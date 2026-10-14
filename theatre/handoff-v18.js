(() => {
'use strict';
const clamp=u=>Math.max(0,Math.min(1,u)),ease=u=>{u=clamp(u);return u*u*(3-2*u)},q=(u,a,b)=>ease((u-a)/(b-a)),mix=(a,b,u)=>a+(b-a)*u;
const tipping=type=>type==='fold'||type==='table';
function sample(type,u,start,end){
 const tip=tipping(type),move=type==='slide'?q(u,.08,.88):q(u,tip ? .34 : .26,tip ? .73 : .78);
 const arrive=q(u,.82,1),distance=Math.hypot(end.x-start.x,end.y-start.y);
 let frame=200,phase='prepare';
 if(tip){
  frame=u<.07?600:u<.14?601:u<.23?602:u<.34?603:u<.57?604:u<.73?605:u<.85?606:607;
  phase=u<.23?'turnAway':u<.34?'contact':u<.57?'push':u<.73?'followThrough':'recover';
 }else if(type==='slide'){
  frame=300;phase='travel';
 }else{
  const high=type==='descend';
  frame=u<.12?201:u<.2?202:u<.26?(high?203:209):u<.47?(high?204:206):u<.66?(high?205:207):u<.82?209:200;
  phase=u<.2?'prepare':u<.26?'contact':u<.66?(type==='match'?'tap':type==='stack'||type==='folio'?'gather':'swipe'):'recover';
 }
 const travel=type==='slide'?q(u,.05,.95):arrive;
 const pose={...end,x:mix(start.x,end.x,travel),y:mix(start.y,end.y,travel),frame,face:tip?1:type==='slide'?(end.x>=start.x?1:-1):-1,
  walkDistance:distance*travel,walkEnvelope:Math.min(q(u,0,.12),1-q(u,.88,1)),action:type==='slide'?'walk':'pageGesture',perch:false,poseBlend:0,lean:0,lag:0,squash:1,turnScale:1,alpha:1,carryOverride:null,screenContact:null,screenSupport:null,
  acting:{phase,transition:type},time:0};
 // Never drift a braced pair of feet during contact and exertion.
 if(type!=='slide'&&u<.82){pose.x=start.x;pose.y=start.y}
 let old='',next='',clip='',oldOpacity=1,nextOpacity=1;
 switch(type){
  case 'fold':case 'table':{
   const settle=q(u,.52,.86);old=`perspective(1700px) rotateX(${move*88}deg) scaleY(${1-move*.24})`;
   oldOpacity=1-q(u,.62,.77);next=`translateY(${(1-settle)*9}%) scale(${.96+.04*settle})`;nextOpacity=q(u,.44,.68);break;
  }
  case 'slide':old=`translateX(${-move*100}%)`;next=`translateX(${(1-move)*100}%)`;break;
  case 'descend':old=`translateY(${-move*100}%)`;next=`translateY(${(1-move)*100}%)`;break;
  case 'leaf':old=`translateX(${-move*100}%) rotate(${-move*3}deg)`;next=`translateX(${(1-move)*100}%)`;break;
  case 'turn':old=`perspective(1800px) rotateY(${-move*95}deg)`;next=`perspective(1800px) rotateY(${(1-move)*70}deg)`;break;
  case 'match':clip=`circle(${move*145}% at ${((start.x-35)/1672*100).toFixed(2)}% 63%)`;break;
  case 'folio':{
   const fold=q(u,.26,.53),open=q(u,.52,.87);old=`scale(${1-fold*.87}) rotate(${-fold*4}deg)`;oldOpacity=1-q(u,.45,.58);
   next=`scale(${.13+open*.87})`;nextOpacity=q(u,.52,.65);break;
  }
  case 'stack':old=`scale(${1-move*.86}) rotate(${move*4}deg)`;oldOpacity=1-q(u,.64,.79);nextOpacity=q(u,.54,.8);break;
  default:old=`translateX(${-move*100}%)`;next=`translateX(${(1-move)*100}%)`;
 }
 return {pose,old,next,clip,oldOpacity,nextOpacity,move,phase,tip};
}
Object.assign(PERFORMANCE_HANDOFFS[2],{name:'转身推倒故事板，露出楼层',duration:3.6});
Object.assign(PERFORMANCE_HANDOFFS[4],{name:'背身推平版面，展开平面对照',duration:3.8});
window.stageHandoff={sample};
window.DIRECTOR_EDITION='v18 / 交替步态与人物触发转场';
})();
