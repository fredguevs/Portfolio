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
// Kept quiet: it's a small cat.

const MEOW_VOLUME = 0.12;

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
  out.gain.linearRampToValueAtTime(MEOW_VOLUME, t + 0.04);
  out.gain.setValueAtTime(MEOW_VOLUME, t + m.length * 0.6);
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

// ---- Clack ----------------------------------------------------------------------
//
// Something from the shelf hitting the ground: a short knock that drops in pitch.
// `loud` is 0 to 1, from how hard it landed.

export function clack(loud: number) {
  if (loud < 0.05) return;
  const c = audio();
  const t = c.currentTime;

  const knock = c.createOscillator();
  knock.type = "triangle";
  knock.frequency.setValueAtTime(380 + Math.random() * 120, t);
  knock.frequency.exponentialRampToValueAtTime(120, t + 0.08);

  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.15 * loud, t + 0.004);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  knock.connect(out).connect(c.destination);

  knock.start(t);
  knock.stop(t + 0.12);
}

// ---- Switch ---------------------------------------------------------------------
//
// The desk lamp's switch: a tiny burst of filtered noise (the snap) on top of a
// short knock (the plastic). Clicking it on is a touch higher than clicking it off,
// like a real rocker switch.

export function flick(on: boolean) {
  const c = audio();
  const t = c.currentTime;

  const length = Math.ceil(c.sampleRate * 0.03);
  const noise = c.createBuffer(1, length, c.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 4;
  const snap = c.createBufferSource();
  snap.buffer = noise;
  const crisp = c.createBiquadFilter();
  crisp.type = "bandpass";
  crisp.frequency.value = on ? 3800 : 3000;
  crisp.Q.value = 1.5;
  const snapLevel = c.createGain();
  snapLevel.gain.value = 0.5;
  snap.connect(crisp).connect(snapLevel).connect(c.destination);

  const knock = c.createOscillator();
  knock.type = "triangle";
  knock.frequency.setValueAtTime(on ? 1700 : 1300, t);
  knock.frequency.exponentialRampToValueAtTime(on ? 600 : 450, t + 0.025);
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.12, t + 0.002);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
  knock.connect(out).connect(c.destination);

  snap.start(t);
  knock.start(t);
  knock.stop(t + 0.05);
}

// ---- Cardboard ------------------------------------------------------------------
//
// A carton on the conveyor. Opening it rips the tape (a scratchy burst of noise
// that rises in pitch) and then the flaps flop out; closing it is just the flop: a
// dull thump of low noise and a falling knock.

function noiseBurst(c: AudioContext, seconds: number, crackle: boolean) {
  const length = Math.ceil(c.sampleRate * seconds);
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  let grain = 1;
  for (let i = 0; i < length; i++) {
    // Tape comes off in little jerks: the level jumps around every few ms.
    if (crackle && i % 96 === 0) grain = 0.3 + Math.random() * 0.7;
    data[i] = (Math.random() * 2 - 1) * grain * (1 - i / length) ** (crackle ? 0.6 : 3);
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  return source;
}

export function cardboard(open: boolean) {
  const c = audio();
  const t = c.currentTime;
  let flop = t;

  if (open) {
    const rip = noiseBurst(c, 0.16, true);
    const scratch = c.createBiquadFilter();
    scratch.type = "bandpass";
    scratch.Q.value = 0.9;
    scratch.frequency.setValueAtTime(1800, t);
    scratch.frequency.exponentialRampToValueAtTime(4200, t + 0.16);
    const level = c.createGain();
    level.gain.value = 0.22;
    rip.connect(scratch).connect(level).connect(c.destination);
    rip.start(t);
    flop = t + 0.17;
  }

  const thump = noiseBurst(c, 0.07, false);
  const dull = c.createBiquadFilter();
  dull.type = "lowpass";
  dull.frequency.value = 500;
  const thumpLevel = c.createGain();
  thumpLevel.gain.value = 0.6;
  thump.connect(dull).connect(thumpLevel).connect(c.destination);
  thump.start(flop);

  const knock = c.createOscillator();
  knock.type = "triangle";
  knock.frequency.setValueAtTime(170, flop);
  knock.frequency.exponentialRampToValueAtTime(70, flop + 0.07);
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, flop);
  out.gain.exponentialRampToValueAtTime(0.18, flop + 0.005);
  out.gain.exponentialRampToValueAtTime(0.0001, flop + 0.09);
  knock.connect(out).connect(c.destination);
  knock.start(flop);
  knock.stop(flop + 0.1);
}

// ---- The Victors ----------------------------------------------------------------
//
// The chorus of "The Victors" (Louis Elbel, 1898; public domain), played by a small
// synthesized brass section: the melody, a second horn a third or sixth below it,
// a tuba on beats 1 and 3, short horn chords on 2 and 4, and some reverb so it
// sounds like it's in a stadium.
//
// The melody is from the score in Wikipedia's article on the song, written below
// in E-flat; the chorus is the march's trio, which bands play a fourth higher, in
// A-flat, so everything is shifted up by KEY. The chords under it are mine.

const KEY = 5; // E-flat up to A-flat
const BEAT = 60 / 172;

// [MIDI note, beats]
const hail: [number, number][] = [
  [67, 2], [63, 1], [65, 1], [67, 1], [63, 1], [65, 1], [67, 1], // Hail! to the victors valiant,
  [68, 2], [65, 1], [67, 1], [68, 1], [65, 1], [67, 1], [68, 1], // Hail! to the conquering heroes,
  [70, 2], [72, 1.5], [67, 0.5], [67, 1], [68, 1], [63, 1], [65, 1], // Hail! Hail! to Michigan,
];
const melody: [number, number][] = [
  ...hail,
  [67, 2], [65, 1], [63, 1], [70, 4], // the leaders and best,
  ...hail,
  [67, 1], [70, 1], [67, 1.5], [65, 0.5], [63, 4], // the champions of the West!
];

// Chords: the notes the horns play.
const chords = {
  Eb: [63, 67, 70],
  Bb7: [62, 65, 68, 70],
  Cm: [60, 63, 67],
  Fm7: [63, 65, 68, 72],
};
type Chord = keyof typeof chords;

// The tuba's root and fifth for each chord.
const bass: Record<Chord, [number, number]> = {
  Eb: [39, 46],
  Bb7: [46, 41],
  Cm: [48, 43],
  Fm7: [41, 48],
};

// One chord per half bar (two beats), sixteen bars.
const phrase: Chord[] = ["Eb", "Eb", "Eb", "Eb", "Bb7", "Bb7", "Bb7", "Bb7", "Eb", "Cm", "Eb", "Fm7"];
const progression: Chord[] = [
  ...phrase, "Eb", "Bb7", "Bb7", "Bb7",
  ...phrase, "Eb", "Bb7", "Eb", "Eb",
];

// The second horn: the nearest chord note at least a minor third below the melody.
function harmonyFor(note: number, chord: Chord) {
  let best = note - 3;
  let bestGap = Infinity;
  for (const n of chords[chord]) {
    for (let candidate = n - 24; candidate < note - 2; candidate += 12) {
      const gap = note - candidate;
      if (gap >= 3 && gap < bestGap) {
        best = candidate;
        bestGap = gap;
      }
    }
  }
  return best;
}

// A short, fading burst of noise in stereo, used as the room's echo.
function roomEcho(c: AudioContext) {
  const length = c.sampleRate * 1.6;
  const impulse = c.createBuffer(2, length, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  const verb = c.createConvolver();
  verb.buffer = impulse;
  return verb;
}

let stopCurrent: (() => void) | null = null;

// Starts the song and returns a function that stops it. `onEnd` runs when it
// finishes by itself.
export function playVictors(onEnd: () => void) {
  stopCurrent?.();
  const c = audio();
  const sources: AudioScheduledSourceNode[] = [];

  // band → (dry + echo) → limiter → volume → speakers
  const band = c.createGain();
  band.gain.value = 0.5;
  const limiter = c.createDynamicsCompressor();
  limiter.threshold.value = -12;
  limiter.ratio.value = 6;
  const echo = roomEcho(c);
  const echoLevel = c.createGain();
  echoLevel.gain.value = 0.28;
  band.connect(limiter);
  band.connect(echo).connect(echoLevel).connect(limiter);
  // After the limiter, so turning this down doesn't just make it squash less.
  const volume = c.createGain();
  volume.gain.value = 0.5;
  limiter.connect(volume).connect(c.destination);

  // A brass note: two slightly detuned sawtooths through a filter that opens as
  // the note starts, which is most of what makes synth brass sound like brass.
  function horn(note: number, t: number, length: number, level: number) {
    const f = hz(note + KEY);
    const tone = c.createBiquadFilter();
    tone.type = "lowpass";
    tone.Q.value = 0.8;
    tone.frequency.setValueAtTime(f * 1.2, t);
    tone.frequency.linearRampToValueAtTime(f * 6, t + 0.05);
    tone.frequency.exponentialRampToValueAtTime(f * 3.5, t + Math.min(0.3, length));

    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(level, t + 0.03);
    env.gain.setValueAtTime(level * 0.85, t + Math.min(0.1, length * 0.5));
    env.gain.setValueAtTime(level * 0.85, t + length * 0.82);
    env.gain.linearRampToValueAtTime(0, t + length * 0.95);
    tone.connect(env).connect(band);

    for (const detune of [-7, 7]) {
      const osc = c.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      osc.detune.value = detune;
      osc.connect(tone);
      osc.start(t);
      osc.stop(t + length);
      sources.push(osc);
      // A little vibrato on the long notes, coming in after the attack.
      if (length > 1) {
        const lfo = c.createOscillator();
        const depth = c.createGain();
        lfo.frequency.value = 5.2;
        depth.gain.setValueAtTime(0, t);
        depth.gain.linearRampToValueAtTime(9, t + 0.4);
        lfo.connect(depth).connect(osc.detune);
        lfo.start(t);
        lfo.stop(t + length);
        sources.push(lfo);
      }
    }
  }

  function tuba(note: number, t: number) {
    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = hz(note + KEY);
    const env = c.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.9, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.01, t + BEAT * 0.9);
    osc.connect(env).connect(band);
    osc.start(t);
    osc.stop(t + BEAT);
    sources.push(osc);
  }

  const start = c.currentTime + 0.08;

  // Melody, with the second horn under it.
  let t = start;
  let beat = 0;
  for (const [note, beats] of melody) {
    const chord = progression[Math.floor(beat / 2)];
    horn(note, t, beats * BEAT, 0.32);
    horn(harmonyFor(note, chord), t, beats * BEAT, 0.18);
    t += beats * BEAT;
    beat += beats;
  }
  const end = t;

  // Tuba on 1 and 3 (root, then fifth while the chord holds), horn chords on 2 and 4.
  progression.forEach((chord, half) => {
    const at = start + half * 2 * BEAT;
    const changed = half === 0 || progression[half - 1] !== chord;
    const [root, fifth] = bass[chord];
    tuba(changed || half % 2 === 0 ? root : fifth, at);
    for (const n of chords[chord]) horn(n - 12, at + BEAT, BEAT * 0.45, 0.07);
  });

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    band.gain.setTargetAtTime(0, c.currentTime, 0.03);
    for (const s of sources) {
      try {
        s.stop(c.currentTime + 0.15);
      } catch {
        // already stopped
      }
    }
    // Let the echo die out, then unplug everything.
    setTimeout(() => limiter.disconnect(), 2000);
    if (stopCurrent === stop) stopCurrent = null;
  };

  // A silent source that ends when the last note does, to know when the song is over.
  const timer = c.createConstantSource();
  const silent = c.createGain();
  silent.gain.value = 0;
  timer.connect(silent).connect(c.destination);
  timer.start(start);
  timer.stop(end + 0.4);
  timer.onended = () => {
    if (!stopped) {
      stop();
      onEnd();
    }
  };
  sources.push(timer);

  stopCurrent = stop;
  return stop;
}

// ---- Guitar ---------------------------------------------------------------------
//
// One strummed chord per click, round and round: D, Bm, Em, A7. Each string is a
// Karplus-Strong pluck: a burst of noise fed round a delay line one period long,
// softened a little on every trip, which is about the cheapest way to get something
// that sounds like a string.

// Open-position shapes, low string to high, as MIDI notes.
const strums = [
  [50, 57, 62, 66], // D:  xx0232
  [47, 54, 59, 62, 66], // Bm: x24432
  [40, 47, 52, 55, 59, 64], // Em: 022000
  [45, 52, 55, 61, 64], // A7: x02020
];
export const GUITAR_CHORDS = strums.length;
const STRING_GAP = 0.014; // seconds between strings in one strum
const RING = 2.2; // how long a chord rings if you leave it
const GUITAR_VOLUME = 0.35;

function pluckChord(c: AudioContext, notes: number[]) {
  const sr = c.sampleRate;
  const buffer = c.createBuffer(1, Math.ceil(sr * RING), sr);
  const out = buffer.getChannelData(0);
  notes.forEach((note, s) => {
    const period = Math.round(sr / hz(note));
    const line = new Float32Array(period);
    // Smoothed noise: a pick, not a hammer.
    let prev = 0;
    for (let i = 0; i < period; i++) line[i] = prev = prev * 0.5 + (Math.random() * 2 - 1) * 0.5;
    const offset = Math.round(s * STRING_GAP * sr);
    for (let i = 0, p = 0; offset + i < out.length; i++) {
      const next = (p + 1) % period;
      const y = line[p];
      line[p] = 0.996 * 0.5 * (y + line[next]);
      out[offset + i] += y / notes.length;
      p = next;
    }
  });
  return buffer;
}

let stopRinging: (() => void) | null = null;

// Strums chord `i` and returns a function that stops it. Whatever was still ringing
// is muted first, like changing chords on a real guitar. `onEnd` runs when this
// chord has rung out by itself (not when another one cuts it off).
export function strumChord(i: number, onEnd: () => void) {
  stopRinging?.();
  const c = audio();
  const out = c.createGain();
  out.gain.value = GUITAR_VOLUME;
  out.connect(c.destination);

  const player = c.createBufferSource();
  player.buffer = pluckChord(c, strums[i % strums.length]);
  player.connect(out);
  player.start();
  player.onended = () => {
    if (stopped) return;
    stopped = true;
    out.disconnect();
    if (stopRinging === stop) stopRinging = null;
    onEnd();
  };

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    out.gain.setTargetAtTime(0, c.currentTime, 0.02);
    player.stop(c.currentTime + 0.1);
    setTimeout(() => out.disconnect(), 200);
    if (stopRinging === stop) stopRinging = null;
  };

  stopRinging = stop;
  return stop;
}
