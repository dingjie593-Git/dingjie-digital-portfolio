(() => {
 'use strict';
 const scenes=window.STORY,$=id=>document.getElementById(id),voice=$('voice'),world=$('world'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let page=0,beat=0,unlocked=false,playing=false,flow=false,raf=0,version=0,seeking=false,pendingTime=0,loading=false,toastTimer=0,galleryReturn=false,resumeAfterDialog=false,wheel=0,wheelStamp=0,flipStamp=0;
 const sum=a=>a.reduce((s,n)=>s+n,0),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),scene=()=>scenes[page];
 const total=()=>sum(scene().durations),position=()=>sum(scene().durations.slice(0,beat))+voice.currentTime;
 const stamp=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const labels=window.ART_LABELS;
 function tell(t){$('status').textContent=t;$('status').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('status').hidden=true,4200)}
 function figure(n,light=false){
  const f=document.createElement('figure');f.className='sheet';f.dataset.image=n;
  const b=document.createElement('button');b.className='image';b.setAttribute('aria-label','放大原图：'+labels[n]);const img=new Image();img.src=`assets/work-${n}.webp`;img.alt=labels[n];img.decoding='async';img.onerror=()=>tell('这张图未能载入，请刷新重试。');b.append(img);b.onclick=()=>openImage(n,light);f.append(b);
  const c=document.createElement('figcaption');c.textContent=labels[n];f.append(c);const tab=document.createElement('i');tab.className='tab';tab.textContent='↗';tab.setAttribute('aria-hidden','true');f.append(tab);
  if(scene().kind==='compare'&&!light){const number=document.createElement('b');number.className='number';number.textContent=n===59?'33':'48';const small=document.createElement('span');small.textContent=n===59?'ORIGINAL':'PROPOSED';number.append(small);f.append(number);}
  return f;
 }
 function materials(){
  const s=scene(),b=s.beats[beat];$('materials').replaceChildren();$('materials').dataset.beat=String(beat);
  b.images.forEach(n=>$('materials').append(figure(n)));
  if(s.kind==='compare'){
   const figs=[...$('materials').children];if(beat<=1)figs[1].classList.add('muted');if(beat>=2)figs[1].querySelector('.number').classList.add('marked');
  }
  $('note').textContent=b.note;$('caption').textContent=b.cn;$('translation').textContent=b.en;
  [...$('beatIndex').children].forEach((el,i)=>{el.classList.toggle('active',i===beat);el.setAttribute('aria-current',String(i===beat))});
 }
 function controls(){
  $('play').textContent=playing?'Ⅱ':'▶';$('play').setAttribute('aria-label',playing?'暂停讲解':'播放讲解');$('prev').disabled=page===0;$('next').disabled=page===scenes.length-1;
  $('chapterButton').textContent=`${String(page+1).padStart(2,'0')} / ${scenes.length}`;$('flow').textContent=flow?'连播':'逐幕';$('flow').setAttribute('aria-pressed',String(flow));
 }
 function render(){
  const s=scene();$('seek').max=String(total());$('seek').value=String(position());$('clock').textContent=`${stamp(position())} / ${stamp(total())}`;
  document.querySelectorAll('#materials .focus').forEach(el=>el.classList.remove('focus'));
  window.performer.render({page,beat,time:voice.currentTime,duration:s.durations[beat],kind:s.kind,action:s.beats[beat].action,unlocked,reduced:reduced.matches,seeking});
 }
 function tick(){render();if(playing)raf=requestAnimationFrame(tick)}
 function pause(){playing=false;voice.pause();cancelAnimationFrame(raf);controls();render()}
 async function play(){
  const v=version;try{await window.performer.prepare()}catch{tell('人物素材加载失败，请刷新重试。');return}if(v!==version)return;
  unlocked=true;$('welcome').hidden=true;$('subtitles').hidden=false;
  if(voice.ended&&beat===3){load(0,0,true);return}
  try{await voice.play();if(v!==version){voice.pause();return}playing=true;seeking=false;controls();cancelAnimationFrame(raf);tick()}catch(e){if(v!==version||e.name==='AbortError')return;pause();tell('点击播放开启声音；若仍无法播放，请刷新重试。')}
 }
 function load(n,time=0,auto=false){
  pause();beat=n;const v=++version;pendingTime=time;loading=true;seeking=time>0;voice.src=`assets/voice-${page}-${beat}.mp3?v=final-2`;voice.load();materials();window.performer.reset();controls();render();
  const start=()=>{if(v!==version)return;loading=false;const target=clamp(pendingTime,0,scene().durations[beat]-.01);if(target>0){voice.addEventListener('seeked',()=>{if(v!==version)return;render();if(auto)play()},{once:true});voice.currentTime=target;}else{voice.currentTime=0;render();if(auto)play()}};
  if(voice.readyState>=3)start();else voice.addEventListener('canplay',start,{once:true});
 }
 function go(n,auto=unlocked&&playing){
  if(n<0||n>=scenes.length)return;pause();page=n;const s=scene();document.body.dataset.theme=s.theme;document.body.dataset.kind=s.kind;
  $('title').textContent=s.title;$('english').textContent=s.en;$('chapter').textContent=s.chapter;$('project').textContent=s.project;$('question').textContent=s.question;
  $('ending').hidden=s.kind!=='ending';$('welcome').hidden=unlocked||page!==0;$('subtitles').hidden=!unlocked;
  history.replaceState(null,'','#scene-'+(page+1));load(0,0,auto);
  if(page<scenes.length-1){const img=new Image();const n=scenes[page+1].beats[0].images[0];if(n)img.src=`assets/work-${n}.webp`;}
 }
 function seek(t,resume=playing){
  let remaining=clamp(t,0,total()-.03),i=0;while(i<3&&remaining>=scene().durations[i]){remaining-=scene().durations[i];i++}
  if(i!==beat)load(i,remaining,resume);else{pendingTime=remaining;seeking=true;window.performer.reset();if(!loading&&voice.readyState>=3){voice.currentTime=remaining;render();seeking=false;if(resume&&!playing)play()}}
 }
 function openCatalog(){pause();$('catalog').showModal()}
 function openDetails(){pause();$('detailTitle').textContent=scene().project;$('detailScope').textContent=scene().scope;$('gallery').replaceChildren();scene().gallery.forEach(n=>$('gallery').append(figure(n,true)));
  if(scene().kind==='process'){const a=document.createElement('a');a.href='https://dingjie593-git.github.io/dingjie-film-portfolio/';a.textContent='打开《晨境里》与《漕河泾》影片 ↗';a.target='_blank';a.rel='noopener';$('gallery').append(a)}$('details').showModal();}
 function openImage(n,fromGallery){pause();galleryReturn=fromGallery;if(fromGallery)$('details').close();$('large').src=`assets/work-${n}.webp`;$('large').alt=labels[n];$('largeLabel').textContent=labels[n];$('backGallery').hidden=!fromGallery;$('lightbox').showModal()}
 for(const d of [$('catalog'),$('details'),$('lightbox')]){d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close()})}
 $('backGallery').onclick=()=>{$('lightbox').close();$('details').showModal()};
 voice.addEventListener('ended',()=>{playing=false;cancelAnimationFrame(raf);render();if(beat<3)load(beat+1,0,true);else if(flow&&page<scenes.length-1)go(page+1,true);else{controls();tell(page===9?'讲解结束。谢谢你跟着我走了一遍。':'本幕讲完了。继续下一幕，或展开图纸慢慢看。')}});
 voice.addEventListener('error',()=>{pause();tell('配音未能载入，请刷新重试。')});voice.addEventListener('timeupdate',render);
 $('start').onclick=()=>{flow=true;play()};$('browse').onclick=()=>{unlocked=true;$('welcome').hidden=true;$('subtitles').hidden=false;openCatalog()};
 $('play').onclick=()=>playing?pause():play();$('replay').onclick=()=>{unlocked=true;$('welcome').hidden=true;$('subtitles').hidden=false;load(0,0,true)};
 $('next').onclick=()=>go(page+1,unlocked);$('prev').onclick=()=>go(page-1,unlocked);$('home').onclick=()=>go(0,false);
 $('directory').onclick=$('chapterButton').onclick=openCatalog;$('evidence').onclick=openDetails;
 $('flow').onclick=()=>{flow=!flow;controls();tell(flow?'连播：本幕结束后自动进入下一幕。':'逐幕：本幕结束后停留，方便看图。')};
 $('seek').addEventListener('input',e=>seek(Number(e.target.value),playing));
 $('mute').onclick=()=>{voice.muted=!voice.muted;$('mute').textContent=voice.muted?'静':'声';$('mute').setAttribute('aria-pressed',String(voice.muted));$('mute').setAttribute('aria-label',voice.muted?'恢复声音':'关闭声音')};
 $('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{tell('浏览器暂不支持全屏，可横屏观看。')}};
 scenes.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button'),num=document.createElement('b'),text=document.createElement('span'),name=document.createElement('strong'),desc=document.createElement('small');num.textContent=String(i+1).padStart(2,'0');name.textContent=s.title;desc.textContent=s.project;text.append(name,desc);b.append(num,text);b.onclick=()=>{unlocked=true;$('catalog').close();go(i,true)};li.append(b);$('sceneList').append(li)});
 for(let i=0;i<4;i++){const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label','播放本幕第'+(i+1)+'段');b.onclick=()=>{unlocked=true;$('welcome').hidden=true;$('subtitles').hidden=false;load(i,0,true)};$('beatIndex').append(b)}
 const dialogOpen=()=>document.querySelector('dialog[open]');
 window.addEventListener('keydown',e=>{if(dialogOpen()||/INPUT|BUTTON|A/.test(e.target.tagName))return;if(['ArrowRight','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();go(page+1,unlocked)}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(page-1,unlocked)}else if(e.code==='Space'){e.preventDefault();playing?pause():play()}});
 window.addEventListener('wheel',e=>{if(dialogOpen()||e.ctrlKey)return;const now=performance.now();if(now-wheelStamp>250)wheel=0;wheel+=e.deltaY;wheelStamp=now;if(Math.abs(wheel)>160&&now-flipStamp>1100){flipStamp=now;go(page+(wheel>0?1:-1),unlocked);wheel=0}},{passive:true});
 let touchY=0;world.addEventListener('touchstart',e=>{touchY=e.touches[0].clientY},{passive:true});world.addEventListener('touchend',e=>{if(dialogOpen()||/BUTTON|A|INPUT/.test(e.target.tagName))return;const d=touchY-e.changedTouches[0].clientY;if(Math.abs(d)>80)go(page+(d>0?1:-1),unlocked)},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause()}});window.addEventListener('resize',()=>{seeking=true;window.performer.reset();render();seeking=false});window.addEventListener('castready',render);reduced.addEventListener('change',render);
 const requested=Number(location.hash.match(/scene-(\d+)/)?.[1]||1)-1;go(clamp(requested,0,scenes.length-1),false);
 window.theatre={go:(n)=>{unlocked=true;$('welcome').hidden=true;$('subtitles').hidden=false;go(n,false)},seek:t=>seek(t,false),pause,state:()=>({page,beat,playing,position:position(),duration:total(),performer:window.performer.getState()})};
})();
