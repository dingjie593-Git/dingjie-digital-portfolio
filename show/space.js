(() => {
  'use strict';
  const root=document.getElementById('walker'),canvas=document.getElementById('walkingCast'),ctx=canvas.getContext('2d');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t,ease=t=>t*t*(3-2*t);
  const atlases=[{image:new Image(),rows:3,count:12,reference:6,boxes:[]},{image:new Image(),rows:2,count:8,reference:7,boxes:[]}];
  let ready=false,actionsReady=false,lastState=null,previousPage=null,lastClock=null,route=null;
  let current={x:.45,y:.87},lastFrame=-1,lastFacing=1,transitionTimer=0;
  let support='ground',mode='stand',contact=false,contactDistance=null;
  let resolveReady,rejectReady;
  const assetsReady=new Promise((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});
  assetsReady.catch(()=>{});
  canvas.width=300;canvas.height=570;
  function floor(){return Math.min(innerHeight*(innerWidth<=800?.82:.87),innerHeight-95);}
  function ground(x){return {x,y:floor()/innerHeight};}
  function platforms(){return [...document.querySelectorAll('#resume li')].map((el,i)=>{const r=el.getBoundingClientRect();return {id:'career-'+i,x:(r.left-18)/innerWidth,y:(r.bottom-34)/innerHeight,left:r.left-56,right:r.left+64,element:el};});}
  function bodyHeight(){return root.offsetWidth*570/300;}
  function handDelta(){const a=atlases[0],b=a.boxes[9],scale=510/a.boxes[6].h,screen=root.offsetWidth/300;return {x:(215-b.anchorX)*scale*screen,y:(190-b.bottom)*scale*screen-8*screen};}
  function draw(frame,facing=1){
    if(!ready)return;if(frame>=20&&!actionsReady)frame=frame===23?11:6;
    if(frame===lastFrame&&facing===lastFacing)return;lastFrame=frame;lastFacing=facing;
    const a=atlases[frame>=20?1:0],i=frame>=20?frame-20:frame,cw=a.image.naturalWidth/4,ch=a.image.naturalHeight/a.rows,b=a.boxes[i];
    // Crouching lowers the body: one physical body scale per atlas.
    const scale=510/a.boxes[a.reference].h;
    ctx.clearRect(0,0,300,570);ctx.save();ctx.translate(150,562);
    if(i<6&&frame<20&&facing<0)ctx.scale(-1,1);
    const bw=b.right-b.left+1,bh=b.bottom-b.top+1;
    ctx.drawImage(a.image,i%4*cw+b.left,Math.floor(i/4)*ch+b.top,bw,bh,(b.left-b.anchorX)*scale,(b.top-b.bottom)*scale,bw*scale,bh*scale);ctx.restore();root.dataset.frame=String(frame);
  }
  function place(point){current=point;root.style.transform=`translate(${Math.round(point.x*innerWidth-root.offsetWidth/2)}px,${Math.round(point.y*innerHeight-bodyHeight())}px)`;}
  function jump(from,to,u,kind='jump'){
    u=clamp(u,0,1);
    if(kind==='step')return {point:{x:mix(from.x,to.x,ease(u)),y:mix(from.y,to.y,ease(u))},frame:u<.9?26:27,air:false};
    if(u<.15)return {point:from,frame:20,air:false};
    if(u>.82)return {point:to,frame:u<.96?20:27,air:false};
    const flight=(u-.15)/.67,apex=bodyHeight()*.43/innerHeight;
    return {point:{x:mix(from.x,to.x,ease(flight)),y:mix(from.y,to.y,flight)-4*apex*flight*(1-flight)},frame:flight<.15?21:25,air:true};
  }
  function opening(s){
    const ps=platforms(),mobile=innerWidth<=800,t=s.pageTime,start=ground(mobile?.26:.45),out=ground(mobile?.4:.705);
    if(s.reduced)return {point:out,frame:6,support:'ground',mode:'stand',behind:false};
    if(t<4.45){const u=clamp((t-.65)/3.8,0,1);return {point:{x:mix(start.x,out.x,ease(u)),y:start.y},frame:Math.floor(t*8)%6,support:'ground',mode:t<.65?'hidden':'walk',behind:t<3.2};}
    const low=ps[2],middle=ps[1],high=ps[0];
    const phases=[
      {start:4.8,end:6.05,from:out,to:low,kind:'jump'},
      {start:6.05,end:7.5,from:low,to:middle,kind:'jump'},
      {start:7.5,end:8.95,from:middle,to:high,kind:'jump'},
      {start:12.6,end:13.8,from:high,to:middle,kind:'jump'},
      {start:15.5,end:16.7,from:middle,to:low,kind:'jump'},
      {start:18.54,end:19.6,from:low,to:out,kind:'jump'}];
    let resting=out;
    for(const p of phases){if(t<p.start)break;if(t<=p.end){const u=(t-p.start)/(p.end-p.start),j=jump(p.from,p.to,u,p.kind);return {...j,support:j.air?'air':u<.15?(p.from.id||'ground'):(p.to.id||'ground'),mode:p.kind,behind:false};}resting=p.to;}
    return {point:resting,frame:t<4.8?7:t<18.54?11:7,support:resting.id||'ground',mode:'stand',behind:false};
  }
  function target(s){
    const figs=[...document.querySelectorAll('#artwork>figure')];
    if(s.pageData.kind==='end')return {point:ground(.73),pose:s.clip===3?7:6,key:'ending',focus:null};
    let i=0,pose=8,side='left';
    if(s.pageData.kind==='compare'){i=s.clip<=1?0:1;side=i?'right':'left';pose=s.clip===2?9:s.clip===3?10:8;}
    else if(s.pageData.kind==='floors'){i=figs.length===4?Math.min(3,s.clip):0;pose=s.clip===0?7:8;side=i%2?'right':'left';}
    else if(s.pageData.kind==='study'){pose=s.clip===2?11:s.clip===3?9:s.clip>=4?10:8;side=s.clip===3?'right':'left';}
    else if(s.pageData.kind==='layers'){i=s.clip===2?1:0;pose=s.clip===1?9:s.clip===2?11:8;side=i?'right':'left';}
    else if(s.pageData.kind==='film'){i=s.clip===2?1:0;pose=10;side=i?'right':'left';}
    else {i=figs.length>1&&s.clip%2===0?1:0;pose=s.clip===0?7:s.clip%3===1?8:s.clip%3===2?11:10;side=i?'right':'left';}
    const focus=figs[i],rect=focus?.getBoundingClientRect();let x=rect?(side==='right'?rect.right-18:rect.left+18)/innerWidth:.22;
    if(pose===9&&rect)x=(rect.right-handDelta().x)/innerWidth;
    return {point:ground(clamp(x,.09,.94)),pose,focus,rect,key:`${s.page}:${s.clip}:${i}`};
  }
  function clearMarks(){document.querySelectorAll('.space-focus,.space-touched,.space-examine').forEach(f=>{f.classList.remove('space-focus','space-touched','space-examine');f.style.translate='';});}
  function render(s){
    lastState=s;if(!ready)return;
    const jumped=lastClock&&s.page===lastClock.page&&s.clip===lastClock.clip&&Math.abs(s.time-lastClock.time)>.7;
    lastClock={page:s.page,clip:s.clip,time:s.time};root.hidden=!s.unlocked;if(!s.unlocked){draw(6);return;}
    if(previousPage!==s.page){if(previousPage!==null){document.body.dataset.spaceTransition='true';clearTimeout(transitionTimer);transitionTimer=setTimeout(()=>delete document.body.dataset.spaceTransition,650);}previousPage=s.page;route=null;}
    clearMarks();document.getElementById('paper').style.transform='rotate(-.6deg)';
    let point,frame=6,moving=false,facing=1,behind=false;contact=false;contactDistance=null;
    if(s.page===0){
      const a=opening(s);point=a.point;frame=a.frame;support=a.support;mode=a.mode;behind=a.behind;moving=['walk','step','jump'].includes(mode);root.hidden=mode==='hidden';
      root.dataset.air=String(a.air||false);route=null;platforms().forEach(p=>p.element.classList.toggle('selected',support===p.id));
    }else{
      const goal=target(s);support='ground';root.dataset.air='false';
      if(!route||route.key!==goal.key){route={key:goal.key,from:{...current},to:goal.point,start:s.time,travel:clamp(Math.abs(current.x-goal.point.x)*7,1,3.3),rect:goal.rect};if(s.time>.7){route.from={...goal.point};route.start=0;}}
      if(jumped){route.from={...goal.point};route.to=goal.point;route.start=0;route.rect=goal.rect;}
      const u=s.reduced?1:clamp((s.time-route.start)/route.travel,0,1);point={x:mix(route.from.x,route.to.x,ease(u)),y:floor()/innerHeight};
      moving=u<1;facing=route.to.x>=route.from.x?1:-1;frame=moving?Math.floor(s.pageTime*8)%6:goal.pose;mode=moving?'walk':'gesture';
      if(!moving&&goal.focus){
        goal.focus.classList.add('space-focus');
        if(goal.pose===9&&!s.reduced){
          const delta=handDelta(),r=route.rect||goal.rect,hand={x:point.x*innerWidth+delta.x,y:floor()+delta.y};
          contactDistance=Math.hypot(hand.x-r.right,hand.y-clamp(hand.y,r.top+10,r.bottom-10));contact=contactDistance<=18;
          if(contact){const elapsed=Math.max(0,s.time-route.start-route.travel),returning=clamp((s.duration-s.time)/.8,0,1),displacement=-10*ease(Math.min(elapsed/.5,returning,1));goal.focus.style.translate=`${displacement}px 0`;goal.focus.classList.add('space-touched');point.x+=displacement/innerWidth;mode='grip';}
          else {frame=8;mode='point';}
        }
        if(goal.pose===11)goal.focus.classList.add('space-examine');
      }
    }
    root.dataset.behind=String(behind);root.dataset.moving=String(moving);root.dataset.support=support;root.dataset.mode=mode;place(point);draw(frame,facing);
  }
  function loadAtlas(a,callback){
    a.image.onload=()=>{
      const cw=a.image.naturalWidth/4,ch=a.image.naturalHeight/a.rows,work=document.createElement('canvas');work.width=cw;work.height=ch;const c=work.getContext('2d',{willReadFrequently:true});
      for(let i=0;i<a.count;i++){
        c.clearRect(0,0,cw,ch);c.drawImage(a.image,i%4*cw,Math.floor(i/4)*ch,cw,ch,0,0,cw,ch);
        const data=c.getImageData(0,0,cw,ch).data,visited=new Uint8Array(cw*ch),queue=new Int32Array(cw*ch),components=[];
        // Decode the figure bounds, excluding tiny disconnected traces from neighboring sprite cells.
        for(let k=0;k<cw*ch;k++)if(!visited[k]&&data[k*4+3]>64){
          let head=0,tail=1,area=0,minX=cw,maxX=0,minY=ch,maxY=0;queue[0]=k;visited[k]=1;
          while(head<tail){const p=queue[head++],x=p%cw,y=Math.floor(p/cw);area++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
            for(const q of [x? p-1:-1,x<cw-1?p+1:-1,y?p-cw:-1,y<ch-1?p+cw:-1])if(q>=0&&!visited[q]&&data[q*4+3]>64){visited[q]=1;queue[tail++]=q;}}
          components.push({area,minX,maxX,minY,maxY});
        }
        const largest=Math.max(...components.map(p=>p.area)),keep=components.filter(p=>p.area>=Math.max(120,largest*.01));
        const top=Math.min(...keep.map(p=>p.minY)),bottom=Math.max(...keep.map(p=>p.maxY)),left=Math.min(...keep.map(p=>p.minX)),right=Math.max(...keep.map(p=>p.maxX));
        let n=0,center=0;for(let y=top;y<top+(bottom-top)*.28;y++)for(let x=left;x<=right;x++){const alpha=data[(y*cw+x)*4+3];if(alpha>64){center+=x*alpha;n+=alpha;}}
        a.boxes.push({h:Math.max(1,bottom-top),top,left,right,bottom,anchorX:n?center/n:cw/2});
      }
      callback();lastFrame=-1;if(lastState)render(lastState);
    };
  }
  const checkReady=()=>{if(ready&&actionsReady)resolveReady();};
  loadAtlas(atlases[0],()=>{ready=true;checkReady();});loadAtlas(atlases[1],()=>{actionsReady=true;checkReady();});
  for(const a of atlases)a.image.onerror=()=>{root.hidden=true;rejectReady(new Error('Character assets could not load'));};
  atlases[0].image.src='assets/walking-cast-v1.png';atlases[1].image.src='assets/climbing-cast-v1.png';
  window.spaceDirector={render,prepare:()=>assetsReady,getState:()=>({ready,actionsReady,position:current,frame:lastFrame,mode,support,contact,contactDistance,ground:floor()/innerHeight,behind:root.dataset.behind,moving:root.dataset.moving,page:previousPage})};
})();
