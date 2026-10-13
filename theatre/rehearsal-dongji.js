(() => {
'use strict';const $=id=>document.getElementById(id),duration=66,story=STORY[1];
const beats=[
 [0,3,'进场，先观察落脚点。','从右侧走入，先看作品，再低头确认粘土块的位置。'],
 [3,5,'靠近粘土块，扶稳。','伸手够到上沿，稍微调整脚步；这是攀爬之前的准备。'],
 [5,9,'攀上粘土块。','身体向前贴近，双手先抓、脚随后抬起，最后站稳。当前用既有攀爬姿态占位。'],
 [9,13,'到边框上，踮脚点主图。','从粘土块转到画框下沿，走两步、抬手触碰主图，建立操作的因果。'],
 [13,16,'主图展开，她退让半步。','触碰后大图才展开；小人先后退，让开图片的展开方向。'],
 [16,24.58,'在框角带看树冠。','停在边缘指认树冠，给观众稳定的观看时间。坐框角暂用蹲姿占位。'],
 [24.58,27,'起身，把构件卡拉过来。','先靠近卡片、伸手，再拉到主图旁，卡片跟着手移动。'],
 [27,38.855,'检查弯折与两种布光。','先指认弯折，再看正背面布光；偶尔回头确认观众，避免持续挥手。'],
 [38.855,41,'从图卡后抽出多视图。','新卡从现有卡片后方出现，保留来源，接住下一段讲述。'],
 [41,50.33,'多视图，检查卷帘。','停住两张卡，沿顶视、底视和立面逐项带看；强调卷帘协调。'],
 [50.33,53,'把卡片归位，收回大图。','先收多视图，再收构件卡，最后将大图压回原画框；没有凭空消失。'],
 [53,61.5,'回到原位，交代参与范围。','在原画框旁完成项目说明，整理动作结束后，再看向观众。'],
 [61.5,66,'沿原路下去，挥手离场。','先找到落脚点，落地后站稳，再从右侧离场，给下一幕留出空间。']
];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>{t=clamp(t);return t*t*(3-2*t)},between=(t,a,b)=>ease((t-a)/(b-a));
let t=0,playing=false,last=0,raf=0,ready=false;const ctx=$('smallActor').getContext('2d');
const atlases=[{src:'assets/walking-cast-v1.png',rows:3,count:12},{src:'assets/climbing-cast-v1.png',rows:2,count:8}];

function principalBox(d,cw,ch){const seen=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch);let best={area:0,l:0,r:0,u:0,b:0};for(let n=0;n<cw*ch;n++){if(seen[n]||d[n*4+3]<=100)continue;let head=0,tail=1,area=0,l=cw,r=0,u=ch,b=0;queue[0]=n;seen[n]=1;while(head<tail){const v=queue[head++],x=v%cw,y=Math.floor(v/cw);area++;l=Math.min(l,x);r=Math.max(r,x);u=Math.min(u,y);b=Math.max(b,y);for(const z of [x?v-1:-1,x<cw-1?v+1:-1,y?v-cw:-1,y<ch-1?v+cw:-1])if(z>=0&&!seen[z]&&d[z*4+3]>100){seen[z]=1;queue[tail++]=z}}if(area>best.area)best={area,l,r,u,b}}return best}
const prepared=Promise.all(atlases.map(async a=>{a.img=new Image();a.img.src=a.src;await a.img.decode();const cw=a.img.naturalWidth/4,ch=a.img.naturalHeight/a.rows,c=document.createElement('canvas');c.width=cw;c.height=ch;const k=c.getContext('2d',{willReadFrequently:true});a.cw=cw;a.ch=ch;a.boxes=[];for(let i=0;i<a.count;i++){k.clearRect(0,0,cw,ch);k.drawImage(a.img,i%4*cw,Math.floor(i/4)*ch,cw,ch,0,0,cw,ch);const d=k.getImageData(0,0,cw,ch).data;const {l,r,u,b}=principalBox(d,cw,ch);let sum=0,sx=0;for(let y=b-25;y<=b;y++)for(let x=l;x<=r;x++)if(d[(y*cw+x)*4+3]>100){sum++;sx+=x}a.boxes.push({l,r,u,b,anchor:sum?sx/sum:(l+r)/2})}}));
function draw(frame,facing=1){const a=atlases[frame>=20?1:0],i=frame>=20?frame-20:frame,b=a.boxes[i],ref=atlases[0].boxes[6],scale=Math.min(244/(ref.b-ref.u),260/(b.b-b.u),224/(b.r-b.l));ctx.clearRect(0,0,240,280);ctx.save();ctx.translate(120,274);ctx.scale(facing,1);ctx.drawImage(a.img,i%4*a.cw+b.l,Math.floor(i/4)*a.ch+b.u,b.r-b.l+1,b.b-b.u+1,(b.l-b.anchor)*scale,(b.u-b.b)*scale,(b.r-b.l+1)*scale,(b.b-b.u+1)*scale);ctx.restore()}
function route(time){let x=1270,y=755,frame=6,facing=-1,air=false;
 if(time<3){x=lerp(1490,1270,between(time,0,3));frame=Math.floor(time*7)%6}
 else if(time<5){frame=time<4?11:23;x=1270}
 else if(time<9){const q=between(time,5,9);x=lerp(1270,1178,q);y=lerp(755,666,q);frame=q<.2?23:q<.45?24:q<.75?25:27;facing=-1}
 else if(time<11){const q=between(time,9,11);x=lerp(1178,984,q);y=lerp(666,730,q)-Math.sin(q*Math.PI)*36;frame=q<.15?20:q<.8?22:23;air=q>.15&&q<.8}
 else if(time<13){x=984;y=730;frame=8;facing=1}
 else if(time<16){const q=between(time,13,16);x=lerp(984,1135,q);y=lerp(730,676,q);frame=Math.floor(time*6)%6;facing=1}
 else if(time<24.58){x=1135;y=676;frame=time%6<1?10:23;facing=-1}
 else if(time<27){const q=between(time,24.58,27);x=lerp(1135,1230,q);y=lerp(676,737,q);frame=9;facing=-1}
 else if(time<38.855){x=1230;y=737;frame=(time%7<1.5)?11:10;facing=-1}
 else if(time<41){x=1230;y=737;frame=9;facing=-1}
 else if(time<50.33){x=1230;y=737;frame=(time%8<2)?8:10;facing=-1}
 else if(time<53){const q=between(time,50.33,53);x=lerp(1230,1020,q);y=lerp(737,730,q);frame=9;facing=-1}
 else if(time<61.5){x=1020;y=730;frame=time%7<1?7:10;facing=1}
 else if(time<63.5){const q=between(time,61.5,63.5);x=lerp(1020,1210,q);y=lerp(730,755,q)-Math.sin(q*Math.PI)*22;frame=q<.2?20:q<.8?22:23;air=q>.2&&q<.8;facing=1}
 else{x=lerp(1210,1480,between(time,63.5,66));y=755;frame=time<64?27:Math.floor(time*7)%6;facing=1}
 return {x,y,frame,facing,air};}
const source={x:38,y:203,w:990,h:527},expanded={x:230,y:151,w:960,h:580};
function prop(id,a,b,q,opacity=1,rotation=0){const el=$(id),base=id==='bigCard'?{w:960,h:580}:id==='detailCard'?{w:390,h:390}:{w:680,h:380};const x=lerp(a.x,b.x,q),y=lerp(a.y,b.y,q),w=lerp(a.w,b.w,q),h=lerp(a.h,b.h,q);el.style.transform=`translate(${x}px,${y}px) rotate(${rotation}deg) scale(${w/base.w},${h/base.h})`;el.style.opacity=opacity}
function voicePosition(time){const segments=[[13,0,11.58],[27,11.58,11.855],[41,23.435,9.33],[53,32.765,11.73]];let a=0,active=false;for(const [start,from,len] of segments){if(time>=start){a=from+Math.min(time-start,len);if(time<start+len)active=true}}return {a,active}}
function render(){if(!ready)return;const p=route(t);draw(p.frame,p.facing);const breath=(!playing||p.frame<6||p.air)?0:Math.sin(t*2.4)*.8;$('smallActor').style.transform=`translate(${p.x-167.143}px,${p.y-390+390*6/280+breath}px)`;$('footShadow').style.transform=`translate(${p.x-41}px,${p.y-3}px) scale(${p.air?.4:1})`;$('footShadow').style.opacity=p.air?.3:.6;
 let q=t<13?0:t<16?between(t,13,16):t<51.5?1:1-between(t,51.5,53);const compare=between(t,24.58,27),third=between(t,38.855,41),exp={x:lerp(lerp(230,100,compare),135,third),y:lerp(lerp(151,180,compare),145,third),w:lerp(lerp(960,790,compare),740,third),h:lerp(lerp(580,480,compare),450,third)};prop('bigCard',source,exp,q,t<13?0:1);$('bigCard').style.opacity=t>=53?0:t>=13?1:0;$('shade').style.opacity=.12*q;
 const detailSource={x:1010,y:256,w:390,h:390},detailTarget={x:lerp(890,960,between(t,38.855,41)),y:lerp(280,260,between(t,38.855,41)),w:lerp(380,345,between(t,38.855,41)),h:390};let dq=t<24.58?0:t<27?between(t,24.58,27):t<51?1:1-between(t,51,52);prop('detailCard',detailSource,detailTarget,dq,t>=24.58&&t<52?1:0,lerp(5,-3,dq));
 const viewSource={x:930,y:430,w:150,h:84},viewTarget={x:200,y:490,w:710,h:278};let vq=t<38.855?0:t<41?between(t,38.855,41):t<50.33?1:1-between(t,50.33,51.3);prop('viewsCard',viewSource,viewTarget,vq,t>=38.855&&t<51.3?clamp(vq*4):0,-2*vq);
 const tap=clamp(1-Math.abs(t-12.7)/.45);$('contactDot').style.opacity=tap;$('contactDot').style.left='907px';$('contactDot').style.top='427px';$('contactDot').style.scale=String(1+(1-tap)*1.5);
 let phase=beats.findIndex(b=>t>=b[0]&&t<b[1]);if(phase<0)phase=beats.length-1;$('phaseTitle').textContent=beats[phase][2];$('phaseDescription').textContent=beats[phase][3];[...$('beats').querySelectorAll('button')].forEach((b,i)=>{b.classList.toggle('active',i===phase);b.setAttribute('aria-current',String(i===phase))});$('stageDirection').textContent=beats[phase][2];const vp=voicePosition(t),line=story.subtitles.find(s=>vp.a>=s.start&&vp.a<s.end);$('subtitle').textContent=vp.active?(line?.cn||story.beats.find(b=>vp.a>=b.start&&vp.a<b.end)?.cn||''):'';
 const original=$('set').contentDocument?.querySelectorAll('#materials button');if(original?.length){original[0].style.opacity=String(1-q);original[1].style.opacity=String(1-dq)}const audio=$('voice');if(audio.readyState>=1&&Math.abs(audio.currentTime-vp.a)>.3)audio.currentTime=vp.a;if(playing&&$('sound').checked&&vp.active){if(audio.paused)audio.play().catch(()=>{$('sound').checked=false})}else audio.pause();
 $('seek').value=String(t);$('clock').textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')} / 01:06`;$('play').textContent=playing?'Ⅱ 暂停排演':t>=duration?'↺ 再看一遍':'▶ 播放排演';
}
function tick(now){if(playing){t=Math.min(duration,t+(now-last)/1000);last=now;render();if(t>=duration){playing=false;render();return}raf=requestAnimationFrame(tick)}}
function pause(){playing=false;cancelAnimationFrame(raf);render()}function play(){if(!ready)return;if(t>=duration)t=0;playing=true;last=performance.now();render();raf=requestAnimationFrame(tick)}
$('play').onclick=()=>playing?pause():play();$('restart').onclick=()=>{pause();t=0;render()};$('seek').oninput=()=>{const n=Number($('seek').value);pause();t=n;render()};$('sound').onchange=render;
beats.forEach((b,i)=>{const li=document.createElement('li'),button=document.createElement('button'),small=document.createElement('small');small.textContent=`${String(i+1).padStart(2,'0')} · ${b[0].toFixed(1)}—${b[1].toFixed(1)}s`;button.append(small,document.createTextNode(b[2]));button.onclick=()=>{pause();t=b[0]+.01;render();$('preview').scrollIntoView({behavior:'smooth',block:'center'})};li.append(button);$('beats').append(li)});
function resize(){const r=$('preview').getBoundingClientRect(),scale=Math.min(r.width/1440,r.height/900);$('surface').style.transform=(document.fullscreenElement?'translate(-50%,-50%) ':'')+`scale(${scale})`}
new ResizeObserver(resize).observe($('preview'));$('fullscreen').onclick=async()=>{if(document.fullscreenElement)await document.exitFullscreen();else await $('preview').requestFullscreen()};
function prepareSet(){const doc=$('set').contentDocument;if(!doc?.head)return;const style=doc.createElement('style');style.textContent='#captionBar,#ground{visibility:hidden}header{opacity:.45}#evidence{display:none}.artwork img{mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent),linear-gradient(transparent,#000 5%,#000 95%,transparent);mask-composite:intersect}';doc.head.append(style);$('set').contentWindow.theatre?.pause()}
$('set').onload=prepareSet;if($('set').contentDocument?.readyState==='complete')prepareSet();
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|BUTTON/.test(e.target.tagName)){e.preventDefault();playing?pause():play()}});$('preview').onclick=()=>{if(document.fullscreenElement)playing?pause():play()};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
prepared.then(()=>{ready=true;$('play').disabled=false;render()}).catch(()=>{$('play').textContent='角色素材未载入，请刷新'});
window.rehearsal={seek:n=>{pause();t=clamp(n,0,duration);render()},state:()=>({time:t,playing,ready,pose:route(t),voice:voicePosition(t)}),play,pause};
})();
