(() => {
 'use strict';
 const prompt=document.getElementById('rotatePrompt'),portrait=matchMedia('(max-width:1024px) and (orientation:portrait)');
 const viewport=document.getElementById('presentationViewport'),subtitles=document.getElementById('subtitles'),plate=document.getElementById('designPlate');
 const backdrop=document.createElement('canvas');backdrop.id='stageBackdrop';backdrop.setAttribute('aria-hidden','true');document.body.prepend(backdrop);
 function paintBackdrop(){
  if(!plate.complete||!plate.naturalWidth)return;
  const width=document.documentElement.clientWidth,height=innerHeight,scale=Number(getComputedStyle(document.documentElement).getPropertyValue('--stage-scale'))||1;
  const w=1672*scale,h=941*scale,x=(width-w)/2,y=(height-viewport.offsetHeight*scale)/2;
  backdrop.width=width;backdrop.height=height;
  const ctx=backdrop.getContext('2d'),sw=plate.naturalWidth,sh=plate.naturalHeight;
  // Extend only the plain clay/paper texture, so decorative frames are never duplicated.
  const tile=document.createElement('canvas');tile.width=64;tile.height=64;
  tile.getContext('2d').drawImage(plate,0,0,32,32,0,0,64,64);
  ctx.fillStyle=ctx.createPattern(tile,'repeat');ctx.fillRect(0,0,width,height);
  ctx.drawImage(plate,0,0,sw,sh,x,y,w,h);
 }
 function syncBackdrop(){if(plate.complete)paintBackdrop()}
 plate.addEventListener('load',paintBackdrop);
 new MutationObserver(syncBackdrop).observe(plate,{attributes:true,attributeFilter:['src']});syncBackdrop();
 let wasPortrait=false,resume=false;
 function fit(){
  const width=document.documentElement.clientWidth,height=innerHeight;
  const captionHeight=subtitles.hidden?0:78;
  const scale=Math.min(width/1672,height/(941+captionHeight));
  document.documentElement.style.setProperty('--stage-scale',String(scale));
  viewport.style.height=`${941+captionHeight}px`;
  document.body.classList.toggle('hasStageCaptions',captionHeight>0);
  paintBackdrop();
  const blocked=portrait.matches;prompt.hidden=!blocked;
  viewport.inert=blocked;
  if(blocked&&!wasPortrait){resume=!!window.theatre?.state().playing;window.theatre?.pause()}
  if(!blocked&&wasPortrait&&resume){resume=false;window.theatre?.play()}
  wasPortrait=blocked;
 }
 window.stageViewport={portrait:()=>portrait.matches,fit};
 new MutationObserver(fit).observe(subtitles,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',fit);portrait.addEventListener('change',fit);fit();
})();
