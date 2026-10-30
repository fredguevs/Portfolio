// Little sounds, made in the browser with the Web Audio API, so there are no audio
// files to download. Browsers only allow sound after a click or tap, so everything
// here is called from one.

let ctx: AudioContext | null = null;

function audio() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

// ---- Meows --------------------------------------------------------------------
//
// A buzzy tone whose pitch rises then falls, pushed through two filters that slide
// from an "ee" shape to an "ow" shape: mee-ow. Five voices, one picked at random.

const meows = [
  { start: 700, peak: 920, end: 540, length: 0.55 }, // ordinary meow
  { start: 820, peak: 1080, end: 680, length: 0.38 }, // quick one
  { start: 600, peak: 780, end: 470, length: 0.8 }, // long complaint
  { start: 950, peak: 1200, end: 900, length: 0.25 }, // tiny mew
  { start: 640, peak: 860, end: 400, length: 0.95 }, // dramatic
];

export function meow() {
  const c = audio();
  const m = meows[Math.floor(Math.random() * meows.length)];
  const t = c.currentTime;
  const end = t + m.length;

  const voice = c.createOscillator();
  voice.type = "sawtooth";
  voice.frequency.setValueAtTime(m.start, t);
  voice.frequency.linearRampToValueAtTime(m.peak, t + m.length * 0.35);
  voice.frequency.linearRampToValueAtTime(m.end, end);

  const wobble = c.createOscillator();
  const wobbleDepth = c.createGain();
  wobble.frequency.value = 6;
  wobbleDepth.gain.value = 14;
  wobble.connect(wobbleDepth).connect(voice.frequency);

  const out = c.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(0.9, t + 0.04);
  out.gain.setValueAtTime(0.9, t + m.length * 0.6);
  out.gain.linearRampToValueAtTime(0, end);
  out.connect(c.destination);

  for (const [from, to, q, level] of [
    [2400, 900, 6, 1],
    [3600, 1400, 8, 0.6],
  ] as const) {
    const shape = c.createBiquadFilter();
    shape.type = "bandpass";
    shape.Q.value = q;
    shape.frequency.setValueAtTime(from, t);
    shape.frequency.linearRampToValueAtTime(from * 1.15, t + m.length * 0.3);
    shape.frequency.exponentialRampToValueAtTime(to, end);
    const g = c.createGain();
    g.gain.value = level;
    voice.connect(shape).connect(g).connect(out);
  }

  voice.start(t);
  wobble.start(t);
  voice.stop(end + 0.05);
  wobble.stop(end + 0.05);
}

// ---- The Victors ----------------------------------------------------------------
//
// The chorus of "The Victors" (Louis Elbel, 1898; public domain), as a chiptune:
// a square-wave lead with a triangle an octave below. Notes are [MIDI note, beats],
// taken from the score in Wikipedia's article on the song. E-flat major, 144 bpm.

const BEAT = 60 / 144;
const hail: [number, number][] = [
  [67, 2], [63, 1], [65, 1], [67, 1], [63, 1], [65, 1], [67, 1], // Hail! to the victors valiant,
  [68, 2], [65, 1], [67, 1], [68, 1], [65, 1], [67, 1], [68, 1], // Hail! to the conquering heroes,
  [70, 2], [72, 1.5], [67, 0.5], [67, 1], [68, 1], [63, 1], [65, 1], // Hail! Hail! to Michigan,
];
const victors: [number, number][] = [
  ...hail,
  [67, 2], [65, 1], [63, 1], [70, 4], // the leaders and best,
  ...hail,
  [67, 1], [70, 1], [67, 1.5], [65, 0.5], [63, 4], // the champions of the West!
];

let stopCurrent: (() => void) | null = null;

// Starts the song and returns a function that stops it. `onEnd` runs when it
// finishes by itself.
export function playVictors(onEnd: () => void) {
  stopCurrent?.();
  const c = audio();
  const master = c.createGain();
  master.gain.value = 0.12;
  master.connect(c.destination);

  const oscillators: OscillatorNode[] = [];
  let t = c.currentTime + 0.05;
  for (const [note, beats] of victors) {
    const length = beats * BEAT;
    for (const [type, pitch, level] of [
      ["square", note, 1],
      ["triangle", note - 12, 1.6],
    ] as const) {
      const osc = c.createOscillator();
      osc.type = type;
      osc.frequency.value = hz(pitch);
      const env = c.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(level, t + 0.01);
      env.gain.setValueAtTime(level * 0.7, t + Math.min(0.08, length / 2));
      env.gain.linearRampToValueAtTime(0, t + length * 0.88);
      osc.connect(env).connect(master);
      osc.start(t);
      osc.stop(t + length);
      oscillators.push(osc);
    }
    t += length;
  }

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    master.gain.setTargetAtTime(0, c.currentTime, 0.02);
    for (const osc of oscillators) {
      try {
        osc.stop(c.currentTime + 0.1);
      } catch {
        // already stopped
      }
    }
    if (stopCurrent === stop) stopCurrent = null;
  };

  oscillators[oscillators.length - 1].onended = () => {
    if (!stopped) {
      stop();
      onEnd();
    }
  };
  stopCurrent = stop;
  return stop;
}
