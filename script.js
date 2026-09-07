// Basic To-Do app with localStorage, edit/delete, complete, keyboard support and ARIA helpers.

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', task.done ? 'Mark task as not done' : 'Mark task as done');

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;
  if (task.done) text.classList.add('completed');

  const editBtn = document.createElement('button');
  editBtn.className = 'task-btn edit';
  editBtn.type = 'button';
  editBtn.textContent = 'Edit';
  editBtn.setAttribute('aria-label', 'Edit task');

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-btn delete';
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('aria-label', 'Delete task');

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  // Events
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    saveTasks();
    renderTasks();
  });

  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  editBtn.addEventListener('click', () => {
    startEdit(task, text, editBtn);
  });

  return li;
}

function startEdit(task, textEl, editBtn) {
  const original = task.text;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = original;
  textEl.replaceWith(input);
  input.focus();
  editBtn.textContent = 'Save';
  editBtn.setAttribute('aria-label', 'Save task');

  function finish(save) {
    if (save) {
      const v = input.value.trim();
      if (v) task.text = v;
    }
    input.replaceWith(textEl);
    textEl.textContent = task.text;
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    saveTasks();
    renderTasks();
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finish(true);
    if (e.key === 'Escape') finish(false);
  });

  // Save on clicking Save button
  editBtn.onclick = () => finish(true);
}

function renderTasks() {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No tasks yet';
    taskList.appendChild(empty);
    return;
  }
  tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
}

function addTask() {
  const val = taskInput.value.trim();
  if (!val) return;
  const task = { id: Date.now(), text: val, done: false };
  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  renderTasks();
  taskInput.focus();
}

// Add keyboard support for Enter on main input
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initialize
renderTasks();

// Expose addTask for inline button onclick in your HTML
window.addTask = addTask;
