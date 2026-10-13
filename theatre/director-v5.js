(() => {
 const $=id=>document.getElementById(id), layouts=window.STATIC_LAYOUTS;let page=0,selection=0;
 const box=(el,s)=>Object.assign(el.style,{left:s.x*100+'%',top:s.y*100+'%',width:s.w*100+'%',height:s.h*100+'%'});
 function configure(scene,i){page=i;selection=0;const l=layouts[i];document.body.dataset.page=i;document.body.dataset.theme=l.green?'olive':'cream';$('designPlate').src=`assets/design-v5/${i===0?'cover-approved':'plate-'+i}.webp`;$('materials').replaceChildren();$('labels').replaceChildren();$('title').textContent=l.title;$('english').textContent=l.en||'';
  l.slots.forEach((s,k)=>{const b=document.createElement('button');b.className='artwork'+(s.diagram?' diagram':'');box(b,s);b.style.transform=`rotate(${s.rotate||0}deg)`;if(s.clip)b.style.clipPath=s.clip;b.dataset.index=k;b.setAttribute('aria-label','放大原图：'+ART_LABELS[s.n]);const img=new Image();img.src=`assets/work-${s.n}.webp`;img.alt=ART_LABELS[s.n];img.decoding='async';b.append(img);b.onclick=()=>window.openArtwork(s.n);$('materials').append(b)});
  for(const [text,x,y,w,h,type] of l.labels||[]){const p=document.createElement('p');p.textContent=text;p.className='plateLabel '+(type||'');box(p,{x,y,w,h});$('labels').append(p)}
  $('clayBook').hidden=!l.book;$('ending').hidden=!l.ending;$('coverMobile').hidden=i!==0;$('coverPlay').hidden=i!==0;$('coverWorks').hidden=i!==0;$('coverNavPlay').hidden=i!==0;$('poster').hidden=i!==0;$('clayPortrait').hidden=i!==9;
  reset();
 }
 function reset(){[...$('materials').children].forEach((x,i)=>x.classList.toggle('mobileSelected',i===selection))}
 window.stageDesign={images:i=>layouts[i].slots.map(s=>s.n)};
 window.director={configure,render:()=>{},prepare:async()=>{},selectImage:i=>{selection=i;reset()},clearSelection:()=>{},reset,getState:()=>({static:true,page,selection})};
})();
