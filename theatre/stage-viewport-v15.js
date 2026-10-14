(() => {
 'use strict';
 const prompt=document.getElementById('rotatePrompt'),portrait=matchMedia('(max-width:1024px) and (orientation:portrait)');
 let wasPortrait=false,resume=false;
 function fit(){
  const width=document.documentElement.clientWidth,height=innerHeight;
  document.documentElement.style.setProperty('--stage-scale',String(Math.min(width/1672,height/1035)));
  const blocked=portrait.matches;prompt.hidden=!blocked;
  document.getElementById('presentationViewport').inert=blocked;
  if(blocked&&!wasPortrait){resume=!!window.theatre?.state().playing;window.theatre?.pause()}
  if(!blocked&&wasPortrait&&resume){resume=false;window.theatre?.play()}
  wasPortrait=blocked;
 }
 window.stageViewport={portrait:()=>portrait.matches,fit};
 window.addEventListener('resize',fit);portrait.addEventListener('change',fit);fit();
})();
