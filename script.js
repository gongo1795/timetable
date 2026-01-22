const timetable = document.getElementById("timetable");
const colors = ["#6c5ce7", "#00b894", "#e17055", "#0984e3", "#d63031"];

let classes = JSON.parse(localStorage.getItem("classes")) || [];

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function addClass() {
  const name = nameInput.value;
  const professor = professorInput.value;
  const day = daySelect.value;
  const start = startInput.value;
  const end = endInput.value;

  if (!name || !start || !end) return alert("모든 값을 입력하세요.");

  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);

  if (startMin >= endMin) return alert("시간이 올바르지 않습니다.");

  // 겹침 검사
  for (let c of classes) {
    if (c.day == day &&
        !(endMin <= c.start || startMin >= c.end)) {
      return alert("⚠️ 시간이 겹치는 수업이 있습니다.");
    }
  }

  classes.push({
    id: Date.now(),
    name,
    professor,
    day,
    start: startMin,
    end: endMin,
    color: colors[Math.floor(Math.random() * colors.length)]
  });

  save();
  render();
}

function render() {
  document.querySelectorAll(".class").forEach(el => el.remove());

  classes.forEach(c => {
    const block = document.createElement("div");
    block.className = "class";
    block.style.background = c.color;

    const top = (c.start - 540) / 60 * 60;
    const height = (c.end - c.start) / 60 * 60;

    block.style.top = `${top}px`;
    block.style.height = `${height}px`;

    block.innerHTML = `
      <strong>${c.name}</strong><br/>
      ${c.professor}
      <br/><small>삭제</small>
    `;

    block.onclick = () => {
      if (confirm("삭제할까요?")) {
        classes = classes.filter(x => x.id !== c.id);
        save();
        render();
      }
    };

    document.querySelectorAll(".day")[c.day].appendChild(block);
  });
}

function save() {
  localStorage.setItem("classes", JSON.stringify(classes));
}

function saveImage() {
  html2canvas(timetable).then(canvas => {
    const link = document.createElement("a");
    link.download = "timetable.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

render();
