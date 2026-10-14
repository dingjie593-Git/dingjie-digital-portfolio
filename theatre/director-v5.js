(() => {
 const $=id=>document.getElementById(id), layouts=window.STATIC_LAYOUTS;let page=0,selection=0;
 const box=(el,s)=>Object.assign(el.style,{left:s.x*100+'%',top:s.y*100+'%',width:s.w*100+'%',height:s.h*100+'%'});
 function configure(scene,i){page=i;selection=0;const l=layouts[i];document.body.dataset.page=i;document.body.dataset.theme=l.green?'olive':'cream';$('designPlate').src=`assets/design-v5/${i===0?'cover-approved':i===1?'plate-1-clean-v12':'plate-'+i}.webp`;$('materials').replaceChildren();$('labels').replaceChildren();$('title').textContent=l.title;$('english').textContent=l.en||'';
  l.slots.forEach((s,k)=>{const b=document.createElement('button');b.className='artwork'+(s.diagram?' diagram':'');box(b,s);b.style.transform=`rotate(${s.rotate||0}deg)`;b.dataset.index=k;if(i===1&&k===1)b.style.zIndex='3';b.setAttribute('aria-label','放大原图：'+ART_LABELS[s.n]);const img=new Image();img.src=`assets/work-${s.n}.webp`;img.alt=ART_LABELS[s.n];img.decoding='async';b.append(img);b.onclick=()=>window.openArtwork(s.n);$('materials').append(b)});
  for(const [text,x,y,w,h,type,angle=0] of l.labels||[]){const p=document.createElement('p');p.textContent=text;p.className='plateLabel '+(type||'');box(p,{x,y,w,h});p.style.transform=`rotate(${angle}deg)`;$('labels').append(p)}
  const NS='http://www.w3.org/2000/svg',defs=$('contourDefs');defs.replaceChildren();
  const clip=(id,d,transform='scale(0.0005980861244 0.0010626992561)')=>{const c=document.createElementNS(NS,'clipPath');c.id=id;c.setAttribute('clipPathUnits','objectBoundingBox');const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('transform',transform);p.setAttribute('clip-rule','evenodd');c.append(p);defs.append(c)};
  const holes=CLAY_CONTOURS.paths[i]||[];clip('clayForeground','M0 0 H1672 V941 H0 Z '+holes.join(' '));clip('claySupport',CLAY_CONTOURS.support);
  l.slots.forEach((s,k)=>{if(!holes[k])return;const w=s.w*1672,h=s.h*941,cx=(s.x+s.w/2)*1672,cy=(s.y+s.h/2)*941,r=(s.rotate||0)*Math.PI/180,c=Math.cos(r),q=Math.sin(r),matrix=[c/w,-q/h,q/w,c/h,(-c*cx-q*cy+w/2)/w,(q*cx-c*cy+h/2)/h];clip('artAperture'+k,holes[k],`matrix(${matrix.join(' ')})`);$('materials').children[k].style.clipPath=`url(#artAperture${k})`});
  $('foregroundPlate').src=$('designPlate').src;$('foregroundPlate').hidden=!holes.length;$('supportPlate').src=$('designPlate').src;$('supportPlate').hidden=i!==1;
  $('clayBook').hidden=true;$('ending').hidden=!l.ending;$('coverMobile').hidden=i!==0;$('coverPlay').hidden=i!==0;$('coverWorks').hidden=i!==0;$('coverNavPlay').hidden=i!==0;$('poster').hidden=i!==0;$('clayPortrait').hidden=i!==9;
  reset();
 }
 function reset(){[...$('materials').children].forEach((x,i)=>x.classList.toggle('mobileSelected',i===selection))}
 window.stageDesign={images:i=>layouts[i].slots.map(s=>s.n)};
 window.director={configure,render:()=>{},prepare:async()=>{},selectImage:i=>{selection=i;reset()},clearSelection:()=>{},reset,getState:()=>({static:true,page,selection})};
})();
