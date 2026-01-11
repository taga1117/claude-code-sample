// DOM要素の取得
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedBtn = document.getElementById('clear-completed');

// ローカルストレージからTodoを読み込み
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Todoを保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// カウントを更新
function updateCount() {
    const remaining = todos.filter(todo => !todo.completed).length;
    const total = todos.length;
    todoCount.textContent = `${remaining}/${total}件のタスク`;
}

// Todoをレンダリング
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" data-index="${index}">&times;</button>
        `;

        todoList.appendChild(li);
    });

    updateCount();
}

// HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Todoを追加
function addTodo(text) {
    todos.push({
        text: text.trim(),
        completed: false
    });
    saveTodos();
    renderTodos();
}

// Todoを削除
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// 完了状態を切り替え
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// 完了済みを削除
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// イベントリスナー
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteTodo(index);
    }
});

todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
        const index = parseInt(e.target.dataset.index);
        toggleTodo(index);
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// 初期レンダリング
renderTodos();
