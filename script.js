/* ===============================
   데이터 및 설정
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

/* ===============================
   초기 로드 및 이벤트
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
});

/* ===============================
   핵심 로직 함수
================================ */

// 1. 학과 목록 업데이트
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

// 2. 실시간 프롬프트 생성
function generatePrompt() {
  const college = document.getElementById("collegeSelect")?.value || "University";
  const major = document.getElementById("majorSelect")?.value || "Major";
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

// 3. 프롬프트 복사 기능 (이미지의 '프롬프트 복사' 버튼)
function copyPrompt() {
  const text = document.getElementById("promptDisplay")?.innerText;
  if (!text || text.includes("선택하세요")) {
    alert("복사할 프롬프트가 없습니다.");
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    alert("프롬프트가 복사되었습니다!");
  }).catch(() => {
    // Fallback
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    alert("프롬프트가 복사되었습니다!");
  });
}

// 4. AI 생성 요청 (이미지의 '생성 요청하기' 버튼)
async function askGemini() {
  const prompt = document.getElementById("promptDisplay")?.innerText;
  const resultPanel = document.getElementById("resultPanel");
  const apiResponse = document.getElementById("apiResponse");
  const generateBtn = document.getElementById("generateBtn");

  if (!prompt || prompt.includes("선택하세요") || prompt.includes("(Topic Keyword)")) {
    alert("단과대, 학과, 키워드를 모두 입력해 주세요.");
    return;
  }

  // UI 업데이트
  resultPanel.style.display = "block";
  apiResponse.innerText = "AI 튜터가 자료를 생성 중입니다... (약 5~10초 소요)";
  generateBtn.disabled = true;

  try {
    // ⚠️ 여기에 실제 Gemini API 호출 fetch 코드가 들어가야 합니다.
    // 지금은 우선 작동 확인을 위한 시뮬레이션 메시지를 띄웁니다.
    setTimeout(() => {
      apiResponse.innerText = "현재 API 연결 설정이 필요합니다.\n\n" + 
                                "1. API Key가 script.js에 등록되어 있는지 확인하세요.\n" +
                                "2. 오늘 사용량을 모두 소진했다면 내일 오후 5시에 리셋됩니다.\n" +
                                "3. 복사된 프롬프트를 오른쪽 하단 Dify 챗봇에 붙여넣어 보세요!";
      generateBtn.disabled = false;
    }, 2000);
  } catch (error) {
    apiResponse.innerText = "오류 발생: " + error.message;
    generateBtn.disabled = false;
  }
}

// 5. 생성된 결과물 복사
function copyResult() {
  const res = document.getElementById("apiResponse")?.innerText;
  navigator.clipboard.writeText(res).then(() => alert("결과가 복사되었습니다!"));
}
