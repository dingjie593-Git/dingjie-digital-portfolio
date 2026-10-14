(() => {
'use strict';
const TAU=Math.PI*2,CYCLE=200,clamp=u=>Math.max(0,Math.min(1,u));
const surface=document.createElement('canvas');surface.width=400;surface.height=400;
let gl,parts,image,torso,torsoRegion,program,vertex,index,vertices,ready=false;
const GW=17,GH=65,drawCount=(GW-1)*(GH-1)*6;
const phase=d=>(((d%CYCLE)+CYCLE)%CYCLE/CYCLE+.25)%1;
function foot(u){
 u=(u+1)%1;const stance=u<.56,v=stance?u/.56:(u-.56)/.44;
 const x=stance?56-200*u:-56+112*v-200/TAU*Math.sin(TAU*v);
 const lift=stance?0:15*Math.sin(Math.PI*v)**1.5;
 const roll=stance?v<.15?-.10*(1-v/.15):v>.82?.13*(v-.82)/.18:0:.13*(1-v)-.10*v-.12*Math.sin(Math.PI*v);
 const sole=Math.max(-18*Math.sin(roll),44*Math.sin(roll))+19.5*Math.cos(roll);
 return {x,y:-sole-lift,roll,stance};
}
function knee(h,a){
 const l1=82,l2=72,dx=a.x-h.x,dy=a.y-h.y,d=Math.min(l1+l2-.01,Math.hypot(dx,dy)),actual=Math.hypot(dx,dy),nx=dx/actual,ny=dy/actual;
 const along=(l1*l1-l2*l2+d*d)/(2*d),bend=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {x:h.x+nx*along+ny*bend,y:h.y+ny*along-nx*bend};
}
function skeleton(d,envelope=1){
 const u=phase(d),feet=[foot(u+.5),foot(u)].map((a,i)=>({...a,x:(i?18:-18)*(1-envelope)+a.x*envelope,y:-19.5*(1-envelope)+a.y*envelope,roll:a.roll*envelope,stance:a.stance||envelope<.3}));
 const support=feet.map((a,i)=>a.y-Math.sqrt(Math.max(1,153**2-(a.x-(i?7:-7))**2))+2);
 const hipY=Math.max(...support),bob=hipY+166;
 return {u,bob,envelope,legs:feet.map((a,i)=>{const h={x:i?7:-7,y:hipY};return {h,k:knee(h,a),a}})};
}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
async function prepare(){
 try{
  image=new Image();image.src='assets/acting-v19/walk-parts.webp';torso=new Image();torso.src='assets/acting-v19/walk-torso.webp';
  [parts,torsoRegion]=await Promise.all([fetch('assets/acting-v19/walk-parts.json').then(r=>{if(!r.ok)throw Error('Walk parts missing');return r.json()}),fetch('assets/acting-v19/walk-torso-region.json').then(r=>r.json()),image.decode(),torso.decode()]);
  gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,preserveDrawingBuffer:true});
  if(gl){
   program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 aPosition;attribute vec2 aUV;varying vec2 vUV;void main(){gl_Position=vec4(aPosition.x/200.0,1.0-(aPosition.y+380.0)/200.0,0.,1.);vUV=aUV;}'));
   gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float;uniform sampler2D uImage;varying vec2 vUV;void main(){gl_FragColor=texture2D(uImage,vUV);}'));
   gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
   vertices=new Float32Array(GW*GH*4);const indices=[];
   for(let y=0;y<GH-1;y++)for(let x=0;x<GW-1;x++){const a=y*GW+x;indices.push(a,a+1,a+GW,a+1,a+GW+1,a+GW)}
   vertex=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertex);gl.bufferData(gl.ARRAY_BUFFER,vertices.byteLength,gl.DYNAMIC_DRAW);
   for(const [name,offset] of [['aPosition',0],['aUV',8]]){const a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,16,offset)}
   index=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);
   const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
   gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
   surface.addEventListener('webglcontextlost',e=>{e.preventDefault();gl=null});
  }
  ready=true;return true;
 }catch(e){console.warn('Walk rig unavailable.',e);return false}
}
function bonePoint(x,y,s,t,width){
 const dx=s[1][0]-s[0][0],dy=s[1][1]-s[0][1],length=Math.hypot(dx,dy),nx=dx/length,ny=dy/length;
 const along=((x-s[0][0])*nx+(y-s[0][1])*ny)/length,across=(-(x-s[0][0])*ny+(y-s[0][1])*nx)*width;
 const tx=t[1].x-t[0].x,ty=t[1].y-t[0].y,tl=Math.hypot(tx,ty);
 return {x:t[0].x+tx*along-ty/tl*across,y:t[0].y+ty*along+tx/tl*across};
}
function legPoint(x,y,leg,near){
 const hipX=near?104:80,kneeX=near?100:85,ankleX=near?100:85;
 const a=bonePoint(x,y,[[hipX,15],[kneeX,245]],[leg.h,leg.k],near?.35:.33);
 const b=bonePoint(x,y,[[kneeX,245],[ankleX,425]],[leg.k,leg.a],near?.35:.33);
 const c=Math.cos(leg.a.roll),s=Math.sin(leg.a.roll),px=(x-ankleX)*.29,py=(y-425)*.29,shoe={x:leg.a.x+px*c-py*s,y:leg.a.y+px*s+py*c};
 let u=clamp((y-210)/70);u=u*u*(3-2*u);let out={x:a.x*(1-u)+b.x*u,y:a.y*(1-u)+b.y*u};
 u=clamp((y-413)/24);u=u*u*(3-2*u);return {x:out.x*(1-u)+shoe.x*u,y:out.y*(1-u)+shoe.y*u};
}
function paintLeg(leg,near){
 const r=near?parts.legNear:parts.legFar;
 for(let row=0;row<GH;row++)for(let col=0;col<GW;col++){
  const x=col/(GW-1)*r[2],y=row/(GH-1)*r[3],p=legPoint(x,y,leg,near),j=(row*GW+col)*4;
  vertices[j]=p.x;vertices[j+1]=p.y;vertices[j+2]=(r[0]+x)/image.width;vertices[j+3]=(r[1]+y)/image.height;
 }
 gl.bindBuffer(gl.ARRAY_BUFFER,vertex);gl.bufferSubData(gl.ARRAY_BUFFER,0,vertices);gl.drawElements(gl.TRIANGLES,drawCount,gl.UNSIGNED_SHORT,0);
}
function arm(ctx,near,s){
 const r=near?parts.armNear:parts.armFar,angle=(near?1:-1)*.29*Math.cos(s.u*TAU)*s.envelope;
 ctx.save();ctx.translate(near?-35:30,-213+s.bob);ctx.rotate(angle);ctx.drawImage(image,...r,-56*.255,-38*.255,r[2]*.255,r[3]*.255);ctx.restore();
}
function triangle(ctx,src,dst){
 const [s,a,b]=src,[t,c,d]=dst,ax=a.x-s.x,ay=a.y-s.y,bx=b.x-s.x,by=b.y-s.y,det=ax*by-ay*bx;
 if(Math.abs(det)<1e-6)return;
 const cx=c.x-t.x,cy=c.y-t.y,dx=d.x-t.x,dy=d.y-t.y;
 const aa=(cx*by-dx*ay)/det,bb=(cy*by-dy*ay)/det,cc=(dx*ax-cx*bx)/det,dd=(dy*ax-cy*bx)/det;
 const mx=(t.x+c.x+d.x)/3,my=(t.y+c.y+d.y)/3;
 ctx.save();ctx.beginPath();dst.forEach((p,i)=>{const x=mx+(p.x-mx)*1.004,y=my+(p.y-my)*1.004;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.clip();
 ctx.transform(aa,bb,cc,dd,t.x-aa*s.x-cc*s.y,t.y-bb*s.x-dd*s.y);ctx.drawImage(image,0,0);ctx.restore();
}
function flatLeg(ctx,leg,near){
 // Canvas fallback uses the same joints and skin weights, rather than switching
 // back to the inconsistent raster walk when WebGL is unavailable.
 const r=near?parts.legNear:parts.legFar;
 for(let row=0;row<48;row++){
  const y=row/48*r[3],z=(row+1)/48*r[3],s=[{x:0,y},{x:r[2],y},{x:0,y:z},{x:r[2],y:z}],p=s.map(v=>legPoint(v.x,v.y,leg,near)),uv=s.map(v=>({x:r[0]+v.x,y:r[1]+v.y}));
  triangle(ctx,[uv[0],uv[1],uv[2]],[p[0],p[1],p[2]]);triangle(ctx,[uv[1],uv[3],uv[2]],[p[1],p[3],p[2]]);
 }
}
function draw(ctx,p,alpha=1){
 if(!ready)return false;
 const s=skeleton(p.walkDistance,p.walkEnvelope??1);ctx.save();ctx.globalAlpha*=alpha;ctx.translate(p.x,p.y);ctx.scale(p.face,1);
 arm(ctx,false,s);
 ctx.drawImage(image,...parts.pelvis,-31.35,-174+s.bob,62.7,43.7);
 if(gl){gl.viewport(0,0,400,400);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);paintLeg(s.legs[0],false);paintLeg(s.legs[1],true);gl.flush();ctx.drawImage(surface,-200,-380)}
 else {flatLeg(ctx,s.legs[0],false);flatLeg(ctx,s.legs[1],true)}
 // A single immutable head and torso throughout the walk.
 ctx.drawImage(torso,...torsoRegion,-61,-342+s.bob,122,187);arm(ctx,true,s);ctx.restore();return true;
}
window.walkMotion={prepare,draw,skeleton,get ready(){return ready},cycle:CYCLE};
})();
