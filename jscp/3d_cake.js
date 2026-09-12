// Birthday Cake (2D, site-themed)
// The candle only goes out when you blow into your microphone — no cursor movement,
// no click, nothing else extinguishes it.

let isCakeActive = false;
let cakeAudioContext, cakeAnalyser, cakeMicSource, cakeDataArray;
let cakeFlicker, cakeBlowLoop;
let flameEls = null; // { outer, inner, glow, wick }

function init3DCake() {
    isCakeActive = true;

    // Full-screen overlay — same dark glass look as the timeline screen
    const container = document.createElement('div');
    container.id = 'cake-container';
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 99999;
        background: rgba(10, 5, 20, 0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    `;
    document.body.appendChild(container);

    // Title
    const title = document.createElement('h2');
    title.id = 'cake-title';
    title.innerText = 'Make a wish, then blow out the candle!';
    title.style.cssText = `
        color: #fff;
        font-family: 'Bangers', cursive;
        letter-spacing: 1px;
        font-size: clamp(1.3rem, 3.5vw, 2.1rem);
        text-align: center;
        text-shadow: 0 0 15px #ed1c24, 0 0 30px #142c71;
        margin: 0 20px 8px 20px;
        z-index: 1;
    `;
    container.appendChild(title);

    // Mic status hint
    const micHint = document.createElement('div');
    micHint.id = 'mic-hint';
    micHint.innerText = 'Requesting microphone access...';
    micHint.style.cssText = `
        color: #ffd1e8;
        font-family: 'Dancing Script', cursive;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 20px;
        z-index: 1;
        opacity: 0.9;
    `;
    container.appendChild(micHint);

    // Cake stage
    const stage = document.createElement('div');
    stage.id = 'cake-stage';
    stage.style.cssText = `
        width: min(80vw, 340px);
        filter: drop-shadow(0 15px 35px rgba(20, 44, 113, 0.4));
    `;
    stage.innerHTML = buildCakeSVG();
    container.appendChild(stage);

    flameEls = {
        outer: stage.querySelector('#flame-outer'),
        inner: stage.querySelector('#flame-inner'),
        glow: stage.querySelector('#flame-glow'),
        smoke: stage.querySelector('#flame-smoke')
    };

    startFlicker();
    initMicrophone(micHint);
}

function buildCakeSVG() {
    return `
    <svg viewBox="0 0 300 260" width="100%" height="auto" role="img" aria-label="Birthday cake with a lit candle, decorated in a Spider-Man red and blue theme">
        <ellipse cx="150" cy="230" rx="112" ry="16" fill="#ffffff"/>
        <rect x="55" y="150" width="190" height="78" rx="14" fill="#0a0a0a"/>
        <rect x="55" y="150" width="190" height="16" rx="8" fill="#ed1c24" opacity="0.5"/>
        <rect x="75" y="108" width="150" height="55" rx="14" fill="#ed1c24"/>
        <rect x="75" y="108" width="150" height="14" rx="7" fill="#ff6b6b" opacity="0.5"/>
        <rect x="95" y="72" width="110" height="42" rx="14" fill="#142c71"/>
        <rect x="95" y="72" width="110" height="12" rx="6" fill="#3d6fd6" opacity="0.6"/>
        <g stroke="#ffffff" stroke-width="1.4" opacity="0.55" fill="none">
            <path d="M100 78 L200 108 M100 108 L200 78 M150 72 L150 114"/>
            <path d="M118 74 Q150 92 182 74 M118 112 Q150 94 182 112"/>
        </g>
        <circle cx="90" cy="228" r="6" fill="#142c71"/>
        <circle cx="150" cy="234" r="6" fill="#ffffff"/>
        <circle cx="210" cy="228" r="6" fill="#142c71"/>
        <circle cx="115" cy="150" r="5.5" fill="#ffffff"/>
        <circle cx="185" cy="150" r="5.5" fill="#142c71"/>
        <circle cx="130" cy="112" r="5" fill="#ed1c24"/>
        <circle cx="170" cy="112" r="5" fill="#ffffff"/>
        <rect x="145" y="42" width="9" height="32" rx="3" fill="#fffdf7"/>
        <rect x="145" y="42" width="9" height="6" fill="#ed1c24" opacity="0.6"/>
        <rect x="148.5" y="36" width="2" height="8" fill="#1a1a1a"/>
        <g id="flame-smoke" opacity="0">
            <path d="M149.5 40 Q140 26 149.5 12 Q159 -1 149.5 -14" fill="none" stroke="#e6e0e8" stroke-width="4" stroke-linecap="round"/>
        </g>
        <g id="flame-group">
            <ellipse id="flame-glow" cx="149.5" cy="26" rx="20" ry="26" fill="#ffaa33" opacity="0.25"/>
            <ellipse id="flame-outer" cx="149.5" cy="24" rx="8.5" ry="15" fill="#ff7b00"/>
            <ellipse id="flame-inner" cx="149.5" cy="29" rx="4" ry="7.5" fill="#fff59d"/>
        </g>
    </svg>`;
}

function startFlicker() {
    cakeFlicker = setInterval(() => {
        if (!isCakeActive || !flameEls || flameEls.outer.style.display === 'none') return;
        const t = Date.now();
        const outerScaleX = 1 + Math.sin(t * 0.01) * 0.08 + Math.random() * 0.05;
        const outerScaleY = 1 + Math.cos(t * 0.008) * 0.1 + Math.random() * 0.06;
        const innerScaleX = 1 + Math.sin(t * 0.015 + 1) * 0.1 + Math.random() * 0.06;
        const innerScaleY = 1 + Math.cos(t * 0.013 + 1) * 0.12 + Math.random() * 0.08;
        flameEls.outer.setAttribute('rx', (8.5 * outerScaleX).toFixed(1));
        flameEls.outer.setAttribute('ry', (15 * outerScaleY).toFixed(1));
        flameEls.inner.setAttribute('rx', (4 * innerScaleX).toFixed(1));
        flameEls.inner.setAttribute('ry', (7.5 * innerScaleY).toFixed(1));
        flameEls.glow.setAttribute('opacity', (0.22 + Math.random() * 0.08).toFixed(2));
    }, 90);
}

async function initMicrophone(micHint) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        cakeAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        cakeAnalyser = cakeAudioContext.createAnalyser();
        cakeMicSource = cakeAudioContext.createMediaStreamSource(stream);
        cakeMicSource.connect(cakeAnalyser);
        cakeAnalyser.fftSize = 256;
        cakeDataArray = new Uint8Array(cakeAnalyser.frequencyBinCount);
        if (micHint) micHint.innerText = 'Blow into your microphone to blow out the candle';
        checkBlow();
    } catch (e) {
        console.warn('Microphone access denied or unavailable:', e);
        if (micHint) {
            micHint.innerText = 'Microphone access is needed to blow out the candle. Please allow microphone access and reload the page.';
            micHint.style.color = '#ffb3b3';
        }
    }
}

function checkBlow() {
    if (!isCakeActive || !flameEls || flameEls.outer.style.display === 'none') return;
    cakeBlowLoop = requestAnimationFrame(checkBlow);
    cakeAnalyser.getByteFrequencyData(cakeDataArray);
    let sum = 0;
    for (let i = 0; i < cakeDataArray.length; i++) sum += cakeDataArray[i];
    if (sum / cakeDataArray.length > 32) blowOutCandle();
}

function blowOutCandle() {
    if (!flameEls || flameEls.outer.style.display === 'none') return;

    clearInterval(cakeFlicker);
    if (cakeBlowLoop) cancelAnimationFrame(cakeBlowLoop);

    flameEls.outer.style.transition = 'opacity 0.3s ease';
    flameEls.inner.style.transition = 'opacity 0.3s ease';
    flameEls.glow.style.transition = 'opacity 0.3s ease';
    flameEls.outer.style.opacity = '0';
    flameEls.inner.style.opacity = '0';
    flameEls.glow.style.opacity = '0';
    flameEls.outer.style.display = 'none';

    flameEls.smoke.style.transition = 'opacity 1.6s ease';
    flameEls.smoke.setAttribute('opacity', '0.6');
    setTimeout(() => flameEls.smoke.setAttribute('opacity', '0'), 100);

    const title = document.getElementById('cake-title');
    if (title) {
        title.innerText = 'Happy Birthday! Your wish is coming true!';
        title.style.textShadow = '0 0 30px #ed1c24, 0 0 60px #142c71';
    }
    const micHint = document.getElementById('mic-hint');
    if (micHint) micHint.style.opacity = '0';

    finishCakeScene();
}

function finishCakeScene() {
    if (typeof showFirework === 'function') {
        showFirework();
        setTimeout(showFirework, 400);
        setTimeout(showFirework, 800);
    }
    setTimeout(() => {
        isCakeActive = false;
        if (cakeAudioContext) {
            cakeAudioContext.close();
            cakeAudioContext = null;
        }
        const container = document.getElementById('cake-container');
        if (container) {
            container.style.animation = 'fadeOutScale 1s ease forwards';
            setTimeout(() => container.remove(), 1000);
        }
    }, 4000);
}