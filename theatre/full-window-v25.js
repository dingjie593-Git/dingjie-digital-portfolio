(() => {
'use strict';
const $=id=>document.getElementById(id),scenery=$('sceneryV6'),configure=director.configure;
const title=document.createElement('div');title.id='coverTitleV25';title.innerHTML='About<br>Ding Jie';
const footer=document.createElement('p');footer.id='coverFooterV25';footer.textContent='SPACES & INTERIORS';
scenery.append(title,footer);
const endingMask=()=>{
 const paths=CLAY_CONTOURS.paths[9]||[];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 941"><g fill="none" stroke="white" stroke-width="80" stroke-linejoin="round">${paths.map(d=>`<path d="${d}"/>`).join('')}</g></svg>`;
 return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
director.configure=(scene,index)=>{
 configure(scene,index);title.hidden=footer.hidden=index!==0;
 $('foregroundPlate').style.maskImage='';
 if(index===0){$('designPlate').src='assets/full-window-v25/cover-background.webp';$('foregroundPlate').hidden=true;}
 if(index===9){
  $('designPlate').src=$('foregroundPlate').src='assets/full-window-v25/ending-background.webp';
  $('foregroundPlate').style.maskImage=endingMask();$('foregroundPlate').style.maskSize='100% 100%';
 }
};
})();
