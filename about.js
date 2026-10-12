(() => {
  'use strict';
  const stage = document.querySelector('.stage');
  const portrait = document.getElementById('portrait');
  portrait.setAttribute('aria-label','丁洁的卡通替身配合本页讲解播放动作');
  const canvas = document.getElementById('character'), ctx = canvas.getContext('2d');
  const audio = document.getElementById('introAudio'), voice = document.getElementById('voice');
  const hint = document.getElementById('scrollHint'), replay = document.getElementById('reset');
  const entries = [...document.querySelectorAll('[data-entry]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sheet = new Image();
  const duration = 24.58;
  let loaded = false, frame = -1, raf = 0, entered = false, inView = true, resumeOnReturn = false;
  function render() {
    const t = Math.min(duration, audio.currentTime), p = t / duration;
    const index = t < 10.369 ? 0 : t < 17.168 ? 1 : 2;
    entries.forEach((entry, i) => {entry.classList.toggle('selected', i === index);entry.classList.toggle('visited', i < index);});
    const mobile = innerWidth <= 800;
    stage.style.setProperty('--actor-x', `${mobile ? Math.sin(p * Math.PI * 2) * 12 : -35 + p * 85 + Math.sin(p * Math.PI * 2) * 38}px`);
    stage.style.setProperty('--actor-y', `${Math.sin(p * Math.PI) * -24}px`);
    stage.style.setProperty('--actor-scale', String(1 + Math.sin(p * Math.PI) * .055));
    stage.style.setProperty('--title-y', `${p * -38}px`);
    stage.style.setProperty('--sticker-y', `${p * -55}px`);
    stage.style.setProperty('--spark-angle', `${10 + p * 65}deg`);
    document.getElementById('progressFill').style.width = `${p * 100}%`;
    const next = reduced.matches ? 0 : t < 2.5 ? 0 : t < 5.576 ? 1 : t < 10.369 ? 2 : t < 17.168 ? 3 : t < 23 ? 4 : 5;
    portrait.dataset.pose = String(next);
    if (loaded && frame !== next) {
      frame = next;
      const w = sheet.naturalWidth / 3, h = sheet.naturalHeight / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sheet, frame % 3 * w, Math.floor(frame / 3) * h, w, h, 0, 0, canvas.width, canvas.height);
    }
  }
  function tick() {render();if (!audio.paused && !audio.ended) raf = requestAnimationFrame(tick);}
  function label(playing) {
    voice.setAttribute('aria-pressed',String(playing));
    voice.setAttribute('aria-label',playing?'暂停本页 / Pause page':'播放本页 / Play page');
    voice.querySelector('span').innerHTML = playing ? '暂停本页 <small>PAUSE</small>' : '播放本页 <small>PLAY PAGE</small>';
  }
  async function play() {
    if (!loaded) return;
    if (audio.ended) audio.currentTime = 0;
    try {await audio.play();hint.innerHTML='个人介绍 <small>ABOUT DING JIE · 01 / 01</small>';replay.hidden=false;}
    catch {label(false);hint.innerHTML='点击右上角，播放本页 <small>CLICK PLAY PAGE TO START</small>';}
  }
  audio.addEventListener('play',()=>{cancelAnimationFrame(raf);label(true);tick();});
  audio.addEventListener('pause',()=>{cancelAnimationFrame(raf);label(false);render();});
  audio.addEventListener('timeupdate',render);
  audio.addEventListener('ended',()=>{label(false);render();hint.innerHTML='本页演示结束 <small>END OF PAGE · 01 / 01</small>';replay.hidden=false;});
  audio.addEventListener('error',()=>{label(false);hint.innerHTML='声音暂不可用，请刷新重试 <small>AUDIO UNAVAILABLE · PLEASE RELOAD</small>';});
  voice.onclick=()=>audio.paused?play():audio.pause();
  replay.onclick=()=>{audio.currentTime=0;render();play();};
  sheet.onload=()=>{canvas.width=sheet.naturalWidth/3;canvas.height=sheet.naturalHeight/2;loaded=true;portrait.classList.add('ready');render();if(inView&&!entered){entered=true;play();}};
  sheet.src='assets/about-poses.png';
  // Page entry starts playback. Scrolling never scrubs the acting sequence.
  new IntersectionObserver(([entry])=>{
    inView=entry.isIntersecting;
    if (!inView) {resumeOnReturn=!audio.paused;audio.pause();}
    else if (loaded&&!entered) {entered=true;play();}
    else if (resumeOnReturn) {resumeOnReturn=false;play();}
  },{threshold:.55}).observe(stage);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeOnReturn=!audio.paused;audio.pause();}else if(inView&&resumeOnReturn){resumeOnReturn=false;play();}});
  addEventListener('resize',render);reduced.addEventListener('change',render);
  document.querySelectorAll('.sticker').forEach(sticker=>{sticker.onclick=()=>{sticker.classList.remove('bounce');void sticker.offsetWidth;sticker.classList.add('bounce');};sticker.addEventListener('animationend',()=>sticker.classList.remove('bounce'));});
  render();
})();
