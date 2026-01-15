// Photos from the user's folder
const photos = [
    "photos/foto1.jpeg",
    "photos/foto2.jpeg",
    "photos/foto3.jpeg",
    "photos/foto4.jpeg",
    "photos/foto5.jpeg"
];

// Loader and Music Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 500);
    }, 500); // Shorter fake load time
});

const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const musicPlayer = document.getElementById('music-player');
const startBtn = document.getElementById('start-btn');

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸';
        isManuallyPaused = false; // User explicitly played
    } else {
        audio.pause();
        playBtn.innerText = '▶';
        isManuallyPaused = true; // User explicitly paused
    }
}

playBtn.addEventListener('click', toggleMusic);

// Tap Navigation Logic
let currentSectionIndex = 0;
const sections = document.querySelectorAll('section');
const progressContainer = document.getElementById('progress-container');

// Ensure music plays on interaction unless manually paused
let isManuallyPaused = false;

function ensureMusicPlaying() {
    if (audio.paused && !isManuallyPaused) {
        audio.play().then(() => {
            playBtn.innerText = '⏸';
            musicPlayer.classList.add('visible');
        }).catch(err => {
            console.log("Interaction needed for music:", err);
        });
    }
}

// Create Progress Bars
sections.forEach((_, index) => {
    const bar = document.createElement('div');
    bar.classList.add('progress-bar');
    if (index === 0) bar.classList.add('active');
    progressContainer.appendChild(bar);
});

function updateProgress() {
    const bars = document.querySelectorAll('.progress-bar');
    bars.forEach((bar, index) => {
        bar.classList.remove('active', 'visited');
        if (index < currentSectionIndex) {
            bar.classList.add('visited');
        } else if (index === currentSectionIndex) {
            bar.classList.add('active');
        }
    });
}

function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSectionIndex = index;
        sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
        updateProgress();

        // Auto-play music if moving past intro
        if (currentSectionIndex > 0) {
            ensureMusicPlaying();
        }
    }
}

// Handle Swipe & Wheel Navigation
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: false });

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = touchEndY - touchStartY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff < 0) {
            // Swipe Up -> Next
            scrollToSection(currentSectionIndex + 1);
        } else {
            // Swipe Down -> Prev
            scrollToSection(currentSectionIndex - 1);
        }
    }
}

// PC Wheel Support (since tap is gone)
document.addEventListener('wheel', (e) => {
    // Debounce or simple threshold to prevent rapid scrolling
    // For simplicity, just check direction
    if (e.deltaY > 0) {
        scrollToSection(currentSectionIndex + 1);
    } else {
        scrollToSection(currentSectionIndex - 1);
    }
}, { passive: true });

// Tap/Click Navigation (Restored)
document.addEventListener('click', (e) => {
    // Ignore clicks on specific interactive elements/buttons
    if (e.target.closest('button') ||
        e.target.closest('#play-btn') ||
        e.target.closest('.play-controls') ||
        e.target.closest('.polaroid')) {
        return;
    }

    const screenWidth = window.innerWidth;
    const clickX = e.clientX;

    if (clickX < screenWidth / 3) {
        // Left 1/3: Back
        scrollToSection(currentSectionIndex - 1);
    } else {
        // Right 2/3: Forward
        scrollToSection(currentSectionIndex + 1);
    }
});

// Start Button connects music + manual advance to specific section
startBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click
    audio.play().then(() => {
        playBtn.innerText = '⏸';
        musicPlayer.classList.add('visible');
    }).catch(err => {
        console.log("Autoplay prevented:", err);
        musicPlayer.classList.add('visible');
    });

    // Update index to point to 'nostalgia' section (index 1)
    scrollToSection(1);
});

// Random Photo Logic
function setRandomPhoto(element) {
    let randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    element.src = randomPhoto;
}

// Initialize Photos on Load and Start Cycle
document.querySelectorAll('.background-photo').forEach(img => {
    setRandomPhoto(img);
    startPhotoCycle(img);
});

function startPhotoCycle(imgElement) {
    setInterval(() => {
        // Fade out
        imgElement.style.opacity = 0;

        setTimeout(() => {
            // Change photo
            setRandomPhoto(imgElement);
            // Fade in (restore original opacity, usually 0.3 defined in CSS)
            imgElement.style.opacity = 0.3;
        }, 1000); // Wait for fade out transition (matches CSS time)
    }, 5000 + Math.random() * 2000); // Random interval between 5-7s for organic feel
}

// Scroll Observer for Animations (Simplified to just reveal content)
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Compliment Carousel
const compliments = [
    "ruh eşim gibisin",
    "seni 2 gündür tanıyorum ama 10 yıldır var gibisin",
    "bayılıyorum sana",
    "ne kadar tatlı olduğunun farkında mısın?",
    "seni hayal etmek bile beni şeker komasına sokuyor"
];

let compIndex = 0;
const compText = document.getElementById('comp-text');

if (compText) {
    setInterval(() => {
        compText.style.transition = "opacity 0.5s";
        compText.style.opacity = 0;
        setTimeout(() => {
            compIndex = (compIndex + 1) % compliments.length;
            compText.innerText = `"${compliments[compIndex]}"`;
            compText.style.opacity = 1;
        }, 500);
    }, 3000); // Faster cycle
}

// Highlight Moments Carousel
const moments = [
    "klavyeden tek tek küçük harfle yazman",
    "getirdiğim hariboyu bende unutman :)",
    "sana ilk buluşmada çiçek getirmem",
    "birbirimizi ana karakterler gibi görmemiz ✨",
    "diğerlerine boş diyişlerimiz",
    "Gece 3'teki derin konuşmalarımız 🌙",
    "nesquiki tencerede saklamam...",
    "ilk öpüştüğümüz an",
    "kokunu ilk içime çektiğim an"
    
];

let momentIndex = 0;
const momentText = document.getElementById('moment-text');

if (momentText) {
    setInterval(() => {
        momentText.style.transition = "opacity 0.5s";
        momentText.style.opacity = 0;
        setTimeout(() => {
            momentIndex = (momentIndex + 1) % moments.length;
            momentText.innerText = moments[momentIndex];
            momentText.style.opacity = 1;
        }, 500);
    }, 4000);
}

// Heart Blast Effect
document.getElementById('heart-btn').addEventListener('click', (e) => {
    const btn = e.target;
    const rect = btn.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-blast');
        heart.innerText = '❤️';
        document.body.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 200;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        heart.style.left = `${center.x}px`;
        heart.style.top = `${center.y}px`;
        heart.style.setProperty('--dx', `${dx}px`);
        heart.style.setProperty('--dy', `${dy}px`);

        setTimeout(() => heart.remove(), 1000);
    }

    btn.innerText = "hoşçakal sevgilim ❤️";
    btn.style.background = "#ff006e";
    btn.style.color = "white";

    // Wait for effect, then restart story
    setTimeout(() => {
        scrollToSection(0);
        currentSectionIndex = 0;
        // Optional: Reset button text after scrolling back
        setTimeout(() => {
            btn.innerText = "hoşçakal sevgilim ❤️";
            btn.style.background = "";
            btn.style.color = "";
        }, 1000);
    }, 1000); // Faster restart (1s)
});

// Random Laugh Generator
const laughs = [
    "ASHDKJHDKJASHDKJ",
    "KSJHDJKSDJKSHDJK",
    "JAKAKWKSMSMSNSMS",
    "AGSHDJKFLGŞİ",
    "DMMFMDMCMEMCMC"
];
const laughEl = document.getElementById('random-laugh');
if (laughEl) {
    setInterval(() => {
        laughEl.innerText = laughs[Math.floor(Math.random() * laughs.length)];
    }, 2000);
}

// Algorithm Bar Animation
// Algorithm Bar Animation
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.getAttribute('data-width');
            // Small delay to ensure transition happens
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
            barObserver.unobserve(fill); // Animate once
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.algo-progress-fill').forEach(bar => {
    barObserver.observe(bar);
});



