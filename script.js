// 모바일 메뉴(햄버거 ☰) 열고 닫기
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => menu.classList.toggle("open"));
  // 메뉴 항목을 누르면 자동으로 닫히게
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

// 홈 의상 갤러리: 양쪽 버튼을 누르면 사진 한 장 너비만큼 이동합니다.
const runway = document.querySelector(".runway-scroll");
const runwayTrack = document.querySelector(".runway-track");
const runwayPrev = document.querySelector(".runway-button-prev");
const runwayNext = document.querySelector(".runway-button-next");

if (runway && runwayTrack && runwayPrev && runwayNext) {
  let runwayIsMoving = false;

  const updateRunwayButtons = () => {
    const end = runway.scrollWidth - runway.clientWidth;
    runwayPrev.disabled = runwayIsMoving || runway.scrollLeft <= 1;
    runwayNext.disabled = runwayIsMoving || runway.scrollLeft >= end - 1;
  };

  const moveRunway = (direction) => {
    const card = runwayTrack.querySelector(".runway-card");
    if (!card || runwayIsMoving) return;

    const start = runway.scrollLeft;
    const end = Math.max(0, Math.min(
      start + direction * card.getBoundingClientRect().width,
      runway.scrollWidth - runway.clientWidth
    ));
    const duration = 550;
    const startedAt = performance.now();

    runwayIsMoving = true;
    updateRunwayButtons();

    // 천천히 출발하고 부드럽게 멈추는 슬라이드 움직임입니다.
    const slide = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      runway.scrollLeft = start + (end - start) * eased;

      if (progress < 1) {
        window.requestAnimationFrame(slide);
      } else {
        runwayIsMoving = false;
        updateRunwayButtons();
      }
    };

    window.requestAnimationFrame(slide);
  };

  runwayPrev.addEventListener("click", () => moveRunway(-1));
  runwayNext.addEventListener("click", () => moveRunway(1));
  runway.addEventListener("scroll", updateRunwayButtons, { passive: true });
  window.addEventListener("resize", updateRunwayButtons);
  updateRunwayButtons();
}
