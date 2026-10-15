(() => {
'use strict';
const $=id=>document.getElementById(id),base=window.director,W=1672,H=941,score=PERFORMANCE_SCORE;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),mix=(a,b,u)=>a+(b-a)*u,ease=u=>{u=clamp(u);return u*u*(3-2*u)},q=(t,a,b)=>ease((t-a)/(b-a));
const scenic=document.createElement('div');scenic.id='sceneryV6';
const nodes=['designPlate','headline','mobileClay','materials','supportPlate','foregroundPlate','labels','clayBook','poster','coverMobile','clayPortrait','ending'];
for(const name of nodes){const el=name==='headline'?document.querySelector('.headline'):$(name);scenic.append(el)}
$('stageCanvas').prepend(scenic);
const canvas=document.createElement('canvas');canvas.id='castV6';canvas.width=W;canvas.height=H;canvas.setAttribute('aria-hidden','true');
const props=document.createElement('div');props.id='propsV6';props.setAttribute('aria-hidden','true');
const ns='http://www.w3.org/2000/svg',focus=document.createElementNS(ns,'svg');focus.id='focusV6';focus.setAttribute('viewBox',`0 0 ${W} ${H}`);focus.setAttribute('aria-hidden','true');const chalk=document.createElementNS(ns,'path');focus.append(chalk);
const actorHit=document.createElement('button');actorHit.id='actorHitV16';actorHit.hidden=true;actorHit.setAttribute('aria-label','暂停讲述');
actorHit.onclick=e=>{
 if(e.detail){const r=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*W),y=Math.floor((e.clientY-r.top)/r.height*H);
  if(x<0||y<0||x>=W||y>=H||context.getImageData(x,y,1,1).data[3]<35){actorHit.style.pointerEvents='none';const below=document.elementFromPoint(e.clientX,e.clientY)?.closest('button,a');actorHit.style.pointerEvents='';below?.click();return}
 }
 if(transitioning)window.theatre.pause();else $('playToggle').click();
};
$('stageCanvas').append(props,focus,canvas,actorHit);
const staticImages=stageDesign.images;stageDesign.images=i=>i===6?[...staticImages(i),66]:staticImages(i);
const context=canvas.getContext('2d'),atlases=[
 {src:'assets/identity-v17/basic.webp',rows:2,count:8,manifest:'assets/identity-v17/basic-regions.json'},null,
 {src:'assets/identity-v17/screen.webp',rows:3,count:12,manifest:'assets/identity-v17/screen-regions.json'},
 {src:'assets/walk-v20/original.webp',rows:2,count:8,manifest:'assets/walk-v20/original-regions.json'},
 null,{src:'assets/identity-v17/point.webp',rows:1,count:1,manifest:'assets/identity-v17/point-regions.json'},
 {src:'assets/acting-v18/turn-push.webp',rows:2,count:8,manifest:'assets/acting-v18/turn-push-regions.json'},
 {src:'assets/acting-v19/basic-closed.webp',rows:1,count:1,manifest:'assets/acting-v19/basic-closed-regions.json'},
 {src:'assets/walk-v20/opposite.webp',rows:2,count:4,manifest:'assets/walk-v20/opposite-regions.json'}];
let page=0,previous=null,enabled=false,loaded=false,transitioning=false,transitionId=0,state={},lastRender=null,photoNodes=[];
// Use the connected alpha component of each tile, excluding atlas noise.
function bounds(data,w,h){const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let best={area:0,l:0,r:0,u:0,b:0};for(let n=0;n<w*h;n++){if(seen[n]||data[n*4+3]<100)continue;let head=0,tail=1,l=w,r=0,u=h,b=0;queue[0]=n;seen[n]=1;while(head<tail){const z=queue[head++],x=z%w,y=Math.floor(z/w);l=Math.min(l,x);r=Math.max(r,x);u=Math.min(u,y);b=Math.max(b,y);for(const next of [x?z-1:-1,x<w-1?z+1:-1,y?z-w:-1,y<h-1?z+w:-1])if(next>=0&&!seen[next]&&data[next*4+3]>=100){seen[next]=1;queue[tail++]=next}}if(tail>best.area)best={area:tail,l,r,u,b}}best.cx=(best.l+best.r)/2;let sum=0,total=0;for(let y=Math.floor(best.b-(best.b-best.u)*.1);y<=best.b;y++)for(let x=best.l;x<=best.r;x++){const alpha=data[(y*w+x)*4+3];if(alpha>100){sum+=x*alpha;total+=alpha}}best.footX=total?sum/total:best.cx;sum=0;total=0;for(let y=Math.floor(best.u+(best.b-best.u)*.52);y<=Math.floor(best.u+(best.b-best.u)*.64);y++)for(let x=best.l;x<=best.r;x++){const alpha=data[(y*w+x)*4+3];if(alpha>100){sum+=x*alpha;total+=alpha}}best.hipX=total?sum/total:best.cx;sum=0;total=0;for(let y=Math.floor(best.u+(best.b-best.u)*.13);y<=Math.floor(best.u+(best.b-best.u)*.28);y++)for(let x=best.l;x<=best.r;x++){const alpha=data[(y*w+x)*4+3];if(alpha>100){sum+=x*alpha;total+=alpha}}best.headX=total?sum/total:best.cx;return best}
const prepared=Promise.all(atlases.map(async a=>{
 if(!a)return;
 a.image=new Image();a.image.src=a.src;await a.image.decode();a.w=a.image.width/4;a.h=a.image.height/a.rows;
 // Read full connected-sprite rectangles, rather than cutting shoes at assumed grid lines.
 a.regions=a.manifest?await fetch(a.manifest).then(r=>{if(!r.ok)throw Error('Missing sprite regions');return r.json()}):Array.from({length:a.count},(_,i)=>[i%4*a.w,Math.floor(i/4)*a.h,a.w,a.h]);
 const c=document.createElement('canvas'),ctx=c.getContext('2d',{willReadFrequently:true});a.boxes=[];if(a.src.includes('/screen.webp'))a.nativeFaces=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1];if(a.src.includes('/point.webp'))a.nativeFaces=[-1];
 for(const [x,y,w,h] of a.regions){c.width=w;c.height=h;ctx.drawImage(a.image,x,y,w,h,0,0,w,h);a.boxes.push(bounds(ctx.getImageData(0,0,w,h).data,w,h))}
})).then(()=>{loaded=true;window.dispatchEvent(new Event('castready'))});
const frames={look:6,present:10,nod:11,reach:100,brace:400,climb:102,balance:103,touch:104,recoil:105,sit:106,grasp:107,pull:404,push:402,dust:110,wave:111,inspect:11,front:6,listen:6,point:8,hold:9};
const flips=[1,1,1,1,-1,1,1,1,-1,-1,1,-1],basicFacing=[1,1,1,1,1,1,1,1,-1,1,1,-1];
function businessAt(scene,time){
 const m={lean:0,lag:0,dx:0,dy:0,squash:1};
 for(const e of score[scene].business||[]){if(time<e.start||time>=e.end)continue;
  const u=clamp((time-e.start)/(e.end-e.start)),bell=Math.sin(Math.PI*u),force=e.amount||1;
  switch(e.kind){
   case 'effort':case 'pull':case 'peel':m.lean+=(-13*Math.sin(Math.PI*u*2)*bell)*force;m.dx+=Math.sin(Math.PI*u*2)*5*force;m.squash-=bell*.015;break;
   case 'press':case 'unfold':case 'spread':m.lean-=bell*9*force;m.lag+=Math.sin(Math.PI*u*2)*3;break;
   case 'balance':case 'settle':m.lean+=Math.sin(u*Math.PI*4)*Math.sin(Math.PI*u)*7*force;break;
   case 'sit':case 'land':m.dy+=Math.sin(Math.PI*u)*3;m.squash-=Math.sin(Math.PI*u)*.018;break;
   case 'crouch':m.lean-=bell*10;m.squash-=bell*.035;break;
   case 'put':case 'gather':m.lean-=bell*7;m.squash-=bell*.01;break;
   case 'straighten':m.lean-=Math.sin(u*Math.PI*2)*7*bell;break;
   case 'doubleTake':m.lean+=Math.sin(u*Math.PI*2)*8*bell;break;
   case 'nod':m.dy+=Math.sin(Math.PI*u)*3;m.lean-=bell*2;break;
   case 'greet':m.lean+=Math.sin(u*Math.PI*2)*3*bell;break;
  }
 }
 return m;
}
function rawPose(scene,time){
 const route=score[scene].route;let index=0;while(index<route.length-1&&time>=route[index+1].t)index++;
 const a=route[index],b=route[Math.min(index+1,route.length-1)],u=a===b?0:q(time,a.t,b.t),distance=Math.hypot(b.x-a.x,b.y-a.y),moving=distance>15&&u>.01&&u<.99;
 let action=a.action;if(moving&&!['climb','pull','push','sit','recoil','brace'].includes(action))action='walk';
 const crossingSeat=(a.action==='sit')!==(b.action==='sit'),m=businessAt(scene,time);
 const walkDistance=distance*u+route.slice(1,index+1).reduce((d,c,j)=>d+Math.hypot(c.x-route[j].x,c.y-route[j].y),0);
 const face=moving&&action==='walk'?(b.x>a.x?1:-1):a.face;
 const frame=action==='walk'?300+walkGait.frame(walkDistance):frames[action];
 const prev=route[Math.max(0,index-1)],blend=action!=='walk'&&prev.action!==action&&!['sit','climb'].includes(action)&&!['sit','walk','climb'].includes(prev.action)?1-q(time,a.t,a.t+.1):0;
 const appear=score[scene].appear,alpha=appear?q(time,appear[0],appear[1]):1;
 const pose={walkDistance,walkEnvelope:Math.min(q(time,a.t,a.t+.16),1-q(time,b.t-.2,b.t)),x:mix(a.x,b.x,u)+m.dx,y:(crossingSeat?a.y:mix(a.y,b.y,u))+m.dy+(appear?(1-alpha)*65:0),action,face,frame,perch:action==='sit',time,lean:m.lean,lag:m.lag,squash:m.squash,alpha,previousFrame:frames[prev.action],poseBlend:blend};return window.screenStage?.pose(scene,time,pose,hand)||pose;
}
const basicAliases=[300,301,302,303,304,305,0,4,203,1,207,7],actingAliases=[203,400,408,409,204,405,407,400,404,402,2,202];
function anatomy(p){
 let canonical=p.action==='walk'&&Number.isFinite(p.walkDistance)?300+walkGait.frame(p.walkDistance):p.frame<100?basicAliases[p.frame]:p.frame<200?actingAliases[p.frame-100]:p.frame;if(canonical>=400&&canonical<500)canonical=[202,206,207,207,209,209,211,200,303,211,500,209][canonical-400];
 if(canonical===4)canonical=700;
 if(canonical>=304&&canonical<=307)canonical=800+canonical-304;
 const bank=Math.floor(canonical/100),a=atlases[bank],i=canonical%100,b=a.boxes[i],ref=a.boxes[0];
 const scale=342/(ref.b-ref.u),native=a.nativeFaces?.[i]??(bank===2?-1:1),face=p.face*native,anchor=p.perch?b.u+(b.b-b.u)*.64:b.b,cx=bank===3||bank===8?b.headX:bank===6||bank===7?b.footX:bank>=3?b.hipX:b.footX;
 return {bank,a,i,b,scale,face,anchor,cx};
}
function hand(p){const {bank,i,b,scale,face,anchor,cx}=anatomy(p),x=bank===5?.02:bank===4?[.8,.95,.98,.98,.94,.8,.55,.5,.8,.8,.98,.65][i]:(bank===3||bank===8)?.8:bank===2?[.3,.3,.08,.02,.02,.02,.02,.02,.25,.25,.3,.8][i]:.7,y=bank===5?.54:bank===4?[.31,.28,.27,.27,.29,.32,.52,.6,.3,.4,.69,.49][i]:(bank===3||bank===8)?.48:bank===2?[.61,.61,.27,.10,.015,.14,.33,.33,.30,.34,.61,.63][i]:.5;return {x:(b.l+(b.r-b.l)*x-cx)*scale*face,y:(b.u+(b.b-b.u)*y-anchor)*scale}}

const storyPictures=new Map();
function storyImage(n){if(!storyPictures.has(n)){const im=new Image();im.src=`assets/work-${n}.webp`;storyPictures.set(n,im)}return storyPictures.get(n)}
function carryAt(scene,t,p){
 const c=score[scene].carry;if(!c||t<c.start||t>c.end)return null;
 const im=storyImage(c.n);if(!im.naturalWidth)return null;
 const h=hand(p),w=(c.width||190),r=im.naturalWidth/im.naturalHeight,held={x:p.x+h.x-w*.9,y:p.y+h.y-w/r*.45,w,h:w/r};
 const loose=c.loose?{x:c.loose[0],y:c.loose[1],w:c.loose[2],h:c.loose[3]}:held;
 const picked=q(t,c.pickup,c.pickup+.45),rect=blend(loose,held,picked);
 return {n:c.n,rect,rotation:mix(-3,-8,picked),back:0,alpha:q(t,c.start,c.start+.25),stack:c.stack||[],picked};
}
function paperCard(card){
 if(!card)return;const {rect:r}=card,im=storyImage(card.n);if(!im.naturalWidth)return;
 context.save();context.globalAlpha*=card.alpha??1;context.translate(r.x+r.w/2,r.y+r.h/2);context.rotate(card.rotation*Math.PI/180);
 const one=(image,x,y,angle=0)=>{context.save();context.translate(x,y);context.rotate(angle);context.shadowColor='#32281f30';context.shadowBlur=7;context.shadowOffsetY=4;context.fillStyle='#e6d8bd';context.fillRect(-r.w/2,-r.h/2,r.w,r.h);context.shadowColor='transparent';if(card.back<1){context.globalAlpha*=1-(card.back||0);if([3,18,48].includes(card.n))context.globalCompositeOperation='multiply';context.drawImage(image,-r.w/2,-r.h/2,r.w,r.h)}context.restore()};
 (card.stack||[]).forEach((n,i)=>{const image=storyImage(n);if(image.naturalWidth)one(image,-12*(i+1),-8*(i+1),-.06*(i+1))});one(im,0,0);context.restore();
}
function supportAt(t,p){const c=window.screenStage?.support(p)||score[page].support;if(!c||t<c.start||t>c.end)return;const u=q(t,c.start,c.start+c.in)*(1-q(t,c.end-c.out,c.end)),top=mix(900,c.top,u),w=c.width,x=c.x-w/2,h=900-top;
 context.save();context.globalAlpha=u;context.fillStyle='#30271f28';context.beginPath();context.ellipse(c.x,904,w*.63,11,0,0,Math.PI*2);context.fill();
 const gradient=context.createLinearGradient(x,top,x+w,900);if(c.color==='olive'){gradient.addColorStop(0,'#a1aa73');gradient.addColorStop(.4,'#839055');gradient.addColorStop(1,'#64713d')}else{gradient.addColorStop(0,'#d58d58');gradient.addColorStop(.45,'#c57643');gradient.addColorStop(1,'#9a562f')}
 context.fillStyle=gradient;context.beginPath();context.moveTo(x+22,top+4);context.bezierCurveTo(x+w*.35,top-4,x+w*.75,top+2,x+w-18,top+5);context.quadraticCurveTo(x+w+3,top+12,x+w,top+31);context.lineTo(x+w-3,900-14);context.quadraticCurveTo(x+w-5,901,x+w-25,902);context.lineTo(x+20,900);context.quadraticCurveTo(x-3,899,x,879);context.lineTo(x-2,top+28);context.quadraticCurveTo(x-1,top+8,x+22,top+4);context.fill();
 context.strokeStyle='#f6dfb032';context.lineWidth=3;context.beginPath();context.moveTo(x+24,top+13);context.quadraticCurveTo(c.x,top+8,x+w-23,top+14);context.stroke();
 context.fillStyle='#37261312';for(let i=0;i<65;i++){const xx=x+12+(i*47%Math.max(1,w-24)),yy=top+16+(i*31%Math.max(1,h-24));context.beginPath();context.ellipse(xx,yy,.8+(i%3)*.3,.7,0,0,Math.PI*2);context.fill()}context.restore();
}
function paintPose(p,alpha=1){
 if(p.action==='walk')p={...p,lean:0,lag:0,squash:1};
 const shape=anatomy(p),{a,i,b,scale,face,anchor,cx}=shape,sx=a.regions[i][0]+b.l,sy=a.regions[i][1]+b.u,sw=b.r-b.l+1,sh=b.b-b.u+1;
 context.save();context.globalAlpha*=alpha;context.translate(p.x,p.y);context.scale(face*(p.turnScale??1),p.squash||1);
 const strips=Math.abs(p.lean||0)+Math.abs(p.lag||0)>.05?24:1;
 for(let j=0;j<strips;j++){const v=j/strips,v2=(j+1)/strips,dy=(b.u+sh*v-anchor)*scale,dh=sh/strips*scale+.5,offset=((p.lean||0)*(1-v)**2+(p.lag||0)*(1-v)**4)*face;
  context.drawImage(a.image,sx,sy+sh*v,sw,Math.min(sh/strips+1,sh-sh*v),(b.l-cx)*scale+offset,dy,sw*scale,dh);
 }
 speechMouth.paint(context,shape,p,speechMouth.level(page,p.time||0,!!lastRender?.playing&&!transitioning));
 context.restore();
}
function draw(p){
 context.clearRect(0,0,W,H);if(!loaded||!enabled)return;
 if(p.action==='walk'&&Number.isFinite(p.walkDistance))p={...p,frame:300+walkGait.frame(p.walkDistance)};
 // Guard the complete silhouette at stage edges, including transition gestures.
 const shape=anatomy(p),stretch=p.turnScale??1,lo=(shape.face>0?shape.b.l-shape.cx:shape.cx-shape.b.r)*shape.scale*stretch,hi=(shape.face>0?shape.b.r-shape.cx:shape.cx-shape.b.l)*shape.scale*stretch;
 const guardedX=Math.max(18-lo,Math.min(W-18-hi,p.x));if(guardedX!==p.x){const dx=guardedX-p.x;p={...p,x:guardedX,edgeGuard:true};if(p.screenContact)p.screenContact={...p.screenContact,target:{x:p.screenContact.target.x+dx,y:p.screenContact.target.y}}}


 if(!p.reduced)supportAt(p.time||0,p);context.save();context.globalAlpha=p.alpha??1;
 context.fillStyle=page===0||page===3||page===9?'#30352350':'#67583e35';context.beginPath();context.ellipse(p.x,p.perch?900:p.y+1,p.perch?28:46,7,0,0,Math.PI*2);context.fill();
 const f=p.poseBlend||0;if(f>.001)paintPose({...p,frame:p.previousFrame},f);paintPose(p,1-f);
 const card=p.carryOverride===undefined?carryAt(page,p.time||0,p):p.carryOverride;paperCard(card);context.restore();
 const {b,scale,face,anchor,cx,i}=anatomy(p),lean=Math.abs(p.lean||0)+Math.abs(p.lag||0);
 state.pose={...p,height:(b.b-b.u)*scale,bounds:{x:p.x+(face>0?b.l-cx:-(b.r-cx))*scale-lean,y:p.y+(b.u-anchor)*scale,w:(b.r-b.l)*scale+lean*2,h:(b.b-b.u)*scale}};state.storyCard=card?{n:card.n,picked:card.picked,back:card.back}:null;
 const hit=state.pose.bounds;Object.assign(actorHit.style,{left:hit.x/W*100+'%',top:hit.y/H*100+'%',width:hit.w/W*100+'%',height:hit.h/H*100+'%'});actorHit.hidden=(p.alpha??1)<.1;
}
function box(slot){return {x:slot.x*W,y:slot.y*H,w:slot.w*W,h:slot.h*H}}
function blend(a,b,u){const c={};for(const k of ['x','y','w','h'])c[k]=mix(a[k],b[k],u);return c}
function initializeProps(){props.replaceChildren();photoNodes=[];for(const item of score[page].props||[]){const div=document.createElement('div'),img=new Image();img.src=`assets/work-${item.n}.webp`;img.alt='';div.className='performancePhoto'+(item.diagram||item.n===3||item.n===5||item.n===50?' diagram':'');div.hidden=true;div.append(img);props.append(div);img.decode().catch(()=>{});photoNodes.push({div,img,item})}}
// Fit complete pictures rather than letting a large invisible object-fit box determine placement.
function fitted(envelope,img){const [x,y,w,h]=envelope,r=(img.naturalWidth||w)/(img.naturalHeight||h),fw=Math.min(w,h*r),fh=fw/r;return {x:x+(w-fw)/2,y:y+(h-fh)/2,w:fw,h:fh}}
function targetAt(item,t,img){let target=fitted(item.box,img);for(const key of item.layouts||[]){target=blend(target,fitted(key.box,img),q(t,key.t,key.until))}return target}
function renderProps(t,p,reduced=false){
 const activity=[],opacities=new Map();let attention=0;
 for(const {div,img,item} of photoNodes){
  const end=item.start+item.rise+item.hold+item.fall;
  if(t<item.start||t>=end||!img.complete||!img.naturalWidth){div.hidden=true;continue}
  const entering=t<item.start+item.rise,leaving=t>end-item.fall;
  const u=entering?q(t,item.start,item.start+item.rise):leaving?1-q(t,end-item.fall,end):1;
  const slot=item.slot==null?null:STATIC_LAYOUTS[page].slots[item.slot];
  const hp=item.origin==='hand'?rawPose(page,item.start):null,hh=hp?hand(hp):null,imRatio=(img.naturalWidth||1)/(img.naturalHeight||1);
  const source=hp?{x:hp.x+hh.x-190*.9,y:hp.y+hh.y-190/imRatio*.45,w:190,h:190/imRatio}:item.from?{x:item.from[0],y:item.from[1],w:item.from[2],h:item.from[3]}:box(slot);
  const target=targetAt(item,t,img),swap=entering&&item.in==='swap'||leaving&&item.out==='swap';
  let c=reduced||swap?{...target}:blend(source,target,u);
  if(!reduced&&!swap)c.y-=Math.sin(Math.PI*u)*12;
  if(!reduced&&swap)c.x+=(entering?1:-1)*(1-u)*18;
  let rotation=reduced||swap?0:(slot?.rotate||0)*(1-u);if(item.straighten&&!reduced){const [a,b,angle]=item.straighten;rotation+=angle*q(t,a-.35,a)*(1-q(t,a,b))*u}
  const alpha=reduced?1:swap?u:Math.min(1,u*4);
  div.hidden=false;Object.assign(div.style,{left:c.x/W*100+'%',top:c.y/H*100+'%',width:c.w/W*100+'%',height:c.h/H*100+'%',opacity:String(alpha),transform:`rotate(${rotation}deg)`,clipPath:!reduced&&item.reveal==='unfold'&&entering?`inset(0 ${(1-q(t,item.start,item.start+item.rise))*.42*100}% 0 0)`:'none'});
  if(item.slot!=null)opacities.set(item.slot,Math.min(opacities.get(item.slot)??1,1-u));
  attention=Math.max(attention,u);activity.push({n:item.n,box:c,q:u,alpha,phase:entering?'lift':leaving?'return':'read'});
 }
 for(const [i,el] of [...$('materials').children].entries())el.style.opacity=String(Math.min(1-attention*.84,opacities.get(i)??1));
 // A lifted picture can pass over a paper tag. Retire its text as a whole instead of cutting letters in half.
 for(const [i,el] of [...$('labels').children].entries()){
  const l=STATIC_LAYOUTS[page].labels[i],r={x:l[1]*W,y:l[2]*H,w:l[3]*W,h:l[4]*H};let opacity=1;
  for(const p of activity){const b=p.box;if(b.x<r.x+r.w&&b.x+b.w>r.x&&b.y<r.y+r.h&&b.y+b.h>r.y)opacity=Math.min(opacity,1-clamp(p.q*4))}
  el.style.opacity=String(opacity);
 }
 return activity;
}
function renderFocus(time,reduced){chalk.setAttribute('d','');focus.style.opacity='0';if(reduced)return;for(const [a,b,index] of score[page].focus){if(time<a||time>b)continue;const s=STATIC_LAYOUTS[page].slots[index];if(!s)continue;const z=box(s),x=z.x+z.w*.55,y=z.y+z.h*.56,w=Math.min(z.w*.36,210),h=Math.min(z.h*.25,100);chalk.setAttribute('d',`M${x-w} ${y} C${x-w} ${y-h*1.5},${x+w} ${y-h*1.5},${x+w} ${y} C${x+w} ${y+h},${x-w} ${y+h},${x-w} ${y}`);focus.style.opacity=String(Math.sin((time-a)/(b-a)*Math.PI)*.8);if(page===5)for(const [i,el] of [...$('materials').children].entries())el.style.opacity=String(i===index?1:1-Math.sin((time-a)/(b-a)*Math.PI)*.35)}}
function render(info){lastRender=info;base.render(info);if(transitioning)return;enabled=info.unlocked&&info.mode==='show';document.body.dataset.performing=String(enabled);actorHit.hidden=!enabled;actorHit.setAttribute('aria-label',info.playing?'暂停讲述':'继续讲述');canvas.hidden=!enabled;state={page,time:info.time,transitioning:false,role:score[page].role};if(!enabled||!loaded){context.clearRect(0,0,W,H);props.hidden=true;focus.style.opacity='0';for(const el of [...$('materials').children,...$('labels').children])el.style.opacity='';return}props.hidden=false;let p=rawPose(page,info.time);if(info.reduced){p={...p,x:window.screenStage&&page>0&&page<9?1450:score[page].entry[0],y:900,action:'look',frame:6,perch:false,lean:0,lag:0,squash:1,poseBlend:0,reduced:true,carryOverride:null}}state.props=renderProps(info.time,p,info.reduced);renderFocus(info.time,info.reduced);draw(p);

}
function capture(){if(!enabled||!loaded)return null;const clone=scenic.cloneNode(true),source=[scenic,...scenic.querySelectorAll('*')],dest=[clone,...clone.querySelectorAll('*')];source.forEach((el,i)=>{const cs=getComputedStyle(el);let text='';for(const name of cs)text+=`${name}:${cs.getPropertyValue(name)};`;dest[i].style.cssText=text;dest[i].removeAttribute('id');dest[i].removeAttribute('tabindex')});const defs=$('contourDefs').parentNode.cloneNode(true),prefix='snapshot'+transitionId+'-';for(const el of defs.querySelectorAll('[id]'))el.id=prefix+el.id;for(const el of dest)el.style.clipPath=el.style.clipPath.replace(/#(clayForeground|claySupport|artAperture\d+)/g,'#'+prefix+'$1');clone.append(defs);clone.className='outgoingV6';clone.setAttribute('aria-hidden','true');clone.inert=true;return {clone,page,pose:state.pose?{...state.pose}:rawPose(page,STORY[page].duration),card:carryAt(page,STORY[page].duration-.01,state.pose||rawPose(page,STORY[page].duration))}}
function configure(scene,index){for(const n of [score[index].carry?.n,...(score[index].carry?.stack||[])].filter(Boolean))storyImage(n);transitionId++;transitioning=false;document.querySelectorAll('.outgoingV6').forEach(el=>el.remove());scenic.style.transform='';scenic.style.transformOrigin='';scenic.style.opacity='';scenic.style.clipPath='';scenic.style.opacity='';$('subtitles').style.opacity='';props.style.opacity='';page=index;base.configure(scene,index);if(index===6){const extra=$('materials').children[0].cloneNode(true);extra.classList.add('sequenceOnly');extra.classList.remove('mobileSelected');extra.dataset.index='3';extra.querySelector('img').src='assets/work-66.webp';extra.querySelector('img').alt=ART_LABELS[66];extra.setAttribute('aria-label','放大原图：'+ART_LABELS[66]);extra.onclick=()=>window.openArtwork(66);$('materials').append(extra)}initializeProps();state={page};for(const image of [$("designPlate"),...$('materials').querySelectorAll('img')])image.decode().catch(()=>{});const next=STATIC_LAYOUTS[index+1];if(next){const bg=new Image();bg.src=`assets/design-v5/plate-${index+1}.webp`;for(const n of new Set([...next.slots.map(s=>s.n),...(score[index+1].props||[]).map(p=>p.n)])){const img=new Image();img.src=`assets/work-${n}.webp`}}}
async function prepare(){await prepared;await Promise.all([$('designPlate').decode(),...Array.from($('materials').querySelectorAll('img'),i=>i.decode()),...photoNodes.map(({img})=>img.decode().catch(()=>{})),...[score[page].carry?.n,...(score[page].carry?.stack||[])].filter(Boolean).map(n=>storyImage(n).decode().catch(()=>{}))]);}
async function handoff(snapshot,from,to,auto){
 if(!snapshot||!auto||to!==from+1||matchMedia('(prefers-reduced-motion:reduce)').matches){snapshot?.clone.remove();return}
 const id=transitionId,plan=PERFORMANCE_HANDOFFS[from],type=score[from].transition;
 transitioning=true;enabled=true;canvas.hidden=false;$('subtitles').style.opacity='0';props.hidden=true;focus.style.opacity='0';
 snapshot.clone.style.setProperty('z-index',type==='match'?'1':'5','important');scenic.style.zIndex=type==='match'?'2':'0';
 $('stageCanvas').insertBefore(snapshot.clone,canvas);actorHit.hidden=false;actorHit.setAttribute('aria-label','暂停讲述');
 try{
  await prepare();if(id!==transitionId)return;
  const begin=performance.now(),start=snapshot.pose,end={...rawPose(to,0)};
  if(type==='folio'||type==='stack'){
   const h=hand(start),origin=`${start.x+h.x}px ${start.y+h.y}px`;
   snapshot.clone.style.setProperty('transform-origin',origin,'important');
   if(type==='folio')scenic.style.transformOrigin=origin;
  }
  await new Promise(resolve=>{function step(now){
   if(id!==transitionId){resolve();return}
   const u=clamp((now-begin)/(plan.duration*1000)),f=stageHandoff.sample(type,u,start,end),p=f.pose;
   snapshot.clone.style.transform=f.old;snapshot.clone.style.opacity=String(f.oldOpacity);
   scenic.style.transform=f.next;scenic.style.clipPath=f.clip;scenic.style.opacity=String(f.nextOpacity);
   // Put the loose card away before both hands turn toward the stage screen.
   const carried=snapshot.card;
   if(carried&&u<.23){
    const hh=hand(p),image=storyImage(carried.n),cw=carried.rect.w,ch=cw/(image.naturalWidth/image.naturalHeight);
    p.carryOverride={...carried,rect:{x:p.x+hh.x-cw*.9,y:p.y+hh.y-ch*.45,w:cw,h:ch},rotation:-8,back:q(u,.04,.18),alpha:1-q(u,.1,.23)};
   }
   draw(p);state={...state,page:to,transitioning:true,handoff:plan.name,fraction:u,phase:f.phase,pageMotion:f.move,pose:state.pose};
   if(u<1)requestAnimationFrame(step);else resolve();
  }requestAnimationFrame(step)});
 }finally{
  snapshot.clone.remove();if(id===transitionId){transitioning=false;scenic.style.transform='';scenic.style.transformOrigin='';scenic.style.clipPath='';scenic.style.opacity='';$('subtitles').style.opacity='';scenic.style.zIndex='';if(lastRender)render({...lastRender,time:0,playing:false})}
 }
}
function finishHandoff(){if(!transitioning)return;transitionId++;transitioning=false;document.querySelectorAll('.outgoingV6').forEach(el=>el.remove());scenic.style.transform='';scenic.style.transformOrigin='';scenic.style.clipPath='';scenic.style.opacity='';$('subtitles').style.opacity='';scenic.style.zIndex='';if(lastRender)render({...lastRender,time:0,playing:false})}
window.director={...base,finishHandoff,configure,prepare,render,capture,handoff,getState:()=>({...state,ready:loaded,enabled}),reset:()=>{base.reset();if(lastRender&&!transitioning)render(lastRender)}};
window.performanceDirector={hand,score:()=>score,pose:(i,t)=>rawPose(i,t),state:()=>({...state}),handoff:(i)=>{const snap=capture();window.theatre.go(i+1);return handoff(snap,i,i+1,true)}};
})();
