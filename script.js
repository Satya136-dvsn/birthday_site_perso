/* ==========================================================================
   GATE SYSTEM — Countdown + Passcode
   ========================================================================== */

(function () {
    const UNLOCK_DATE = new Date('2026-07-22T00:00:00'); // July 22, 2026 midnight
    const PASSCODE    = '2207';

    const countdownGate = document.getElementById('countdown-gate');
    const passcodeGate  = document.getElementById('passcode-gate');
    const errorMsg      = document.getElementById('passcode-error');
    const dots          = [
        document.getElementById('dot-1'),
        document.getElementById('dot-2'),
        document.getElementById('dot-3'),
        document.getElementById('dot-4'),
    ];

    let entered = '';

    // ── Check which gate to show ──────────────────────────────────────────
    function checkGate() {
        const now = new Date();
        if (now < UNLOCK_DATE) {
            // Before birthday — show countdown
            countdownGate.classList.remove('hidden');
            passcodeGate.classList.add('hidden');
            startCountdown();
        } else {
            // Birthday day or after — show passcode
            countdownGate.classList.add('hidden');
            passcodeGate.classList.remove('hidden');
        }
    }

    // ── Live countdown ticker ─────────────────────────────────────────────
    function startCountdown() {
        function tick() {
            const diff = UNLOCK_DATE - new Date();
            if (diff <= 0) {
                // Time's up — switch to passcode gate without page reload
                countdownGate.classList.add('hidden');
                passcodeGate.classList.remove('hidden');
                return;
            }
            const d  = Math.floor(diff / 86400000);
            const h  = Math.floor((diff % 86400000) / 3600000);
            const m  = Math.floor((diff % 3600000) / 60000);
            const s  = Math.floor((diff % 60000) / 1000);
            document.getElementById('cd-days').textContent  = String(d).padStart(2, '0');
            document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
            document.getElementById('cd-mins').textContent  = String(m).padStart(2, '0');
            document.getElementById('cd-secs').textContent  = String(s).padStart(2, '0');
            setTimeout(tick, 1000);
        }
        tick();
    }

    // ── Passcode numpad logic ─────────────────────────────────────────────
    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.remove('filled', 'error');
            if (i < entered.length) dot.classList.add('filled');
        });
    }

    function shakeError() {
        dots.forEach(dot => {
            dot.classList.remove('filled');
            dot.classList.add('error');
        });
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            entered = '';
            dots.forEach(dot => dot.classList.remove('error'));
            updateDots();
        }, 800);
    }

    function tryUnlock() {
        if (entered === PASSCODE) {
            // Correct! — beautiful fade-out then reveal the site
            passcodeGate.classList.add('unlocking');
            setTimeout(() => {
                passcodeGate.classList.add('hidden');
                passcodeGate.classList.remove('unlocking');
            }, 800);
        } else {
            shakeError();
        }
    }

    document.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const n      = btn.dataset.n;
            const action = btn.dataset.action;

            if (action === 'clear') {
                entered = entered.slice(0, -1);
                errorMsg.classList.add('hidden');
                updateDots();
            } else if (action === 'enter') {
                tryUnlock();
            } else if (n !== undefined && entered.length < 4) {
                entered += n;
                updateDots();
                // Auto-submit when 4 digits entered
                if (entered.length === 4) {
                    setTimeout(tryUnlock, 200);
                }
            }
        });
    });

    // ── Dev bypass: ?preview=true skips all gates ────────────────────────
    const DEV_BYPASS = new URLSearchParams(window.location.search).get('preview') === 'true';

    // Run gate check on load
    if (DEV_BYPASS) {
        // Skip everything — hide both gates immediately
        countdownGate.classList.add('hidden');
        passcodeGate.classList.add('hidden');
    } else {
        checkGate();
    }
    // Canvas sakura petals + bokeh (z-index: 1100) already drift over the gate naturally ✨
})();

/* ==========================================================================
   STATE MANAGEMENT & CONFIGURATION
   ========================================================================== */
const STATE = {
    audioInitialized: false,
    candlesLit: [true, true, true],
    currentSceneIndex: 0,
    musicPlaying: false,
    wishesReleased: 0
};

// Scenes in chronological order
const SCENES = [
    'welcome-section',
    'cake-section',
    'letter-section',
    'gallery-section',
    'wish-section'
];

// Polaroid Diary Data
const DIARY_DATA = [
    {
        title: "Where it all began...",
        date: "June 12, 2012",
        desc: "The playground where we first met. We were both so shy, but we ended up spending hours on these wooden swings arguing about who could go higher. Who knew that swing set would be the start of a lifetime of laughter? 🌅",
        image: "assets/memory_swings.png"
    },
    {
        title: "Chasing shooting stars",
        date: "August 18, 2016",
        desc: "Lying on a blanket on the grassy hill, counting shooting stars. We talked about what we wanted to be when we grew up, making a silent pact that no matter where life took us, we'd always stargaze together. 💫",
        image: "assets/memory_stargazing.png"
    },
    {
        title: "Cake & endless gossips",
        date: "September 03, 2021",
        desc: "Sharing giant slices of strawberry cake at that cozy little corner cafe. You always eat the cherries first, and I always steal the frosting when you aren't looking. Simple moments that feel like home. 🍰",
        image: "assets/memory_cafe.png"
    },
    {
        title: "Secrets locked forever",
        date: "October 14, 2024",
        desc: "Our old notebook of promises, doodles, and silly inside jokes that make zero sense to anyone else. It's safe to say our secrets are locked forever in our memory vaults. 🔐",
        image: "assets/memory_notebook.png"
    },
    {
        title: "Picnic on the hill",
        date: "May 08, 2025",
        desc: "Spent a sunny afternoon on the hillside picnic. Surrounded by wild daisies and sweet strawberries, we laughed so hard our ribs hurt just telling the silliest stories. 🌸",
        image: "assets/memory_picnic.png"
    },
    {
        title: "Dancing in the rain",
        date: "July 22, 2025",
        desc: "Got completely caught in an unexpected summer downpour without an umbrella! Instead of running, we just danced under the warm street lamps, soaked to the bone and completely happy. ☔",
        image: "assets/memory_rain.png"
    },
    {
        title: "Golden hour forever",
        date: "August 30, 2025",
        desc: "Sitting quietly on the warm sand watching the beach sunset. As the sky turned a million shades of pink and orange, we promised to always chase these golden moments together. 🌊",
        image: "assets/memory_beach.png"
    },
    {
        title: "Our favourite corner",
        date: "November 11, 2025",
        desc: "Tucked away in the quiet library corner, sharing one book under fairy lights. We whispered so many jokes and got shushed by the librarian at least three times! 📚",
        image: "assets/memory_library.png"
    },
    {
        title: "Cozy campfire nights",
        date: "December 24, 2025",
        desc: "Gathered around a crackling campfire, roasting marshmallows and wrapping ourselves in thick blankets. Singing acoustic songs off-key and talking about the future under a canopy of sparks. 🔥",
        image: "assets/memory_campfire.png"
    },
    {
        title: "First winter snow",
        date: "January 15, 2026",
        desc: "Waking up to a world completely covered in pristine white snow. We ran outside like kids, built a tiny snowman, and then warmed up with extra large mugs of hot chocolate topped with marshmallows. ❄️",
        image: "assets/memory_snow.png"
    },
    {
        title: "Rooftop stargazing",
        date: "March 21, 2026",
        desc: "Sneaking up to the rooftop after midnight with a box of hot pizza. The city lights stretched out below us like a second galaxy, and we sat on the edge whispering our hopes for the years ahead. 🍕",
        image: "assets/memory_rooftop.png"
    },
    {
        title: "Sunset on the hill",
        date: "April 05, 2026",
        desc: "Running up the grassy hill just in time to catch the sun dipping below the horizon. As the orange sky faded into a warm purple twilight, we agreed that some of the best moments are the simplest ones. 🌅",
        image: "assets/memory_sunset_hill.png"
    }
];


/* ==========================================================================
   AMBIENT BACKGROUND & SPARKLE CANVAS
   ========================================================================== */
const ambientCanvas = document.getElementById('ambient-canvas');
const ctx = ambientCanvas.getContext('2d');

let particles = [];
let mouseTrail = [];
let width = (ambientCanvas.width = window.innerWidth);
let height = (ambientCanvas.height = window.innerHeight);

// Resize handling
window.addEventListener('resize', () => {
    width = ambientCanvas.width = window.innerWidth;
    height = ambientCanvas.height = window.innerHeight;
});


// Particle Base Class
class DreamParticle {
    constructor() {
        this.reset();
        // Disperse fully on initialization
        this.y = Math.random() * height;
        this.x = Math.random() * width;
    }

    reset() {
        this.x = Math.random() * width;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.008 - 0.004;
        
        // 40% chance to be a subtle sakura petal, 60% chance to be dreamy bokeh light
        if (Math.random() < 0.40) {
            this.type = 'sakura';
            this.size = Math.random() * 6 + 4; // slightly varied petal size
            this.speedY = Math.random() * 0.5 + 0.2; // drifting down gracefully
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.5 + 0.2; 
            
            // Start above screen
            this.y = -this.size - 20; 
        } else {
            this.type = 'bokeh';
            this.size = Math.random() * 60 + 40; // large, soft out-of-focus orbs
            this.speedY = (Math.random() - 0.5) * 0.25; // slow drift
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.opacity = Math.random() * 0.15 + 0.05; // very faint
            
            // Warm dreamy cinematic tones
            const colors = [
                '255, 240, 245', // Lavender blush
                '255, 228, 225', // Misty rose
                '253, 245, 230', // Old lace
                '230, 230, 250'  // Lavender
            ];
            this.colorRGB = colors[Math.floor(Math.random() * colors.length)];
            
            // Slow pulse
            this.pulseSpeed = Math.random() * 0.008 + 0.004;
            this.pulsePhase = Math.random() * Math.PI * 2;
            
            // Start off-screen based on direction
            if (this.speedY > 0) {
                this.y = -this.size - 20; // moving down, start top
            } else {
                this.y = height + this.size + 20; // moving up, start bottom
            }
        }
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.type === 'bokeh') {
            this.pulsePhase += this.pulseSpeed;
        }
        
        // Reset when moving fully off screen vertically
        if ((this.speedY > 0 && this.y > height + this.size + 20) || 
            (this.speedY < 0 && this.y < -this.size - 20)) {
            this.reset();
        }
        
        // Wrap around gently horizontally
        if (this.x > width + this.size + 20) this.x = -this.size;
        if (this.x < -this.size - 20) this.x = width + this.size;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 'sakura') {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#FFB6C1'; // Soft pink petal
            ctx.beginPath();
            // Subtle, elegant petal shape
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(this.size, -this.size, this.size, this.size * 0.5, 0, this.size);
            ctx.bezierCurveTo(-this.size, this.size * 0.5, -this.size, -this.size, 0, -this.size);
            ctx.fill();
        } else if (this.type === 'bokeh') {
            // Elegant slow pulsing opacity
            const currentOpacity = Math.max(0, this.opacity + Math.sin(this.pulsePhase) * 0.08);
            if (currentOpacity > 0) {
                // Soft radial gradient for out-of-focus bokeh look
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
                grad.addColorStop(0, `rgba(${this.colorRGB}, ${currentOpacity})`);
                grad.addColorStop(0.5, `rgba(${this.colorRGB}, ${currentOpacity * 0.5})`);
                grad.addColorStop(1, `rgba(${this.colorRGB}, 0)`);
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
}

// Initialize Background Particles
for (let i = 0; i < 90; i++) { // Much denser to make the page look full and magical
    particles.push(new DreamParticle());
}

// Canvas Loop
function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

/* ==========================================================================
   DREAMY SOUNDTRACK ENGINE (WEB AUDIO API SYNTH)
   ========================================================================== */
let audioCtx = null;
let delayNode = null;
let feedbackNode = null;
let masterVolume = null;

// Warm Lofi Chord Chords: [Cmaj7, Fmaj7, Am9, G6]
const CHORDS = [
    [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
    [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4
    [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
    [196.00, 246.94, 293.66, 329.63]  // G3, B3, D4, E4
];

const BELL_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // Pentatonic

function initAudioSystem() {
    if (STATE.audioInitialized) return;
    
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master Volume
        masterVolume = audioCtx.createGain();
        masterVolume.gain.setValueAtTime(0.08, audioCtx.currentTime); // Soft background level
        
        // Spacey Delay & Feedback
        delayNode = audioCtx.createDelay(1.0);
        delayNode.delayTime.setValueAtTime(0.4, audioCtx.currentTime);
        
        feedbackNode = audioCtx.createGain();
        feedbackNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        
        // Connect nodes
        delayNode.connect(feedbackNode);
        feedbackNode.connect(delayNode);
        
        masterVolume.connect(audioCtx.destination);
        delayNode.connect(masterVolume);
        
        STATE.audioInitialized = true;
        STATE.musicPlaying = true; // Critical: Must be true for loops to execute
        
        // Update UI button to reflect playing state
        const wave = document.getElementById('music-wave');
        if (wave) wave.classList.add('playing');
        const toggle = document.getElementById('music-toggle');
        if (toggle) toggle.setAttribute('title', 'Pause music');
        
        // Start continuous music loop
        startChordLoop();
        startBellLoop();
    } catch (e) {
        console.warn("Failed to initialize audio system:", e);
        STATE.audioInitialized = false;
    }
}

// Soft Analog Pad Chord Synthesizer
function playPadChord(frequencies, duration = 6) {
    try {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        frequencies.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'triangle'; // mellow wave
            osc.frequency.setValueAtTime(freq, now);
            
            // Slow swell attack & long decay
            gainNode.gain.setValueAtTime(0.001, now);
            gainNode.gain.linearRampToValueAtTime(0.05, now + 2.0); // Slow fade-in
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Long fade-out
            
            osc.connect(gainNode);
            if (masterVolume) gainNode.connect(masterVolume);
            
            osc.start(now);
            osc.stop(now + duration + 0.1);
        });
    } catch (e) {
        console.warn("Failed to play pad chord:", e);
    }
}

// Gentle Windchime Star Bell Synthesizer
function playBellNote(frequency) {
    try {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine'; // pure round tone
        osc.frequency.setValueAtTime(frequency, now);
        
        // Extremely fast strike attack & immediate decay
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        
        osc.connect(gainNode);
        
        // Connect to both Master out and Delay loop for spacey echoes
        if (masterVolume) gainNode.connect(masterVolume);
        if (delayNode) gainNode.connect(delayNode);
        
        osc.start(now);
        osc.stop(now + 1.6);
    } catch (e) {
        console.warn("Failed to play bell note:", e);
    }
}

// Endless loops
let chordIndex = 0;
function startChordLoop() {
    try {
        if (!STATE.musicPlaying) return;
        
        const chord = CHORDS[chordIndex];
        playPadChord(chord, 6);
        chordIndex = (chordIndex + 1) % CHORDS.length;
        
        // Repeat every 5.5 seconds for seamless overlay crossfades
        setTimeout(startChordLoop, 5500);
    } catch (e) {
        console.warn("Error in chord loop:", e);
    }
}

function startBellLoop() {
    try {
        if (!STATE.musicPlaying) return;
        
        // Play a bell note randomly from pentatonic scale
        const note = BELL_SCALE[Math.floor(Math.random() * BELL_SCALE.length)];
        playBellNote(note);
        
        // Random timing interval for cozy organic windchime behavior
        const nextInterval = Math.random() * 1500 + 1200;
        setTimeout(startBellLoop, nextInterval);
    } catch (e) {
        console.warn("Error in bell loop:", e);
    }
}



// Attempt to start audio immediately (may be blocked by browser autoplay policy)
setTimeout(() => {
    if (!STATE.audioInitialized) initAudioSystem();
}, 500);

// Global fallback: start audio on the very first user interaction (click or touch)
const startAudioOnInteract = () => {
    if (!STATE.audioInitialized) {
        initAudioSystem();
    }
    // Remove the listener after the first interaction
    document.removeEventListener('click', startAudioOnInteract);
    document.removeEventListener('touchstart', startAudioOnInteract);
};
document.addEventListener('click', startAudioOnInteract, { once: true });
document.addEventListener('touchstart', startAudioOnInteract, { once: true });

// Toggle sound control
const musicToggle = document.getElementById('music-toggle');
const musicWave = document.getElementById('music-wave');

musicToggle.addEventListener('click', () => {
    if (!STATE.audioInitialized) {
        initAudioSystem();
    }
    
    if (STATE.musicPlaying) {
        // Mute
        masterVolume.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        STATE.musicPlaying = false;
        musicWave.classList.remove('playing');
        musicToggle.setAttribute('title', 'Play soft music');
    } else {
        // Unmute/Resume
        audioCtx.resume();
        STATE.musicPlaying = true;
        masterVolume.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.5);
        musicWave.classList.add('playing');
        musicToggle.setAttribute('title', 'Pause music');
        
        // Start loops
        startChordLoop();
        startBellLoop();
    }
});

/* ==========================================================================
   SCENE NAVIGATION SYSTEM
   ========================================================================== */
function showScene(sceneId) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    
    // Show current scene
    const targetScene = document.getElementById(sceneId);
    if (targetScene) {
        targetScene.classList.add('active');
        // Mic blow detection is now started only via the dedicated Blow button
    }
}

// Scene navigations
document.getElementById('unwrap-btn').addEventListener('click', () => {
    showScene('cake-section');
});

document.getElementById('next-to-letter').addEventListener('click', () => {
    showScene('letter-section');
});

document.getElementById('next-to-gallery').addEventListener('click', () => {
    letterCard.classList.remove('visible');
    letterCard.classList.add('hidden');
    letterBackdrop.classList.remove('visible');
    currentScrapbookPage = 1;
    renderScrapbookCard(1);
    document.getElementById('current-page-num').textContent = '1';
    document.getElementById('prev-page-btn').disabled = true;
    document.getElementById('next-page-btn').disabled = false;
    showScene('gallery-section');
});

// Transition from Star Constellation Map to Wish Jar
document.getElementById('next-to-wish').addEventListener('click', () => {
    showScene('wish-section');
});

// Welcome Screen Typing Animation
const typingElement = document.getElementById('welcome-typing');
const welcomeMsg = "I wanted to make something special for you this year... Let's unwrap it, shall we?";
let typingIdx = 0;

function typeWelcomeMessage() {
    if (typingIdx < welcomeMsg.length) {
        typingElement.textContent += welcomeMsg.charAt(typingIdx);
        typingIdx++;
        setTimeout(typeWelcomeMessage, 50);
    }
}
// Start typing slightly after page loads
setTimeout(typeWelcomeMessage, 800);

/* ==========================================================================
   SECTION 2: CAKE CANDLE BLOW INTERACTION
   ========================================================================== */
const flames      = document.querySelectorAll('.flame');
const candles     = document.querySelectorAll('.candle');
const cakeSuccessMsg = document.getElementById('cake-success-msg');
const blowBtn     = document.getElementById('blow-btn');
const lightBtn    = document.getElementById('light-btn');

// Start: all candles unlit (blown-out class already in HTML)
// STATE.candlesLit starts [false, false, false] until lit
STATE.candlesLit = [false, false, false];

// ── Light Candles button ──
lightBtn.addEventListener('click', () => {
    if (!STATE.audioInitialized) initAudioSystem();

    // Light each flame with slight stagger
    flames.forEach((flame, i) => {
        setTimeout(() => {
            flame.classList.remove('blown-out', 'extinguished');
            flame.classList.add('lighting');
            STATE.candlesLit[i] = true;

            // After lightUp animation, switch to normal flicker
            setTimeout(() => {
                flame.classList.remove('lighting');
            }, 460);
        }, i * 160);
    });

    // Swap buttons after all lit — give candles time to shine
    setTimeout(() => {
        lightBtn.classList.add('hidden');
        blowBtn.classList.remove('hidden');
        document.getElementById('cake-instruction').textContent =
            'Make a wish in your heart… then blow out the candles! 💨';
    }, flames.length * 160 + 500);
});

// ── Blow button — extinguish ALL candles at once ──
blowBtn.addEventListener('click', () => {
    if (!STATE.candlesLit.some(lit => lit)) return; // nothing to blow

    if (!STATE.audioInitialized) initAudioSystem();

    // Blow out all lit candles with tiny stagger for natural look
    flames.forEach((flame, i) => {
        if (STATE.candlesLit[i]) {
            setTimeout(() => extinguishCandle(i), i * 80);
        }
    });
});

// Individual candle click (tap a single candle)
candles.forEach((candle, index) => {
    candle.addEventListener('click', () => {
        if (STATE.candlesLit[index]) extinguishCandle(index);
    });
});

function extinguishCandle(index) {
    if (!STATE.candlesLit[index]) return;
    STATE.candlesLit[index] = false;

    const flame = flames[index];
    flame.classList.remove('lighting');
    flame.classList.add('blown-out');

    // After animation, lock it into extinguished state (slowed down)
    setTimeout(() => {
        flame.classList.remove('blown-out');
        flame.classList.add('extinguished');
    }, 1200);

    // Audio removed for extinguish action as per user request
    
    // Check if ALL candles are out
    if (STATE.candlesLit.every(lit => !lit)) {
        setTimeout(triggerCakeSuccess, 1200); // Wait for the 1.2s slow fade-out CSS animation
    }
}

// Confetti blast on candle blowout
function triggerConfetti() {
    const confettiCount = 80;
    const colors = ['#FFC0CB', '#FFF0F5', '#FFE4E1', '#FFF7C2', '#E0B0FF'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random styles
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.width = Math.random() * 8 + 6 + 'px';
        confetti.style.height = Math.random() * 12 + 8 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Animation params (very slow, dreamy fall)
        const duration = Math.random() * 6 + 6; // 6 to 12 seconds
        confetti.style.animation = `fallConfetti ${duration}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        // Clean up
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Inject confetti CSS dynamically
const confettiStyle = document.createElement('style');
confettiStyle.innerHTML = `
.confetti-piece {
    position: fixed;
    z-index: 150;
    pointer-events: none;
}
@keyframes fallConfetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
}
`;
document.head.appendChild(confettiStyle);

function triggerCakeSuccess() {
    
    // Hide instructions and controls to free vertical space
    const instructionEl = document.getElementById('cake-instruction');
    if (instructionEl) instructionEl.classList.add('hidden');
    
    const controlsEl = document.querySelector('.cake-controls');
    if (controlsEl) controlsEl.classList.add('hidden');
    
    // Audio is already running from the blowBtn/lightBtn interactions,
    // so we let the background music continue seamlessly.
    
    try {
        triggerConfetti();
    } catch (confettiError) {
        console.warn("Confetti trigger bypassed:", confettiError);
    }
    
    // Display celebration pane
    if (cakeSuccessMsg) {
        cakeSuccessMsg.classList.remove('hidden');
        cakeSuccessMsg.classList.add('show');
    }
    
    // Scale down cake container to fit smaller heights and make button visible
    const cakeContainer = document.querySelector('.cake-container');
    if (cakeContainer) {
        cakeContainer.classList.add('success');
    }
}

/* ==========================================================================
   SECTION 3: THE WAX-SEALED LETTER
   ========================================================================== */
const waxSeal = document.getElementById('wax-seal');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const letterReadPrompt = document.getElementById('letter-read-prompt');

/* --- Floating symbols background for letter section --- */
const LETTER_SYMBOLS = ['🤍', '💌', '✨', '⭐', '🌸', '💫', '🌟', '✦', '♡', '❀', '🕊️', '💕'];
let letterFloatInterval = null;

function createLetterFloater() {
    const el = document.createElement('div');
    el.className = 'letter-floater';
    el.textContent = LETTER_SYMBOLS[Math.floor(Math.random() * LETTER_SYMBOLS.length)];

    const startX = Math.random() * 96 + 2; // 2–98 vw
    const duration = Math.random() * 8 + 10; // 10–18 s
    const size = Math.random() * 1.0 + 0.65; // 0.65–1.65 rem
    const drift = (Math.random() - 0.5) * 80; // horizontal drift px

    el.style.cssText = `
        position: fixed;
        left: ${startX}vw;
        bottom: -60px;
        font-size: ${size}rem;
        opacity: 0;
        pointer-events: none;
        z-index: 0;
        user-select: none;
        will-change: transform, opacity;
        animation: letterFloatUp ${duration}s ease-in forwards;
        --drift: ${drift}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
}

// Inject floater keyframes
const letterFloatStyle = document.createElement('style');
letterFloatStyle.innerHTML = `
@keyframes letterFloatUp {
    0%   { transform: translateY(0) translateX(0) rotate(0deg);        opacity: 0; }
    8%   { opacity: 0.75; }
    85%  { opacity: 0.55; }
    100% { transform: translateY(-115vh) translateX(var(--drift)) rotate(25deg); opacity: 0; }
}
.letter-floater { filter: drop-shadow(0 2px 6px rgba(220,150,170,0.25)); }
`;
document.head.appendChild(letterFloatStyle);

function startLetterFloaters() {
    if (letterFloatInterval) return;
    // Seed a few immediately
    for (let i = 0; i < 5; i++) {
        setTimeout(createLetterFloater, i * 600);
    }
    letterFloatInterval = setInterval(createLetterFloater, 1400);
}

function stopLetterFloaters() {
    clearInterval(letterFloatInterval);
    letterFloatInterval = null;
}

// Hook into showScene to start/stop floaters
const _origShowScene = showScene;
// patch: track when letter section opens/closes
const _letterSectionObserver = new MutationObserver(() => {
    const letterActive = document.getElementById('letter-section').classList.contains('active');
    if (letterActive) {
        startLetterFloaters();
    } else {
        stopLetterFloaters();
    }
});
_letterSectionObserver.observe(document.getElementById('letter-section'), { attributes: true, attributeFilter: ['class'] });

const envelopeStage = document.getElementById('envelope-stage');
const letterCard     = document.getElementById('letter-card');
const letterBackdrop = document.getElementById('letter-backdrop');

waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    if (waxSeal.classList.contains('broken')) return;

    if (!STATE.audioInitialized) initAudioSystem();

    // 1. Crack the seal
    waxSeal.classList.add('broken');

    // 2. Flip envelope flap open
    setTimeout(() => {
        envelopeWrapper.classList.add('open');
    }, 500);

    // 3. Fade out envelope, show full letter card + backdrop
    setTimeout(() => {
        envelopeStage.classList.add('fade-out');

        // Show backdrop
        letterBackdrop.classList.add('visible');

        // Reveal letter card (remove hidden, then add visible on next frame)
        letterCard.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                letterCard.classList.add('visible');
            });
        });
    }, 1100);
});

/* ==========================================================================
   SECTION 4: SCRAPBOOK GALLERY & DIARY LIGHTBOX
   ========================================================================== */
const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const currentPageNum = document.getElementById('current-page-num');
const cardContainer = document.getElementById('scrapbook-card-container');

let currentScrapbookPage = 1;

function renderScrapbookCard(pageIndex) {
    const entry = DIARY_DATA[pageIndex - 1];
    if (!entry) return;

    const rotationClasses = [
        'item-rotate-left',
        'item-rotate-right-slight',
        'item-rotate-left-slight',
        'item-rotate-right'
    ];
    const rotationClass = rotationClasses[(pageIndex - 1) % rotationClasses.length];

    cardContainer.innerHTML = `
        <div class="polaroid-wrapper-3d ${rotationClass}">
            <!-- Tape Decals -->
            <div class="tape tape-top-left"></div>
            <div class="tape tape-top-right"></div>
            
            <div class="polaroid-card-3d" id="polaroid-card">
                <!-- Front Side (Photo) -->
                    <div class="polaroid-front">
                        <div class="polaroid-img-wrapper">
                            <img class="polaroid-img" src="${entry.image}" alt="${entry.title}" draggable="false">
                        </div>
                        <div class="polaroid-caption">${entry.title}</div>
                        <div class="flip-hint">✨ Click card to flip</div>
                    </div>
                
                <!-- Back Side (Diary Content) -->
                    <div class="polaroid-back">
                        <div class="letter-lines"></div>
                        <div class="polaroid-back-content">
                            <div class="diary-date">${entry.date}</div>
                            <h3 class="diary-title">${entry.title}</h3>
                            <p class="diary-text">${entry.desc}</p>
                            <div class="flip-hint-back">🔄 Click card to see photo</div>
                        </div>
                    </div>
            </div>
        </div>
    `;

    const card = cardContainer.querySelector('.polaroid-card-3d');
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
}

function changeScrapbookPage(newPage) {
    if (newPage < 1 || newPage > 12) return;

    cardContainer.style.opacity = '0';
    cardContainer.style.transform = 'scale(0.95)';

    setTimeout(() => {
        currentScrapbookPage = newPage;
        renderScrapbookCard(currentScrapbookPage);

        currentPageNum.textContent = currentScrapbookPage;
        prevPageBtn.disabled = (currentScrapbookPage === 1);
        nextPageBtn.disabled = (currentScrapbookPage === 12);

        cardContainer.style.opacity = '1';
        cardContainer.style.transform = 'scale(1)';
    }, 300);
}

prevPageBtn.addEventListener('click', () => {
    if (currentScrapbookPage > 1) {
        changeScrapbookPage(currentScrapbookPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentScrapbookPage < 12) {
        changeScrapbookPage(currentScrapbookPage + 1);
    }
});

/* ==========================================================================
   SECTION 6: THE WISH JAR & FLOATING LANTERNS
   ========================================================================== */
const wishForm = document.getElementById('wish-form');
const wishInput = document.getElementById('wish-input');
const counterPane = document.getElementById('lantern-counter-pane');
const restartBtn = document.getElementById('restart-btn');

wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const wishText = wishInput.value.trim();
    if (!wishText) return;
    
    // --- EMAILJS INTEGRATION ---
    // Make sure to replace these placeholder strings with your actual EmailJS IDs!
    emailjs.init("YOUR_PUBLIC_KEY"); 
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        message: wishText,
    }).then(
        () => console.log("Wish sent to your email successfully!"),
        (err) => console.error("EmailJS error:", err)
    );
    // ---------------------------

    // Clear input
    wishInput.value = '';
    
    // Release a glowing lantern into the screen sky
    createFloatingLantern();
    
    if (!STATE.audioInitialized) initAudioSystem();
    
    STATE.wishesReleased++;
    
    // Fade out form and display heartfelt gratitude
    wishForm.classList.add('hidden');
    document.querySelector('.wish-form-wrapper').style.opacity = '0.3';
    counterPane.classList.remove('hidden');
});

// Floating sky lantern animation
function createFloatingLantern() {
    const lantern = document.createElement('div');
    lantern.className = 'sky-lantern';
    
    // Lantern SVG drawing
    lantern.innerHTML = `
        <svg viewBox="0 0 40 60" width="40" height="60">
            <!-- Lantern Body -->
            <path d="M5 10 C5 0, 35 0, 35 10 C35 25, 30 50, 25 55 L15 55 C10 50, 5 25, 5 10 Z" fill="rgba(255, 179, 71, 0.85)" stroke="#C89D50" stroke-width="1" />
            <!-- Inside Candle Glow -->
            <circle cx="20" cy="40" r="8" fill="#FFF7C2" filter="blur(2px)" />
            <path d="M20 40 L17 48 L23 48 Z" fill="#FFA500" />
            <!-- Base Ring -->
            <ellipse cx="20" cy="55" rx="5" ry="1.5" fill="#5C4A42" />
        </svg>
    `;
    
    // Position starting from below the bottom center
    lantern.style.left = '50vw';
    lantern.style.bottom = '-80px';
    lantern.style.transform = 'translateX(-50%) scale(0.6)';
    lantern.style.opacity = '1';
    
    document.body.appendChild(lantern);
    
    // Animate lantern floating upward and swaying sideways
    const floatDuration = 5; // 5 seconds
    
    lantern.style.transition = `bottom ${floatDuration}s linear, left ${floatDuration}s ease-in-out, transform ${floatDuration}s ease, opacity ${floatDuration}s ease`;
    
    // Trigger transition next frame
    requestAnimationFrame(() => {
        lantern.style.bottom = '110vh';
        lantern.style.left = `${Math.random() * 40 + 30}vw`; // drift sideways
        lantern.style.transform = 'translateX(-50%) scale(1.2) rotate(10deg)';
        lantern.style.opacity = '0';
    });
    
    // Clean up DOM node
    setTimeout(() => {
        lantern.remove();
    }, floatDuration * 1000);
}

// Inject Lantern CSS dynamically
const lanternStyle = document.createElement('style');
lanternStyle.innerHTML = `
.sky-lantern {
    position: fixed;
    z-index: 90;
    pointer-events: none;
    filter: drop-shadow(0 0 12px rgba(255, 165, 0, 0.6));
}
.wish-form-wrapper {
    transition: opacity 0.5s ease;
}
.wish-form-wrapper.hidden {
    pointer-events: none;
}
`;
document.head.appendChild(lanternStyle);

// Restart the entire experience
restartBtn.addEventListener('click', () => {
    // Reset candle state — back to unlit
    STATE.candlesLit = [false, false, false];
    STATE.wishesReleased = 0;



    // Reset flames to unlit state
    flames.forEach(flame => {
        flame.classList.remove('lighting', 'extinguished');
        flame.classList.add('blown-out');
    });

    // Reset buttons and controls
    lightBtn.classList.remove('hidden');
    blowBtn.classList.add('hidden');
    document.querySelector('.cake-controls').classList.remove('hidden');
    
    // Reset instructions
    const cakeInstruction = document.getElementById('cake-instruction');
    cakeInstruction.classList.remove('hidden');
    cakeInstruction.textContent =
        'First light the candles, make a wish, then blow them all out!';



    // Reset success message
    cakeSuccessMsg.classList.remove('show');
    cakeSuccessMsg.classList.add('hidden');

    // Reset cake container scale
    const cakeContainer = document.querySelector('.cake-container');
    if (cakeContainer) {
        cakeContainer.classList.remove('success');
    }

    // Reset envelope seal and letter card
    waxSeal.classList.remove('broken');
    envelopeWrapper.classList.remove('open');
    envelopeStage.classList.remove('fade-out');
    letterCard.classList.remove('visible');
    letterCard.classList.add('hidden');
    letterBackdrop.classList.remove('visible');

    // Reset wish jar view
    wishForm.classList.remove('hidden');
    document.querySelector('.wish-form-wrapper').style.opacity = '1';
    counterPane.classList.add('hidden');

    // Reset scrapbook page state
    currentScrapbookPage = 1;
    renderScrapbookCard(1);
    document.getElementById('current-page-num').textContent = '1';
    document.getElementById('prev-page-btn').disabled = true;
    document.getElementById('next-page-btn').disabled = false;

    // Return to welcome gate
    showScene('welcome-section');
});

// Initial mount configuration
renderScrapbookCard(1);
