(() => {
  'use strict';
  const story = document.querySelector('.scroll-story');
  const stage = document.querySelector('.stage');
  const portrait = document.getElementById('portrait');
  const canvas = document.getElementById('character');
  const ctx = canvas.getContext('2d');
  const sheet = new Image();
  const entries = [...document.querySelectorAll('[data-entry]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let loaded = false, frame = -1, scheduled = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  function update() {
    scheduled = false;
    const p = clamp(-story.getBoundingClientRect().top / Math.max(1, story.offsetHeight - stage.offsetHeight));
    const index = p < .37 ? 0 : p < .7 ? 1 : 2;
    entries.forEach((entry, i) => {entry.classList.toggle('selected', i === index); entry.classList.toggle('visited', i < index);});
    const mobile = innerWidth <= 800;
    const x = mobile ? Math.sin(p * Math.PI * 2) * 12 : -35 + p * 85 + Math.sin(p * Math.PI * 2) * 38;
    stage.style.setProperty('--actor-x', `${x}px`);
    stage.style.setProperty('--actor-y', `${Math.sin(p * Math.PI) * -24}px`);
    stage.style.setProperty('--actor-scale', String(1 + Math.sin(p * Math.PI) * .055));
    stage.style.setProperty('--title-y', `${p * -38}px`);
    stage.style.setProperty('--sticker-y', `${p * -55}px`);
    stage.style.setProperty('--spark-angle', `${10 + p * 65}deg`);
    document.getElementById('progressFill').style.width = `${p * 100}%`;
    document.getElementById('scrollHint').hidden = p > .94;
    document.getElementById('reset').hidden = p <= .94;
    const nextFrame = reduced.matches ? 0 : p < .12 ? 0 : p < .28 ? 1 : p < .4 ? 2 : p < .65 ? 3 : p < .85 ? 4 : 5;
    portrait.dataset.pose = String(nextFrame);
    if (loaded && nextFrame !== frame) {
      frame = nextFrame;
      const w = sheet.naturalWidth / 3, h = sheet.naturalHeight / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sheet, frame % 3 * w, Math.floor(frame / 3) * h, w, h, 0, 0, canvas.width, canvas.height);
    }
  }
  function schedule() {if (!scheduled) {scheduled = true; requestAnimationFrame(update);}}
  sheet.onload = () => {canvas.width = sheet.naturalWidth / 3; canvas.height = sheet.naturalHeight / 2; loaded = true; portrait.classList.add('ready'); update();};
  sheet.src = 'assets/about-poses.png';
  addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule); reduced.addEventListener('change', schedule);
  document.getElementById('reset').onclick = () => scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});
  document.querySelectorAll('.sticker').forEach(sticker => {sticker.onclick = () => {sticker.classList.remove('bounce'); void sticker.offsetWidth; sticker.classList.add('bounce');}; sticker.addEventListener('animationend',()=>sticker.classList.remove('bounce'));});
  const audio = document.getElementById('introAudio'), voice = document.getElementById('voice');
  function setVoice(playing) {voice.setAttribute('aria-pressed',String(playing));voice.querySelector('span').innerHTML = playing ? '暂停介绍 <small>PAUSE</small>' : '听我介绍 <small>HEAR ME</small>';}
  voice.onclick = async () => {if (!audio.paused) {audio.pause();setVoice(false);} else {try {if(audio.ended)audio.currentTime=0;await audio.play();setVoice(true);} catch {voice.querySelector('span').textContent='点击重试 / TRY AGAIN';}}};
  audio.addEventListener('ended',()=>setVoice(false)); audio.addEventListener('error',()=>{setVoice(false);voice.querySelector('span').textContent='声音暂不可用 / AUDIO UNAVAILABLE';});
  update();
})();
