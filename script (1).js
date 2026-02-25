// Simulado CSA — JavaScript
const PASS_THRESHOLD = 0.80; // 80%
let ALL_QUESTIONS = [];
let currentBlock = 1;
let blockQuestions = [];
let currentIndex = 0;
let answers = {}; // key: question.id -> array of selected letters

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

async function loadData(){
  const res = await fetch('questions.json');
  const data = await res.json();
  ALL_QUESTIONS = data.questions;
}

function sliceBlock(block){
  const start = (block-1)*75; // 0, 75, 150, 225
  const end = start + 75; // exclusive
  return ALL_QUESTIONS.slice(start, end);
}

function renderQuestion(){
  const q = blockQuestions[currentIndex];
  const card = $('#questionCard');
  card.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = `Questão ${currentIndex+1} de ${blockQuestions.length}`;
  card.appendChild(h);

  const p = document.createElement('p');
  p.textContent = q.question;
  card.appendChild(p);

  const ul = document.createElement('ul');
  ul.className = 'options';
  const multi = q.multi;
  const name = `q_${q.id}`;

  // previously selected
  const prevSel = answers[q.id] || [];

  q.choices.forEach(ch => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = multi ? 'checkbox' : 'radio';
    input.name = name;
    input.value = ch.key;
    if (prevSel.includes(ch.key)) input.checked = true;
    input.addEventListener('change', () => {
      if (multi){
        const sels = $all(`input[name="${name}"]:checked`).map(x => x.value);
        answers[q.id] = sels;
      } else {
        answers[q.id] = [input.value];
      }
      updateNavButtons();
    });
    const strong = document.createElement('strong');
    strong.textContent = ch.key + '.';
    const span = document.createElement('span');
    span.textContent = ch.text;
    label.appendChild(input);
    label.appendChild(strong);
    label.appendChild(span);
    li.appendChild(label);
    ul.appendChild(li);
  });
  card.appendChild(ul);
  $('#progress').textContent = `Progresso: ${currentIndex+1}/${blockQuestions.length}`;
  updateNavButtons();
}

function updateNavButtons(){
  $('#prevBtn').disabled = currentIndex === 0;
  $('#nextBtn').disabled = currentIndex >= blockQuestions.length-1;
}

function computeScore(){
  let correct = 0;
  const details = [];
  blockQuestions.forEach((q, idx) => {
    const sel = answers[q.id] || [];
    const corr = q.correct || [];
    // compare sets (order-insensitive)
    const ok = sel.length === corr.length && sel.every(s => corr.includes(s));
    if (ok) correct++;
    details.push({
      index: idx+1,
      id: q.id,
      question: q.question,
      selected: sel,
      correct: corr,
      ok
    });
  });
  return { correct, total: blockQuestions.length, details };
}

function showResult(){
  const { correct, total, details } = computeScore();
  const perc = correct/total;
  $('#scoreText').textContent = `Você acertou ${correct} de ${total} questões (${(perc*100).toFixed(1)}%).`;
  $('#passFail').textContent = perc >= PASS_THRESHOLD ? 'Status: APROVADO (≥ 80%)' : 'Status: REPROVADO (< 80%)';
  // Build table
  const tbody = $('#answerTable tbody');
  tbody.innerHTML = '';
  details.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = d.ok ? 'correct' : 'wrong';
    const td1 = document.createElement('td'); td1.textContent = d.index;
    const td2 = document.createElement('td'); td2.textContent = d.question;
    const td3 = document.createElement('td'); td3.textContent = d.selected.length? d.selected.join(', ') : '—';
    const td4 = document.createElement('td'); td4.textContent = d.correct.join(', ');
    const td5 = document.createElement('td'); td5.textContent = d.ok ? '✔ Correta' : '✘ Errada';
    tr.append(td1, td2, td3, td4, td5);
    tbody.appendChild(tr);
  });
}

function reset(){
  currentIndex = 0;
  answers = {};
  $('#setup').classList.remove('hidden');
  $('#quiz').classList.add('hidden');
  $('#result').classList.add('hidden');
}

// Event wiring
window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  $('#startBtn').addEventListener('click', () => {
    currentBlock = parseInt($('#block').value, 10);
    blockQuestions = sliceBlock(currentBlock);
    currentIndex = 0;
    answers = {}; // clear
    $('#setup').classList.add('hidden');
    $('#quiz').classList.remove('hidden');
    renderQuestion();
  });
  $('#prevBtn').addEventListener('click', () => { if (currentIndex>0){ currentIndex--; renderQuestion(); } });
  $('#nextBtn').addEventListener('click', () => { if (currentIndex<blockQuestions.length-1){ currentIndex++; renderQuestion(); } });
  $('#finishBtn').addEventListener('click', () => {
    $('#quiz').classList.add('hidden');
    $('#result').classList.remove('hidden');
    showResult();
    // Persist locally
    try {
      const payload = { when: new Date().toISOString(), block: currentBlock, answers };
      localStorage.setItem('simulado_csa_last', JSON.stringify(payload));
    } catch(e){ /* ignore */ }
  });
  $('#restartBtn').addEventListener('click', reset);
});
