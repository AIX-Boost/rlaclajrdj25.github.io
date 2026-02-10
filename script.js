/* ===============================
   GISCUS 설정
================================ */
const GISCUS_REPO = "AIX-Boost/AIX-Boost.github.io";
const GISCUS_REPO_ID = "R_kgDOL...";
const GISCUS_CATEGORY_ID = "DIC_kwDOL...";

/* ===============================
   데이터
================================ */
const collegeData = {
  "컴퓨터소프트웨어특성화대학": ["컴퓨터정보공학과", "인공지능융합학과", "임베디드소프트웨어학과", "소프트웨어학과", "IT융합통신공학과"],
  "해양·바이오특성화대학": ["생명과학과", "해양수산공공인재학과", "해양생명과학과", "해양생물자원학과", "수산생명의학과", "식품영양학과", "기관공학과", "식품생명공학과"],
  "경영특성화대학": ["경영학부", "국제물류학과", "무역학과", "회계학부", "금융부동산경제학과", "벤처창업학과"],
  "자율전공대학": ["자율전공학부", "미술학과", "음악과", "조선공학과", "글로벌융합학부"],
  "융합과학공학대학": ["전자공학과", "전기공학과", "신소재공학과", "화학공학과", "환경공학과", "토목공학과", "해양건설공학과", "첨단과학기술학부", "수학과"],
  "인문콘텐츠융합대학": ["국어국문학과", "영어영문학과", "일어일문학과", "중어중문학과", "역사학과", "철학과"],
  "ICC 특성화 대학부": ["미디어문화학부", "아동학부", "사회복지학부", "법행정경찰학부", "간호학부", "체육학부", "산업디자인학부", "의류학부", "해양경찰학부", "기계공학부", "건축공학부", "공간디자인융합기술학부", "이차전지·에너지학부"]
};

const weeks = [
  { id: 1, title: "문장의 5형식과 전공 어휘", topic: "문장 구조(Structure)" },
  { id: 2, title: "명사와 관사 바로 쓰기", topic: "명사/관사(Noun/Article)" },
  { id: 3, title: "시제의 이해 (현재/과거/미래)", topic: "시제(Tense)" },
  { id: 4, title: "수동태의 활용 (Passive Voice)", topic: "수동태(Passive Voice)" },
  { id: 5, title: "To 부정사의 명사적 용법", topic: "To 부정사(To-Infinitive)" }
];

/* ===============================
   페이지 로드
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const weekGrid = document.getElementById("weekGrid");
  if (weekGrid) {
    weeks.forEach(week => {
      const card = document.createElement("div");
      card.className = "week-card";
      card.onclick = () => openWeekAssignment(week);
      card.innerHTML = `
        <div>
          <span class="week-number">${week.id}주차</span>
          <div style="font-weight:bold;">${week.title}</div>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:#ddd;"></i>
      `;
      weekGrid.appendChild(card);
    });
  }
});

/* ===============================
   주차 클릭 → 과제 제출 화면
================================ */
function openWeekAssignment(week) {
  document.getElementById("week-list-view").style.display = "none";
  document.getElementById("assignment-detail-view").style.display = "block";

  document.getElementById("currentWeekTitle").innerText = `Week ${week.id}`;
  document.getElementById("currentWeekTopic").innerText = week.topic;

  loadGiscus(`week-${week.id}`);
}

/* ===============================
   목록으로 돌아가기
================================ */
function backToWeekList() {
  document.getElementById("assignment-detail-view").style.display = "none";
  document.getElementById("week-list-view").style.display = "block";

  const container = document.querySelector(".giscus-container");
  if (container) container.innerHTML = "";
}

/* ===============================
   Giscus 로드
================================ */
function loadGiscus(term) {
  const container = document.querySelector(".giscus-container");
  container.innerHTML = "";

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", GISCUS_REPO);
  script.setAttribute("data-repo-id", GISCUS_REPO_ID);
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", term);
  script.setAttribute("data-lang", "ko");
  script.setAttribute("data-theme", "light");
  script.async = true;
  script.crossOrigin = "anonymous";

  container.appendChild(script);
}
