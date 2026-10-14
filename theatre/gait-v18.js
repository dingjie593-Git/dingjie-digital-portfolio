(() => {
'use strict';
const cycle=240;
// Distance, rather than a timer, advances the alternating left/right cycle.
const phase=d=>(((d%cycle)+cycle)%cycle/cycle+.25)%1;
const support=[270,223,131,74,303,185,156,70];
window.walkGait={cycle,phase,frame:d=>Math.floor(phase(d)*8),support,
 offset(d,i,cx,scale){
  if(!support[i])return 0;
  const u=phase(d),desired=60-(u%.5)*240;
  return desired-(support[i]-cx)*scale;
 }
};
})();
