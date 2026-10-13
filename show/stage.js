(() => {
  'use strict';
  const pages=window.PORTFOLIO, $=id=>document.getElementById(id);
  const audio=$('voice'),stage=$('stage'),paper=$('paper'),art=$('artwork'),actor=$('actor');
  const sheet=new Image(),canvas=$('cast'),ctx=canvas.getContext('2d');
  const chapters=$('chapters'),lightbox=$('lightbox'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let pageIndex=0,clip=0,unlocked=false,playing=false,ready=false,lastFrame=-1,raf=0;
  let renderKey='',loadVersion=0,desiredTime=0,browseImage=null,continuous=false;
  let suspended=false,wheelTotal=0,wheelLast=0,noticeTimer=0;
  const sum=a=>a.reduce((x,y)=>x+y,0),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const current=()=>pages[pageIndex],total=()=>sum(current().durations);
  const position=()=>sum(current().durations.slice(0,clip))+audio.currentTime;
  const stamp=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
  function notify(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').hidden=true,5000);}
  function setButtons(){
    $('play').innerHTML=playing?'Ⅱ <span>PAUSE</span>':'▶ <span>PLAY</span>';
    $('navPlay').innerHTML=playing?'PAUSE<span>暂停</span>':'PLAY<span>听我讲</span>';
    $('play').setAttribute('aria-label',playing?'暂停讲解':'播放讲解');
    $('prev').disabled=pageIndex===0;$('next').disabled=pageIndex===pages.length-1;
    $('pageNumber').textContent=`${String(pageIndex+1).padStart(2,'0')} / ${pages.length}`;
  }
  function figure(i,options={}){
    const source=current().images[i];if(!source)return null;
    const f=document.createElement('figure');if(options.className)f.className=options.className;
    const b=document.createElement('button');b.className='image';b.setAttribute('aria-label','放大：'+source.label);
    const img=new Image();img.src=source.src;img.alt=source.label;img.decoding='async';
    img.onerror=()=>notify('有一张作品图未能加载，请刷新后重试。');b.append(img);b.onclick=()=>openImage(source);
    const c=document.createElement('figcaption');
    if(options.number){const n=document.createElement('b');n.textContent=options.number;c.append(n);const e=document.createElement('em');e.textContent=options.number===33?'ORIGINAL':'PROPOSED';c.append(e);}
    else c.textContent=source.label;
    f.append(b,c);return f;
  }
  function addFigure(index,options){const f=figure(index,options);if(f)art.append(f);return f;}
  function buildArtwork(){
    const p=current(),k=clip;art.replaceChildren();art.className='artwork';
    $('sourceNote').textContent=p.tag;$('actionLabel').textContent='';
    if(p.kind==='about'||p.kind==='end')return;
    if(p.kind==='compare'){
      art.classList.add('comparison');
      const a=addFigure(0,{number:33}),b=addFigure(1,{number:48});
      if(k<=1){b.classList.add('muted');if(k===1)a.classList.add('selected');}else {b.classList.add('selected');}
      if(k>=3)$('actionLabel').textContent='舞台、展览，让路径有停留。';
      if(k===2)b.classList.add('entering-plan');
      return;
    }
    if(p.kind==='study'){
      if(k<=1){art.classList.add('single');addFigure(k===1?1:0);}
      else if(k===2||k===3){art.classList.add('study');addFigure(k===2?2:3);addFigure(0,{className:'mini'});}
      else {art.classList.add('single');addFigure(0);if(k>=5){const n=document.createElement('div');n.className='scope-note';n.innerHTML='<strong>我的参与</strong><p>主中庭、影院实体墙、主入口、电梯厅及超市扶梯坡道。<br>方案设计、建模、出图和文本。</p>';art.append(n);}}
      return;
    }
    if(p.kind==='floors'){
      const index=browseImage??(k<2?null:k===2?0:k===3?2:3);
      if(index===null){art.classList.add('four');p.images.forEach((_,i)=>addFigure(i));}
      else {art.classList.add('single');addFigure(index);const nav=document.createElement('div');nav.className='floor-index';p.images.forEach((_,i)=>{const b=document.createElement('button');b.textContent=`${7+i}F`;b.className=i===index?'active':'';b.onclick=()=>{pause();browseImage=i;renderKey='';render();};nav.append(b);});art.append(nav);}
      return;
    }
    if(p.kind==='layers'){
      art.classList.add(k===2?'duo':'single');addFigure(k===0?0:1);if(k===2)addFigure(2);return;
    }
    if(p.kind==='film'){
      art.classList.add('duo');p.images.forEach((_,i)=>{const f=addFigure(i);const a=document.createElement('a');a.className='figure-link';a.textContent='打开影片 ↗';a.href='https://dingjie593-git.github.io/dingjie-film-portfolio/'+(i===0?'#chenjingli':'#caohejing');a.target='_blank';a.rel='noopener';a.onclick=()=>pause();f.append(a);});return;
    }
    let indexes=[];
    if(pageIndex===2)indexes=k<=1?[0]:k===2?[1]:k===3?[2,3]:[3,4];
    else if(pageIndex===4)indexes=k<=1?[0,1]:k===2?[2,3]:k===3?[3]:[3,4];
    else if(pageIndex===5)indexes=k===0?[0]:k===1?[0,1]:k===2?[2,3]:[2];
    else if(pageIndex===8)indexes=k<=1?[0,1]:k===2?[2]:[3];
    else if(pageIndex===9)indexes=k<=1?[0,1]:k===2?[2]:[3];
    else if(pageIndex===10)indexes=k<=1?[0]:k===2?[2]:[1];
    else indexes=[Math.min(k,p.images.length-1)];
    art.classList.add(indexes.length>1?'duo':'single');indexes.forEach(i=>addFigure(i));
  }
  function drawFrame(frame){
    if(!ready||lastFrame===frame)return;
    lastFrame=frame;const cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // The second row has a small trace of the upper row at its boundary.
    const inset=frame>=4?12:0;
    ctx.drawImage(sheet,frame%4*cw,Math.floor(frame/4)*ch+inset,cw,ch-inset,0,inset,canvas.width,canvas.height-inset);
    actor.dataset.frame=String(frame);
  }
  function render(){
    const p=current(),t=audio.currentTime,d=p.durations[clip]||1,progress=clamp(t/d,0,1);
    const key=`${pageIndex}:${clip}:${browseImage}`;
    if(key!==renderKey){renderKey=key;buildArtwork();}
    const sentences=p.paragraphs[clip].match(/[^。！？]+[。！？]?/g)||[p.paragraphs[clip]];
    const textLength=sentences.reduce((n,s)=>n+s.length,0),textPosition=progress*textLength;
    let sentenceIndex=0,passed=0;
    while(sentenceIndex<sentences.length-1&&passed+sentences[sentenceIndex].length<textPosition){passed+=sentences[sentenceIndex].length;sentenceIndex++;}
    const timedCues=p.cues?.[clip];
    const timedCaption=timedCues?.find(c=>t>=c.start&&t<c.end)?.text||timedCues?.[timedCues.length-1]?.text;
    $('caption').textContent=unlocked?(timedCaption||sentences[sentenceIndex]):'';
    $('seek').max=total();$('seek').value=position();$('clock').textContent=`${stamp(position())} / ${stamp(total())}`;
    let frame=0,shift=0,scale=1,turn=0,pull=0;
    if(unlocked){
      if(p.kind==='about')frame=clip===0?(progress<.2?0:7):clip===1?1:clip===2?5:7;
      else if(p.kind==='end')frame=clip>=p.paragraphs.length-1?7:6;
      else if(clip===0){frame=progress<.15?0:1;turn=-1;}
      else if(clip%3===1){frame=progress<.12?1:progress<.3?3:progress>.9?6:4;pull=Math.sin(Math.min(progress/.3,1)*Math.PI/2);shift=-pull*12;scale=1+pull*.025;}
      else if(clip%3===2){frame=progress<.13?1:5;turn=-1;shift=-7;}
      else {frame=progress<.15?6:progress<.4?4:7;turn=progress<.4?-1:1;}
      // Fuzhou is a rehearsed 25-second scene: gesture follows the comparison and the actual sentence pauses.
      if(p.kind==='compare'){
        if(clip===0){frame=t<.7?0:1;shift=0;turn=-1;pull=0;}
        else if(clip===1){frame=t<.5?1:4;shift=-8;turn=-1;pull=0;}
        else if(clip===2){frame=t<1.4?3:4;shift=-14;scale=1.025;turn=-1;pull=t<1.4?Math.min(t/1.4,1):0;}
        else {frame=t<5.9?5:4;shift=-5;turn=t<5.9?-1:0;pull=0;}
        const proposed=art.querySelector('figure:nth-child(2)');
        proposed?.classList.toggle('marked',clip>=3||(clip===2&&t>=5));
        paper.dataset.beat=clip===0?'overview':clip===1?'original':clip===2?'proposed':'nodes';
      }
      if(clip===p.paragraphs.length-1&&progress>.92){frame=7;pull=0;shift=0;turn=1;}
    }
    if(reduced.matches){frame=0;shift=0;scale=1;turn=0;pull=0;}
    const steppedShift=Math.round(shift/2)*2;
    actor.style.transform=`translateX(${steppedShift}px) rotate(${turn}deg) scale(${scale})`;
    if(p.kind!=='about'&&p.kind!=='end')paper.style.transform=`rotate(${-.6+pull*.6}deg) translateX(${-Math.round(pull*6)}px) scale(${1+pull*.015})`;
    $('scribble').style.transform=`rotate(${18+Math.round(progress*3)*4}deg)`;
    drawFrame(frame);
    if(p.kind==='about')$('resume').querySelectorAll('li').forEach((li,i)=>li.classList.toggle('selected',clip===1&&(i===Math.min(2,Math.floor(progress*3)))));
  }
  function tick(){render();if(playing)raf=requestAnimationFrame(tick);}
  function pause(){playing=false;audio.pause();cancelAnimationFrame(raf);setButtons();render();}
  async function play(){
    unlocked=true;$('welcome').hidden=true;browseImage=null;renderKey='';
    if(audio.ended&&clip===current().paragraphs.length-1){seekTo(0,false);}
    const version=loadVersion;
    try {await audio.play();if(version!==loadVersion)return;playing=true;setButtons();cancelAnimationFrame(raf);tick();}
    catch(error){if(version!==loadVersion||error.name==='AbortError')return;pause();notify('点击播放即可开始声音；如果仍无法播放，请刷新重试。');}
  }
  function loadClip(index,time=0,autoplay=false){
    const version=++loadVersion;audio.pause();cancelAnimationFrame(raf);clip=index;desiredTime=time;playing=false;
    audio.src=current().audio[clip];audio.load();renderKey='';setButtons();render();
    const start=()=>{if(version!==loadVersion)return;audio.currentTime=clamp(desiredTime,0,current().durations[clip]);render();if(autoplay)play();};
    if(audio.readyState>=1)start();else audio.addEventListener('loadedmetadata',start,{once:true});
  }
  function seekTo(seconds,resume=playing){
    let remaining=clamp(seconds,0,Math.max(0,total()-.02)),i=0;
    while(i<current().durations.length-1&&remaining>=current().durations[i]){remaining-=current().durations[i];i++;}
    if(i!==clip)loadClip(i,remaining,resume);else {audio.currentTime=remaining;render();if(resume&&!playing)play();}
  }
  function showPage(index,autoplay=unlocked&&playing){
    pause();pageIndex=clamp(index,0,pages.length-1);browseImage=null;const p=current();
    document.body.dataset.kind=p.kind;stage.dataset.page=String(pageIndex);
    $('chapterTag').textContent=p.tag;$('chapterTitle').textContent=p.short;$('subtitle').textContent=p.title;$('englishTitle').textContent=p.en;
    paper.hidden=['about','end'].includes(p.kind);$('resume').hidden=p.kind!=='about';$('outro').hidden=p.kind!=='end';
    $('welcome').hidden=unlocked||p.kind!=='about';$('actionLabel').textContent='';lastFrame=-1;
    history.replaceState(null,'','#page-'+(pageIndex+1));loadClip(0,0,autoplay);setButtons();
    current().images.slice(0,2).forEach(s=>{const img=new Image();img.src=s.src;});
  }
  function openImage(source){pause();$('largeImage').src=source.src;$('largeImage').alt=source.label;$('largeLabel').textContent=source.label;lightbox.showModal();}
  audio.addEventListener('ended',()=>{
    playing=false;
    if(clip<current().paragraphs.length-1)loadClip(clip+1,0,true);
    else {setButtons();render();if(continuous&&pageIndex<pages.length-1)showPage(pageIndex+1,true);else notify(pageIndex===pages.length-1?'讲解结束。谢谢大家。':'本页讲完了，可以继续下一页或展开原图。');}
  });
  audio.addEventListener('error',()=>{pause();notify('配音加载失败，请刷新后重试。');});
  audio.addEventListener('timeupdate',render);
  $('start').onclick=()=>{continuous=true;play();};$('browse').onclick=()=>{unlocked=true;$('welcome').hidden=true;pause();chapters.showModal();};
  $('play').onclick=()=>playing?pause():play();$('navPlay').onclick=()=>{continuous=true;playing?pause():play();};
  $('replay').onclick=()=>{unlocked=true;$('welcome').hidden=true;loadClip(0,0,true);};
  $('prev').onclick=()=>showPage(pageIndex-1,unlocked);$('next').onclick=()=>showPage(pageIndex+1,unlocked);
  $('home').onclick=$('about').onclick=()=>showPage(0,unlocked);
  $('works').onclick=()=>{pause();chapters.showModal();};
  $('seek').addEventListener('input',e=>seekTo(Number(e.target.value),playing));
  $('mute').onclick=()=>{audio.muted=!audio.muted;$('mute').textContent=audio.muted?'静':'声';$('mute').setAttribute('aria-pressed',String(audio.muted));$('mute').setAttribute('aria-label',audio.muted?'恢复声音':'关闭声音');};
  $('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('这个浏览器暂不支持全屏，请使用横屏观看。');}};
  for(const d of [chapters,lightbox]){d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close();});}
  pages.forEach((p,i)=>{const li=document.createElement('li'),b=document.createElement('button'),number=document.createElement('b'),text=document.createElement('span'),small=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');text.textContent=p.label;small.textContent=p.en;text.append(small);b.append(number,text);b.onclick=()=>{unlocked=true;chapters.close();showPage(i,true);};li.append(b);$('chapterList').append(li);});
  window.addEventListener('keydown',e=>{if(chapters.open||lightbox.open||/INPUT|BUTTON|A/.test(e.target.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();showPage(pageIndex+1,unlocked);}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();showPage(pageIndex-1,unlocked);}else if(e.code==='Space'){e.preventDefault();playing?pause():play();}});
  window.addEventListener('wheel',e=>{if(chapters.open||lightbox.open||e.ctrlKey)return;const now=performance.now();if(now-wheelLast>220)wheelTotal=0;wheelTotal+=e.deltaY;wheelLast=now;if(Math.abs(wheelTotal)>180&&now-(window.lastPageFlip||0)>1000){const step=wheelTotal>0?1:-1;wheelTotal=0;window.lastPageFlip=now;showPage(pageIndex+step,unlocked);}}, {passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){suspended=playing;pause();}else if(suspended){suspended=false;play();}});
  sheet.onload=()=>{ready=true;canvas.width=Math.round(sheet.naturalWidth/4);canvas.height=Math.round(sheet.naturalHeight/2);actor.classList.add('ready');lastFrame=-1;render();};sheet.onerror=()=>notify('角色动作图未能加载，目前显示静态形象。');sheet.src='assets/cast.png';
  reduced.addEventListener('change',()=>{lastFrame=-1;render();});window.addEventListener('resize',render);
  const requested=Number(location.hash.match(/page-(\d+)/)?.[1]||1)-1;showPage(requested,false);
  window.stageDebug={getState:()=>({page:pageIndex,clip,playing,time:position(),duration:total(),frame:actor.dataset.frame}),go:showPage,seek:seekTo,pause};
})();
