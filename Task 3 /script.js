// DOM Elements
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

// Globals
let tasks = [];

// Load saved tasks (from LocalStorage)
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
}

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';

  const searchText = searchInput.value.toLowerCase();
  const filter = statusFilter.value;
  
  tasks
    .filter(task => task.text.toLowerCase().includes(searchText))
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .forEach(task => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';

      li.innerHTML = `
        <span>${task.text}</span>
        <div>
          <button class="action-btn edit-btn">✏️</button>
          <button class="action-btn delete-btn">🗑️</button>
          <input type="checkbox" class="complete-toggle" ${task.completed ? 'checked':''}>
        </div>
      `;

      // Toggle completed
      li.querySelector('.complete-toggle').addEventListener('change', () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

      // Delete
      li.querySelector('.delete-btn').addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      });

      // Edit
      li.querySelector('.edit-btn').addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText) {
          task.text = newText;
          saveTasks();
          renderTasks();
        }
      });

      taskList.appendChild(li);
    });
}

// Add new task
addTaskBtn.addEventListener('click', () => {
  if (!newTaskInput.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: newTaskInput.value.trim(),
    completed: false
  });

  newTaskInput.value = '';
  saveTasks();
  renderTasks();
});

// Search
searchInput.addEventListener('input', renderTasks);

// Filter
statusFilter.addEventListener('change', renderTasks);

// Initial load
loadTasks();
renderTasks();
