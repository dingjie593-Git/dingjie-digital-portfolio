(() => {
  'use strict';
  const actor = document.getElementById('actor');
  const audio = document.getElementById('narration');
  const canvas = document.createElement('canvas');
  canvas.className = 'actor-performance';
  canvas.setAttribute('aria-hidden', 'true');
  actor.querySelector('.actor-pose').appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const sheet = new Image();
  let ready = false, lastFrame = -1;
  const movements = new Set([0, 3, 4, 5, 7, 8, 9]);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function frameAt(t, cueIndex) {
    const cue = DEMO.cues[cueIndex];
    if (!cue || reduced.matches || !movements.has(cueIndex)) return 0;
    const elapsed = Math.max(0, t - cue.start);
    const remaining = cue.end - t;
    // Row-major hand-drawn acting frames: gaze, shoulder, elbow, point, return.
    if (remaining < 1.05) return Math.min(11, 8 + Math.floor((1.05 - remaining) / .27));
    if (elapsed < .28) return 0;
    if (elapsed < 1.5) return Math.min(6, 1 + Math.floor((elapsed - .28) / .205));
    return cueIndex === 0 || cueIndex === 9 ? 7 : 6;
  }
  function render(t, cueIndex) {
    if (!ready) return;
    const frame = frameAt(t, cueIndex);
    actor.dataset.frame = String(frame);
    if (lastFrame === frame) return;
    lastFrame = frame;
    const w = sheet.naturalWidth / 4, h = sheet.naturalHeight / 3;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sheet, (frame % 4) * w, Math.floor(frame / 4) * h, w, h, 0, 0, canvas.width, canvas.height);
  }
  window.actorPerformance = {render, ready: () => ready};
  sheet.addEventListener('load', () => {
    canvas.width = sheet.naturalWidth / 4;
    canvas.height = sheet.naturalHeight / 3;
    ready = true;
    actor.classList.add('performance-ready');
    const cueIndex = Math.max(0, DEMO.cues.findIndex(c => audio.currentTime >= c.start && audio.currentTime < c.end));
    render(audio.currentTime, cueIndex);
  });
  sheet.src = 'assets/performance-sheet.png';
})();
