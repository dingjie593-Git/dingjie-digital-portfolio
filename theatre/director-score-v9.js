(() => {
'use strict';
const k=(t,x,action='listen',face=-1,y=900)=>({t,x,y,action,face});
const act=(start,end,kind,amount=1)=>({start,end,kind,amount});
const install=(i,route,business,note,extra={})=>Object.assign(PERFORMANCE_SCORE[i],{route,business,directorNote:note,...extra});

install(0,[k(0,1070),k(4.7,1070,'brace'),k(5.6,1110,'wave'),k(7.5,1110),k(8.8,1110,'walk',1),k(10.9,1200,'present',1),k(15.9,1200,'listen',1),k(18.1,1200,'present',1),k(21,1200,'listen',1),k(26.5,1200,'present',-1),k(30.8,1200),k(33.1,1200,'walk',1),k(35.6,1340,'point',-1)],
 [act(4.7,6,'emerge'),act(10.7,11.5,'settle'),act(26.6,27.4,'nod')],
 '先让观众认识画报；说到带大家逛逛时独立小人才出现，转向履历，再邀请出发。',{appear:[4.7,5.6]});

install(1,[k(0,1430),k(1.2,1430,'walk'),k(2.2,1360,'touch'),k(3,1360,'walk',1),k(4.2,1450,'present'),k(10.9,1450,'inspect'),k(12,1450,'reach'),k(13,1450,'brace'),k(13.8,1450,'climb'),k(14.7,1450,'balance',-1,810),k(15.4,1450,'present',-1,810),k(19.6,1450,'inspect',-1,810),k(20.7,1450,'climb',-1,810),k(21.7,1450,'listen'),k(23.2,1450,'grasp'),k(24.2,1450,'pull'),k(25.3,1450,'listen'),k(31.3,1450,'push'),k(33.2,1450,'present'),k(39.8,1450,'walk'),k(41.1,1380,'listen',1),k(42.1,1380,'inspect'),k(42.8,1380,'grasp'),k(43.6,1380,'hold')],
 [act(1.7,3.6,'press'),act(12.1,14.8,'effort'),act(14.6,15.3,'balance'),act(23.1,25.4,'pull'),act(31.2,33,'put'),act(42,43.5,'doubleTake')],
 '观察整体；够不到单元图才登上粘土块；多视图从手边展开；离开时回头收起遗落的研究卡。',
 {support:{start:12.4,in:.7,end:22.2,out:.6,x:1450,top:810,width:176,color:'olive'},carry:{n:3,start:41.1,pickup:42.8,end:44.5,loose:[1210,786,155,80],width:190}});

install(2,[k(0,1430,'point'),k(3,1430),k(9.9,1430,'push'),k(11.3,1430,'grasp'),k(12.2,1430,'pull'),k(13.4,1430,'present'),k(19.9,1430),k(21.3,1430,'point'),k(23.2,1430,'inspect'),k(26.1,1430,'present'),k(29.8,1430),k(32.4,1430,'grasp'),k(33.4,1430,'pull'),k(34.8,1430,'present'),k(39.5,1430,'push'),k(41,1430,'grasp'),k(42,1430,'walk'),k(43.7,1380,'hold')],
 [act(1.1,2.9,'press'),act(11.1,13.4,'pull'),act(21.2,22.9,'press'),act(32.3,34.6,'unfold'),act(39.3,40.8,'put')],
 '沿故事条读主题；投标效果、结构、剖面依次展开；把长条纸折成下一幕的竖向楼层索引。',
 {carry:{n:18,start:41.4,pickup:41.4,end:44.57,width:210}});

install(3,[k(0,1450,'present'),k(2.2,1450,'point'),k(4.2,1450),k(13.3,1450,'reach'),k(14.2,1450,'brace'),k(15,1450,'climb'),k(16.2,1450,'balance',-1,805),k(17.1,1450,'present',-1,805),k(20.3,1450,'listen',-1,805),k(24.9,1450,'listen',-1,805),k(25.5,1450,'brace',-1,805),k(26.1,1450,'climb',-1,805),k(27.2,1450,'grasp'),k(28.4,1450,'present'),k(30.1,1450,'point'),k(32.1,1450),k(37.5,1450,'push'),k(39.3,1450,'touch'),k(41.2,1450),k(47.2,1450,'grasp'),k(48.3,1450,'walk'),k(50.1,1380,'hold')],
 [act(13.3,16.2,'effort'),act(16.1,17,'balance'),act(20.2,21,'sit'),act(25.3,27.2,'land'),act(39.2,41,'press')],
 '四层由低到高；八层登高，停下观察共享座席；十层回到地面，再带观众回看公共界面。',
 {support:{start:14,in:.8,end:27.8,out:.6,x:1450,top:805,width:180,color:'terracotta'},carry:{n:38,start:48,pickup:48,end:51.34,width:190}});

install(4,[k(0,1450),k(1.7,1450,'point'),k(4.7,1450,'inspect'),k(10.9,1450,'brace'),k(11.8,1450,'brace'),k(12.3,1450,'sit',-1,805),k(14.1,1450,'sit',-1,805),k(19.1,1450,'sit',-1,805),k(19.8,1450,'brace'),k(20.7,1450,'listen'),k(21.6,1450,'grasp'),k(22.5,1450,'pull'),k(23.9,1450,'inspect'),k(25,1450,'grasp'),k(26,1450,'present'),k(30.9,1450),k(32.1,1450,'push'),k(34.1,1450,'present'),k(41.7,1450),k(43.4,1450,'grasp'),k(44.4,1450,'walk'),k(45.8,1380,'hold')],
 [act(1.4,3.5,'press'),act(11.6,13.5,'sit'),act(19.5,21.1,'land'),act(21.4,24,'peel'),act(25,26.2,'put'),act(32,33.6,'put')],
 '抵达大堂，观察转角；共享空间段真的坐下；起身后掀开表面看构件，把实体模型轻放旁边。',
 {support:{start:11.2,in:.7,end:21.4,out:.7,x:1450,top:805,width:210,color:'olive'},carry:{n:48,start:43.9,pickup:43.9,end:46.48,width:195}});

install(5,[k(0,1550),k(4.3,1550,'point'),k(7.9,1550),k(9.5,1550,'present'),k(12.6,1550,'inspect'),k(16.9,1550),k(18.2,1550,'point'),k(21.8,1550),k(25.3,1550,'touch'),k(27.1,1550,'hold')],
 [act(4.1,5.2,'press'),act(9.5,10.8,'press'),act(17.8,18.8,'nod'),act(25.2,27,'press')],
 '节奏放慢，两图保持基准；眼神和指向带动33到48；最终点击调整平面的空间节点，直接进入效果图。');

install(6,[k(0,1450,'present'),k(1.8,1450,'point'),k(4.1,1450),k(10.3,1450,'grasp'),k(11.6,1450,'pull'),k(12.9,1450,'present'),k(17.9,1450),k(19.1,1450,'point'),k(21.2,1450,'inspect'),k(28.9,1450,'push'),k(30.9,1450,'grasp'),k(32.4,1450,'present'),k(35.7,1450),k(37,1450,'grasp'),k(38.7,1400,'hold')],
 [act(1.6,3.8,'press'),act(10.2,12.9,'unfold'),act(19,21,'press'),act(28.7,30.5,'put'),act(31,33,'spread')],
 '像展开空间明信片：先整体，再展览，再回到入口关系，最后摊开停留区与市集两张卡。',
 {carry:{n:62,start:37.1,pickup:37.1,end:39.84,width:190}});

install(7,[k(0,1450,'inspect'),k(1.2,1450,'brace'),k(2.6,1450,'inspect'),k(5.2,1450),k(10.4,1450,'push'),k(11.4,1450,'grasp'),k(12.3,1450,'pull'),k(13.3,1450,'present'),k(16.5,1450,'front'),k(17.4,1450,'point'),k(19,1450),k(22.4,1450,'grasp'),k(23.4,1450,'pull'),k(24.6,1450,'present'),k(30.9,1450),k(31.6,1450,'push'),k(34.1,1450,'present'),k(40.2,1450),k(44.9,1450,'grasp'),k(46.3,1450,'walk'),k(47.5,1380,'hold')],
 [act(.9,2.8,'crouch'),act(11.2,13.4,'unfold'),act(16.5,17.5,'straighten'),act(22.2,24.6,'unfold'),act(31.4,33,'put')],
 '儿童空间先俯身观察，音乐厅站直；会客厅安静阅读；收起图纸，翻到表达能力。',
 {carry:{n:70,start:45.4,pickup:45.4,end:48.24,width:190}});

install(8,[k(0,1450,'present'),k(1.1,1450,'grasp'),k(2,1450,'pull'),k(2.9,1450,'inspect'),k(3.4,1450,'push'),k(4.3,1450),k(5.2,1450,'grasp'),k(6,1450,'pull'),k(7.1,1450,'present'),k(9.8,1450),k(11,1450,'touch'),k(12.7,1450,'present'),k(14.7,1450),k(23.7,1450,'present'),k(26.9,1450),k(31.7,1450,'front'),k(33.1,1450,'push'),k(34.9,1450,'walk'),k(36.1,1280,'present'),k(39.2,1280,'inspect'),k(42.5,1280),k(44.5,1280,'grasp'),k(46.5,1380,'hold')],
 [act(1,2.8,'pull'),act(3.3,4.3,'straighten'),act(5.1,7,'pull'),act(11,12.7,'press'),act(31.6,32.4,'nod'),act(33,34.4,'put'),act(44.4,46.4,'gather')],
 '建模卡抽出后歪了一点，扶正再退开；Enscape与AI安静看图；走近链接，最后收好三张能力卡。',
 {carry:{n:83,stack:[93,98],start:44.9,pickup:44.9,end:47.66,width:175}});

install(9,[k(0,1350,'push'),k(1.1,1350,'dust'),k(2.3,1350,'front'),k(3.4,1350,'present'),k(6.5,1350,'wave'),k(8.2,1350,'front'),k(10.2,1350,'front')],
 [act(0,1.2,'put'),act(6.4,7.7,'greet'),act(10.1,11.2,'nod')],
 '把作品放好，面对观众说求职意向；挥一次手，落定致谢。');

// Supplemental drawings come out of her hand, not from an arbitrary distant corner.
for(let i=1;i<=8;i++)for(const p of PERFORMANCE_SCORE[i].props||[]){
 if(p.slot==null){p.origin='hand';delete p.from;}
 if(p.diagram&&[3,18,21,24,39,50].includes(p.n))p.reveal='unfold';
}
PERFORMANCE_SCORE[8].props[0].straighten=[2.8,4.2,-2.4];
for(let i=0;i<10;i++){const s=PERFORMANCE_SCORE[i];s.entry=[s.route[0].x,s.route[0].y];s.exit=[s.route.at(-1).x,s.route.at(-1).y];}

Object.assign(PERFORMANCE_HANDOFFS[1],{name:'折起研究卡，打开故事纸',duration:2.6,note:'研究卡留在手里；旧页收向卡片，故事纸从同一位置展开。'});
PERFORMANCE_SCORE[1].transition='folio';
Object.assign(PERFORMANCE_HANDOFFS[2],{name:'故事纸展开成楼层',duration:2.5});
Object.assign(PERFORMANCE_HANDOFFS[5],{name:'平面节点进入空间',duration:2.3});
Object.assign(PERFORMANCE_HANDOFFS[7],{name:'把作品翻到表达的一面',duration:2.5});
Object.assign(PERFORMANCE_HANDOFFS[8],{name:'把能力卡收好，向观众致谢',duration:2.8});
window.DIRECTOR_EDITION='v9 / 一位设计师，带你走过作品';
})();
