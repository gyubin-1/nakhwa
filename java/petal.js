// 1) 문 열림 + Overview 천천히 등장(fade-in)
window.addEventListener("DOMContentLoaded", () => {
  const closed = document.getElementById("door-closed");
  const open = document.getElementById("door-open");
  const site = document.getElementById("site-main");
  const sequence = document.getElementById("door-sequence");
  const overview = document.querySelector(".Overview");

  setTimeout(() => { closed.style.transform = "scale(1.2)"; closed.style.opacity = "0"; }, 300);
  setTimeout(() => { open.style.opacity = "1"; open.style.transform = "scale(1.2)"; }, 1200);
  setTimeout(() => { open.style.transform = "scale(1.35)"; }, 1600);
  setTimeout(() => {
    sequence.style.display = "none";
    site.style.transition = "opacity 1s";
    site.style.opacity = "1";
    // Overview 페이드 인
    if (overview) setTimeout(() => overview.classList.add("visible"), 300);
  }, 2300);
});
// 2) 벚꽃 파티클
(function runPetalParticles() {
  const canvas = document.getElementById("petal-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const petals = [];
  const petalImage = new Image();
  petalImage.src = "./img/ok1.png";  // 경로 수정!

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = 20 + Math.random() * 20;
      this.speedY = 1 + Math.random() * 2;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02;
      this.opacity = 0.5 + Math.random() * 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.spin;
      if (this.y > canvas.height + this.size) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(petalImage, -this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  function createPetals(count) {
    petals.length = 0;
    for (let i = 0; i < count; i++) petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  petalImage.onload = () => {
    createPetals(60);
    animate();
  };
})();

// 3) 먼지 파티클
(function runDustParticles() {
  const canvas = document.getElementById("dust-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const dusts = [];
  for (let i = 0; i < 80; i++) {
    dusts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 2,
      speedY: 0.2 + Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: 0.1 + Math.random() * 0.3
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dusts.forEach(d => {
      d.x += d.speedX;
      d.y += d.speedY;
      if (d.y > canvas.height) d.y = -d.size;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${d.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  animate();
})();

// 4) 스크롤시 헤더 숨김
(function () {
  const header = document.querySelector(".header");
  let lastScroll = window.pageYOffset, scrollTimer;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll) header.classList.add("hide");
    else header.classList.remove("hide");
    lastScroll = currentScroll;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => header.classList.remove("hide"), 150);
  });
  document.addEventListener("mousemove", () => header.classList.remove("hide"));
  document.addEventListener("touchstart", () => header.classList.remove("hide"));
})();

// 5) 섹션별 IntersectionObserver - 효과 등장시 실행
window.addEventListener("DOMContentLoaded", () => {
  // brush-bg: Overview 등장 시
  function showBrushFadeIn() {
    const brushBg = document.querySelector(".brush-bg");
    if (brushBg && !brushBg.classList.contains('show')) brushBg.classList.add("show");
  }
  // world-view: burn-canvas
  function startBurnEffect() {
    const img = document.getElementById("burn-target");
    const burnCanvas = document.getElementById("burn-canvas");
    if (!img || !burnCanvas) return;
    const burnCtx = burnCanvas.getContext("2d");
    burnCanvas.width = img.clientWidth; burnCanvas.height = img.clientHeight;
    burnCtx.drawImage(img, 0, 0, burnCanvas.width, burnCanvas.height);
    if (burnCanvas.dataset.active) return; // 한 번만 실행
    burnCanvas.dataset.active = "1";
    (function burn() {
      let pixels = burnCtx.getImageData(0, 0, burnCanvas.width, burnCanvas.height);
      let data = pixels.data;
      setInterval(() => {
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() < 0.02) {
            data[i] *= 0.5;
            data[i + 1] *= 0.3;
            data[i + 2] *= 0.2;
            data[i + 3] *= 0.9;
          }
        }
        burnCtx.putImageData(pixels, 0, 0);
      }, 50);
    })();
  }
  // 기사: knight-dust
  function startKnightDust() {
    const canvas = document.getElementById("knight-dust");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = 1920; canvas.height = 800;
    const particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: Math.random() * 0.6,
        opacity: Math.random() * 0.3 + 0.2
      });
    }
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX; p.y -= p.speedY;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,200,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 옵저버 설정
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");

        if (e.target.classList.contains('Overview')) showBrushFadeIn();
        if (e.target.classList.contains('world-view')) {
          startBurnEffect();
          startTypingEffect();
        }
        if (e.target.classList.contains('knight-container')) startKnightDust();
      } else {
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".scroll-item, .demo-bullets, .big-box, .dlc2 .dlc-box, .feedback-entry, .team, .team-box").forEach(el => scrollObserver.observe(el));
});

// 6) 데모 헤드라인 타이핑: demo 영역 등장시만 실행
(function () {
  let typingTimer = null, typingActive = false, el = null, text = "", i = 0;
  function typeDemoHeadline() {
    if (!el) return;
    el.innerHTML = "";
    i = 0; typingActive = true;
    function tick() {
      if (!typingActive) return;
      el.innerHTML = text.slice(0, i).replace(/\n/g, "<br/>");
      if (i++ < text.length) typingTimer = setTimeout(tick, 60);
      else { typingActive = false; typingTimer = null; }
    }
    tick();
  }
  function resetDemoHeadline() {
    if (typingTimer) clearTimeout(typingTimer);
    typingActive = false;
    if (el) el.innerHTML = "";
    i = 0;
  }
  window.addEventListener("DOMContentLoaded", () => {
    el = document.getElementById("demo-headline");
    if (!el) return;
    text = el.getAttribute('data-text') || el.textContent.trim();
    el.setAttribute('data-text', text);
    const demoSection = document.querySelector(".demo");
    if (!demoSection) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) typeDemoHeadline();
        else resetDemoHeadline();
      });
    }, { threshold: 0.3 });
    obs.observe(demoSection);
  });
})();

// 7) DLC 슬라이더
window.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".slider-item");
  const dots = document.querySelectorAll(".slider-indicators .dot");
  let currentIndex = 0;
  function updateSlider(index) {
    items.forEach((item, i) => item.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentIndex = index;
  }
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"));
      updateSlider(index);
    });
  });
  setInterval(() => { updateSlider((currentIndex + 1) % items.length); }, 5000);
  updateSlider(0);
});

function startTypingEffect() {
  const el = document.querySelector(".world-view .typing");
  if (!el) return;

  let original = el.getAttribute('data-text');
  if (!original) {
    original = el.textContent.trim();
    el.setAttribute('data-text', original);
  }

  el.innerHTML = "";
  let i = 0;

  function type() {
    el.innerHTML = original.slice(0, i).replace(/\n/g, "<br/>");
    if (i < original.length) {
      i++;
      setTimeout(type, 45);
    }
  }

  type();
}


// TOP 버튼 기능
const topButton = document.querySelector(".top-button");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
});

topButton.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const cursorCanvas = document.getElementById("cursor-canvas");
const ctx = cursorCanvas.getContext("2d");
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

let x = 0, y = 0;

document.addEventListener("mousemove", (e) => {
  x = e.clientX;
  y = e.clientY;
});

function draw() {
  ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 8;
  ctx.shadowColor = "#000";
  ctx.fill();

  requestAnimationFrame(draw);
}

draw();

/* 스토리 */
const sections = document.querySelectorAll('.story-section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.3
});

sections.forEach(section => {
  observer.observe(section);
});