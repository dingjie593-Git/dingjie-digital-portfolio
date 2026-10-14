(() => {
'use strict';const $=id=>document.getElementById(id),duration=82,story=STORY[1];
const D=window.DONGJI_DIRECTION,beats=D.beats;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>{t=clamp(t);return t*t*(3-2*t)},between=(t,a,b)=>ease((t-a)/(b-a));
let t=0,playing=false,last=0,raf=0,ready=false;const ctx=$('smallActor').getContext('2d');
const atlases=[{src:'assets/walking-cast-v1.png',rows:3,count:12},{src:'assets/climbing-cast-v1.png',rows:2,count:8},{src:'assets/director-v1/acting-atlas.webp',rows:3,count:12}];

function principalBox(d,cw,ch){const seen=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch);let best={area:0,l:0,r:0,u:0,b:0};for(let n=0;n<cw*ch;n++){if(seen[n]||d[n*4+3]<=100)continue;let head=0,tail=1,area=0,l=cw,r=0,u=ch,b=0;queue[0]=n;seen[n]=1;while(head<tail){const v=queue[head++],x=v%cw,y=Math.floor(v/cw);area++;l=Math.min(l,x);r=Math.max(r,x);u=Math.min(u,y);b=Math.max(b,y);for(const z of [x?v-1:-1,x<cw-1?v+1:-1,y?v-cw:-1,y<ch-1?v+cw:-1])if(z>=0&&!seen[z]&&d[z*4+3]>100){seen[z]=1;queue[tail++]=z}}if(area>best.area)best={area,l,r,u,b}}return best}
const prepared=Promise.all(atlases.map(async a=>{a.img=new Image();a.img.src=a.src;await a.img.decode();const cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,c=document.createElement('canvas');c.width=cw;c.height=ch;const k=c.getContext('2d',{willReadFrequently:true});a.cw=cw;a.ch=ch;a.boxes=[];for(let i=0;i<a.count;i++){k.clearRect(0,0,cw,ch);k.drawImage(a.img,i%4*cw,Math.floor(i/4)*ch,cw,ch,0,0,cw,ch);const d=k.getImageData(0,0,cw,ch).data;const {l,r,u,b}=principalBox(d,cw,ch);let sum=0,sx=0;for(let y=b-25;y<=b;y++)for(let x=l;x<=r;x++)if(d[(y*cw+x)*4+3]>100){sum++;sx+=x}a.boxes.push({l,r,u,b,anchor:sum?sx/sum:(l+r)/2})}}));
const newFlip=[-1,-1,-1,-1,1,1,-1,-1,1,1,1,1];
function anatomy(p){const fresh=p.frame>=100,a=atlases[fresh?2:p.frame>=20?1:0],i=fresh?p.frame-100:p.frame>=20?p.frame-20:p.frame,b=a.boxes[i],ref=a.boxes[fresh?3:6]||a.boxes[0],scale=Math.min(244/(ref.b-ref.u),302/(b.b-b.u),296/(b.r-b.l)),facing=p.facing*(fresh?newFlip[i]:1),anchorY=p.perch?b.u+(b.b-b.u)*.70:b.b;return {a,i,b,scale,facing,anchorY}}
function hand(p){const z=anatomy(p),{b,scale,facing,anchorY}=z;const fresh=p.frame>=100,i=z.i;const hx=b.l+(b.r-b.l)*(fresh?([.9,.85,.85,.5,.03,.5,.5,.93,.08,.05,.5,.5][i]):p.frame===8?.03:.18),hy=b.u+(b.b-b.u)*(fresh?([.02,.36,.28,.5,.015,.35,.6,.34,.28,.28,.5,.15][i]):.30);return {x:(hx-b.anchor)*scale*1.4*facing,y:(hy-anchorY)*scale*1.4}}
function draw(p){const {a,i,b,scale,facing,anchorY}=anatomy(p);ctx.clearRect(0,0,320,480);ctx.save();ctx.translate(160,340);ctx.scale(facing,1);ctx.drawImage(a.img,i%4*a.cw+b.l,Math.floor(i/4)*a.ch+b.u,b.r-b.l+1,b.b-b.u+1,(b.l-b.anchor)*scale,(b.u-anchorY)*scale,(b.r-b.l+1)*scale,(b.b-b.u+1)*scale);ctx.restore()}
function prop(id,state,base){const z=state.box;$(id).style.transform=`translate(${z.x}px,${z.y}px) scale(${z.w/base.w},${z.h/base.h})`;$(id).style.opacity=state.opacity}
function route(time){return D.pose(time)}
function voicePosition(time){return D.voice(time)}
function render(){if(!ready)return;const cards=D.cards(t),p=D.pose(t);const h=hand(p);
 const uv={detail:[.05,.67],views:[.91,.05],main:[.91,.63]};
 function contact(c,who,hh){const [u,v]=uv[who];return {x:c.box.x+c.box.w*u-hh.x,y:755}}
 if(p.grip){const c=cards[p.grip],target=contact(c,p.grip,h);p.x=target.x;p.y=target.y;c.box.y=p.y+h.y-c.box.h*uv[p.grip][1]}
 // Approach and release share the same contact geometry, so a pose never resets its position.
 const links=[[23.2,24.6,24.6,'detail',108,'in'],[27.5,28.8,27.5,'detail',108,'out'],[38,39.355,39.355,'views',108,'in'],[42,43.3,42,'views',108,'out'],[50,51.33,51.33,'views',109,'in'],[56.5,57.8,56.5,'main',109,'out']];
 for(const [a,b,edge,who,frame,mode] of links)if(t>=a&&t<b){const ep=D.pose(edge),hp=hand({...ep,frame,facing:1}),c=D.cards(edge)[who],dest=contact(c,who,hp),u=between(t,a,b);p.x=mode==='in'?lerp(p.x,dest.x,u):lerp(dest.x,p.x,u);p.y=mode==='in'?lerp(p.y,755,u):lerp(755,p.y,u);p.frame=Math.floor(t*7)%6;p.facing=mode==='in'?-1:1}
 for(const [a,b,from,to] of [[52.4,53,'views','detail'],[54,54.8,'detail','main']])if(t>=a&&t<b){const hp=hand({frame:109,facing:1}),start=contact(D.cards(a)[from],from,hp),end=contact(D.cards(b)[to],to,hp);p.x=lerp(start.x,end.x,between(t,a,b));p.y=755;p.frame=Math.floor(t*7)%6;p.facing=end.x>start.x?1:-1}
 const reveal=between(t,70.5,71.5)*.208333+between(t,71.5,75.5)*.791667;
 if(t>=71.5&&t<75.5){p.frame=109;p.facing=1;const hh=hand(p);p.x=1440*(1-reveal)-hh.x;p.y=755;p.grip='story'}
 draw(p);$('smallActor').style.transform=`translate(${p.x-224}px,${p.y-476}px) rotate(${p.lean||0}deg)`;
 $('footShadow').style.transform=`translate(${p.x-41}px,${p.y-3}px) scale(${p.perch?.45:1})`;$('footShadow').style.opacity=p.perch?.25:.5;
 prop('bigCard',cards.main,{w:960,h:580});prop('detailCard',cards.detail,{w:390,h:390});prop('viewsCard',cards.views,{w:680,h:380});
 $('shade').style.opacity=.055*cards.main.q;
 const touch=hand(p);$('contactDot').style.left=(p.x+touch.x)+'px';$('contactDot').style.top=(p.y+touch.y)+'px';$('contactDot').style.opacity=cards.tap;
 let path='',opacity=0;if(t>29.2&&t<30.4){path='M916 380 Q950 345 1000 380';opacity=Math.sin((t-29.2)/1.2*Math.PI)}if(t>35&&t<36.2){path='M1084 398 L1084 526';opacity=Math.sin((t-35)/1.2*Math.PI)}if(t>44&&t<45.1){path='M335 594 Q400 556 457 594';opacity=Math.sin((t-44)/1.1*Math.PI)}$('attentionPath').setAttribute('d',path);$('attention').style.opacity=opacity;
 $('openingSet').style.transform=`translateX(${-1440*between(t,.6,2.8)}px)`;$('openingSet').style.opacity=t>=2.8?'0':'1';$('nextSet').style.transform=`translateX(${1440*(1-reveal)}px)`;$('set').style.transform=`translateX(${-1440*reveal}px)`;
 let phase=beats.findIndex(b=>t>=b[0]&&t<b[1]);if(phase<0)phase=beats.length-1;$('phaseTitle').textContent=beats[phase][2];$('phaseDescription').textContent=beats[phase][3];[...$('beats').querySelectorAll('button')].forEach((b,i)=>{b.classList.toggle('active',i===phase);b.setAttribute('aria-current',String(i===phase))});$('stageDirection').textContent=beats[phase][2];const vp=D.voice(t),line=story.subtitles.find(s=>vp.a>=s.start&&vp.a<s.end);$('subtitle').textContent=vp.active?(line?.cn||''):'';
 const original=$('set').contentDocument?.querySelectorAll('#materials button');if(original?.length){original[0].style.opacity=String(1-cards.main.q);original[1].style.opacity=String(1-cards.detail.q)}
 const audio=$('voice');if(audio.readyState>=1&&Math.abs(audio.currentTime-vp.a)>.3)audio.currentTime=vp.a;if(playing&&$('sound').checked&&vp.active){if(audio.paused)audio.play().catch(()=>{$('sound').checked=false})}else audio.pause();
 $('seek').value=String(t);$('clock').textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')} / 01:22`;$('play').textContent=playing?'Ⅱ 暂停排演':t>=duration?'↺ 再看一遍':'▶ 播放排演';
 window.directorState={time:t,pose:p,cards,reveal,phase,hand:touch};
}
function tick(now){if(playing){t=Math.min(duration,t+Math.max(0,now-last)/1000);last=now;render();if(t>=duration){playing=false;render();return}raf=requestAnimationFrame(tick)}}
function pause(){playing=false;cancelAnimationFrame(raf);render()}function play(){if(!ready)return;if(t>=duration)t=0;playing=true;last=performance.now();render();raf=requestAnimationFrame(tick)}
$('play').onclick=()=>playing?pause():play();$('restart').onclick=()=>{pause();t=0;render()};$('seek').oninput=()=>{const n=Number($('seek').value);pause();t=n;render()};$('sound').onchange=render;
beats.forEach((b,i)=>{const li=document.createElement('li'),button=document.createElement('button'),small=document.createElement('small');small.textContent=`${String(i+1).padStart(2,'0')} · ${b[0].toFixed(1)}—${b[1].toFixed(1)}s`;button.append(small,document.createTextNode(b[2]));button.onclick=()=>{pause();t=b[0]+.01;render();$('preview').scrollIntoView({behavior:'smooth',block:'center'})};li.append(button);$('beats').append(li)});
function resize(){const r=$('preview').getBoundingClientRect(),scale=Math.min(r.width/1440,r.height/900);$('surface').style.transform=(document.fullscreenElement?'translate(-50%,-50%) ':'')+`scale(${scale})`}
new ResizeObserver(resize).observe($('preview'));$('fullscreen').onclick=async()=>{if(document.fullscreenElement)await document.exitFullscreen();else await $('preview').requestFullscreen()};
function prepareSet(){const doc=$('set').contentDocument;if(!doc?.head)return;const style=doc.createElement('style');style.textContent='#captionBar,#ground{visibility:hidden}header{opacity:.45}#evidence{display:none}.artwork img{mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);mask-composite:intersect}';doc.head.append(style);$('set').contentWindow.theatre?.pause()}
$('nextSet').onload=()=>{const d=$('nextSet').contentDocument,st=d.createElement('style');st.textContent='#captionBar,#ground{visibility:hidden}header{opacity:.45}#evidence{display:none}';d.head.append(st)};
$('set').onload=prepareSet;if($('set').contentDocument?.readyState==='complete')prepareSet();
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON/.test(e.target.tagName)){e.preventDefault();playing?pause():play()}});$('preview').onclick=()=>{if(document.fullscreenElement)playing?pause():play()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
async function waitStage(id){const frame=$(id);for(let i=0;i<300;i++){const d=frame.contentDocument;if(d?.readyState==='complete'&&frame.contentWindow.theatre){await Promise.all(Array.from(d.images,img=>img.decode().catch(()=>{})));frame.contentWindow.theatre.pause();return}await new Promise(r=>setTimeout(r,100))}throw new Error('Stage not ready')}
Promise.all([prepared,waitStage('set'),waitStage('nextSet'),...Array.from(document.querySelectorAll('#surface > img,.prop img'),i=>i.decode())]).then(()=>{ready=true;$('play').disabled=false;render()}).catch(()=>{$('play').textContent='角色素材未载入，请刷新'});
window.rehearsal={seek:n=>{pause();t=clamp(n,0,duration);render()},state:()=>({time:t,playing,ready,pose:route(t),voice:voicePosition(t),direction:window.directorState}),play,pause};
})();

for(const [title,text,anchor] of window.CONTINUITY_PLAN){const li=document.createElement('li'),b=document.createElement('strong'),p=document.createElement('p'),sm=document.createElement('small');b.textContent=title;p.textContent=text;sm.textContent=anchor;li.append(b,p,sm);document.getElementById('handoffs').append(li)}
