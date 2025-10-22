const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');

function createTaskElement(taskText) {
    const listItem = document.createElement('li');
    listItem.className = 'task';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
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
    taskList.querySelectorAll('.task span').forEach(taskSpan => {
        tasks.push(taskSpan.textContent);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(taskText => {
        const newTask = createTaskElement(taskText);
        taskList.appendChild(newTask);
    });
}

loadTasksFromLocalStorage();

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