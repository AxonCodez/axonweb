// === Designer/Developer Hover Swap ===
const roleSwap = document.querySelector('.role-swap');

if (roleSwap) {
  roleSwap.addEventListener('mouseenter', () => {
    roleSwap.classList.add('swap');
  });

  roleSwap.addEventListener('mouseleave', () => {
    roleSwap.classList.remove('swap');
  });
}

// === Fade-In on Scroll ===
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

fadeEls.forEach(el => observer.observe(el));

// === Tilt Initialization (optional, if you're using tilt.js) ===
const tiltElements = document.querySelectorAll('.tilt');
if (tiltElements.length > 0) {
  VanillaTilt.init(tiltElements, {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const comet = document.querySelector(".comet");
  const fireball = comet.querySelector(".fireball");
  const timeline = document.querySelector(".timeline");
  const entries = document.querySelectorAll(".timeline-entry");

  window.addEventListener("scroll", () => {
    const timelineRect = timeline.getBoundingClientRect();
    const scrollY = window.scrollY + window.innerHeight / 2;
    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;

    // Animate comet height
    const progress = Math.min(Math.max((scrollY - timelineTop) / timelineHeight, 0), 1);
    comet.style.height = `${progress * 100}%`;
    fireball.style.top = `calc(${progress * 100}% - 10px)`;

    // Animate timeline entries as fireball crosses
    entries.forEach(entry => {
      const entryTop = entry.offsetTop + timeline.offsetTop;
      if (scrollY > entryTop - 100) {
        entry.classList.add("animated");
      }
    });
  });
});

 window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.work-dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const parent = toggle.closest('.work-card');
        const dropdown = parent.querySelector('.work-dropdown-content');
        toggle.classList.toggle('open');
        dropdown.classList.toggle('show');
      });
    });
  });

  const reorderStack = (carouselId) => {
    const carousel = document.getElementById(carouselId);
    const first = carousel.children[0];
    carousel.appendChild(first);
    
    // Reset styles to reapply z-index stacking
    Array.from(carousel.children).forEach((img, idx) => {
      img.style.zIndex = carousel.children.length - idx;
      img.style.transform = `translateY(${idx * 10}px) scale(${1 - idx * 0.03})`;
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const stacks = document.querySelectorAll(".graphics-stack-carousel");

    stacks.forEach(stack => {
      stack.addEventListener("click", () => reorderStack(stack.id));
    });
  });

  const songs = [
  { title: "Dreams", src: "./assets/music/track1.mp3" },
  { title: "Reflections", src: "./assets/music/track2.mp3" },
  { title: "Into the Light", src: "./assets/music/track3.mp3" }
];

let currentSongIndex = 0;
const audio = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const currentSongLabel = document.getElementById("currentSong");
const seekBar = document.getElementById("seekBar");

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  currentSongLabel.textContent = song.title;
  audio.load();
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = "⏸";
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = "⏸";
}

function toggleMusicPlayer() {
  const player = document.getElementById("musicPlayer");
  player.classList.toggle("collapsed");
}

// Seekbar Sync
audio.addEventListener("timeupdate", () => {
  seekBar.max = Math.floor(audio.duration);
  seekBar.value = Math.floor(audio.currentTime);
});

seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

// Autoplay next
audio.addEventListener("ended", nextSong);

// Load first song on init
window.addEventListener("DOMContentLoaded", () => {
  loadSong(currentSongIndex);
});