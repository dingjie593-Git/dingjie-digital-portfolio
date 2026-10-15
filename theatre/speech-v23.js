(() => {
'use strict';
// Original-atlas landmarks: animate lips without replacing the character or gait.
const mouths={
 0:[[238,109,33,-21],[550,100,31,10],[952,107,33,-16],[1275,108,18,27],[251,613,34,-28],[557,612,27,10],[951,615,29,-23],[1310,608,32,-30]],
 2:[[150,110,28,-16],[373,113,26,10],[633,113,26,11],[893,111,26,19],[131,619,25,20],[386,619,26,19],[646,625,26,18],[906,633,26,20],[126,1120,25,19],[382,1123,26,17],[636,1124,26,19],[908,1120,27,-21]],
 3:[[264,111,28,-7],[626,115,28,-11],[994,115,26,-2],[1382,117,24,2]],
 5:[[501,318,80,-23]],
 6:[[244,116,32,-18],[539,112,18,-4],[963,114,15,-18],null,null,null,[948,604,28,16],[1317,609,32,-21]],
 7:[[251,613,36,-27]],
 8:[[269,608,25,-3],[630,612,23,-1],[1002,611,23,1],[1389,611,24,1]]
};
let data=null;
const ready=fetch('assets/speech-v23/envelopes.json').then(r=>{if(!r.ok)throw Error('Speech timing unavailable');return r.json()}).then(d=>data=d).catch(()=>null);
function level(scene,time,playing){
 if(!playing||!data)return 0;
 const row=data.scenes[scene];if(!row||time<0||time>=row.duration)return 0;
 const pos=time*data.fps,i=Math.floor(pos),f=pos-i,v=row.levels;
 return Math.max(((v[i]||0)*(1-f)+(v[i+1]||0)*f)/255,(v[i-1]||0)/255*.6);
}
function paint(ctx,shape,p,amount){
 const {bank,a,i,b,scale,face,anchor,cx}=shape,m=mouths[bank]?.[i];
 if(!m||amount<.035||Math.abs(p.turnScale??1)<.5)return;
 const [mx,my,w,angle]=m,[rx,ry]=a.regions[i];
 const x=mx-rx,y=my-ry,v=(y-b.u)/(b.b-b.u+1);
 const offset=((p.lean||0)*(1-v)**2+(p.lag||0)*(1-v)**4)*face;
 ctx.save();ctx.translate((x-cx)*scale+offset,(y-anchor)*scale);ctx.scale(scale,scale);ctx.rotate(angle*Math.PI/180);
 const round=(Math.sin((p.time||0)*19)+1)/2,width=w*(.94-.06*round*amount),h=w*(.02+.27*amount),left=-width/2,right=width/2;
 ctx.filter='blur(.22px)';
 const cavity=new Path2D();cavity.moveTo(left,0);cavity.bezierCurveTo(-width*.2,-h*.16,width*.23,-h*.16,right,0);cavity.bezierCurveTo(width*.35,h*1.04,-width*.3,h*1.04,left,0);cavity.closePath();
 const inside=ctx.createLinearGradient(0,0,0,h);inside.addColorStop(0,'#512727');inside.addColorStop(1,'#903f3b');ctx.fillStyle=inside;ctx.fill(cavity);
 ctx.save();ctx.clip(cavity);
 const teeth=ctx.createLinearGradient(0,0,0,h*.4);teeth.addColorStop(0,'#dac8b1');teeth.addColorStop(.45,'#f2dfc5');teeth.addColorStop(1,'#d3b99f');ctx.fillStyle=teeth;ctx.beginPath();ctx.moveTo(left,0);ctx.quadraticCurveTo(0,h*.13,right,0);ctx.lineTo(right,h*.2);ctx.quadraticCurveTo(0,h*.34,left,h*.17);ctx.fill();
 ctx.fillStyle='#c56d65';ctx.beginPath();ctx.ellipse(0,h*.91,width*.3,h*.26,0,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.lineCap='round';ctx.lineWidth=w*.045;ctx.strokeStyle='#be6d59';ctx.beginPath();ctx.moveTo(left,0);ctx.bezierCurveTo(-width*.3,h*1.06,width*.34,h*1.06,right,0);ctx.stroke();
 ctx.strokeStyle='#f2b59a';ctx.lineWidth=w*.025;ctx.beginPath();ctx.moveTo(-width*.2,h*.82);ctx.quadraticCurveTo(0,h*.98,width*.24,h*.8);ctx.stroke();ctx.restore();
}
window.speechMouth={ready,level,paint,landmarks:mouths};
})();
