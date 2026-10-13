(() => {
 const $=id=>document.getElementById(id);
 const identities=[['A PERSONAL INTRODUCTION','空间设计师 / 丁洁'],['FORM STUDY','柱身 → 顶面　连续转折'],['CONCEPT & SCHEME','故事线 → 主题 → 空间'],['WORKPLACE','7F · 8F · 9F · 10F'],['ARRIVAL','L形大堂 · 回应两侧入口'],['PLAN STUDY','33 → 48'],['EXHIBITION','沿途的空间与装置。'],['LEARNING & CULTURE','阅读 · 活动 · 相遇'],['DESIGN PROCESS','模型 / 光 / 表达'],['CONTACT','继续聊聊空间。']];
 let scene,page;
 function configure(s,i){scene=s;page=i;document.body.dataset.scene=String(i);$('folioMark').textContent=String(i).padStart(2,'0');$('sceneKicker').textContent=identities[i][0];$('sceneLead').textContent=identities[i][1];if(i===1||i===2||i===9){$('title').replaceChildren();for(const line of (i===1?['从柱身，','长成树冠。']:i===2?['让故事，','进入空间。']:['让设计，','回到空间。'])){const part=document.createElement('span');part.className='titlePart';part.textContent=line;$('title').append(part)}}}
 function layout(p,ids,beat,ratio){const w=$('world').offsetWidth,h=$('world').offsetHeight,out=new Map(),bottom=h*.96-48;const fit=(n,x,y,bw,bh)=>{const cap=27,iw=Math.min(bw,(bh-cap)*ratio(n)),ih=iw/ratio(n);out.set(n,{x:x+(bw-iw)/2,y:y+(bh-ih-cap)/2,w:iw,h:ih+cap})};
 $('materials').dataset.beat=String(beat);document.body.dataset.beat=String(beat);
 if(p===6)$('sceneLead').textContent=['两种市集氛围','二月 · 展览相关空间','中央茉莉装置 · 个人设计','场景与装置'][beat];
 if(p===3)$('sceneLead').textContent=['7F','8F / 9F','10F','9F / 10F'][beat];
 if(w<=800){
  if(p===9){ids.forEach((n,i)=>fit(n,w*.05+i*w*.31,h*.48,w*.28,h*.22));return out}
  const top=p===5?312:292,bh=Math.max(95,bottom-top-12);fit(ids[0],w*.05,top,w*.90,bh);return out;
 }
 const box=(n,x,y,bw,bh)=>fit(n,w*x,h*y,w*bw,Math.min(h*bh,bottom-h*y));
 if(p===1){if(ids.length===1)box(ids[0],.35,.17,.61,.73);else if(beat===1){box(ids[0],.35,.27,.39,.59);box(ids[1],.77,.47,.19,.36)}else{box(ids[0],.35,.27,.36,.59);box(ids[1],.74,.22,.22,.48)}}
 else if(p===2){if(ids.length===1)box(ids[0],beat===0?.31:.04,beat===0?.18:.33,beat===0?.65:.74,.57);else{box(ids[0],.04,.33,.54,.54);box(ids[1],.62,.24,.34,.50)}}
 else if(p===3){if(ids.length===1)box(ids[0],.25,.22,.71,.66);else{box(ids[0],.04,.36,.56,.49);box(ids[1],.64,.26,.32,.48)}}
 else if(p===4){if(ids.length===1)box(ids[0],.08,.32,.84,.56);else{box(ids[0],.04,.32,.70,.54);box(ids[1],.78,.31,.18,.49)}}
 else if(p===5){box(ids[0],.04,.35,.43,.48);box(ids[1],.53,.35,.43,.48)}
 else if(p===6){if(ids.length===1)box(ids[0],.04,.27,.61,.61);else{box(ids[0],.04,.28,.44,.56);box(ids[1],.52,.38,.43,.49)}}
 else if(p===7){if(ids.length===1)box(ids[0],.28,.32,.68,.52);else{box(ids[0],.04,.36,.55,.50);box(ids[1],.64,.28,.32,.46)}}
 else if(p===8){if(ids.length===1)box(ids[0],.27,.28,.69,.55);else{box(ids[0],.04,.39,.40,.47);box(ids[1],.49,.28,.47,.53)}}
 else if(p===9){ids.forEach((n,i)=>box(n,.04+i*.19,.58+(i===1?.035:0),.17,.23))}
 return out;
 }
 window.stageDesign={configure,layout};
})();
