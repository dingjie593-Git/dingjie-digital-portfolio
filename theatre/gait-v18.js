(() => {
'use strict';
// Metadata shares the continuous rig's 200px two-step period. Raster walk-frame
// switching and the old horizontal trouser correction are no longer rendered.
const cycle=200,phase=d=>(((d%cycle)+cycle)%cycle/cycle+.25)%1;
window.walkGait={cycle,phase,frame:d=>Math.floor(phase(d)*8)};
})();
