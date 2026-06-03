// Lightweight WebAudio sound effects — no assets required.
let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15, when = 0) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  click: () => tone(520, 0.08, "triangle", 0.08),
  correct: () => {
    tone(660, 0.12, "sine", 0.18, 0);
    tone(880, 0.16, "sine", 0.18, 0.1);
    tone(1320, 0.22, "sine", 0.15, 0.22);
  },
  close: () => {
    tone(500, 0.12, "sine", 0.15, 0);
    tone(420, 0.18, "sine", 0.13, 0.1);
  },
  wrong: () => {
    tone(220, 0.18, "sawtooth", 0.12, 0);
    tone(160, 0.22, "sawtooth", 0.12, 0.12);
  },
  finish: () => {
    tone(523, 0.15, "triangle", 0.18, 0);
    tone(659, 0.15, "triangle", 0.18, 0.12);
    tone(784, 0.15, "triangle", 0.18, 0.24);
    tone(1047, 0.35, "triangle", 0.2, 0.36);
  },
};
