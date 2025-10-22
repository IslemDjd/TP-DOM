const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');

// Function to create a task element
function createTaskElement(taskText, isCompleted = false) {
    const listItem = document.createElement('li');
    listItem.className = 'task';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = isCompleted;
    checkbox.addEventListener('change', () => {
        taskSpan.classList.toggle('completed', checkbox.checked);
        saveTasksToLocalStorage();
    });
    listItem.appendChild(checkbox);

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    if (isCompleted) {
        taskSpan.classList.add('completed');
    }
    listItem.appendChild(taskSpan);

    const buttonContainer = document.createElement('div');

    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.className = 'edit-button';
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.className = 'delete-button';
    buttonContainer.appendChild(deleteButton);

    listItem.appendChild(buttonContainer);

    editButton.addEventListener('click', () => editTask(listItem, taskSpan, editButton));
    deleteButton.addEventListener('click', () => deleteTask(listItem));

    return listItem;
}

function editTask(listItem, taskSpan, editButton) {
    if (editButton.textContent === 'Modifier') {
        taskSpan.contentEditable = true;
        taskSpan.focus();
        listItem.classList.add('edit-mode');
        editButton.textContent = 'Sauvegarder';
    } else {
        taskSpan.contentEditable = false;
        listItem.classList.remove('edit-mode');
        editButton.textContent = 'Modifier';
        saveTasksToLocalStorage();
    }
}

function deleteTask(listItem) {
    listItem.remove();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('.task').forEach(taskItem => {
        const taskSpan = taskItem.querySelector('span');
        const isCompleted = taskItem.querySelector('.task-checkbox').checked;
        tasks.push({
            text: taskSpan.textContent,
            completed: isCompleted
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
            const newTask = createTaskElement(task.text, task.completed);
            taskList.appendChild(newTask);
    });
}

function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll('.task-checkbox:checked');
    completedTasks.forEach(checkbox => {
        const listItem = checkbox.closest('.task');
        listItem.remove();
    });
    saveTasksToLocalStorage();
}

loadTasksFromLocalStorage();

const clearCompletedButton = document.getElementById('clearCompletedButton');
clearCompletedButton.addEventListener('click', clearCompletedTasks);

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        errorMessage.textContent = 'Veuillez entrer une tâche.';
        return;
    }

    errorMessage.textContent = '';

    const newTask = createTaskElement(taskText);
    taskList.appendChild(newTask);
    taskInput.value = '';
    saveTasksToLocalStorage();
});