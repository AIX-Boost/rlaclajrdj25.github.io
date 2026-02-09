/* script.js */

// ★★★ 설정: Giscus ID 수정 필수 ★★★
const GISCUS_REPO = "rlaclajrdj25/rlaclajrdj25.github.io"; 
const GISCUS_REPO_ID = "R_kgDOL...";       // ★ 본인 ID
const GISCUS_CATEGORY_ID = "DIC_kwDOL..."; // ★ 본인 Category ID

// --- 데이터 ---
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

// --- 페이지 로드 시 실행 ---
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 생성기 페이지 로직 (generator.html)
    const collegeSelect = document.getElementById('collegeSelect');
    if (collegeSelect) {
        for (let college in collegeData) {
            let option = document.createElement('option');
            option.value = college;
            option.innerText = college;
            collegeSelect.appendChild(option);
        }
        generatePrompt(); // 초기 실행
    }

    // 2. 과제제출 페이지 로직 (submission.html)
    const weekGrid = document.getElementById('weekGrid');
    if (weekGrid) {
        weeks.forEach(week => {
            const card = document.createElement('div');
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

    // 3. 퀴즈 페이지 로직 (quiz.html) - 인라인 onclick으로 처리됨
});

// --- 함수들 ---

// 학과 업데이트 (생성기)
function updateMajors() {
    const collegeSelect = document.getElementById('collegeSelect');
    const majorSelect = document.getElementById('majorSelect');
    if(!collegeSelect || !majorSelect) return;

    const selectedCollege = collegeSelect.value;
    majorSelect.innerHTML = '<option value="">학과를 선택하세요</option>';
    
    if (selectedCollege && collegeData[selectedCollege]) {
        collegeData[selectedCollege].forEach(major => {
            let option = document.createElement('option');
            option.value = major;
            option.innerText = major;
            majorSelect.appendChild(option);
        });
    }
    generatePrompt();
}

// 프롬프트 생성 (생성기)
function generatePrompt() {
    const college = document.getElementById('collegeSelect').value || "University";
    const major = document.getElementById('majorSelect').value || "Major";
    const grammar = document.getElementById('grammarSelect').value;
    const keyword = document.getElementById('keyword').value || "(Topic Keyword)";
    const txt = `Act as a professor in ${major} (${college}).
I am a student majoring in ${major}.
Please create 3 example sentences using "${grammar}" related to the keyword "${keyword}" in the context of ${major}.
[Requirements]
1. Use professional vocabulary related to ${major}.
2. Provide a Korean translation for each sentence.
3. Explain why this grammar is used in this context.
4. Create a "Fill-in-the-blank" quiz for each sentence.`;
    
    const display = document.getElementById('promptDisplay');
    if(display) display.innerText = txt;
}

function copyPrompt() {
    const text = document.getElementById('promptDisplay').innerText;
    navigator.clipboard.writeText(text).then(() => alert('복사되었습니다!'));
}

// 주차별 과제 열기 (과제제출)
function openWeekAssignment(week) {
    document.getElementById('week-list-view').style.display = 'none';
    document.getElementById('assignment-detail-view').style.display = 'block';
    
    document.getElementById('currentWeekTitle').innerHTML = `${week.id}주차: ${week.title}`;
    document.getElementById('currentWeekTopic').innerText = week.topic;

    const termName = `${week.id}주차: ${week.title}`;
    loadGiscus(termName);
}

function backToWeekList() {
    document.getElementById('assignment-detail-view').style.display = 'none';
    document.getElementById('week-list-view').style.display = 'block';
    const container = document.querySelector('.giscus-container');
    if(container) container.innerHTML = '';
}

// Giscus 로드
function loadGiscus(term) {
    const container = document.querySelector('.giscus-container');
    if(!container) return;
    container.innerHTML = ""; 

    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_REPO);
    script.setAttribute("data-repo-id", GISCUS_REPO_ID);
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", GISCUS_CATEGORY_ID);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "ko");
    script.crossOrigin = "anonymous";
    script.async = true;
    container.appendChild(script);
}

// 본인의 API 키를 여기에 입력하세요
const GEMINI_API_KEY = "AIzaSyCqJgF80PJUa8d726b_5Pv2Uve64qx_aUc"; 

async function askGemini() {
    const promptText = document.getElementById('promptDisplay').innerText;
    const responseDisplay = document.getElementById('apiResponse');
    const resultPanel = document.getElementById('resultPanel');
    const btn = document.getElementById('generateBtn');

    if (promptText === "Loading..." || promptText === "조건을 선택하세요...") {
        alert("먼저 학습 조건을 설정해주세요!");
        return;
    }

    // 상태 업데이트
    resultPanel.style.display = "block";
    responseDisplay.innerText = "AI가 답변을 생성하고 있습니다. 잠시만 기다려주세요...";
    btn.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiResult = data.candidates[0].content.parts[0].text;
            // 결과를 화면에 출력
            responseDisplay.innerText = aiResult;
        } else {
            responseDisplay.innerText = "답변을 가져오지 못했습니다. 다시 시도해주세요.";
        }
    } catch (error) {
        console.error("Error:", error);
        responseDisplay.innerText = "오류가 발생했습니다: " + error.message;
    } finally {
        btn.disabled = false;
    }
}

// 생성된 학습 자료를 복사하는 함수
function copyResult() {
    const resultText = document.getElementById('apiResponse').innerText;
    
    // 내용이 비어있거나 초기 메시지인 경우 방지
    if (resultText.includes("기다리는 중") || resultText === "") {
        alert("복사할 내용이 없습니다.");
        return;
    }

    navigator.clipboard.writeText(resultText).then(() => {
        alert('학습 자료가 클립보드에 복사되었습니다! 메모장이나 과제 창에 붙여넣으세요.');
    }).catch(err => {
        console.error('복사 실패:', err);
    });
}
