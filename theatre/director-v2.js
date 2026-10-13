(() => {
 'use strict';
 const $=id=>document.getElementById(id),root=$('performer'),canvas=$('actor'),ctx=canvas.getContext('2d'),world=$('world'),stage=$('materials'),packet=$('packet'),shadow=$('floorShadow');
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
 const atlases=[{img:new Image(),rows:3,count:12,ref:6,boxes:[]},{img:new Image(),rows:2,count:8,ref:7,boxes:[]},{img:new Image(),rows:2,count:8,ref:0,boxes:[]}];
 let scene=null,page=0,key='',papers=new Map(),active=[],previous=[],oldLayout=new Map(),newLayout=new Map(),current={x:.45,y:.86},from={...current},lastFrame=-1,lastFacing=1,ready=false,forced=null,overrideBeat=-1,lastTime=0;
 let resolve,reject;const preparation=new Promise((r,j)=>{resolve=r;reject=j});preparation.catch(()=>{});
 canvas.width=300;canvas.height=570;
 function bounds(a){const cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,c=document.createElement('canvas');c.width=cw;c.height=ch;const k=c.getContext('2d',{willReadFrequently:true});
  for(let i=0;i<a.count;i++){k.clearRect(0,0,cw,ch);k.drawImage(a.img,i%4*cw,Math.floor(i/4)*ch,cw,ch,0,0,cw,ch);const data=k.getImageData(0,0,cw,ch).data,seen=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch),parts=[];
   for(let n=0;n<cw*ch;n++)if(!seen[n]&&data[n*4+3]>64){let head=0,tail=1,area=0,left=cw,right=0,top=ch,bottom=0;queue[0]=n;seen[n]=1;
    while(head<tail){const p=queue[head++],x=p%cw,y=Math.floor(p/cw);area++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(const q of [x?p-1:-1,x<cw-1?p+1:-1,y?p-cw:-1,y<ch-1?p+cw:-1])if(q>=0&&!seen[q]&&data[q*4+3]>64){seen[q]=1;queue[tail++]=q;}}parts.push({area,left,right,top,bottom});}
   const largest=Math.max(...parts.map(p=>p.area)),keep=parts.filter(p=>p.area>=Math.max(140,largest*.01));const b={left:Math.min(...keep.map(p=>p.left)),right:Math.max(...keep.map(p=>p.right)),top:Math.min(...keep.map(p=>p.top)),bottom:Math.max(...keep.map(p=>p.bottom))};let total=0,xsum=0;
   for(let y=b.top;y<b.top+(b.bottom-b.top)*.28;y++)for(let x=b.left;x<=b.right;x++){const alpha=data[(y*cw+x)*4+3];if(alpha>64){total+=alpha;xsum+=x*alpha;}}b.anchor=total?xsum/total:cw/2;b.h=b.bottom-b.top;a.boxes.push(b);
  }
 }
 atlases.forEach((a,i)=>{a.img.onload=()=>{try{bounds(a);if(atlases.every(x=>x.boxes.length)){ready=true;resolve();window.dispatchEvent(new Event('castready'));}}catch(e){reject(e)}};a.img.onerror=()=>reject(new Error('角色素材加载失败'));a.img.src=['assets/walking-cast-v1.png','assets/climbing-cast-v1.png','assets/talking-cast-v2.png'][i]});
 function draw(frame,facing=1){if(!ready||frame===lastFrame&&facing===lastFacing)return;lastFrame=frame;lastFacing=facing;const ai=frame>=40?2:frame>=20?1:0,a=atlases[ai],i=frame>=40?frame-40:frame>=20?frame-20:frame,b=a.boxes[i],cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,scale=510/a.boxes[a.ref].h;
  ctx.clearRect(0,0,300,570);ctx.save();ctx.translate(150,562);if(facing<0)ctx.scale(-1,1);ctx.drawImage(a.img,i%4*cw+b.left,Math.floor(i/4)*ch+b.top,b.right-b.left+1,b.bottom-b.top+1,(b.left-b.anchor)*scale,(b.top-b.bottom)*scale,(b.right-b.left+1)*scale,(b.bottom-b.top+1)*scale);ctx.restore();root.dataset.frame=String(frame);
 }
 const mobile=()=>innerWidth<=800, floor=()=>.96;
 function hand(){const a=atlases[0],b=a.boxes[9],scale=510/a.boxes[6].h,s=root.offsetWidth/300;return {x:(215-b.anchor)*scale*s,y:(190-b.bottom)*scale*s-8*s}}
 function place(p,supportY=p.y,air=false){const w=world.offsetWidth,h=world.offsetHeight;current=p;root.style.transform=`translate(${Math.round(p.x*w-root.offsetWidth/2)}px,${Math.round(p.y*h-root.offsetWidth*570/300)}px)`;shadow.style.left=`${p.x*w-28}px`;shadow.style.top=`${supportY*h-4}px`;shadow.style.opacity=air?'.22':'.65';shadow.style.transform=`scale(${air?.65:1})`}
 function jump(a,b,u){u=clamp(u,0,1);if(u<.17)return {point:a,frame:20,air:false};if(u>.84)return {point:b,frame:u<.96?20:27,air:false};const t=(u-.17)/.67;return {point:{x:mix(a.x,b.x,ease(t)),y:mix(a.y,b.y,t)-Math.sin(t*Math.PI)*root.offsetWidth*.72/world.offsetHeight},frame:t<.15?21:25,air:true}}
 function makePaper(n){const f=document.createElement('figure');f.className='sheet';f.dataset.image=n;f.hidden=true;const b=document.createElement('button');b.className='image';b.setAttribute('aria-label','放大原图：'+ART_LABELS[n]);const img=new Image();img.onload=()=>window.dispatchEvent(new Event('materialready'));img.src=`assets/work-${n}.webp`;img.alt=ART_LABELS[n];img.decoding='async';b.append(img);b.onclick=()=>window.openArtwork(n);const c=document.createElement('figcaption');c.textContent=ART_LABELS[n];const tab=document.createElement('i');tab.className='tab';tab.textContent='↗';f.append(b,c,tab);
  if(scene.kind==='compare'){const number=document.createElement('b');number.className='number';number.textContent=n===59?'33':'48';const small=document.createElement('span');small.textContent=n===59?'ORIGINAL':'PROPOSED';number.append(small);f.append(number)}stage.append(f);papers.set(n,f);return f}
 function configure(s,i){scene=s;page=i;key='';forced=null;active=[];previous=[];oldLayout=new Map();newLayout=new Map();stage.replaceChildren();papers=new Map();for(const n of [...new Set(s.beats.flatMap(b=>b.images))])makePaper(n);packet.hidden=true;root.dataset.contact='false';$('bridges').innerHTML='';lastTime=0;}
 function ratio(n){const x=papers.get(n).querySelector('img');return x.naturalWidth?x.naturalWidth/x.naturalHeight:16/9}
 function layout(ids,beat){const w=world.offsetWidth,h=world.offsetHeight,pad=mobile()?14:20,caption=mobile()?29:28,top=mobile()?262:h<620?173:211,space=floor()*h-top-26,out=new Map();if(!ids.length)return out;
  if(scene.kind==='ending'){const count=ids.length,span=mobile()?w*.9:w*.57,gap=mobile()?9:22,width=(span-gap*(count-1))/count;ids.forEach((n,i)=>{const ih=Math.min(mobile()?140:210,(width-pad)/ratio(n));out.set(n,{x:w*.05+i*(width+gap),y:mobile()?h*.35:h*.38,w:width,h:ih+caption+pad})});return out}
  if(mobile()){const n=ids[0],iw=Math.min(w*.9-pad,(space-caption-pad)*ratio(n)),ih=iw/ratio(n);out.set(n,{x:(w-iw-pad)/2,y:top+(space-ih-caption-pad)/2,w:iw+pad,h:ih+caption+pad});return out}
  const isStudy=scene.kind==='study'&&beat===1;
  if(ids.length===1||isStudy){const n=ids[0],iw=Math.min(w*.68,(space-caption-pad)*ratio(n)),ih=iw/ratio(n),r={x:w*.045,y:top,w:iw+pad,h:ih+caption+pad};out.set(n,r);
   if(isStudy&&ids[1]){const nw=Math.min(w*.21,270),nh=nw/ratio(ids[1]);out.set(ids[1],{x:r.x+r.w+48,y:top+space-nh-caption-pad,w:nw+pad,h:nh+caption+pad})}
   const end=Math.max(...[...out.values()].map(x=>x.x+x.w));$('margin').style.left=`${Math.min(w*.78,end+48)}px`;$('margin').style.right='auto';$('margin').style.width=`${w-Math.min(w*.78,end+48)-w*.04}px`;
  }else{const span=w*.90,gap=30,width=(span-gap*(ids.length-1))/ids.length;ids.forEach((n,i)=>{const iw=Math.min(width-pad,(space-caption-pad)*ratio(n)),ih=iw/ratio(n);out.set(n,{x:w*.045+i*(width+gap)+(width-iw-pad)/2,y:top+(space-ih-caption-pad)/2,w:iw+pad,h:ih+caption+pad})})}
  return out;
 }
 function locateBeat(t){let i=0;while(i<3&&t>=scene.beats[i].end)i++;return i}
 function viseme(t){const a=scene.visemes;let lo=0,hi=a.length-1;while(lo<=hi){const m=(lo+hi)>>1;if(a[m][0]<=t)lo=m+1;else hi=m-1}return a[Math.max(0,hi)]?.[1]||0}
 function speechFrame(t,playing){if(!playing)return 40;const blink=t%4.9;return blink<.10?47:blink<.18?46:40+viseme(t)}
 function render(s){if(!scene||!ready)return;const t=Math.floor(s.time*12)/12,beat=locateBeat(t),b=scene.beats[beat],local=t-b.start,w=world.offsetWidth,h=world.offsetHeight,base=floor();$('ground').style.top=`${base*h}px`;if(overrideBeat!==beat)forced=null;root.hidden=!s.unlocked;shadow.hidden=!s.unlocked;if(!s.unlocked)return;
  root.dataset.behind='false';let point=current,frame=speechFrame(t,s.playing),facing=1,air=false,support=base,contact=false;
  if(scene.kind==='opening'){
   packet.hidden=true;const wr=world.getBoundingClientRect(),ps=[...document.querySelectorAll('#career .ledge')].map(el=>{const r=el.getBoundingClientRect();return {x:(r.left+r.width/2-wr.left)/w,y:(r.top-wr.top)/h}}),start={x:mobile()?.3:.45,y:base},out={x:ps[0].x,y:base};
   const path=ps.map(p=>`${p.x*w},${p.y*h+4}`).join(' ');$('bridges').innerHTML=`<polyline points="${path}" fill="none" stroke="#a6b47a" stroke-width="7" stroke-linejoin="round"/><polyline points="${path}" fill="none" stroke="#e5edc2" stroke-width="3"/>`;
   if(beat===0){root.hidden=true;shadow.hidden=true;point=start}
   else if(beat===1){const u=clamp((local-.3)/3,0,1);point={x:mix(start.x,out.x,ease(u)),y:base};frame=u<1?Math.floor(t*8)%6:7;root.dataset.behind=String(u<.5)}
   else if(beat===2){const p1=b.phrases.find(p=>p.text.startsWith('之后'))?.start-b.start||6,p2=b.phrases.find(p=>p.text.startsWith('现在'))?.start-b.start||12;let j=local<p1?0:local<p2?1:2;
    if(j===0){const a=jump(out,ps[0],local/1.7);point=a.point;frame=a.frame;air=a.air;support=air?base:ps[0].y;if(local>1.7)frame=speechFrame(t,s.playing)}else{const u=clamp((local-(j===1?p1:p2))/1.6,0,1);point={x:mix(ps[j-1].x,ps[j].x,ease(u)),y:mix(ps[j-1].y,ps[j].y,ease(u))};frame=u<1?Math.floor(t*8)%6:speechFrame(t,s.playing);support=point.y}
    document.querySelectorAll('#career>div').forEach((el,i)=>el.classList.toggle('active',i===j));
   }else{const end={x:.88,y:base},a=jump(ps[2],end,local/1.8);point=a.point;frame=a.frame;air=a.air;support=air?base:point.y;if(local>1.8)frame=speechFrame(t,s.playing)}
   if(s.reduced){point=out;frame=40;air=false;support=base}
  }else{
   $('bridges').innerHTML='';let ids=b.images.slice(),mobileIndex=0,offset=0;
   if(mobile()&&ids.length>1&&scene.kind!=='ending'){mobileIndex=forced??(scene.kind==='compare'?(beat<2?0:1):local>(b.end-b.start)*.55?1:0);if(mobileIndex>0&&forced===null&&scene.kind!=='compare')offset=(b.end-b.start)*.55;ids=[ids[mobileIndex]]}
   const nextKey=`${page}:${beat}:${mobileIndex}:${w}:${h}`;if(key!==nextKey){previous=active.slice();oldLayout=new Map(newLayout);active=ids;newLayout=layout(ids,beat);from={...current};key=nextKey;}
   const same=previous.length===active.length&&previous.every((n,i)=>n===active[i]),instant=s.mode==='browse'||s.seeking||s.reduced,hasArrival=!same&&active.length>0;
   const cue=hasArrival?offset+(offset?1.65:b.reveal):0,walkStart=Math.max(offset,cue-1.45),delta=hand(),main=newLayout.get(active[0]);
   const dockX=main?Math.min(main.x+main.w+18,w-root.offsetWidth/2+delta.x-8):w*.82,dockY=base*h+delta.y;
   const target={x:clamp((dockX-delta.x)/w,(root.offsetWidth/2+3)/w,1-(root.offsetWidth/2+3)/w),y:base};
   const u=instant?1:clamp((local-walkStart)/1.45,0,1);point={x:mix(from.x,target.x,ease(u)),y:base};facing=target.x>=from.x?1:-1;
   let reveal=instant||!hasArrival?1:0;
   if(hasArrival){packet.hidden=instant||local>cue+1.45;packet.style.left=`${dockX-22}px`;packet.style.top=`${dockY-26}px`;
    if(!instant&&local>=walkStart&&local<cue){frame=u<1?Math.floor(t*8)%6:speechFrame(t,s.playing)}
    if(!instant&&local>=cue&&local<cue+1.45){contact=u>=.999&&Math.abs(point.x*w+delta.x-dockX)<5;frame=contact?9:8;facing=1;if(contact){reveal=ease(clamp((local-cue-.18)/.9,0,1));const pull=-38*reveal;point.x+=pull/w;packet.style.left=`${dockX-22+pull}px`;}}
    if(local>=cue+1.45&&!instant)reveal=1;
   }else packet.hidden=true;
   for(const [n,f] of papers){const old=oldLayout.get(n),next=newLayout.get(n),inOld=previous.includes(n),inNext=active.includes(n);f.hidden=!(inOld||inNext);if(f.hidden)continue;let r=next||old;
    if(inOld&&inNext&&old&&next)r={x:mix(old.x,next.x,reveal),y:mix(old.y,next.y,reveal),w:mix(old.w,next.w,reveal),h:mix(old.h,next.h,reveal)};
    f.style.left=`${r.x}px`;f.style.top=`${r.y}px`;f.style.width=`${r.w}px`;f.style.height=`${r.h}px`;f.style.opacity=String(inNext?inOld?1:reveal:1-reveal);
    f.style.transform=inNext&&!inOld?`translateX(${38*(1-reveal)}px) scaleX(${.08+.92*reveal})`:'none';f.style.pointerEvents=inNext&&reveal>.95?'auto':'none';f.classList.toggle('focus',inNext&&reveal>.95&&((b.action==='original'&&n===59)||(b.action==='revised'&&n===60)||b.action==='pull'));
    const number=f.querySelector('.number');if(number)number.classList.toggle('marked',n===60&&beat>=2);
   }
   document.body.dataset.layout=active.length>1?'compare':'single';if(mobile()){$('margin').style.left='auto';$('margin').style.right='5%';$('margin').style.width='31%'}
   if(instant||local>cue+1.45){const viewTarget=newLayout.get(b.action==='revised'?60:active[0])||main,tx=scene.kind==='ending'?.85:b.action==='yield'?.91:viewTarget?clamp((viewTarget.x+viewTarget.w+25)/w,.1,1-(root.offsetWidth/2+4)/w):.86;
    const v=instant?1:ease(clamp((local-cue-1.45)/1.15,0,1));point={x:mix(target.x,tx,v),y:base};frame=!instant&&v<1?Math.floor(t*8)%6:local<cue+3.8&&['point','original','revised'].includes(b.action)?8:speechFrame(t,s.playing);facing=1;
   }
   root.dataset.reveal=String(reveal);root.dataset.phase=contact?'contact':reveal<1?'approach':'read';root.dataset.mobileImage=String(mobileIndex);
  }
  root.dataset.contact=String(contact);root.dataset.mode=air?'jump':contact?'grip':frame<6?'walk':frame>=40?'speak':'gesture';root.dataset.air=String(air);place(point,support,air);draw(frame,facing);lastTime=t;
 }
 window.director={configure,render,prepare:()=>preparation,reset:()=>{key='';lastFrame=-1},selectImage:i=>{forced=i;overrideBeat=locateBeat(lastTime);key=''},clearSelection:()=>{forced=null;key=''},getState:()=>({point:{...current},frame:lastFrame,contact:root.dataset.contact==='true',phase:root.dataset.phase,reveal:Number(root.dataset.reveal||0),mode:root.dataset.mode,ready})};
})();
