/**
 * To-Do List Pro Application
 * A feature-rich task management app with categories, priorities, dates, and more
 */

// ===========================
// State Management
// ===========================

let tasks = [];
let currentFilter = 'all';
let currentCategoryFilter = '';
let searchQuery = '';
let editingTaskId = null;
let draggedElement = null;

// ===========================
// DOM Elements
// ===========================

const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const categoryInput = document.getElementById('categoryInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const clearCompleted = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');

// Modal elements
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');
const editTaskInput = document.getElementById('editTaskInput');
const editDueDateInput = document.getElementById('editDueDateInput');
const editCategoryInput = document.getElementById('editCategoryInput');
const editPriorityInput = document.getElementById('editPriorityInput');

// ===========================
// Initialize App
// ===========================

function init() {
    loadTasksFromStorage();
    loadDarkModePreference();
    renderTasks();
    attachEventListeners();
}

// ===========================
// Event Listeners
// ===========================

function attachEventListeners() {
    // Add task
    addBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });

    // Clear completed
    clearCompleted.addEventListener('click', handleClearCompleted);

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            updateFilterButtons();
            renderTasks();
        });
    });

    // Category filter buttons
    categoryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategoryFilter = btn.dataset.category;
            updateCategoryFilterButtons();
            renderTasks();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Modal events
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    saveEdit.addEventListener('click', handleSaveEdit);

    // Close modal on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !editModal.classList.contains('hidden')) {
            closeEditModal();
        }
    });
}

// ===========================
// Task Operations
// ===========================

/**
 * Add a new task
 */
function handleAddTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        category: categoryInput.value,
        priority: priorityInput.value,
        dueDate: dueDateInput.value,
        createdAt: new Date().toISOString(),
        order: tasks.length
    };

    tasks.unshift(newTask);

    // Reset inputs
    taskInput.value = '';
    dueDateInput.value = '';
    categoryInput.value = '';
    priorityInput.value = 'medium';
    taskInput.focus();

    saveTasksToStorage();
    renderTasks();
}

/**
 * Toggle task completion status
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
    }
}

/**
 * Delete a task
 */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage();
    renderTasks();
}

/**
 * Open edit modal for a task
 */
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;
    editTaskInput.value = task.text;
    editDueDateInput.value = task.dueDate || '';
    editCategoryInput.value = task.category || '';
    editPriorityInput.value = task.priority || 'medium';

    editModal.classList.remove('hidden');
    editTaskInput.focus();
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.classList.add('hidden');
    editingTaskId = null;
}

/**
 * Save edited task
 */
function handleSaveEdit() {
    if (!editingTaskId) return;

    const task = tasks.find(t => t.id === editingTaskId);
    if (!task) return;

    const newText = editTaskInput.value.trim();
    if (newText === '') {
        editTaskInput.focus();
        return;
    }

    task.text = newText;
    task.dueDate = editDueDateInput.value;
    task.category = editCategoryInput.value;
    task.priority = editPriorityInput.value;

    saveTasksToStorage();
    renderTasks();
    closeEditModal();
}

/**
 * Clear all completed tasks
 */
function handleClearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    tasks = tasks.filter(t => !t.completed);
    saveTasksToStorage();
    renderTasks();
}

// ===========================
// Drag and Drop
// ===========================

/**
 * Handle drag start
 */
function handleDragStart(e, id) {
    draggedElement = e.currentTarget;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

/**
 * Handle drag over
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(taskList, e.clientY);
    const draggable = document.querySelector('.dragging');

    if (afterElement == null) {
        taskList.appendChild(draggable);
    } else {
        taskList.insertBefore(draggable, afterElement);
    }
}

/**
 * Handle drag end
 */
function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');

    // Update task order based on current DOM order
    const taskElements = Array.from(taskList.children);
    taskElements.forEach((element, index) => {
        const taskId = parseInt(element.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.order = index;
        }
    });

    // Sort tasks by order
    tasks.sort((a, b) => a.order - b.order);
    saveTasksToStorage();
}

/**
 * Get element after drag position
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ===========================
// Dark Mode
// ===========================

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    // Toggle icons
    const sunIcon = darkModeToggle.querySelector('.sun-icon');
    const moonIcon = darkModeToggle.querySelector('.moon-icon');

    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    // Save preference
    localStorage.setItem('darkMode', isDark);
}

/**
 * Load dark mode preference
 */
function loadDarkModePreference() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const sunIcon = darkModeToggle.querySelector('.sun-icon');
        const moonIcon = darkModeToggle.querySelector('.moon-icon');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// ===========================
// Rendering
// ===========================

/**
 * Render all tasks based on filters
 */
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Clear current list
    taskList.innerHTML = '';

    // Show/hide empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        taskList.style.display = 'none';
    } else {
        emptyState.classList.add('hidden');
        taskList.style.display = 'flex';

        // Render each task
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    updateTaskCount();
}

/**
 * Create a task list item element
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', 'true');

    // Drag events
    li.addEventListener('dragstart', (e) => handleDragStart(e, task.id));
    li.addEventListener('dragend', handleDragEnd);
    li.addEventListener('dragover', handleDragOver);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task as complete');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task content container
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    taskText.addEventListener('dblclick', () => openEditModal(task.id));

    // Task meta (category, priority, due date)
    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';

    if (task.category) {
        const categoryBadge = document.createElement('span');
        categoryBadge.className = `task-category ${task.category}`;
        categoryBadge.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);
        taskMeta.appendChild(categoryBadge);
    }

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `task-priority ${task.priority}`;
    priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    taskMeta.appendChild(priorityBadge);

    if (task.dueDate) {
        const dueDateBadge = document.createElement('span');
        const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
        dueDateBadge.className = `task-due-date ${isOverdue ? 'overdue' : ''}`;
        dueDateBadge.textContent = `📅 ${formatDate(task.dueDate)}`;
        taskMeta.appendChild(dueDateBadge);
    }

    taskContent.appendChild(taskText);
    if (taskMeta.children.length > 0) {
        taskContent.appendChild(taskMeta);
    }

    // Task actions
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.5 2.5L15.5 5.5M2 16L2 13L11.5 3.5L14.5 6.5L5 16H2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    editBtn.addEventListener('click', () => openEditModal(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    // Assemble task item
    li.appendChild(checkbox);
    li.appendChild(taskContent);
    li.appendChild(taskActions);

    return li;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

/**
 * Update the task count display
 */
function updateTaskCount() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    const taskWord = activeTasks === 1 ? 'task' : 'tasks';
    taskCount.textContent = `${activeTasks} ${taskWord} remaining`;
}

/**
 * Update active filter button
 */
function updateFilterButtons() {
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Update active category filter button
 */
function updateCategoryFilterButtons() {
    categoryFilterBtns.forEach(btn => {
        if (btn.dataset.category === currentCategoryFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===========================
// Filtering
// ===========================

/**
 * Get filtered tasks based on current filters and search
 */
function getFilteredTasks() {
    let filtered = tasks;

    // Filter by completion status
    switch (currentFilter) {
        case 'active':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'all':
        default:
            break;
    }

    // Filter by category
    if (currentCategoryFilter) {
        filtered = filtered.filter(t => t.category === currentCategoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.text.toLowerCase().includes(searchQuery)
        );
    }

    // Sort by order
    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));

    return filtered;
}

// ===========================
// Local Storage
// ===========================

/**
 * Save tasks to localStorage
 */
function saveTasksToStorage() {
    try {
        localStorage.setItem('todoTasksPro', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

/**
 * Load tasks from localStorage
 */
function loadTasksFromStorage() {
    try {
        // Clear old storage keys from previous versions
        const oldKey = localStorage.getItem('todoTasks');
        if (oldKey) {
            localStorage.removeItem('todoTasks');
        }

        const stored = localStorage.getItem('todoTasksPro');
        if (stored) {
            const loadedTasks = JSON.parse(stored);
            // Validate that tasks have required fields
            tasks = loadedTasks.filter(task =>
                task.id && task.text !== undefined
            );
            // Ensure all tasks have proper structure
            tasks = tasks.map((task, index) => ({
                id: task.id,
                text: task.text,
                completed: task.completed || false,
                category: task.category || '',
                priority: task.priority || 'medium',
                dueDate: task.dueDate || '',
                createdAt: task.createdAt || new Date().toISOString(),
                order: task.order !== undefined ? task.order : index
            }));
        } else {
            tasks = [];
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = [];
    }
}

// ===========================
// Initialize Application
// ===========================

document.addEventListener('DOMContentLoaded', init);
