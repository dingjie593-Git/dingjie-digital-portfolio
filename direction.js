(() => {
  const views=['space','unit','boundary','scope'];
  const copy={
    space:{title:'从柱身，<br><span class="marker">长成树冠。</span>',en:'From column to canopy.',note:'先看空间，再看它怎样被推敲。',noteEn:'See the space. Then see the thinking behind it.'},
    unit:{title:'整体留下，<br><span class="marker">把单元拿出来。</span>',en:'The whole, and the parts.',note:'单元弯曲、整体放射与灯光位置，一起看。',noteEn:'Read the slat, the canopy, and the lighting together.'},
    boundary:{title:'换个角度，<br><span class="marker">把关系看清。</span>',en:'A different view. A clearer relationship.',note:'顶视、底视与立面，对照同一套空间关系。',noteEn:'Plan, underside and elevations describe the same geometry.'},
    scope:{title:'从想法，<br><span class="marker">推到细处。</span>',en:'Spatial thinking. Careful making.',note:'图片与图纸均为方案阶段的表达与研究。',noteEn:'Images and drawings show scheme-stage studies.'}
  };
  let timer=0,index=0;const tour=document.getElementById('tour');
  function show(view){index=views.indexOf(view);document.body.dataset.view=view;document.getElementById('title').innerHTML=copy[view].title;document.getElementById('subtitle').textContent=copy[view].en;document.getElementById('chapterNote').innerHTML=`${copy[view].note}<span>${copy[view].noteEn}</span>`;document.querySelectorAll('[data-view]').forEach(b=>{if(b.tagName==='BUTTON'){b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));}});const boundary=view==='boundary';const source=boundary?'assets/dongji-multiview.png':'assets/dongji-unit.png';document.getElementById('technicalImage').src=source;document.getElementById('technicalImage').alt=boundary?'原作品集顶视、底视、正视与侧视研究':'原作品集格栅及灯光单元研究';document.getElementById('technicalButton').dataset.src=source;document.getElementById('technicalCaption').innerHTML=boundary?'多视图核对 <span>MULTI-VIEW STUDIES</span>':'单元与灯光研究 <span>UNIT & LIGHTING STUDIES</span>';}
  function stop(){clearInterval(timer);timer=0;tour.innerHTML='▶ 自动看版式 <small>PREVIEW</small>';}
  document.querySelectorAll('button[data-view]').forEach(b=>b.onclick=()=>{stop();show(b.dataset.view);});
  tour.onclick=()=>{if(timer){stop();return;}if(index===3)show('space');tour.innerHTML='Ⅱ 暂停浏览 <small>PAUSE</small>';timer=setInterval(()=>{if(index>=3){stop();return;}show(views[index+1]);},7000);};
  const sprite=new Image(),canvas=document.getElementById('castStanding'),ctx=canvas.getContext('2d');sprite.onload=()=>{const w=sprite.naturalWidth/4,h=sprite.naturalHeight/2;canvas.width=w;canvas.height=h;ctx.drawImage(sprite,3*w,h,w,h,0,0,w,h);};sprite.src='assets/contact-poses.png';
  const dialog=document.getElementById('lightbox');document.querySelectorAll('.image-button').forEach(b=>b.onclick=()=>{stop();document.getElementById('largeImage').src=b.dataset.src;dialog.showModal();});document.getElementById('close').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};
  addEventListener('keydown',e=>{if(dialog.open)return;if(e.key==='ArrowRight'){stop();show(views[Math.min(3,index+1)]);}if(e.key==='ArrowLeft'){stop();show(views[Math.max(0,index-1)]);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});show('space');
})();
