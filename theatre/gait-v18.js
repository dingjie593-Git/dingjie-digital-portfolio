(() => {
'use strict';
// Original whole-character frames 1-4, followed by the opposite-leg frames 5-8.
// No limb rig, optical-flow interpolation, or horizontal cloth correction.
const cycle=200,phase=d=>(((d%cycle)+cycle)%cycle/cycle+.25)%1;
window.walkGait={cycle,phase,frame:d=>Math.floor(phase(d)*8)};
})();
