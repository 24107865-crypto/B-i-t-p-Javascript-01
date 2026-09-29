// ----- Danh sách 5 môn học -----
const SUBJECTS = [
  "Giải tích 1",
  "Đại số tuyến tính",
  "Xác suất thống kê",
  "Tin học đại cương",
  "Xây dựng ứng dụng Web"
];
 
// ----- Hàm tính điểm trung bình -----
// Input: mảng điểm 5 môn
// Output: điểm trung bình
function calculateAverage(scores) {
  const sum = scores.reduce((total, score) => total + score, 0);
  return sum / scores.length;
}
 
// ----- Hàm xếp loại học tập -----
function classify(avg) {
  if (avg >= 8.0) return { label: "Giỏi", css: "badge--gioi" };
  if (avg >= 6.5) return { label: "Khá", css: "badge--kha" };
  if (avg >= 5.0) return { label: "Trung bình", css: "badge--trungbinh" };
  return { label: "Yếu", css: "badge--yeu" };
}
 
// ----- DOM references -----
const form = document.getElementById("grade-form");
const nameInput = document.getElementById("student-name");
const scoreInputs = [1, 2, 3, 4, 5].map(i => document.getElementById(`score-${i}`));
const resultSection = document.getElementById("result");
const resultName = document.getElementById("result-name");
const resultAvg = document.getElementById("result-avg");
const resultBadge = document.getElementById("result-badge");
const resultBody = document.getElementById("result-body");
 
function clearErrors() {
  document.getElementById("err-name").textContent = "";
  nameInput.classList.remove("is-invalid");
  scoreInputs.forEach((input, i) => {
    document.getElementById(`err-${i + 1}`).textContent = "";
    input.classList.remove("is-invalid");
  });
}
 
function setError(errorId, inputEl, message) {
  document.getElementById(errorId).textContent = message;
  inputEl.classList.add("is-invalid");
}
 
// ----- Kiểm tra dữ liệu nhập -----
function validate() {
  let isValid = true;
  const name = nameInput.value.trim();
 
  if (name === "") {
    setError("err-name", nameInput, "Vui lòng nhập tên sinh viên.");
    isValid = false;
  }
 
  const scores = [];
 
  scoreInputs.forEach((input, i) => {
    const raw = input.value.trim();
    const errorId = `err-${i + 1}`;
 
    if (raw === "") {
      setError(errorId, input, "Không được để trống.");
      isValid = false;
      scores.push(null);
      return;
    }
 
    const value = Number(raw);
 
    if (Number.isNaN(value) || value < 0 || value > 10) {
      setError(errorId, input, "Điểm phải từ 0 đến 10.");
      isValid = false;
      scores.push(null);
      return;
    }
 
    scores.push(value);
  });
 
  return { isValid, name, scores };
}
 
// ----- Hiển thị kết quả -----
function renderResult(name, scores) {
  const avg = calculateAverage(scores);
  const { label, css } = classify(avg);
 
  resultName.textContent = name;
  resultAvg.textContent = avg.toFixed(2);
  resultBadge.textContent = label;
  resultBadge.className = `badge ${css}`;
 
  resultBody.innerHTML = "";
  SUBJECTS.forEach((subject, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${subject}</td>
      <td class="table__num">${scores[i].toFixed(1)}</td>
    `;
    resultBody.appendChild(row);
  });
 
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
 
// ----- Xử lý submit form (không reload trang) -----
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
 
  const { isValid, name, scores } = validate();
  if (!isValid) {
    resultSection.hidden = true;
    return;
  }
 
  renderResult(name, scores);
});
 
// ----- Xử lý nút Xoá -----
document.getElementById("reset-btn").addEventListener("click", () => {
  clearErrors();
  resultSection.hidden = true;
});