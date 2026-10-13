(() => {
 'use strict';
 const root=document.getElementById('performer'),canvas=document.getElementById('actor'),ctx=canvas.getContext('2d'),world=document.getElementById('world');
 const atlases=[{img:new Image(),rows:3,count:12,ref:6,boxes:[]},{img:new Image(),rows:2,count:8,ref:7,boxes:[]}];
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
 let ready=false,current={x:.5,y:.84},route=null,lastFrame=-1,lastFacing=1,lastBeat=null,lastPage=null;
 let resolve,reject;const prepared=new Promise((r,j)=>{resolve=r;reject=j});prepared.catch(()=>{});
 function bounds(a){
  const cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,c=document.createElement('canvas');c.width=cw;c.height=ch;const k=c.getContext('2d',{willReadFrequently:true});
  for(let i=0;i<a.count;i++){
   k.clearRect(0,0,cw,ch);k.drawImage(a.img,i%4*cw,Math.floor(i/4)*ch,cw,ch,0,0,cw,ch);
   const pixels=k.getImageData(0,0,cw,ch).data,seen=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch),parts=[];
   for(let n=0;n<cw*ch;n++)if(!seen[n]&&pixels[n*4+3]>64){
    let head=0,tail=1,area=0,left=cw,right=0,top=ch,bottom=0;queue[0]=n;seen[n]=1;
    while(head<tail){const p=queue[head++],x=p%cw,y=Math.floor(p/cw);area++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
     for(const q of [x?p-1:-1,x<cw-1?p+1:-1,y?p-cw:-1,y<ch-1?p+cw:-1])if(q>=0&&!seen[q]&&pixels[q*4+3]>64){seen[q]=1;queue[tail++]=q;}}
    parts.push({area,left,right,top,bottom});
   }
   const max=Math.max(...parts.map(p=>p.area)),keep=parts.filter(p=>p.area>Math.max(120,max*.01));
   const b={left:Math.min(...keep.map(p=>p.left)),right:Math.max(...keep.map(p=>p.right)),top:Math.min(...keep.map(p=>p.top)),bottom:Math.max(...keep.map(p=>p.bottom))};
   let total=0,xsum=0;for(let y=b.top;y<b.top+(b.bottom-b.top)*.28;y++)for(let x=b.left;x<=b.right;x++){const alpha=pixels[(y*cw+x)*4+3];if(alpha>64){total+=alpha;xsum+=x*alpha;}}
   b.anchor=total?xsum/total:cw/2;b.h=b.bottom-b.top;a.boxes.push(b);
  }
 }
 for(const [i,a] of atlases.entries()){a.img.onload=()=>{try{bounds(a);if(atlases.every(a=>a.boxes.length)){ready=true;resolve();window.dispatchEvent(new Event('castready'));}}catch(e){reject(e)}};a.img.onerror=()=>reject(new Error('角色素材加载失败'));a.img.src=i?'assets/climbing-cast-v1.png':'assets/walking-cast-v1.png';}
 function draw(frame,facing){
  if(frame===lastFrame&&facing===lastFacing)return;lastFrame=frame;lastFacing=facing;
  const a=atlases[frame>=20?1:0],i=frame>=20?frame-20:frame,b=a.boxes[i],cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,scale=510/a.boxes[a.ref].h;
  ctx.clearRect(0,0,300,570);ctx.save();ctx.translate(150,562);if(frame<6&&facing<0)ctx.scale(-1,1);
  ctx.drawImage(a.img,i%4*cw+b.left,Math.floor(i/4)*ch+b.top,b.right-b.left+1,b.bottom-b.top+1,(b.left-b.anchor)*scale,(b.top-b.bottom)*scale,(b.right-b.left+1)*scale,(b.bottom-b.top+1)*scale);ctx.restore();root.dataset.frame=String(frame);
 }
 function floor(){return innerWidth<=800?.76:.84}
 function screen(point){const r=world.getBoundingClientRect();return {x:point.x*r.width,y:point.y*r.height}}
 function place(point){current=point;const p=screen(point),h=root.offsetWidth*570/300;root.style.transform=`translate(${Math.round(p.x-root.offsetWidth/2)}px,${Math.round(p.y-h)}px)`;}
 function jump(from,to,u){u=clamp(u,0,1);if(u<.17)return {p:from,frame:20,air:false};if(u>.83)return {p:to,frame:u<.95?20:27,air:false};const t=(u-.17)/.66;return {p:{x:mix(from.x,to.x,ease(t)),y:mix(from.y,to.y,t)-Math.sin(t*Math.PI)*root.offsetWidth*.75/world.offsetHeight},frame:t<.16?21:25,air:true};}
 function ledges(){const w=world.getBoundingClientRect();return [...document.querySelectorAll('#career .ledge')].map(el=>{const r=el.getBoundingClientRect();return {x:(r.left+r.width*.5-w.left)/w.width,y:(r.top-w.top)/w.height}});}
 function hand(){const a=atlases[0],b=a.boxes[9],scale=510/a.boxes[6].h,s=root.offsetWidth/300;return {x:(215-b.anchor)*scale*s,y:(190-b.bottom)*scale*s-8*s};}
 function alignTab(target,hy,w){const tab=target.querySelector('.tab'),r=target.getBoundingClientRect();tab.style.bottom=`${r.bottom-w.top-hy-13}px`;for(let i=0;i<2;i++){const tr=tab.getBoundingClientRect(),dy=tr.top+tr.height/2-w.top-hy;tab.style.bottom=`${parseFloat(tab.style.bottom)+dy}px`;}return tab.getBoundingClientRect();}
 function reset(){route=null;lastBeat=null;lastFrame=-1}
 function render(s){
  if(!ready)return;root.hidden=!s.unlocked;if(!s.unlocked)return;
  const quant=Math.floor(s.time*12)/12,w=world.getBoundingClientRect(),base=floor();let point=current,frame=6,facing=1,air=false,contact=false;
  document.querySelectorAll('.touched').forEach(x=>{x.classList.remove('touched');x.style.translate='';});
  root.dataset.behind='false';
  if(s.kind==='opening'){
   const mobile=innerWidth<=800,behind={x:mobile?.35:.51,y:base},out={x:mobile?.56:.69,y:base},ps=ledges();
   if(s.beat===0){point=behind;root.hidden=true;}
   else if(s.beat===1){const u=clamp((quant-.45)/3.4,0,1);point={x:mix(behind.x,out.x,ease(u)),y:base};frame=u<1?Math.floor(quant*8)%6:7;root.dataset.behind=String(u<.45);}
   else if(s.beat===2){const t=quant,stops=[out,ps[2],ps[1],ps[0]],j=Math.min(2,Math.floor(t/2.4)),u=(t-j*2.4)/1.7;const a=jump(stops[j],stops[j+1],u);point=a.p;frame=a.frame;air=a.air;document.querySelectorAll('#career>div').forEach((el,i)=>el.classList.toggle('active',i===2-j));}
   else {const a=jump(ps[0],out,quant/1.8);point=a.p;frame=a.frame;air=a.air;if(quant>2){const u=clamp((quant-2)/4,0,1);point={x:mix(out.x,.86,u),y:base};frame=u<1?Math.floor(quant*8)%6:10;}}
   if(s.reduced){point=out;frame=7;air=false;}
  } else {
   const figures=[...document.querySelectorAll('#materials>.sheet')],target=s.action==='original'?figures[0]:s.action==='revised'?figures[1]:s.action==='pull'?figures[0]:s.action==='compare'?figures.at(-1):figures[0];
   let tx=s.kind==='ending'?.83:s.action==='yield'?.87:target?(target.getBoundingClientRect().right-w.left+10)/w.width:.18;
   if(s.action==='point'||s.action==='original')tx=target?(target.getBoundingClientRect().left-w.left-10)/w.width:.15;
   const grip=s.action==='pull'&&target&&!s.reduced,delta=hand();
   if(grip){const hy=base*w.height+delta.y,tr=alignTab(target,hy,w);tx=(tr.left+tr.width/2-w.left-delta.x)/w.width;}
   tx=clamp(tx,Math.max(.08,(root.offsetWidth/2+3)/w.width),Math.min(.91,1-(root.offsetWidth/2+3)/w.width));const key=`${s.page}:${s.beat}:${w.width}`;
   if(lastBeat!==key){route={from:{...current},to:{x:tx,y:base},duration:clamp(Math.abs(current.x-tx)*4,.55,1.6)};if(s.seeking){route.from={...route.to};route.duration=0}lastBeat=key;}
   const u=s.reduced||route.duration===0?1:clamp(quant/route.duration,0,1);facing=route.to.x>=route.from.x?1:-1;point={x:mix(route.from.x,tx,ease(u)),y:base};
   frame=u<1?Math.floor(quant*8)%6:s.action==='wave'?7:s.action==='yield'?10:s.action==='compare'?11:8;
   if(grip&&u>=1){
    const r=target.getBoundingClientRect(),tab=target.querySelector('.tab');let hy=base*w.height+delta.y;
    if(hy>=r.top-w.top+18&&hy<=r.bottom-w.top-8){
     const tabRect=alignTab(target,hy,w);const distance=Math.hypot(point.x*w.width+delta.x-(tabRect.left-w.left+tabRect.width/2),hy-(tabRect.top-w.top+tabRect.height/2));root.dataset.distance=String(distance);
     if(distance<5){contact=true;frame=9;const d=-(innerWidth<=800?12:42)*ease(clamp((quant-route.duration)/.7,0,1))*ease(clamp((s.duration-quant)/.75,0,1));target.style.translate=`${d}px 0`;point.x+=d/w.width;target.classList.add('touched');}
    }
   }
   if(target&&u>=1)target.classList.add('focus');
  }
  if(s.reduced){air=false;contact=false;}root.dataset.air=String(air);root.dataset.contact=String(contact);root.dataset.mode=air?'jump':contact?'grip':frame<6?'walk':'gesture';
  place(point);draw(frame,facing);lastPage=s.page;
 }
 window.performer={prepare:()=>prepared,render,reset,getState:()=>({point:{...current},frame:lastFrame,contact:root.dataset.contact==='true',mode:root.dataset.mode,ready})};
})();
