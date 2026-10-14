(() => {
 const offset=INTRO_GUIDE.duration,s=PERFORMANCE_SCORE[0];
 s.route=s.route.map(k=>({...k,t:k.t+offset}));
 s.route.unshift({t:0,x:1150,y:900,action:'listen',face:1});
 s.business=(s.business||[]).map(k=>({...k,start:k.start+offset,end:k.end+offset}));
 s.focus=(s.focus||[]).map(([a,b,...rest])=>[a+offset,b+offset,...rest]);
 delete s.appear;
})();
