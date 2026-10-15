(() => {
 'use strict';
 const prompt=document.getElementById('rotatePrompt'),portrait=matchMedia('(max-width:1024px) and (orientation:portrait)');
 const viewport=document.getElementById('presentationViewport'),subtitles=document.getElementById('subtitles'),plate=document.getElementById('designPlate'),captionBar=document.getElementById('captionBar');
 document.body.append(captionBar);
 const backdrop=document.createElement('canvas');backdrop.id='stageBackdrop';backdrop.setAttribute('aria-hidden','true');document.body.prepend(backdrop);
 function paintBackdrop(){
  if(!plate.complete||!plate.naturalWidth)return;
  const width=document.documentElement.clientWidth,height=innerHeight;
  backdrop.width=width;backdrop.height=height;
  const ctx=backdrop.getContext('2d');
  // Extend only the plain clay/paper texture, so decorative frames are never duplicated.
  const tile=document.createElement('canvas');tile.width=64;tile.height=64;
  tile.getContext('2d').drawImage(plate,0,0,32,32,0,0,64,64);
  ctx.fillStyle=ctx.createPattern(tile,'repeat');ctx.fillRect(0,0,width,height);
 }
 function syncBackdrop(){if(plate.complete)paintBackdrop()}
 plate.addEventListener('load',paintBackdrop);
 new MutationObserver(syncBackdrop).observe(plate,{attributes:true,attributeFilter:['src']});syncBackdrop();
 let wasPortrait=false,resume=false;
 let captionMeasureKey='';
 function measureCompactCaptions(width){
  if(!matchMedia('(orientation:landscape) and (max-height:500px)').matches)return;
  const key=width+':'+document.body.dataset.language;if(key===captionMeasureKey)return;
  // Reserve the longest actual line once per size/language, so the stage never jumps between sentences.
  const probe=captionBar.cloneNode(true);Object.assign(probe.style,{height:'auto',display:'flex',visibility:'hidden'});
  probe.querySelector('#subtitles').hidden=false;document.body.append(probe);
  const cn=probe.querySelector('#caption'),en=probe.querySelector('#translation');let height=0;
  for(const line of [...STORY.flatMap(s=>s.subtitles),...(window.INTRO_GUIDE?.steps||[])]){
   cn.textContent=line.cn;en.textContent=line.en;height=Math.max(height,probe.offsetHeight);
  }
  probe.remove();document.documentElement.style.setProperty('--compact-caption-height',height+'px');captionMeasureKey=key;
 }
 function fit(){
  const width=document.documentElement.clientWidth,height=innerHeight;
  document.body.classList.toggle('hasStageCaptions',!subtitles.hidden);
  measureCompactCaptions(width);
  const captionHeight=subtitles.hidden?0:captionBar.offsetHeight;
  const availableHeight=height-captionHeight;
  const scale=width/1672,sceneHeight=availableHeight/scale;
  document.documentElement.style.setProperty('--stage-scale',String(scale));
  document.documentElement.style.setProperty('--scene-height',sceneHeight+'px');
  document.documentElement.style.setProperty('--scene-aspect',String(sceneHeight/941));
  window.stageViewport.actorAspect=sceneHeight/941;
  viewport.style.height=sceneHeight+'px';viewport.style.top='0px';
  paintBackdrop();
  const blocked=portrait.matches;prompt.hidden=!blocked;
  viewport.inert=blocked;
  if(blocked&&!wasPortrait){resume=!!window.theatre?.state().playing;window.theatre?.pause()}
  if(!blocked&&wasPortrait&&resume){resume=false;window.theatre?.play()}
  wasPortrait=blocked;
  window.dispatchEvent(new Event('stagefit'));
 }
 window.stageViewport={portrait:()=>portrait.matches,fit};
 new MutationObserver(fit).observe(subtitles,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(fit).observe(document.body,{attributes:true,attributeFilter:['data-language']});
 // Subtitle wrapping changes in short landscape webviews; reserve only its actual height.
 new ResizeObserver(fit).observe(captionBar);
 window.addEventListener('resize',fit);portrait.addEventListener('change',fit);fit();
})();
