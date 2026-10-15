(() => {
'use strict';
const $=id=>document.getElementById(id),scenery=$('sceneryV6'),old=director.configure,oldRender=director.render;
const career=document.createElement('section');career.id='careerV7';career.setAttribute('aria-label','工作经历');
for(const [date,name,en,desc] of [['2019—2022','上海派沃','PAIWO','商业空间与室内设计'],['2022—2025','AICO','INTERIOR DESIGN','商业与公共空间 · 方案设计'],['2025—2026','小满来也','INDEPENDENT STUDIO','独立工作室 · 空间设计']]){const el=document.createElement('div'),d=document.createElement('small'),n=document.createElement('strong'),e=document.createElement('span'),p=document.createElement('p');d.textContent=date;n.textContent=name;e.textContent=en;p.textContent=desc;el.append(d,n,e,p);career.append(el)}
const films=document.createElement('section');films.id='filmLinksV7';films.setAttribute('aria-label','视频编排与剪辑作品');
const title=document.createElement('p');title.textContent='视频编排与剪辑 · 完整原视频 ↗';films.append(title);
for(const [name,anchor] of [['《晨境里》','chenjingli'],['《漕河泾》','caohejing']]){const a=document.createElement('a');a.href='https://dingjie593-git.github.io/dingjie-film-portfolio/#'+anchor;a.target='_blank';a.rel='noopener';a.textContent=name+' ↗';a.addEventListener('click',()=>window.theatre.pause());films.append(a)}
scenery.append(career,films);
director.configure=(scene,index)=>{old(scene,index);career.hidden=index!==0;films.hidden=index!==8;if(index===0){$('designPlate').src='assets/design-v5/cover-typeset.webp';$('foregroundPlate').hidden=true;$('coverPlay').replaceChildren(document.createTextNode('跟我走一遍  ▶'));}if(index===9){$('ending').querySelector('h2').textContent='THANK YOU.'}};
director.render=info=>{oldRender(info);films.classList.toggle('speaking',document.body.dataset.page==='8'&&info.mode==='show'&&info.time>=34.74);};
})();
