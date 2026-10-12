(() => {
  'use strict';
  const stage=document.getElementById('contactStage'),picture=document.getElementById('picture'),actor=document.getElementById('actor');
  const canvas=document.getElementById('actorCanvas'),ctx=canvas.getContext('2d'),audio=document.getElementById('voice'),button=document.getElementById('play');
  const sheet=new Image(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let ready=false,last=-1,raf=0;
  const clamp=n=>Math.max(0,Math.min(1,n));
  const ease=n=>{n=clamp(n);return n*n*(3-2*n);};
  const mix=(a,b,p)=>a+(b-a)*p;
  // The image edge and gripping hands share this world-space anchor.
  const grips={5:{x:.328,y:.38},6:{x:.228,y:.395}};
  function render(){
    const t=audio.currentTime,w=stage.clientWidth,h=stage.clientHeight,mobile=w<=650;
    let zoom=t<4.5?0:t<6.5?ease((t-4.5)/2):t<12.5?1:t<14.5?1-ease((t-12.5)/2):0;
    if(reduced.matches)zoom=0;
    const left=mix(mobile?.05:.08,mobile?.025:.04,zoom)*w;
    const width=mix(mobile?.52:.54,mobile?.65:.72,zoom)*w;
    const height=mix(mobile?.24:.4,mobile?.3:.533333,zoom)*h;
    const contactY=(mobile?.54:.55)*h;
    const top=contactY-height*.55;
    picture.style.left=`${left}px`;picture.style.top=`${top}px`;picture.style.width=`${width}px`;picture.style.height=`${height}px`;
    let frame=t<.8?0:t<1.5?1:t<2?2:t<2.8?3:t<3.6?4:t<4.5?5:t<6.5?6:t<14.5?5:7;
    if(reduced.matches)frame=2;
    const actorH=(mobile?.38:.55)*h,actorW=actorH*(ready?canvas.width/canvas.height:1/3);
    const grip=grips[frame]||grips[5];
    const targetX=left+width-grip.x*actorW,targetY=contactY-grip.y*actorH;
    const floorY=contactY+(.95-.38)*actorH;
    document.querySelector('.floor').style.top=`${floorY}px`;
    let actorX,actorY;
    if(t<3.6){const approach=ease((t-1.8)/1.8);actorX=mix(mobile?w-actorW*1.04:w-actorW*1.05,targetX,approach);actorY=floorY-(frame<=3?.99:.95)*actorH;}
    else if(t<=14.5){actorX=targetX;actorY=targetY;}
    else {const settle=ease((t-14.5)/1.28);actorX=targetX+settle*(mobile?15:40);actorY=floorY-.96*actorH;}
    actor.style.left=`${actorX}px`;actor.style.top=`${actorY}px`;actor.style.width=`${actorW}px`;actor.style.height=`${actorH}px`;
    document.getElementById('actorShadow').style.bottom=frame<=3?'1%':'5%';
    const holding=t>=3.6&&t<14.5;
    stage.classList.toggle('holding',holding);stage.dataset.phase=t<1.8?'stand':t<3.6?'approach':t<4.5?'grasp':t<6.5?'pull':t<12.5?'explain':t<14.5?'return':'release';
    actor.dataset.frame=String(frame);
    if(ready&&frame!==last){last=frame;const cw=sheet.naturalWidth/4,ch=sheet.naturalHeight/2;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(sheet,frame%4*cw,Math.floor(frame/4)*ch,cw,ch,0,0,canvas.width,canvas.height);}
    const cue=CONTACT.cues.find(c=>t>=c.start&&t<c.end)||CONTACT.cues.filter(c=>c.start<=t).at(-1)||CONTACT.cues[0];
    document.getElementById('cn').textContent=cue.cn;document.getElementById('en').textContent=cue.en;
    document.getElementById('progress').style.width=`${clamp(t/CONTACT.duration)*100}%`;
    document.getElementById('seek').value=t;
  }
  function tick(){render();if(!audio.paused&&!audio.ended)raf=requestAnimationFrame(tick);}
  async function play(){if(!ready)return;if(audio.ended)audio.currentTime=0;try{await audio.play();document.getElementById('status').innerHTML='主中庭互动 <small>MAIN ATRIUM</small>';}catch{document.getElementById('status').innerHTML='点击播放互动 <small>CLICK PLAY</small>';}}
  audio.onplay=()=>{cancelAnimationFrame(raf);button.innerHTML='Ⅱ 暂停 <small>PAUSE</small>';tick();};audio.onpause=()=>{cancelAnimationFrame(raf);button.innerHTML='▶ 播放互动 <small>PLAY</small>';render();};audio.ontimeupdate=render;
  audio.onended=()=>{render();document.getElementById('status').innerHTML='图已放回 <small>PICTURE RETURNED</small>';};
  audio.onerror=()=>{document.getElementById('status').innerHTML='配音未能加载，请刷新 <small>PLEASE RELOAD</small>';};
  button.onclick=()=>audio.paused?play():audio.pause();document.getElementById('replay').onclick=()=>{audio.currentTime=0;render();play();};
  const seek=document.getElementById('seek');seek.max=CONTACT.duration;seek.oninput=()=>{audio.currentTime=Number(seek.value);render();};
  sheet.onload=()=>{canvas.width=sheet.naturalWidth/4;canvas.height=sheet.naturalHeight/2;ready=true;render();play();};sheet.src='assets/contact-poses.png';
  document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();});addEventListener('resize',render);reduced.addEventListener('change',render);render();
})();
