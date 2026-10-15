(() => {
'use strict';
const W=1672,H=941,$=id=>document.getElementById(id),base=director;
const clamp=u=>Math.max(0,Math.min(1,u)),ease=u=>{u=clamp(u);return u*u*(3-2*u)},q=(t,a,b)=>ease((t-a)/(b-a)),mix=(a,b,u)=>a+(b-a)*u;
const slide=(at,slot,n)=>({at,slot,n,kind:'swipe',duration:.7});
const readingEnvelope=[35,185,1310,745];
const tap=(at,slot,end,box=readingEnvelope)=>({at,slot,end,box,kind:'tap',duration:.25});
// A screen keeps its own images. Taps open and close its reading view; swipes change its content.
const cues=[[],
 [tap(2.6,0,10.6),tap(14.3,1,22.2,[560,245,680,540]),slide(23.8,1,3),tap(25.1,1,32.5,[420,255,830,530])],
 [slide(12.1,1,20),tap(13.2,1,20.4),slide(21.9,1,21),tap(23,1,26,[70,260,650,540]),tap(28.2,2,31),slide(33.1,2,24),tap(34.2,2,40.2)],
 [tap(3,0,13.4),slide(14.6,0,33),tap(15.45,0,26.6),slide(17.8,0,34),slide(20.85,0,36),slide(27.7,2,39),tap(28.8,2,38.3),slide(31,2,42),slide(40,2,38),tap(41.1,2,47.3)],
 [tap(2.3,0,10.7),tap(12.3,2,20.4),slide(22.2,0,50),tap(23.3,0,32.9,[75,250,710,550]),slide(25.3,1,51),slide(34.2,0,49)],
 [],
 [slide(11.5,0,66),tap(12.6,0,18.6),slide(19.55,0,63),tap(20.65,0,30.6),slide(31.5,0,110),tap(32.6,0,37.5),slide(35,0,62)],
 [tap(2,0,10.4),slide(12.1,0,67),tap(13.2,0,16.4),tap(17.2,2,22.1),tap(23.1,1,32.5),slide(33.5,0,70)],
 [slide(1.9,0,113),slide(5.7,0,119),tap(11.8,1,22.9,[80,245,1150,535]),slide(15.5,1,111),slide(19.35,1,112),tap(24.1,2,33.5,[80,245,1150,535]),slide(28.5,2,120)],
 []];
const diagrams=new Set([3,5,18,21,24,35,37,39,48,50,59,60,83,113,114,115,116,117,118,119]);
let page=0,last=null,views=[],track=[],reading=null,enabled=false;
const cache=new Map(),picture=n=>{if(!cache.has(n)){const im=new Image();im.src=`assets/work-${n}.webp`;cache.set(n,im)}return cache.get(n)};
const rect=s=>({x:s.x*W,y:s.y*H,w:s.w*W,h:s.h*H});
function imageState(i,slot,t){let n=STATIC_LAYOUTS[i].slots[slot].n,old=n,progress=1,event=null;
 for(const c of cues[i])if(c.kind==='swipe'&&c.slot===slot&&t>=c.at){old=n;n=c.n;progress=q(t,c.at+.1,c.at+c.duration);event=c;}
 return {n,old,progress,event};
}
function viewAt(i,t){return cues[i].find(c=>c.kind==='tap'&&t>=c.at+.12&&t<c.end+.8)||null}
function fit(envelope,n){const im=picture(n),[x,y,w,h]=envelope,r=(im.naturalWidth||w)/(im.naturalHeight||h),fw=Math.min(w,h*r),fh=fw/r;return {x:x+(w-fw)/2,y:y+(h-fh)/2,w:fw,h:fh}}
function targetFor(i,c){
 const n=imageState(i,c.slot,c.at).n,im=picture(n),nw=im.naturalWidth||1,nh=im.naturalHeight||1,source=rect(STATIC_LAYOUTS[i].slots[c.slot]);
 const nativeScale=diagrams.has(n)?Math.min(source.w/nw,source.h/nh):Math.max(source.w/nw,source.h/nh);
 let target=fit(c.box,n);if(Math.min(target.w/nw,target.h/nh)<nativeScale*1.1)target=fit(readingEnvelope,n);
 return {target,nativeScale,zoomScale:target.w/nw};
}
function readingBox(i,t,c){const s=imageState(i,c.slot,t),{target,nativeScale,zoomScale}=targetFor(i,c),source=rect(STATIC_LAYOUTS[i].slots[c.slot]),u=q(t,c.at+.12,c.at+.85)*(1-q(t,c.end+.12,c.end+.8));return {box:Object.fromEntries(['x','y','w','h'].map(k=>[k,mix(source[k],target[k],u)])),u,state:s,source,target,nativeScale,zoomScale}}
const zoom=document.createElement('div');zoom.id='screenReadingV10';zoom.hidden=true;
const zOld=new Image(),zNew=new Image();zoom.append(zOld,zNew);$('stageCanvas').append(zoom);
const ring=document.createElement('div');ring.id='screenTouchV10';ring.hidden=true;$('stageCanvas').append(ring);

for(let i=1;i<=8;i++){
 const s=PERFORMANCE_SCORE[i];s.props=[];s.business=[];delete s.carry;delete s.support;
 s.screenCues=cues[i];s.directorNote='粘土框作为固定屏幕；靠近、接触、框内滑动换图，点击进入阅读，再点击返回。';
 if(i!==5){s.route=[{t:0,x:i===8?650:1450,y:900,action:'listen',face:-1},{t:STORY[i].duration-1,x:1450,y:900,action:'present',face:-1}];s.entry=[s.route[0].x,900];s.exit=[1450,900];s.focus=[];}
}
PERFORMANCE_SCORE[1].transition='push';
for(const [i,name] of [[1,'关闭屏幕，进入下一组作品'],[2,'从故事屏进入楼层'],[5,'从平面节点进入空间'],[7,'从作品进入表达能力'],[8,'退出展示，向观众致谢']]){PERFORMANCE_HANDOFFS[i].name=name;PERFORMANCE_HANDOFFS[i].note='屏幕内容归位后换景，人物留在舞台上继续引导。';}
window.DIRECTOR_EDITION='v20 / 原版人物与另一侧领步';

function setImage(im,n){const src=`assets/work-${n}.webp`;if(im.getAttribute('src')!==src)im.src=src;im.alt=ART_LABELS[n]||'';}
function paintImages(container,a,b,s,reduced,diagram,readingMetrics=null){
 setImage(a,s.old);setImage(b,s.n);const u=reduced?1:s.progress;
 const w=readingMetrics?.box.w||container.clientWidth||1,h=readingMetrics?.box.h||container.clientHeight||1;
 for(const [im,n,offset] of [[a,s.old,-u],[b,s.n,1-u]]){
  const asset=picture(n),nw=asset.naturalWidth||w,nh=asset.naturalHeight||h,contain=Math.min(w/nw,h/nh),cover=Math.max(w/nw,h/nh);
  const scale=diagrams.has(n)?contain:readingMetrics?mix(cover,contain,readingMetrics.u):cover;
  const iw=nw*scale,ih=nh*scale;
  Object.assign(im.style,{width:iw/w*100+'%',height:ih/h*100+'%',left:(w-iw)/w*50+'%',top:(h-ih)/h*50+'%',objectFit:'fill',transform:`translateX(${offset*w/iw*100}%)`});
 }
 a.style.visibility=u>=1?'hidden':'visible';b.style.visibility='visible';container.classList.toggle('diagram',diagram);
}
function initialize(){
 views=[];for(const [slot,el] of [...$('materials').children].entries()){
  if(!STATIC_LAYOUTS[page].slots[slot])continue;
  const a=el.querySelector('img'),b=new Image();b.className='screenIncomingV10';setImage(b,STATIC_LAYOUTS[page].slots[slot].n);el.classList.add('clayScreenV10');const viewport=document.createElement('div');viewport.className='screenViewportV10';viewport.append(a,b);el.append(viewport);views.push({el,a,b,slot});
 }
 track=[];for(const c of cues[page]){track.push(c);if(c.kind==='tap')track.push({...c,at:c.end,kind:'close',duration:.22,opened:c})}track.sort((a,b)=>a.at-b.at);
 for(const n of new Set([...STATIC_LAYOUTS[page].slots.map(s=>s.n),...cues[page].filter(c=>c.n).map(c=>c.n)]))picture(n);
}
function home(i,t){return i===8?mix(650,1450,q(t,9,11)):1450}
function contact(i,e,hand){
 const active=e.kind==='close'?e.opened:viewAt(i,e.at+.05),r=active&&active.slot===e.slot?targetFor(i,active).target:rect(STATIC_LAYOUTS[i].slots[e.slot]);
 const face=r.x+r.w*.5>W*.78?1:-1,frame=e.kind==='swipe'?(face===1?207:206):r.y+r.h<650?204:206;
 const sample={frame,face,perch:false,x:0,y:900},h=hand(sample);
 const tx=r.x+r.w*(face===1?.16:.86),ty=Math.max(r.y+24,Math.min(r.y+r.h-24,900+h.y));
 const root={x:Math.max(130,Math.min(1540,tx-h.x)),y:Math.min(900,ty-h.y)};
 return {...root,frame,face,target:{x:root.x+h.x,y:root.y+h.y},slot:e.slot,event:e};
}
function operator(i,t,p,hand){
 if(i===0&&window.INTRO_GUIDE&&t<INTRO_GUIDE.duration){
  const g=INTRO_GUIDE,step=g.steps.findIndex(s=>t>=s.start&&t<s.end),j=Math.max(0,step),elapsed=t-g.steps[j].start,settle=q(t,g.duration-.7,g.duration);
  const face=j<2?1:-1,frame=t>g.duration-.7?300+walkGait.frame(80*settle):elapsed<.35?202:elapsed<2?(j===2?209:203):200;
  return {...p,action:t>g.duration-.7?'walk':'listen',walkDistance:80*settle,walkEnvelope:Math.min(q(t,g.duration-.7,g.duration-.55),1-q(t,g.duration-.15,g.duration)),x:mix(1150,1070,settle),y:900,frame,face,alpha:q(t,0,.35),poseBlend:0,lean:0,lag:0,squash:1,perch:false,acting:{phase:'guide',step:j}};
 }
 if(i===0||i===9||!cues[i].length)return p;
 const events=[];for(const c of cues[i]){events.push(c);if(c.kind==='tap')events.push({...c,at:c.end,kind:'close',duration:.22,opened:c})}events.sort((a,b)=>a.at-b.at);
 let out={...p,x:home(i,t),y:900,frame:6,action:'listen',face:-1,perch:false,lean:0,lag:0,squash:1,poseBlend:0,screenContact:null};
 const contacts=events.map((e,j)=>({...contact(i,e,hand),at:e.at,duration:e.duration,
  lead:Math.min(.56,Math.max(.12,(e.at-(events[j-1]?events[j-1].at+events[j-1].duration:0))*.27)),
  tail:Math.min(.42,Math.max(.1,((events[j+1]?.at??e.at+3)-e.at-e.duration)*.24))}));
 // Give travel its share of tight cue gaps before allocating preparation/recovery.
 for(let j=1;j<contacts.length;j++){
  const a=contacts[j-1],b=contacts[j],gap=b.at-a.at-a.duration,needed=Math.hypot(b.x-a.x,b.y-a.y)/650*1.5;
  const budget=Math.max(.045,gap-needed);a.tail=Math.min(a.tail,budget*.45);b.lead=Math.min(b.lead,budget*.55);
 }
 const nodes=[{at:0,x:home(i,0),y:900}];
 const travel=(a,b)=>Math.max(.75,Math.hypot(a.x-b.x,a.y-b.y)/300*1.5);
 for(const c of contacts){
  const prev=nodes.at(-1),arrival=c.at-c.lead,gap=arrival-prev.at,rest={x:home(i,(prev.at+arrival)/2),y:900};
  const back=travel(prev,rest),forth=travel(rest,c);
  // Return aside only for a genuine reading hold or to step off an elevated support.
  // Short gaps keep her planted, rather than sending her home and back after every touch.
  if((prev.y<875||prev.event?.kind==='tap')&&gap>back+forth+2.2){nodes.push({...rest,at:prev.at+back},{...rest,at:arrival-forth})}
  else if(gap>travel(prev,c)+.2)nodes.push({...prev,at:arrival-travel(prev,c)});
  nodes.push({...c,at:arrival},{...c,at:c.at+c.duration+c.tail});
 }
 const tail=nodes.at(-1),rest={x:1450,y:900};nodes.push({...rest,at:tail.at+travel(tail,rest)});
 let left=nodes[0],right=nodes.at(-1);
 for(let j=1;j<nodes.length;j++){if(t<=nodes[j].at){left=nodes[j-1];right=nodes[j];break}left=nodes[j]}
 const linear=clamp((t-left.at)/Math.max(.01,right.at-left.at)),ramp=.16,cruise=linear<ramp?linear*linear/(2*ramp*(1-ramp)):linear>1-ramp?1-(1-linear)**2/(2*ramp*(1-ramp)):(linear-ramp/2)/(1-ramp);
 const u=cruise,distance=Math.hypot(right.x-left.x,right.y-left.y),moving=distance>.1&&t<right.at;
 out={...out,walkDistance:distance*u,walkEnvelope:Math.min(q(t,left.at,left.at+.16),1-q(t,right.at-.2,right.at)),x:mix(left.x,right.x,u),y:mix(left.y,right.y,u),action:moving?'walk':'listen',frame:moving?300+walkGait.frame(distance*u):200,face:moving?(right.x>=left.x?1:-1):-1};
 // Feet stay planted during preparation, touch and recovery; only the arm/torso acts.
 const c=contacts.find(c=>t>=c.at-c.lead&&t<=c.at+c.duration+c.tail);
 if(c){
  const e=c.event,high=c.frame===204,active=t>=c.at&&t<=c.at+c.duration;
  let frame=200,phase='anticipate';
  if(t<c.at){const u=clamp((t-(c.at-c.lead))/c.lead);frame=u<.18?201:u<.48?202:u<.8?(high?203:209):c.frame}
  else if(active){const u=(t-c.at)/c.duration;frame=e.kind==='swipe'?(c.face===1?(u<.42?207:206):(u<.42?206:207)):c.frame;phase=e.kind==='swipe'?'swipe':'contact'}
  else {const u=(t-c.at-c.duration)/c.tail;frame=u<.26?c.frame:u<.7?(high?208:209):200;phase='recover'}
  const pulse=active?Math.sin(Math.PI*(t-c.at)/c.duration):0;
  out={...out,x:c.x,y:c.y,frame,face:c.face,action:phase,lean:active?-2*pulse:0,squash:1,acting:{event:e.kind,phase,slot:e.slot},screenContact:null};
  if(active){const h=hand(out);out.screenContact={slot:e.slot,kind:e.kind,target:{x:out.x+h.x,y:out.y+h.y},at:e.at}}
 }else if(!moving){
  const since=t-left.at,until=right.at-t,cycle=(t+i*1.73)%11.7;
  out.frame=since<.2?201:until<.3?201:cycle>7.1&&cycle<8.25?210:cycle>9.2?211:200;
  out.lean=Math.sin(t*1.35+i)*.65;out.squash=1+Math.sin(t*1.65+i)*.0018;
  out.acting={phase:since<.2?'settle':'listen'};
  if(left.face===1&&since<.48){const turn=q(since,.16,.46);out.face=turn<.5?1:-1;out.turnScale=1;if(turn>.3&&turn<.7)out.frame=406;out.acting.phase='turn'}
 }else{
  // Walking phase follows distance, and the last step brakes into the planted stance.
  const velocity=linear<ramp?linear/(ramp*(1-ramp)):linear>1-ramp?(1-linear)/(ramp*(1-ramp)):1/(1-ramp),speed=velocity*distance/Math.max(.01,right.at-left.at);
  out.lean=(out.face===1?-1:1)*Math.min(3,speed/180);
  out.acting={phase:'travel',speed};
  const rise=right.y-left.y;
  if(Math.abs(rise)>35){
   if(rise<0){out.x=mix(left.x,right.x,q(linear,0,.72));out.y=mix(left.y,right.y,q(linear,.55,1));if(linear>.5){out.frame=linear<.9?102:407;out.action='stepUp';out.acting.phase='stepUp'}}
   else {out.x=mix(left.x,right.x,q(linear,.2,1));out.y=mix(left.y,right.y,q(linear,0,.45));if(linear<.48){out.frame=102;out.action='stepDown';out.acting.phase='stepDown'}}
  }
  if(left.face&&left.face!==out.face&&t-left.at<.25){out.turnScale=1;out.acting.phase='turn'}
 }
 const elevated=contacts.find(c=>c.y<875&&t>=c.at-c.lead-1.6&&t<=c.at+c.duration+c.tail+1.6);
 if(elevated)out.screenSupport={start:elevated.at-elevated.lead-1.6,in:.35,end:elevated.at+elevated.duration+elevated.tail+1.6,out:.35,x:elevated.x,top:elevated.y,width:170,color:'olive'};
 if(i===8&&t>=34.9){
  const anchor=operator(i,34.899,p,hand),arrival=q(t,34.9,38.5),depart=q(t,44.95,STORY[8].duration-.45),x=t<44.95?mix(anchor.x,1050,arrival):mix(1050,1450,depart);
  const traveling=t<38.5||t>=44.95&&depart<1,pointing=t>=39.1&&t<44.55;
  const frame=traveling?300+walkGait.frame(t<38.5?Math.abs(anchor.x-1050)*arrival:400*depart):t<39.1?400:pointing?410:t<44.95?411:200;
  out={...out,walkEnvelope:t<38.5?Math.min(q(t,34.9,35.06),1-q(t,38.3,38.5)):Math.min(q(t,44.95,45.11),1-q(t,STORY[8].duration-.65,STORY[8].duration-.45)),walkDistance:t<38.5?Math.abs(anchor.x-1050)*arrival:400*depart,x,y:t<38.5?mix(anchor.y,900,arrival):900,frame,face:t>=44.95&&depart<1?1:-1,lean:0,lag:0,squash:1,turnScale:1,poseBlend:0,screenContact:null,screenSupport:null,action:pointing?'pointLinks':traveling?'walk':'listen',acting:{phase:pointing?'pointLinks':traveling?'travel':'recover'}};
 }
 return out;
}
window.screenStage={pose:operator,support:p=>p.screenSupport};

director={...base,
 configure(scene,index){page=index;zoom.hidden=true;ring.hidden=true;last=null;base.configure(scene,index);initialize()},
 async prepare(){await base.prepare();await Promise.all([...cache.values()].map(im=>im.decode().catch(()=>{})))},
 render(info){
  last=info;enabled=info.unlocked&&info.mode==='show';
  if(enabled)for(const v of views){const s=imageState(page,v.slot,info.time);paintImages(v.el,v.a,v.b,s,info.reduced,diagrams.has(s.n));v.el.onclick=()=>window.openArtwork(s.n);v.el.setAttribute('aria-label','放大原图：'+(ART_LABELS[s.n]||''));}
  else for(const v of views){setImage(v.a,STATIC_LAYOUTS[page].slots[v.slot].n);Object.assign(v.a.style,{transform:'',visibility:'',width:'100%',height:'100%',left:'0',top:'0',objectFit:STATIC_LAYOUTS[page].slots[v.slot].diagram?'contain':'cover'});v.b.style.visibility='hidden';}
  base.render(info);[...$('labels').children].forEach((el,i)=>el.textContent=STATIC_LAYOUTS[page].labels[i][0]);reading=enabled?viewAt(page,info.time):null;zoom.hidden=!reading;ring.hidden=true;
  let z=null;if(reading){z=readingBox(page,info.time,reading);if(info.reduced){z.box=z.target;z.u=1}paintImages(zoom,zOld,zNew,z.state,info.reduced,diagrams.has(z.state.n),z);Object.assign(zoom.style,{left:z.box.x/W*100+'%',top:z.box.y/H*100+'%',width:z.box.w/W*100+'%',height:z.box.h/H*100+'%',opacity:String(Math.min(1,z.u*5)),transform:`rotate(${(STATIC_LAYOUTS[page].slots[reading.slot].rotate||0)*(1-z.u)}deg)`});
    for(const v of views)v.el.style.opacity=String(1-z.u*.48);
    for(const [i,el] of [...$('labels').children].entries()){const l=STATIC_LAYOUTS[page].labels[i];if(z.box.x<(l[1]+l[3])*W&&z.box.x+z.box.w>l[1]*W&&z.box.y<(l[2]+l[4])*H&&z.box.y+z.box.h>l[2]*H)el.style.opacity=String(1-z.u)}
   }

  if(enabled){const lab=$('labels').children;
   if(page===3){const n=imageState(page,0,info.time).n;if(n===33||n===34){lab[0].textContent='8F';lab[1].textContent=n===34?'护理体验':'平行宇宙'}else if(n===36){lab[0].textContent='9F';lab[1].textContent='共享座席'}}
   if(page===4&&imageState(page,0,info.time).n===50)lab[0].textContent='墙面 · 构件研究';
   if(page===6)lab[0].textContent=({66:'方案 B · 展览空间',110:'方案 B · 停留空间',62:'方案 B · 市集空间'})[imageState(page,0,info.time).n]||'方案 B · 前区空间';
   if(page===7)lab[0].textContent=imageState(page,0,info.time).n===67?'幼儿园 · 常规教室':'幼儿园 · 阅读空间';
  }
  const p=base.getState().pose;if(enabled&&!info.reduced&&p?.screenContact){const c=p.screenContact,u=clamp((info.time-c.at)/.45);ring.hidden=false;Object.assign(ring.style,{left:c.target.x/W*100+'%',top:c.target.y/H*100+'%',opacity:String(1-u),transform:`translate(-50%,-50%) scale(${.7+u})`});}
 },
 getState(){const s=base.getState(),z=reading&&last?readingBox(page,last.time,reading):null;return {...s,screens:enabled?views.map(v=>({slot:v.slot,...imageState(page,v.slot,last.time)})):[],props:z?[{n:z.state.n,box:z.box,q:z.u,phase:z.u>.999?'read':'zoom'}]:[],screenZoom:reading?.slot??null,zoomRatio:z?z.zoomScale/z.nativeScale:null}},
 capture(){zoom.hidden=true;ring.hidden=true;return base.capture()},
 async handoff(...args){zoom.hidden=true;ring.hidden=true;return base.handoff(...args)}
};
window.director=director;
})();
