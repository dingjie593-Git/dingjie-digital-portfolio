(() => {
'use strict';
const W=1672,H=941,$=id=>document.getElementById(id),base=director;
const clamp=u=>Math.max(0,Math.min(1,u)),ease=u=>{u=clamp(u);return u*u*(3-2*u)},q=(t,a,b)=>ease((t-a)/(b-a)),mix=(a,b,u)=>a+(b-a)*u;
const slide=(at,slot,n)=>({at,slot,n,kind:'swipe',duration:.7});
const tap=(at,slot,end,box=[65,245,1160,585])=>({at,slot,end,box,kind:'tap',duration:.25});
// A screen keeps its own images. Taps open and close its reading view; swipes change its content.
const cues=[[],
 [tap(2.6,0,10.6),tap(14.3,1,22.2,[560,245,680,540]),slide(23.8,1,3),tap(25.1,1,32.5,[420,255,830,530])],
 [slide(12.1,1,20),tap(13.2,1,20.4),slide(21.9,1,21),tap(23,1,26,[70,260,650,540]),tap(26.6,2,31),slide(33.1,2,24),tap(34.2,2,40.2)],
 [tap(3,0,13.4),tap(15.2,1,19.6,[210,345,670,440]),slide(20.4,0,36),tap(21.5,0,26.5),slide(27.7,2,39),tap(28.8,2,38.3),slide(31,2,42),slide(40,2,38),tap(41.1,2,47.3)],
 [tap(2.3,0,10.7),tap(12.3,2,20.4),slide(22.2,0,50),tap(23.3,0,32.9,[75,250,710,550]),slide(25.3,1,51)],
 [],
 [slide(11.5,0,66),tap(12.6,0,18.6),slide(19.55,0,63),tap(20.65,0,30.6),tap(31.8,2,37.2)],
 [tap(2,0,10.4),slide(12.1,0,67),tap(13.2,0,16.4),tap(17.2,2,22.1),tap(23.1,1,32.5)],
 [slide(1.9,0,113),slide(5.7,0,119),tap(11.8,1,22.9,[80,245,1150,535]),slide(15.5,1,111),slide(19.35,1,112),tap(24.1,2,33.5,[80,245,1150,535]),slide(28.5,2,120)],
 []];
const diagrams=new Set([3,5,18,21,24,35,37,39,48,50,59,60,83,113,114,115,116,117,118,119]);
let page=0,last=null,views=[],track=[],reading=null,enabled=false;
const cache=new Map(),picture=n=>{if(!cache.has(n)){const im=new Image();im.src=`assets/work-${n}.webp`;cache.set(n,im)}return cache.get(n)};
const rect=s=>({x:s.x*W,y:s.y*H,w:s.w*W,h:s.h*H});
function imageState(i,slot,t){let n=STATIC_LAYOUTS[i].slots[slot].n,old=n,progress=1,event=null;
 for(const c of cues[i])if(c.kind==='swipe'&&c.slot===slot&&t>=c.at){old=n;n=c.n;progress=q(t,c.at,c.at+c.duration);event=c;}
 return {n,old,progress,event};
}
function viewAt(i,t){return cues[i].find(c=>c.kind==='tap'&&t>=c.at+.12&&t<c.end+.8)||null}
function fit(envelope,n){const im=picture(n),[x,y,w,h]=envelope,r=(im.naturalWidth||w)/(im.naturalHeight||h),fw=Math.min(w,h*r),fh=fw/r;return {x:x+(w-fw)/2,y:y+(h-fh)/2,w:fw,h:fh}}
function readingBox(i,t,c){const s=imageState(i,c.slot,t),target=fit(c.box,imageState(i,c.slot,c.at).n),source=rect(STATIC_LAYOUTS[i].slots[c.slot]),u=q(t,c.at+.12,c.at+.85)*(1-q(t,c.end+.12,c.end+.8));return {box:Object.fromEntries(['x','y','w','h'].map(k=>[k,mix(source[k],target[k],u)])),u,state:s,source,target}}
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
window.DIRECTOR_EDITION='v10 / 粘土屏幕';

function setImage(im,n){const src=`assets/work-${n}.webp`;if(im.getAttribute('src')!==src)im.src=src;im.alt=ART_LABELS[n]||'';}
function paintImages(container,a,b,s,reduced,diagram){
 setImage(a,s.old);setImage(b,s.n);const u=reduced?1:s.progress;
 a.style.transform=`translateX(${-u*100}%)`;b.style.transform=`translateX(${(1-u)*100}%)`;a.style.visibility=u>=1?'hidden':'visible';b.style.visibility='visible';
 for(const im of [a,b])im.style.objectFit=diagram?'contain':'cover';container.classList.toggle('diagram',diagram);
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
 const active=e.kind==='close'?e.opened:viewAt(i,e.at+.05),r=active&&active.slot===e.slot?fit(active.box,imageState(i,e.slot,e.at).n):rect(STATIC_LAYOUTS[i].slots[e.slot]);
 const face=r.x+r.w*.5>W*.78?1:-1,frame=r.y>H*.5?109:104;
 const sample={frame,face,perch:false,x:0,y:900},h=hand(sample);
 const tx=r.x+r.w*(face===1?.16:.86),ty=Math.max(r.y+24,Math.min(r.y+r.h-24,900+h.y));
 const root={x:Math.max(130,Math.min(1540,tx-h.x)),y:Math.min(900,ty-h.y)};
 return {...root,frame,face,target:{x:root.x+h.x,y:root.y+h.y},slot:e.slot,event:e};
}
function operator(i,t,p,hand){
 if(i===0||i===9||!cues[i].length)return p;
 const events=[];for(const c of cues[i]){events.push(c);if(c.kind==='tap')events.push({...c,at:c.end,kind:'close',duration:.22,opened:c})}events.sort((a,b)=>a.at-b.at);
 let out={...p,x:home(i,t),y:900,frame:6,action:'listen',face:-1,perch:false,lean:0,lag:0,squash:1,poseBlend:0,screenContact:null};
 if(i===8&&t>9&&t<11){out.action='walk';out.face=1;out.frame=Math.floor((out.x-650)/24)%6}
 for(let j=0;j<events.length;j++){
  const e=events[j],c=contact(i,e,hand),prev=events[j-1],next=events[j+1],prior=prev&&e.at-prev.at<2.5?contact(i,prev,hand):{x:home(i,t),y:900};
  const approach=Math.max(prev?prev.at+prev.duration+.06:0,e.at-Math.max(1.1,Math.abs(c.x-prior.x)/380+.35)),release=next&&next.at-e.at<2.5?next.at:e.at+e.duration+.65;
  if(t<approach||t>release)continue;
  const arrive=e.at-.12,swiping=t>=e.at&&t<=e.at+e.duration;
  let x=c.x,y=c.y,action=e.kind==='swipe'?'swipe':'touch',frame=c.frame;
  if(t<arrive){const u=q(t,approach,arrive);x=mix(prior.x,c.x,u);y=mix(prior.y??900,c.y,u);action=c.y<850?'climb':'walk';frame=action==='climb'?102:Math.floor(Math.abs(c.x-prior.x)*u/24)%6;}
  else if(t>e.at+e.duration){const holdForNext=next&&next.at-e.at<2.5,u=holdForNext?0:q(t,e.at+e.duration,release);x=mix(c.x,home(i,t),u);y=mix(c.y,900,u);action=u>.04?'walk':'touch';if(u>.04)frame=Math.floor(Math.abs(c.x-home(i,t))*u/24)%6;}
  const drag=swiping&&e.kind==='swipe'?-36*Math.sin(Math.PI*(t-e.at)/e.duration):0;
  out={...out,x:x+drag,y,frame,face:c.face,action,lean:swiping?-8*Math.sin(Math.PI*(t-e.at)/e.duration):0,screenContact:swiping?{slot:e.slot,kind:e.kind,target:{x:c.target.x+drag,y:c.target.y},at:e.at}:null};
  if(c.y<875)out.screenSupport={start:approach,in:.45,end:release+.2,out:.35,x:c.x,top:c.y,width:170,color:'olive'};
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
  else for(const v of views){setImage(v.a,STATIC_LAYOUTS[page].slots[v.slot].n);v.a.style.transform='';v.a.style.visibility='';v.b.style.visibility='hidden';}
  base.render(info);[...$('labels').children].forEach((el,i)=>el.textContent=STATIC_LAYOUTS[page].labels[i][0]);if(innerWidth<=800&&enabled)for(const v of views){const s=imageState(page,v.slot,info.time);paintImages(v.el,v.a,v.b,s,info.reduced,diagrams.has(s.n));v.el.onclick=()=>window.openArtwork(s.n)}reading=enabled?viewAt(page,info.time):null;zoom.hidden=!reading||innerWidth<=800;ring.hidden=true;
  let z=null;if(reading){z=readingBox(page,info.time,reading);if(info.reduced){z.box=z.target;z.u=1}if(innerWidth>800){paintImages(zoom,zOld,zNew,z.state,info.reduced,diagrams.has(z.state.n));zOld.style.objectFit=zNew.style.objectFit='contain';Object.assign(zoom.style,{left:z.box.x/W*100+'%',top:z.box.y/H*100+'%',width:z.box.w/W*100+'%',height:z.box.h/H*100+'%',opacity:String(Math.min(1,z.u*5)),transform:`rotate(${(STATIC_LAYOUTS[page].slots[reading.slot].rotate||0)*(1-z.u)}deg)`});
    for(const v of views)v.el.style.opacity=String(1-z.u*.48);
    for(const [i,el] of [...$('labels').children].entries()){const l=STATIC_LAYOUTS[page].labels[i];if(z.box.x<(l[1]+l[3])*W&&z.box.x+z.box.w>l[1]*W&&z.box.y<(l[2]+l[4])*H&&z.box.y+z.box.h>l[2]*H)el.style.opacity=String(1-z.u)}
   }}
  if(innerWidth<=800&&enabled){const active=z?{slot:reading.slot,n:z.state.n}:cues[page].filter(c=>c.at<=info.time).at(-1);if(active){const slot=active.slot,n=imageState(page,slot,info.time).n;for(const v of views)v.el.classList.toggle('mobileSelected',v.slot===slot);}}
  if(enabled){const lab=$('labels').children;
   if(page===3&&imageState(page,0,info.time).n===36){lab[0].textContent='9F';lab[1].textContent='共享座席'}
   if(page===4&&imageState(page,0,info.time).n===50)lab[0].textContent='墙面 · 构件研究';
   if(page===6)lab[0].textContent=imageState(page,0,info.time).n===66?'方案 B · 展览空间':'方案 B · 前区空间';
   if(page===7)lab[0].textContent=imageState(page,0,info.time).n===67?'幼儿园 · 常规教室':'幼儿园 · 阅读空间';
  }
  const p=base.getState().pose;if(enabled&&!info.reduced&&p?.screenContact){const c=p.screenContact,u=clamp((info.time-c.at)/.45);ring.hidden=false;Object.assign(ring.style,{left:c.target.x/W*100+'%',top:c.target.y/H*100+'%',opacity:String(1-u),transform:`translate(-50%,-50%) scale(${.7+u})`});}
 },
 getState(){const s=base.getState(),z=reading&&last?readingBox(page,last.time,reading):null;return {...s,screens:enabled?views.map(v=>({slot:v.slot,...imageState(page,v.slot,last.time)})):[],props:z&&innerWidth>800?[{n:z.state.n,box:z.box,q:z.u,phase:z.u>.999?'read':'zoom'}]:[],screenZoom:reading?.slot??null}},
 capture(){zoom.hidden=true;ring.hidden=true;return base.capture()},
 async handoff(...args){zoom.hidden=true;ring.hidden=true;return base.handoff(...args)}
};
window.director=director;
})();
