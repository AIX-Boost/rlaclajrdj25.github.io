/* ===============================
   설정 및 데이터
================================ */
const GISCUS_REPO = "AIX-Boost/AIX-Boost.github.io";
const GISCUS_REPO_ID = "R_kgDOL..."; // 실제 ID
const GISCUS_CATEGORY_ID = "DIC_kwDOL..."; // 실제 ID

// ✅ 너의 Vercel API 도메인 (중요)
const API_BASE = "https://aix-boost-api.vercel.app";

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
  { id: 5, title: "To 부정사의 명사적 용법", topic: "To 부정사(To-Infinitive)" },
  { id: 6, title: "동명사와 현재분사 구분", topic: "동명사(Gerund)" },
  { id: 7, title: "분사구문과 전공 텍스트 해석", topic: "분사구문(Participle)" },
  { id: 8, title: "중간고사 대체 과제", topic: "중간 점검(Midterm)" },
  { id: 9, title: "관계대명사 (주격/목적격)", topic: "관계대명사(Relative Clause)" },
  { id: 10, title: "관계부사와 복합관계사", topic: "관계부사(Relative Adverb)" },
  { id: 11, title: "가정법 과거와 과거완료", topic: "가정법(Subjunctive)" },
  { id: 12, title: "접속사와 전치사의 차이", topic: "접속사(Conjunctions)" },
  { id: 13, title: "비교구문과 최상급 표현", topic: "비교급(Comparison)" },
  { id: 14, title: "특수구문 (도치/강조)", topic: "특수구문(Special Syntax)" },
  { id: 15, title: "기말 프로젝트 제출", topic: "기말 과제(Final Project)" }
];

/* ===============================
   DOM 로드 및 초기화
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const collegeSelect = document.getElementById("collegeSelect");
  if (collegeSelect) {
    collegeSelect.innerHTML = '<option value="">선택하세요</option>';
    for (let college in collegeData) {
      const option = document.createElement("option");
      option.value = college;
      option.innerText = college;
      collegeSelect.appendChild(option);
    }
  }

  const weekGrid = document.getElementById("weekGrid");
  if (weekGrid) {
    weekGrid.innerHTML = "";
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
   생성기 로직 (Generator)
================================ */
function updateMajors() {
  const college = document.getElementById("collegeSelect")?.value;
  const majorSelect = document.getElementById("majorSelect");
  if (!majorSelect) return;

  majorSelect.innerHTML = '<option value="">선택하세요</option>';
  if (college && collegeData[college]) {
    collegeData[college].forEach(major => {
      const opt = document.createElement("option");
      opt.value = major;
      opt.innerText = major;
      majorSelect.appendChild(opt);
    });
  }
  generatePrompt();
}

function generatePrompt() {
  const major = document.getElementById("majorSelect")?.value || "Major";
  const college = document.getElementById("collegeSelect")?.value || "University";
  const grammar = document.getElementById("grammarSelect")?.value || "Grammar";
  const keyword = document.getElementById("keyword")?.value || "(Topic Keyword)";
  const display = document.getElementById("promptDisplay");
  if (!display) return;

  display.innerText = `Act as a professor in ${major} (${college}).
I am a student majoring in ${major}.
Please create 3 example sentences using "${grammar}" related to the keyword "${keyword}" in the context of ${major}.
[Requirements]
1. Use professional vocabulary related to ${major}.
2. Provide a Korean translation for each sentence.
3. Explain why this grammar is used in this context.
4. Create a "Fill-in-the-blank" quiz for each sentence.`;
}

function copyPrompt() {
  const text = document.getElementById("promptDisplay")?.innerText;
  if (!text || text.includes("선택하세요")) return alert("프롬프트를 먼저 생성하세요.");
  navigator.clipboard.writeText(text).then(() => alert("복사 완료!"));
}

async function askGemini() {
  const apiResponse = document.getElementById("apiResponse");
  const resultPanel = document.getElementById("resultPanel");
  const promptText = document.getElementById("promptDisplay")?.innerText;

  if (!apiResponse || !resultPanel || !promptText) return;

  resultPanel.style.display = "block";
  apiResponse.innerText = "제미나이가 학습 자료를 생성 중입니다...";

  try {
    // ✅ Vercel API 절대 URL 호출 (중요)
    const response = await fetch(`${API_BASE}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });

    // ✅ JSON이 아닐 가능성 대비
    const raw = await response.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {}

    if (response.ok) {
      apiResponse.innerText = data.text || "(응답이 비어있습니다)";
    } else if (response.status === 429) {
      apiResponse.innerText = "무료 할당량을 모두 사용했습니다. 시간이 지나면 리셋되거나 새 키를 등록하세요.";
    } else {
      apiResponse.innerText = "에러 발생: " + (data.error || `HTTP ${response.status}\n${raw.slice(0, 200)}`);
    }
  } catch (error) {
    apiResponse.innerText = "요청 실패(대부분 CORS/도메인/서버 문제): " + (error?.message || error);
    console.error(error);
  }
}

/* ===============================
   과제 제출 및 기타 로직
================================ */
function openWeekAssignment(week) {
  document.getElementById("week-list-view").style.display = "none";
  document.getElementById("assignment-detail-view").style.display = "block";
  document.getElementById("currentWeekTitle").innerText = `Week ${week.id}`;
  document.getElementById("currentWeekTopic").innerText = week.topic;
  loadGiscus(`week-${week.id}`);
}

function backToWeekList() {
  document.getElementById("assignment-detail-view").style.display = "none";
  document.getElementById("week-list-view").style.display = "block";
  const container = document.querySelector(".giscus-container");
  if (container) container.innerHTML = "";
}

function loadGiscus(term) {
  const container = document.querySelector(".giscus-container");
  if (!container) return;
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
  script.crossOrigin = "anonymous";
  script.async = true;
  container.appendChild(script);
}

