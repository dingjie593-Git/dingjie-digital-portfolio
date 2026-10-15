(() => {
'use strict';
// Speaking variants were edited directly from each original atlas, then registered to it.
const mouths={
 0:[[238,109,33,-21],[550,100,31,10],[952,107,33,-16],[1275,108,18,27],[251,613,34,-28],[557,612,27,10],[951,615,29,-23],[1310,608,32,-30]],
 2:[[150,110,28,-16],[373,113,26,10],[633,113,26,11],[893,111,26,19],[131,619,25,20],[386,619,26,19],[646,625,26,18],[906,633,26,20],[126,1120,25,19],[382,1123,26,17],[636,1124,26,19],[908,1120,27,-21]],
 3:[[264,111,28,-7],[626,115,28,-11],[994,115,26,-2],[1382,117,24,2]],
 5:[[501,318,80,-23]],
 6:[[244,116,32,-18],[539,112,18,-4],[963,114,15,-18],null,null,null,[948,604,28,16],[1317,609,32,-21]],
 7:[[251,613,36,-27]],
 8:[[269,608,25,-3],[630,612,23,-1],[1002,611,23,1],[1389,611,24,1]]
};

let data=null,registration=null;
const patches=new Map();
const ready=Promise.all([fetch('assets/speech-v23/envelopes.json').then(r=>r.json()).then(d=>data=d),fetch('assets/speech-v24/registration.json').then(r=>r.json()).then(d=>registration=d)]);
function level(scene,time,playing){
 if(!playing||!data)return 0;
 const row=data.scenes[scene];if(!row||time<0||time>=row.duration)return 0;
 const pos=time*data.fps,i=Math.floor(pos),f=pos-i,v=row.levels;
 const current=((v[i]||0)*(1-f)+(v[i+1]||0)*f)/255;
 const softened=current*.65+((v[i-1]||0)+(v[i+1]||0))/255*.175;
 return Math.max(0,Math.min(1,(softened-.075)/.925));
}
async function prepare(atlases){
 await ready;
 await Promise.all(Object.entries(registration).map(async([bank,entry])=>{
  const a=atlases[bank];if(!a)return;
  const variant=new Image();variant.src=entry.src;await variant.decode();
  const source=document.createElement('canvas'),target=document.createElement('canvas');source.width=target.width=a.image.naturalWidth;source.height=target.height=a.image.naturalHeight;
  const original=source.getContext('2d',{willReadFrequently:true}),edited=target.getContext('2d',{willReadFrequently:true});original.drawImage(a.image,0,0);edited.drawImage(variant,0,0,target.width,target.height);
  mouths[bank].forEach((m,i)=>{
   if(!m||!entry.poses[i]||entry.poses[i].correlation<.9)return;
   const [x,y,w]=m,{dx,dy}=entry.poses[i],width=Math.ceil(w*1.65),height=Math.ceil(w*.92),left=Math.round(x-width/2),top=Math.round(y-w*.35);
   const base=original.getImageData(left,top,width,height),result=edited.getImageData(left+dx,top+dy,width,height),rgb=result.data;
   const correction=[0,0,0];let count=0;
   for(let yy=0;yy<height;yy++)for(let xx=0;xx<width;xx++)if(xx<2||xx>=width-2||yy<2||yy>=height-2){const k=(yy*width+xx)*4;for(let c=0;c<3;c++)correction[c]+=base.data[k+c]-rgb[k+c];count++;}
   for(let yy=0;yy<height;yy++)for(let xx=0;xx<width;xx++){
    const k=(yy*width+xx)*4,r=Math.hypot((xx-width/2)/(width/2),(yy-height*.45)/(height*.52)),alpha=Math.max(0,Math.min(1,(1-r)/.28));
    for(let c=0;c<3;c++)rgb[k+c]=Math.max(0,Math.min(255,rgb[k+c]+correction[c]/count));
    rgb[k+3]=Math.round(base.data[k+3]*alpha);
   }
   const image=document.createElement('canvas');image.width=width;image.height=height;image.getContext('2d').putImageData(result,0,0);
   patches.set(bank+':'+i,{image,left,top});
  });
 }));
}
function paint(ctx,shape,p,amount){
 const {bank,a,i,b,scale,face,anchor,cx}=shape,patch=patches.get(bank+':'+i),m=mouths[bank]?.[i];
 if(!patch||!m||amount<.018||Math.abs(p.turnScale??1)<.5)return;
 const [rx,ry]=a.regions[i],v=(m[1]-ry-b.u)/(b.b-b.u+1);
 const offset=((p.lean||0)*(1-v)**2+(p.lag||0)*(1-v)**4)*face;
 ctx.save();ctx.globalAlpha*=Math.min(1,amount*1.15);
 ctx.drawImage(patch.image,(patch.left-rx-cx)*scale+offset,(patch.top-ry-anchor)*scale,patch.image.width*scale,patch.image.height*scale);ctx.restore();
}
window.speechMouth={ready,prepare,level,paint,landmarks:mouths};
})();
