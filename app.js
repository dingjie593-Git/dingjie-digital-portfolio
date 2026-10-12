(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const audio = $('#narration'), stage = $('#stage'), actor = $('#actor'), seek = $('#seek');
  const subtitles = [$('#subtitleCn'), $('#subtitleEn')];
  const sections = ['intro','about','project'];
  let currentCue = -1, raf = 0, playing = false, browsing = false;
  const projectScenes = ['original','revised','compare','nodes','end'];
  const fmt = n => `${Math.floor(n/60).toString().padStart(2,'0')}:${Math.floor(n%60).toString().padStart(2,'0')}`;
  seek.max = DEMO.duration;
  function showScene(scene, node) {
    const section = projectScenes.includes(scene) ? 'project' : scene;
    stage.dataset.scene = scene;
    document.body.classList.toggle('project-mode', section === 'project');
    sections.forEach(id => { const el = $('#'+id); el.hidden = id !== section; el.classList.toggle('active',id === section); });
    document.querySelectorAll('[data-chapter]').forEach(b => b.classList.toggle('nav-current',b.dataset.chapter === (section === 'project' ? 'original' : section)));
    document.querySelectorAll('[data-node]').forEach(el => el.classList.toggle('current',Number(el.dataset.node) === node));
    $('#sceneNumber').textContent = section === 'intro' ? '01 / 03' : section === 'about' ? '02 / 03' : '03 / 03';
    $('#sceneLabel').textContent = section === 'intro' ? '认识一下 / SAY HELLO' : section === 'about' ? '我的经历 / MY JOURNEY' : '平面组织 / LAYOUT STUDY';
  }
  function sync(force = false) {
    const t = audio.currentTime;
    seek.value = t;
    $('#clock').textContent = `${fmt(t)} / ${fmt(DEMO.duration)}`;
    let index = DEMO.cues.findIndex(c => t >= c.start && t < c.end);
    if (index < 0) index = DEMO.cues.reduce((last,c,i) => c.start <= t ? i : last,0);
    if (!browsing && (index !== currentCue || force)) {
      currentCue = index;
      const cue = DEMO.cues[index];
      showScene(cue.scene,cue.node);
      subtitles[0].textContent = cue.cn;
      subtitles[1].textContent = cue.en;
    }
    // Time labels, not array indices, remain authoritative across segment pauses.
    let lo=0,hi=DEMO.mouth.length-1;
    while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(DEMO.mouth[mid][0]<=t)lo=mid;else hi=mid-1;}
    actor.classList.toggle('speaking',playing && DEMO.mouth[lo][1] > .018 && t < DEMO.cues[index].end);
  }
  function frame(){sync();if(playing)raf=requestAnimationFrame(frame);}
  function setPlaying(value){playing=value;$('#playPause').innerHTML=value?'Ⅱ <span>暂停 / PAUSE</span>':'▶ <span>播放 / PLAY</span>';$('#playPause').setAttribute('aria-label',value?'暂停 / Pause':'播放 / Play');if(value){cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}else{cancelAnimationFrame(raf);actor.classList.remove('speaking');}}
  async function play(){browsing=false;if(audio.ended || audio.currentTime>=DEMO.duration-.1)audio.currentTime=0;try{await audio.play();setPlaying(true);sync(true);}catch(e){setPlaying(false);subtitles[0].textContent='声音暂未启动，请再点一次播放。';subtitles[1].textContent='Audio could not start. Please press play again.';}}
  function pause(){audio.pause();setPlaying(false);sync();}
  async function replay(){pause();audio.currentTime=0;currentCue=-1;browsing=false;await play();}
  $('#start').addEventListener('click',play);
  $('#playPause').addEventListener('click',()=>playing?pause():play());
  $('#replay').addEventListener('click',replay);$('#endReplay').addEventListener('click',replay);
  seek.addEventListener('input',()=>{browsing=false;audio.currentTime=Number(seek.value);sync(true);});
  audio.addEventListener('timeupdate',()=>{if(!playing)sync();});
  audio.addEventListener('ended',()=>{setPlaying(false);showScene('end');subtitles[0].textContent='样段结束。可以重播，或自由查看项目图。';subtitles[1].textContent='End of sample. Replay or explore the drawings.';});
  audio.addEventListener('error',()=>{setPlaying(false);subtitles[0].textContent='配音文件未能加载，仍可查看项目图。';subtitles[1].textContent='Audio could not load. The project drawings remain available.';});
  document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>{pause();browsing=false;const cue=DEMO.cues.find(c=>c.scene===b.dataset.chapter);audio.currentTime=cue.start;sync(true);}));
  $('.identity').addEventListener('click',e=>{e.preventDefault();pause();audio.currentTime=0;currentCue=-1;sync(true);});
  $('#mute').addEventListener('click',()=>{audio.muted=!audio.muted;$('#mute').setAttribute('aria-pressed',String(audio.muted));$('#mute').setAttribute('aria-label',audio.muted?'取消静音 / Unmute':'静音 / Mute');$('#mute').textContent=audio.muted?'♩':'♫';});
  $('#fullScreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}});
  const dialog=$('#imageDialog');
  document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{pause();$('#largeImage').src=b.dataset.image;dialog.showModal();}));
  $('#closeImage').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  document.addEventListener('keydown',e=>{if(e.code==='Space' && !['INPUT','BUTTON'].includes(document.activeElement.tagName) && !dialog.open){e.preventDefault();playing?pause():play();}});
  sync(true);
  window.demoState=()=>({time:audio.currentTime,paused:audio.paused,scene:stage.dataset.scene,cue:currentCue,duration:DEMO.duration,subtitle:subtitles[0].textContent});
})();
