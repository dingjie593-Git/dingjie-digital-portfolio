(() => {
const E=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)},M=(a,b,t)=>a+(b-a)*t,Q=(t,a,b)=>E((t-a)/(b-a));
const duration=82,segments=[[10,0,11.58],[27.5,11.58,11.855],[42,23.435,9.33],[56.5,32.765,11.73]];
const beats=[
 [0,2.4,'从封面接着走。','上一幕整体向左让位，小人沿同一条地面继续走；不重新出生或进场。'],
 [2.4,3.8,'抬头，停一下。','视线先到树冠，再带动身体转向，让观众读懂她的兴趣。'],
 [3.8,5,'想够到，差一点。','试着伸手，停在够不到的位置，收回手；不触发图片。'],
 [5,6.3,'低头，找到落脚点。','从图片看向粘土块，往前挪一步，决定怎么上去。'],
 [6.3,7.2,'双手扶稳，再抬脚。','先接触，再转移重心；攀爬从这个预备动作开始。'],
 [7.2,10.5,'拉起身体，跨上粘土块。','抓住支撑点，抬膝，将身体带到上方，最后把脚放稳。'],
 [10.5,12,'有点晃，扶一下。','站稳后张开手臂找平衡，再看观众一眼；趣味来自重心恢复。'],
 [12,14,'走到边框，准备操作。','沿边缘移动，脚步放慢，先看清即将触碰的位置。'],
 [14,15.2,'指尖触碰，等待回应。','触碰之前图片不动；接触后先轻微回应，再展开。'],
 [15.2,17.2,'图片展开，她退让。','图片独立离开原位，固定粘土框留在舞台；她先后撤再转身。'],
 [17.2,18.2,'在框角坐下。','找准固定画框的角，把重心落到坐点，两条腿自然悬垂。'],
 [18.2,21.58,'坐稳，陪观众看树冠。','身体保持安静，给画面阅读时间，视线仍跟着作品。'],
 [21.58,24.6,'起身，走到构件图旁。','先起身站稳，随后靠近图片边缘，伸手准备抓握。'],
 [24.6,27.5,'抓住，拉到旁边。','手与图片保持同一个接触点，图片跟随手移动；放好后才松手。'],
 [27.5,39.355,'带看弯折，再看布光。','多数时间稳住画面，关键句用一次明确指认；中间低头检查，再回看观众。'],
 [39.355,42,'从后面抽出多视图。','先看卡片来源，伸手取出，再把多视图放到比较位置。'],
 [42,51.33,'逐项检查，留出阅读时间。','对照顶视、底视、立面和卷帘关系，用短暂强调帮助定位。'],
 [51.33,56.5,'按顺序收回，推到原位。','先收多视图，再送回构件图，最后缩回主图；手在推回段保持接触。'],
 [56.5,68.23,'站在作品旁，交代参与。','看向观众，说明参与范围；不连续挥手，也不遮住项目核心。'],
 [68.23,70.5,'检查一下，拍拍手。','确认图片已归位，做一个轻轻整理与拍手的结束动作。'],
 [70.5,76,'接住故事板，推向下一幕。','人物留在舞台上，双手接住下一张故事板，把整页布景推入；位置、面向和动作不中断。'],
 [76,82,'已经到了泗泾，接着看故事。','在下一幕的固定落脚点站稳，转向故事板，下一段从这里接着讲。']
];
function voice(time){let a=0,active=false;for(const [s,f,l] of segments)if(time>=s){a=f+Math.min(time-s,l);if(time<s+l)active=true}return {a,active}}
function pose(t){let p={x:1230,y:755,frame:6,facing:-1,air:false,lean:0,perch:false};
 if(t<2.4){p.x=M(1110,1230,Q(t,0,2.4));p.frame=Math.floor(t*8)%6;p.facing=1}
 else if(t<3.8){p.frame=100;p.facing=1;p.lean=-1.5*Q(t,2.4,3.8)}
 else if(t<5){p.frame=t<4.6?100:11;p.facing=1;p.y=755-6*Math.sin(Q(t,3.8,5)*Math.PI)}
 else if(t<6.3){p.frame=11;p.facing=-1;p.x=M(1230,1260,Q(t,5,6.3))}
 else if(t<7.2){p.x=1260;p.frame=101;p.facing=1}
 else if(t<10.5){const u=Q(t,7.2,10.5);p.x=M(1260,1190,u);p.y=M(755,679,u);p.frame=u<.22?101:u<.86?102:103;p.facing=1}
 else if(t<12){p.x=1190;p.y=679;p.frame=103;p.facing=1;p.lean=Math.sin((t-10.5)*6)*2.5*(1-Q(t,10.5,12))}
 else if(t<14){const u=Q(t,12,14);p.x=M(1190,1000,u);p.y=M(679,730,u);p.frame=Math.floor(t*7)%6;p.facing=-1}
 else if(t<15.2){p.x=1000;p.y=730;p.frame=104;p.facing=1}
 else if(t<17.2){const u=Q(t,15.2,17.2);p.x=M(1000,1170,u);p.y=M(730,730,u);p.frame=u<.65?105:103;p.facing=1}
 else if(t<21.58){p.x=M(1170,1020,Q(t,17.2,18.2));p.y=730;p.frame=t<17.8?103:106;p.facing=1;p.perch=t>=17.8}
 else if(t<24.6){const u=Q(t,21.58,24.6);p.x=M(1020,1230,u);p.y=M(730,755,u);p.frame=u<.18?103:u<.84?Math.floor(t*7)%6:107;p.facing=1}
 else if(t<27.5){p.frame=108;p.facing=1;p.grip='detail';p.x=M(1230,1200,Q(t,24.6,27.5))}
 else if(t<39.355){p.x=1200;p.frame=(t>30.2&&t<31.4)||(t>35&&t<36.2)?8:t>33&&t<34.2?11:10;p.facing=p.frame===8?1:-1}
 else if(t<42){p.x=1200;p.frame=108;p.facing=1;p.grip='views'}
 else if(t<51.33){p.x=1200;p.frame=t>43&&t<44.2||t>47.4&&t<48.6?8:10;p.facing=p.frame===8?1:-1}
 else if(t<56.5){p.x=1200;p.frame=109;p.facing=1;p.grip=t<52.4?'views':t<53?null:t<54?'detail':t<54.8?null:'main'}
 else if(t<68.23){p.x=1110;p.y=730;p.frame=t<57.2?103:10;p.facing=-1}
 else if(t<70.5){p.x=1110;p.y=730;p.frame=t<69?109:110;p.facing=1}
 else if(t<71.5){const u=Q(t,70.5,71.5);p.x=M(1110,1240,u);p.y=M(730,755,u);p.frame=107;p.facing=1}
 else if(t<75.5){p.frame=109;p.facing=1}
 else if(t<77){p.x=M(80,240,Q(t,75.5,77));p.frame=Math.floor(t*7)%6;p.facing=1}
 else{p.x=240;p.frame=104;p.facing=-1}
 return p;
}
function box(a,b,u){const r={};for(const k of ['x','y','w','h'])r[k]=M(a[k],b[k],u);return r}
const src={x:38,y:203,w:990,h:527},large={x:160,y:155,w:940,h:560},left={x:95,y:175,w:770,h:440},third={x:125,y:150,w:740,h:430},detailSrc={x:1010,y:256,w:390,h:390},detailDst={x:820,y:265,w:350,h:370},viewsSrc={x:955,y:515,w:130,h:80},viewsDst={x:180,y:505,w:700,h:240};
function cards(t){const mainQ=t<15.2?0:t<17.2?Q(t,15.2,17.2):t<54.8?1:1-Q(t,54.8,56.5),dq=t<24.6?0:t<27.5?Q(t,24.6,27.5):t<53?1:1-Q(t,53,54),vq=t<39.355?0:t<42?Q(t,39.355,42):t<51.33?1:1-Q(t,51.33,52.4);const dest=box(box(large,left,Q(t,24.6,27.5)),third,Q(t,39.355,42));return {main:{box:box(src,dest,mainQ),opacity:t>=15.2&&t<56.5?1:0,q:mainQ},detail:{box:box(detailSrc,detailDst,dq),opacity:t>=24.6&&t<54?1:0,q:dq},views:{box:box(viewsSrc,viewsDst,vq),opacity:t>=39.355&&t<52.4?Math.min(1,vq*5):0,q:vq},tap:Math.max(0,1-Math.abs(t-15.04)/.25)}}
window.DONGJI_DIRECTION={duration,beats,voice,pose,cards};
})();
