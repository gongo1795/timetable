const colors = ["#6c5ce7", "#00b894", "#e17055", "#0984e3", "#d63031"];

let timetables = JSON.parse(localStorage.getItem("timetables")) || {};
let currentId = localStorage.getItem("currentId") || null;

/* 저장 */
function saveAll() {
  localStorage.setItem("timetables", JSON.stringify(timetables));
  localStorage.setItem("currentId", currentId);
}

/* 시간표 생성 */
function createTimetable() {
  const name = prompt("시간표 이름을 입력하세요");
  if (!name) return;

  const id = Date.now().toString();
  timetables[id] = {
    name,
    classes: []
  };
  currentId = id;
  saveAll();
  renderTimetableSelect();
  render();
}

/* 시간표 선택 렌더 */
function renderTimetableSelect() {
  timetableSelect.innerHTML = "";
  Object.entries(timetables).forEach(([id, t]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = t.name;
    if (id === currentId) opt.selected = true;
    timetableSelect.appendChild(opt);
  });
}

timetableSelect.onchange = e => {
  currentId = e.target.value;
  saveAll();
  render();
};

/* 시간 변환 */
function timeToMin(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/* 수업 등록 */
function addClass() {
  if (!currentId) return;

  const name = nameInput.value;
  const prof = professorInput.value;
  const day = daySelect.value;
  const start = startInput.value;
  const end = endInput.value;

  if (!name || !start || !end) {
    alert("모든 값을 입력하세요");
    return;
  }

  timetables[currentId].classes.push({
    id: Date.now(),
    name,
    prof,
    day,
    start: timeToMin(start),
    end: timeToMin(end),
    color: colors[Math.floor(Math.random() * colors.length)],
    active: false
  });

  nameInput.value = "";
  professorInput.value = "";

  saveAll();
  render();
}

/* 전체 렌더 */
function render() {
  renderList();
  renderTable();
}

/* 수업 목록 */
function renderList() {
  classList.innerHTML = "";
  const classes = timetables[currentId].classes;

  classes.forEach(c => {
    const li = document.createElement("li");

    li.innerHTML = `
      <label>
        <input type="checkbox" ${c.active ? "checked" : ""}>
        ${c.name}
      </label>
      <button>삭제</button>
    `;

    li.querySelector("input").onchange = e => {
      c.active = e.target.checked;
      saveAll();
      renderTable();
    };

    li.querySelector("button").onclick = () => {
      timetables[currentId].classes =
        timetables[currentId].classes.filter(x => x.id !== c.id);
      saveAll();
      render();
    };

    classList.appendChild(li);
  });
}

/* 시간표 */
function renderTable() {
  document.querySelectorAll(".class").forEach(e => e.remove());

  timetables[currentId].classes
    .filter(c => c.active)
    .forEach(c => {
      const block = document.createElement("div");
      block.className = "class";
      block.style.background = c.color;
      block.style.top = (c.start - 540) + "px";
      block.style.height = (c.end - c.start) + "px";
      block.innerHTML = `<b>${c.name}</b><br>${c.prof || ""}`;

      document.querySelectorAll(".day")[c.day].appendChild(block);
    });
}

/* 초기 실행 */
if (!currentId || !timetables[currentId]) {
  createTimetable();
} else {
  renderTimetableSelect();
  render();
}
