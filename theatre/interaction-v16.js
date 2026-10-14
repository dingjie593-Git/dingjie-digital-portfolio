(() => {
 'use strict';
 const $=id=>document.getElementById(id),stage=$('stageCanvas'),oldRender=director.render,oldConfigure=director.configure;
 const guide=document.createElement('section');guide.id='introGuideV16';guide.hidden=true;guide.setAttribute('aria-label','观看方式');
 const index=document.createElement('small'),text=document.createElement('p'),picture=document.createElement('button'),img=new Image();
 picture.id='guidePictureV16';picture.hidden=true;picture.setAttribute('aria-label','示范：点击查看项目大图');img.src='assets/work-2.webp';img.alt='东基中海环宇城项目预览';picture.append(img);picture.onclick=()=>window.openArtwork(2);guide.append(index,text,picture);stage.append(guide);
 const ns='http://www.w3.org/2000/svg',pointer=document.createElementNS(ns,'svg'),line=document.createElementNS(ns,'path'),dot=document.createElementNS(ns,'circle');
 pointer.id='linksPointerV16';pointer.setAttribute('viewBox','0 0 1672 941');pointer.setAttribute('aria-hidden','true');dot.setAttribute('r','5');pointer.append(line,dot);pointer.style.display='none';stage.append(pointer);
 const clear=()=>{document.querySelectorAll('.guideTargetV16').forEach(el=>el.classList.remove('guideTargetV16'));$('filmLinksV7')?.classList.remove('pointed')};
 director.configure=(...args)=>{clear();guide.hidden=true;pointer.style.display='none';oldConfigure(...args)};
 director.render=info=>{
  oldRender(info);clear();const state=director.getState(),active=state.page===0&&info.unlocked&&info.mode==='show'&&info.time<INTRO_GUIDE.duration;
  guide.hidden=!active;
  if(active){const j=Math.max(0,INTRO_GUIDE.steps.findIndex(s=>info.time>=s.start&&info.time<s.end)),step=INTRO_GUIDE.steps[j];index.textContent='观看方式  '+String(j+1).padStart(2,'0')+' / 04';text.textContent=step.cn;picture.hidden=step.target!=='picture';
   const target=step.target==='directory'?$('directory'):step.target==='portfolio'?document.querySelector('header a'):step.target==='actor'?$('actorHitV16'):picture;target?.classList.add('guideTargetV16');
  }
  const pointing=state.page===8&&info.unlocked&&info.mode==='show'&&state.pose?.acting?.phase==='pointLinks';pointer.style.display=pointing?'':'none';
  if(pointing){const p=state.pose,h=performanceDirector.hand(p),r=$('filmLinksV7').getBoundingClientRect(),b=stage.getBoundingClientRect(),x=(r.x-b.x+r.width*.27)/b.width*1672,y=(r.y-b.y+r.height*.65)/b.height*941;
   line.setAttribute('d',`M${p.x+h.x} ${p.y+h.y} Q${(p.x+h.x+x)/2} ${y-26} ${x} ${y}`);dot.setAttribute('cx',x);dot.setAttribute('cy',y);$('filmLinksV7').classList.add('pointed');
  }
 };
})();
