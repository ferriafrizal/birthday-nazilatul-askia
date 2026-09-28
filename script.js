/**
 * ====================================================================
 * WEBSITE SELAMAT ULANG TAHUN: NAZILATUL ASKIA 🎂🌸
 * Dilengkapi Pemutar Musik Instrumen Music Box, Interaksi Kue,
 * Balon Doa, Amplop Surat, & Efek Confetti Partikel.
 * ====================================================================
 */

// --- Web Audio API: Synthesizer Musik Box & Sound FX ---
class CuteMusicBox {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.tempo = 140; // BPM
    this.step = 0;

    // Frekuensi Nada (Hz)
    this.notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'REST': 0
    };

    // Melodi Instrumen "Happy Birthday" (Nada, Durasi dalam beat, Akor Bass pendamping)
    this.score = [
      // "Happy Birthday to you"
      { note: 'G4', dur: 0.75, bass: 'C4' },
      { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 1.0, bass: 'F4' },
      { note: 'G4', dur: 1.0, bass: 'C4' },
      { note: 'C5', dur: 1.0, bass: 'E4' },
      { note: 'B4', dur: 2.0, bass: 'G4' },

      // "Happy Birthday to you"
      { note: 'G4', dur: 0.75, bass: 'G4' },
      { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 1.0, bass: 'F4' },
      { note: 'G4', dur: 1.0, bass: 'G4' },
      { note: 'D5', dur: 1.0, bass: 'F4' },
      { note: 'C5', dur: 2.0, bass: 'C4' },

      // "Happy Birthday dear Nazilatul Askia"
      { note: 'G4', dur: 0.75, bass: 'C4' },
      { note: 'G4', dur: 0.25 },
      { note: 'G5', dur: 1.0, bass: 'E4' },
      { note: 'E5', dur: 1.0, bass: 'C4' },
      { note: 'C5', dur: 1.0, bass: 'A4' },
      { note: 'B4', dur: 1.0, bass: 'F4' },
      { note: 'A4', dur: 1.5, bass: 'D4' },

      // "Happy Birthday to you!"
      { note: 'F5', dur: 0.75, bass: 'F4' },
      { note: 'F5', dur: 0.25 },
      { note: 'E5', dur: 1.0, bass: 'C4' },
      { note: 'C5', dur: 1.0, bass: 'G4' },
      { note: 'D5', dur: 1.0, bass: 'G4' },
      { note: 'C5', dur: 2.5, bass: 'C4' },

      // Jeda lembut sebelum loop
      { note: 'REST', dur: 1.0 }
    ];
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Menghasilkan bunyi denting instrumen kotak musik (music box bell chime)
  playChime(freq, time, duration = 1.2, volume = 0.25) {
    if (!freq || freq === 0) return;

    // Oscillator 1: Fundamental Sine Wave (Nada Dasar Bersih)
    const osc1 = this.audioCtx.createOscillator();
    const gain1 = this.audioCtx.createGain();

    // Oscillator 2: Sweet Overtone (Karakter Lonceng Logam Kalimba/Kotak Musik)
    const osc2 = this.audioCtx.createOscillator();
    const gain2 = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, time); // Subtle harmonic sparkle

    // Envelope Attack & Long Sweet Decay
    gain1.gain.setValueAtTime(0, time);
    gain1.gain.linearRampToValueAtTime(volume, time + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    gain2.gain.setValueAtTime(0, time);
    gain2.gain.linearRampToValueAtTime(volume * 0.35, time + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.6);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.audioCtx.destination);
    gain2.connect(this.audioCtx.destination);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;
    this.playLoop();
  }

  playLoop() {
    if (!this.isPlaying) return;

    const item = this.score[this.step];
    const beatDuration = (60 / this.tempo) * 1000;
    const itemDurationMs = item.dur * beatDuration;
    const now = this.audioCtx.currentTime;

    const noteFreq = this.notes[item.note] || 0;
    if (noteFreq > 0) {
      this.playChime(noteFreq, now, item.dur * 1.5, 0.22);
    }

    // Mainkan nada bass lembut jika ada
    if (item.bass) {
      const bassFreq = this.notes[item.bass] || 0;
      if (bassFreq > 0) {
        this.playChime(bassFreq, now, 1.8, 0.12);
      }
    }

    this.step = (this.step + 1) % this.score.length;

    this.timerId = setTimeout(() => {
      this.playLoop();
    }, itemDurationMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // SFX Khusus: Buka Kado (Sparkle Glissando)
  playGiftOpenSound() {
    this.init();
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C6
    chord.forEach((freq, idx) => {
      this.playChime(freq, this.audioCtx.currentTime + idx * 0.08, 1.0, 0.2);
    });
  }

  // SFX Khusus: Tiup Lilin (Whoosh + Tinkle)
  playBlowCandleSound() {
    this.init();
    const chord = [783.99, 880.00, 1046.50];
    chord.forEach((freq, idx) => {
      this.playChime(freq, this.audioCtx.currentTime + idx * 0.1, 1.5, 0.25);
    });
  }

  // SFX Khusus: Balon Pecah
  playPopSound() {
    this.init();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const time = this.audioCtx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.13);

    // High sparkle chime
    this.playChime(1046.50, time + 0.05, 0.6, 0.15);
  }
}

// Inisialisasi Player Musik
const musicBox = new CuteMusicBox();

// --- DOM ELEMENTS ---
const musicPill = document.getElementById('musicPill');
const discIcon = document.getElementById('discIcon');
const musicStatus = document.getElementById('musicStatus');
const musicBtnIcon = document.getElementById('musicBtnIcon');
const musicToggleBtn = document.getElementById('musicToggleBtn');

const giftScreen = document.getElementById('giftScreen');
const giftBox = document.getElementById('giftBox');
const openGiftBtn = document.getElementById('openGiftBtn');
const mainParty = document.getElementById('mainParty');

const blowCandleBtn = document.getElementById('blowCandleBtn');
const relightCandleBtn = document.getElementById('relightCandleBtn');
const cakeInstruction = document.getElementById('cakeInstruction');

const envelope = document.getElementById('envelope');
const fireworksBtn = document.getElementById('fireworksBtn');

// --- EVENT: TOGGLE MUSIK INSTRUMEN ---
function toggleMusic() {
  if (!musicBox.isPlaying) {
    musicBox.start();
    discIcon.classList.add('playing');
    musicStatus.textContent = 'Memutar Musik Ceria 🎵';
    musicBtnIcon.textContent = '⏸️';
  } else {
    musicBox.stop();
    discIcon.classList.remove('playing');
    musicStatus.textContent = 'Musik Dijeda';
    musicBtnIcon.textContent = '▶️';
  }
}

musicPill.addEventListener('click', toggleMusic);
musicToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMusic();
});

// --- CONFETTI HELPERS ---
function triggerConfettiBurst() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff8fab', '#fb6f92', '#ffd166', '#a2d2ff', '#bde0fe']
    });
  }
}

function triggerGrandFireworks() {
  if (typeof confetti === 'function') {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#ff8fab', '#fb6f92', '#ffd166', '#c1fba4', '#d8bbff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// --- EVENT: BUKA KADO KEJUTAN (OPEN GIFT) ---
function openSurpriseGift() {
  musicBox.playGiftOpenSound();
  triggerGrandFireworks();

  // Buka tutup kado
  const giftLid = document.querySelector('.gift-lid');
  if (giftLid) {
    giftLid.style.transform = 'translateY(-60px) rotate(-15deg)';
  }

  // Mulai memutar musik instrumen otomatis setelah interaksi pengguna
  setTimeout(() => {
    if (!musicBox.isPlaying) {
      musicBox.start();
      discIcon.classList.add('playing');
      musicStatus.textContent = 'Memutar Musik Ceria 🎵';
      musicBtnIcon.textContent = '⏸️';
    }

    // Transisi mulus ke Main Party
    giftScreen.classList.add('fade-out');
    setTimeout(() => {
      giftScreen.classList.add('hidden');
      mainParty.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  }, 400);
}

giftBox.addEventListener('click', openSurpriseGift);
openGiftBtn.addEventListener('click', openSurpriseGift);

// --- EVENT: TIUP LILIN & NYALAKAN LAGI ---
const flames = [
  document.getElementById('flame1'),
  document.getElementById('flame2'),
  document.getElementById('flame3')
];
const smokes = [
  document.getElementById('smoke1'),
  document.getElementById('smoke2'),
  document.getElementById('smoke3')
];

blowCandleBtn.addEventListener('click', () => {
  musicBox.playBlowCandleSound();
  
  // Padamkan api lilin
  flames.forEach(flame => flame.classList.add('blown-out'));
  
  // Aktifkan efek kepulan asap imut
  smokes.forEach(smoke => {
    smoke.classList.add('active');
    setTimeout(() => smoke.classList.remove('active'), 1600);
  });

  // Hujan confetti meriah
  triggerGrandFireworks();

  cakeInstruction.innerHTML = '✨ <strong>Horeee! Permohonan Askia pasti terkabul!</strong> 🎉💖';
  blowCandleBtn.classList.add('hidden');
  relightCandleBtn.classList.remove('hidden');
});

relightCandleBtn.addEventListener('click', () => {
  flames.forEach(flame => flame.classList.remove('blown-out'));
  cakeInstruction.textContent = 'Sentuh tombol untuk meniup lilinnya dan sampaikan permohonanmu!';
  relightCandleBtn.classList.add('hidden');
  blowCandleBtn.classList.remove('hidden');
  triggerConfettiBurst();
});

// --- EVENT: PECAHKAN BALON DOA (WISH BALLOONS) ---
const balloonItems = document.querySelectorAll('.balloon-item');

balloonItems.forEach(item => {
  item.addEventListener('click', () => {
    const balloon = item.querySelector('.balloon');
    const wishReveal = item.querySelector('.wish-reveal');
    const wishText = item.getAttribute('data-wish');

    // Jika belum dipecahkan
    if (!wishReveal.classList.contains('active')) {
      musicBox.playPopSound();
      triggerConfettiBurst();

      // Animasi letusan balon
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      balloon.style.transition = 'all 0.25s ease-out';

      setTimeout(() => {
        balloon.style.display = 'none';
        wishReveal.textContent = wishText;
        wishReveal.classList.remove('hidden');
        wishReveal.classList.add('active');
      }, 250);
    }
  });
});

// --- EVENT: AMPLOP SURAT KASIH SAYANG (ENVELOPE) ---
envelope.addEventListener('click', () => {
  if (!envelope.classList.contains('open')) {
    envelope.classList.add('open');
    musicBox.playGiftOpenSound();
    triggerConfettiBurst();
  }
});

// --- EVENT: KEMBANG API CINTA (FOOTER BUTTON) ---
fireworksBtn.addEventListener('click', () => {
  musicBox.playGiftOpenSound();
  triggerGrandFireworks();
});

// --- EVENT: LIGHTBOX PREVIEW FOTO POLAROID & AVATAR ---
const photoModal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBackdrop = document.getElementById('modalBackdrop');
const heroAvatar = document.getElementById('heroAvatar');
const polaroidCards = document.querySelectorAll('.polaroid-card');

function openPhotoLightbox(src, caption) {
  modalImg.src = src;
  modalCaption.textContent = caption;
  photoModal.classList.remove('hidden');
  musicBox.playGiftOpenSound();
}

function closePhotoLightbox() {
  photoModal.classList.add('hidden');
}

polaroidCards.forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-src');
    const caption = card.getAttribute('data-caption');
    if (src) openPhotoLightbox(src, caption);
  });
});

if (heroAvatar) {
  heroAvatar.addEventListener('click', () => {
    openPhotoLightbox('images/askia-cantik.jpg', '👑 Nazilatul Askia - Adik Tercinta yang Berulang Tahun 🌸✨');
  });
}

modalCloseBtn.addEventListener('click', closePhotoLightbox);
modalBackdrop.addEventListener('click', closePhotoLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !photoModal.classList.contains('hidden')) {
    closePhotoLightbox();
  }
});

// --- EXTRA: KLIK LAYAR UNTUK MUNCULKAN HATI KECIL (LOVE PARTICLES) ---
document.addEventListener('click', (e) => {
  // Hanya buat partikel jika bukan klik tombol atau modal
  if (e.target.closest('button') || e.target.closest('.balloon-item') || e.target.closest('.lightbox-content') || e.target.closest('.polaroid-card')) return;

  const heart = document.createElement('span');
  heart.textContent = ['💖', '✨', '🌸', '🎀'][Math.floor(Math.random() * 4)];
  heart.style.position = 'fixed';
  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;
  heart.style.fontSize = '1.4rem';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
  heart.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -80px) scale(1.4) rotate(${Math.random() * 40 - 20}deg)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 800);
});
