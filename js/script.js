/**
 * CalcSafe – Calculator Looking Notepad
 * Copyright (c) 2025 Serhat Mert Solak
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const secretCode     = ['1','2','3','+','='];
let inputSequence    = [];

const display        = document.getElementById('display');
const buttons        = document.querySelectorAll('.btn');
const calculator     = document.querySelector('.calculator');
const secretArea     = document.getElementById('secret');
const controls       = document.getElementById('controls');
const newBtn         = document.getElementById('newNotebook');
const openBtn        = document.getElementById('openNotebooks');
const logoutBtn      = document.getElementById('logout');
const formContainer  = document.getElementById('formContainer');
const listContainer  = document.getElementById('listContainer');
const viewContainer  = document.getElementById('viewContainer');

// Calculator keys
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    trackCode(val);
    if (val === 'C') {
      updateDisplay('0'); currentInput = '';
    } else if (val === '=') {
      try {
        const res = eval(currentInput);
        updateDisplay(res); currentInput = res.toString();
      } catch {
        updateDisplay('Error'); currentInput = '';
      }
    } else {
      currentInput += val;
      updateDisplay(currentInput);
    }
  });
});

let currentInput = '';
function updateDisplay(txt) { display.textContent = txt; }


function trackCode(v) {
  inputSequence.push(v);
  if (inputSequence.length > secretCode.length) inputSequence.shift();
  if (inputSequence.join('') === secretCode.join('')) {
    openSecret();
    inputSequence = [];
  }
}


function openSecret() {
  calculator.classList.add('hidden');
  secretArea.classList.remove('hidden');
  hideAllSections();
}


function hideAllSections() {
  formContainer.classList.add('hidden');
  listContainer.classList.add('hidden');
  viewContainer.classList.add('hidden');
}

// LOCAL STORAGE OKU/YAZ
function getNotebooks() {
  return JSON.parse(localStorage.getItem('calcSafeNotebooks') || '[]');
}
function setNotebooks(arr) {
  localStorage.setItem('calcSafeNotebooks', JSON.stringify(arr));
}

// New Ledger formula
newBtn.addEventListener('click', () => {
  hideAllSections();
  formContainer.innerHTML = '';
  formContainer.classList.remove('hidden');

  const title = document.createElement('input');
  title.className = 'title';
  title.placeholder = 'Defter Başlığı...';

  const area = document.createElement('textarea');
  area.className = 'content';
  area.placeholder = 'Notlarını buraya yaz...';

  const save = document.createElement('button');
  save.textContent = 'Kaydet';
  save.className = 'save';
  save.addEventListener('click', () => {
    const t = title.value.trim();
    const c = area.value.trim();
    if (!t && !c) return alert('Başlık veya içerik girin.');
    const all = getNotebooks();
    all.push({ title: t, content: c });
    setNotebooks(all);
    alert('Defter kaydedildi 🔐');
    showList();
  });

  const cancel = document.createElement('button');
  cancel.textContent = 'İptal';
  cancel.className = 'cancel';
  cancel.addEventListener('click', hideAllSections);

  formContainer.append(title, save, cancel, area);
});

// Open Notebooks
openBtn.addEventListener('click', showList);
function showList() {
  hideAllSections();
  listContainer.innerHTML = '';
  listContainer.classList.remove('hidden');
  const all = getNotebooks();
  if (!all.length) {
    listContainer.innerHTML = '<p>Henüz defter kaydı yok.</p>';
    return;
  }
  all.forEach((notebook, i) => {
    const item = document.createElement('div');
    item.className = 'notebook-item';

    const btn = document.createElement('button');
    btn.textContent = notebook.title || '(Başlıksız)';
    btn.className = 'view-btn';
    btn.addEventListener('click', () => viewNotebook(i));

    const del = document.createElement('button');
    del.textContent = 'Sil';
    del.className = 'delete-btn';
    del.addEventListener('click', () => {
      all.splice(i,1);
      setNotebooks(all);
      showList();
    });

    item.append(btn, del);
    listContainer.appendChild(item);
  });
}

// Ledger View
function viewNotebook(idx) {
  hideAllSections();
  viewContainer.innerHTML = '';
  viewContainer.classList.remove('hidden');
  const nb = getNotebooks()[idx];

  const h3 = document.createElement('h3');
  h3.textContent = nb.title || '(Başlıksız)';
  const pre = document.createElement('pre');
  pre.textContent = nb.content;

  const back = document.createElement('button');
  back.textContent = 'Geri';
  back.className = 'back';
  back.addEventListener('click', showList);

  viewContainer.append(h3, pre, back);
}

// Log Out
logoutBtn.addEventListener('click', () => {
  secretArea.classList.add('hidden');
  calculator.classList.remove('hidden');
  currentInput = '';
  updateDisplay('0');
});
