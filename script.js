// ========== DOM ELEMENTS ==========
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// ========== LOAD TASKS FROM LOCALSTORAGE ==========
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ========== INITIALIZE APP ==========
function init() {
    renderTasks();
    
    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}

// ========== ADD NEW TASK ==========
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validate input
    if (taskText === '') {
        taskInput.focus();
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage
    saveTasks();
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Re-render tasks
    renderTasks();
}

// ========== RENDER TASKS ==========
function renderTasks() {
    taskList.innerHTML = '';

    // Show empty state if no tasks
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <span>📭</span>
                <p>No tasks yet!</p>
                <p style="font-size: 0.9rem;">Add a task to get started.</p>
            </div>
        `;
        return;
    }

    // Render each task
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        
        taskList.appendChild(li);
    });

    // Add event listeners to checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', toggleTask);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// ========== TOGGLE TASK COMPLETION ==========
function toggleTask(e) {
    const id = parseInt(e.target.dataset.id);
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// ========== DELETE TASK ==========
function deleteTask(e) {
    const id = parseInt(e.target.dataset.id);
    const taskItem = e.target.closest('.task-item');
    
    // Add removing animation
    taskItem.classList.add('removing');
    
    // Wait for animation to complete before removing
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }, 400);
}

// ========== SAVE TO LOCALSTORAGE ==========
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== START THE APP ==========
init();
