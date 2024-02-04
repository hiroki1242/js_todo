// 変数の初期化
const input = document.getElementById('input'),
      form = document.getElementById('form'),
      ul = document.getElementById('ul');

const all = document.getElementById('all'),
      done = document.getElementById('done'),
      undone = document.getElementById('undone');

// タスクカウントを増やす
const plusCount = (type) => {
  // memo: textContentへ代入時に自動でStringに変換される
  type.textContent = Number(type.textContent) + 1;
};

// タスクカウントを減らす
const minusCount = (type) => {
  type.textContent = Number(type.textContent) - 1;
};

// inputタグに属性を追加する
const setAttributeToInput = (inputDom, value, className) => {
  inputDom.type = 'button';
  inputDom.value = value;
  inputDom.className = className;
}

// 編集機能で使う削除ボタンとチェックボックスの表示を切り替える
const toggleDisplay = (li, displayStatus) => {
  const buttons = ['input[type="checkbox"]', '.edit', '.delete'];
  buttons.forEach(selector => {
    const element = li.querySelector(selector);
    element.style.display = displayStatus;
  }) 
};

// 編集ボタンの機能
const editTask = (e) => {
  let li = e.target.parentNode;
  let p = li.querySelector('p');
  let input = document.createElement('input');
  input.type = 'text';
  input.value = p.textContent;
  li.insertBefore(input, p);
  li.removeChild(p);

  // 保存ボタンを作成
  let saveBtn = document.createElement('input');
  setAttributeToInput(saveBtn, '保存', 'save');

  saveBtn.addEventListener("click", (e) => {
    let li = e.target.parentNode;
    let input = li.querySelector('input[type=text]');
    let p = document.createElement('p');
    p.textContent = input.value;
    li.insertBefore(p, input);
    li.removeChild(input);
    li.removeChild(e.target);

    toggleDisplay(li, 'inline');
  });

  li.appendChild(saveBtn);
  toggleDisplay(li, 'none');
};

// 削除ボタンの機能
const deleteTask = (e) => {
  let confirm = window.confirm('本当に削除してもよろしいですか？');
  if (confirm){
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log('削除されました');
    minusCount(all);

    // 完了、未完了カウントの調整
    let checkBox = e.target.parentNode.querySelector('input[type="checkbox"]');
    if (checkBox && checkBox.checked) {
      minusCount(done);
    } else {
      minusCount(undone);
    }
  }
};

// 追加のTODO要素を作成
const makeLi = (todoTxt) => {
  let li = document.createElement('li'); 

  let checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');

  checkBox.addEventListener('change', () => {
    if (checkBox.checked) {
      plusCount(done);
      minusCount(undone);
    } else {
      minusCount(done);
      plusCount(undone);
    }
  });

  let p = document.createElement('p');
  p.textContent = todoTxt;

  let editBtn = document.createElement('input');
  setAttributeToInput(editBtn, '編集', 'edit');
  editBtn.addEventListener("click", editTask);

  let deleteBtn = document.createElement('input');
  setAttributeToInput(deleteBtn, '削除', 'delete')
  deleteBtn.addEventListener("click", deleteTask);

  li.append(checkBox, p, editBtn, deleteBtn);
  
  return li
}

// タスクを追加する機能
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let todoTxt = input.value;
  if (!todoTxt) return;

  let li = makeLi(todoTxt);
  ul.appendChild(li);

  plusCount(all);
  plusCount(undone);

  input.value = '';
});
