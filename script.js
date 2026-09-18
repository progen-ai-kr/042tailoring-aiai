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
const runwaySection = document.querySelector(".runway");

if (runway && runwayTrack && runwayPrev && runwayNext && runwaySection) {
  const originalCards = Array.from(runwayTrack.children);
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    runwayTrack.appendChild(clone);
  });

  let runwayIsMoving = false;
  let runwayAutoTimer;

  const updateRunwayButtons = () => {
    runwayPrev.disabled = runwayIsMoving;
    runwayNext.disabled = runwayIsMoving;
  };

  const moveRunway = (direction) => {
    const card = runwayTrack.querySelector(".runway-card");
    if (!card || runwayIsMoving) return;

    const cardWidth = card.getBoundingClientRect().width;
    const repeatedStart = runwayTrack.children[originalCards.length].offsetLeft;
    let start = runway.scrollLeft;

    // 복제된 영역에 들어간 상태라면 같은 모습의 원본 위치로 되돌립니다.
    if (start >= repeatedStart) {
      start -= repeatedStart;
      runway.scrollLeft = start;
    }

    // 첫 사진에서 이전 버튼을 누르면 복제된 첫 사진 위치에서 8번째로 이동합니다.
    if (direction < 0 && start < cardWidth / 2) {
      start += repeatedStart;
      runway.scrollLeft = start;
    }

    const end = start + direction * cardWidth;
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
        // 8번째 다음의 복제 사진에서 같은 모습의 원본 사진으로 조용히 연결합니다.
        if (end >= repeatedStart) runway.scrollLeft = end - repeatedStart;
        if (end < 0) runway.scrollLeft = end + repeatedStart;
        runwayIsMoving = false;
        updateRunwayButtons();
      }
    };

    window.requestAnimationFrame(slide);
  };

  const stopRunwayAuto = () => window.clearInterval(runwayAutoTimer);
  const startRunwayAuto = () => {
    stopRunwayAuto();
    runwayAutoTimer = window.setInterval(() => moveRunway(1), 4000);
  };

  runwayPrev.addEventListener("click", () => {
    moveRunway(-1);
    startRunwayAuto();
  });
  runwayNext.addEventListener("click", () => {
    moveRunway(1);
    startRunwayAuto();
  });
  // 동작 최소화 설정이나 마우스·키보드 포커스 상태와 관계없이 자동 재생을 유지합니다.
  updateRunwayButtons();
  startRunwayAuto();
}

// 페이지가 길 때 빠르게 처음으로 돌아가는 공통 버튼입니다.
const backToTop = document.createElement("button");
backToTop.type = "button";
backToTop.className = "back-to-top";
backToTop.setAttribute("aria-label", "맨 위로 가기");
backToTop.innerHTML = '<span aria-hidden="true">↑</span><span>TOP</span>';
document.body.appendChild(backToTop);

const updateBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
