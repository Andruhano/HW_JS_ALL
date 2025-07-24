document.addEventListener('DOMContentLoaded', () => {
    const appendTaskButton = document.getElementById('append-task');
    if (!appendTaskButton) throw "append-task not found";
    appendTaskButton.addEventListener('click', appendTaskClick);

    const printTaskButton = document.getElementById('print-task');
    if (!printTaskButton) throw "print-task not found";
    printTaskButton.addEventListener('click', printTaskClick);

    const todoList = document.getElementById('todo-list');
    if (!todoList) throw "todo-list not found";
    window.todoList = todoList;

    const taskTemplate = document.getElementById('task-template');
    if (!taskTemplate) throw "task-template not found";
    window.taskTemplate = taskTemplate; 

    updateClickListeners();
});

function updateClickListeners() {
    for (let btn of document.querySelectorAll('[data-action="insert"]')) {
        btn.onclick = insertButtonClick;
    }
    for (let btn of document.querySelectorAll('[data-action="delete"]')) {
        btn.onclick = deleteButtonClick;
    }
    for (let btn of document.querySelectorAll('[data-action="move-up"]')) {
        btn.onclick = moveUpButtonClick;
    }
    for (let btn of document.querySelectorAll('[data-action="move-down"]')) {
        btn.onclick = moveDownButtonClick;
    }
    for (let btn of document.querySelectorAll('[data-action="edit"]')) {
        btn.onclick = editButtonClick;
    }
}

function deleteButtonClick(e) {
    const li = e.target.closest("li");
    window.todoList.removeChild(li);
    updateClickListeners();
}

function insertButtonClick(e) {
    const li = e.target.closest('li');
    const taskContent = prompt("Введіть зміст нової задачі:", "Нова задача");
    if (taskContent === null || taskContent.trim() === '') return;

    const newTask = window.taskTemplate.cloneNode(true);
    newTask.style.display = 'flex'; 
    newTask.querySelector('span').innerText = taskContent;
    window.todoList.insertBefore(newTask, li);
    updateClickListeners();
}

function moveUpButtonClick(e) {
    const li = e.target.closest('li');
    const prev = li.previousElementSibling;
    if (prev && prev.id !== 'task-template') {
        window.todoList.insertBefore(li, prev);
    }
}

function moveDownButtonClick(e) {
    const li = e.target.closest('li');
    const next = li.nextElementSibling;
    if (next && next.id !== 'task-template') {
        window.todoList.insertBefore(next, li);
    }
}

function editButtonClick(e) {
    const li = e.target.closest('li');
    const span = li.querySelector('span');
    const newContent = prompt("Редагуйте зміст задачі:", span.innerText);
    if (newContent === null || newContent.trim() === '') return;
    span.innerText = newContent;
}

function printTaskClick() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) throw "todo-list not found";
    
    const existingSheet = document.querySelector('div[style*="border: 1px solid lightgray"]');
    if (existingSheet) existingSheet.remove();
    
    let txt = "";
    for (let li of todoList.children) {
        if (li.id !== 'task-template') {
            txt += li.querySelector('span').innerText + '\r\n';
        }
    }
    
    const sheet = document.createElement('div');
    sheet.style.border = "1px solid lightgray";
    sheet.style.margin = "10px";
    sheet.style.padding = "10px";
    sheet.style['box-shadow'] = "5px 5px 3px #ddd";
    sheet.innerText = txt;
    document.body.appendChild(sheet);
    console.log(txt);
}

function appendTaskClick() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) throw "todo-list not found";
    
    const taskContent = prompt("Введіть зміст нової задачі:", "Нова задача");
    if (taskContent === null || taskContent.trim() === '') return;

    const newTask = window.taskTemplate.cloneNode(true);
    newTask.style.display = 'flex'; 
    newTask.removeAttribute('id'); 
    newTask.querySelector('span').innerText = taskContent;
    todoList.appendChild(newTask);
    updateClickListeners();
}