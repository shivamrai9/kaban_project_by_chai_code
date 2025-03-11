document.addEventListener("DOMContentLoaded", () => {
    loadBoards(); // Load saved boards and tasks
});

function createNewBoard() {
    const boardTitle = prompt("Create new board:");
    if (!boardTitle) return;

    const container = document.getElementById("taskBoardContainer");
    const newBoard = document.createElement("div");
    const boardId = `board-${Date.now()}`;
    newBoard.className = "task_board";
    newBoard.setAttribute("id",boardId)
    newBoard.innerHTML = `
        <div class="task_board_header">
            <div class="tools">
                <div class="circle"><span class="red box"></span></div>
                <div class="circle"><span class="yellow box"></span></div>
                <div class="circle"><span class="green box"></span></div>
            </div>
            <h2 class="task_board_title">${boardTitle}</h2>
        </div>
    `;
    addBoardEventListeners(newBoard);
    container.appendChild(newBoard);
    saveBoards()
}

function addTask() {
    const taskContent = prompt("Create new task:");
    if (!taskContent) return;

    const boards = document.getElementsByClassName("task_board");
    if (boards.length === 0) {
        alert("Please create a board first.");
        return;
    }
    
    const taskBox = createTaskElement(taskContent);
    boards[0].appendChild(taskBox);
    saveBoards();
}

function createTaskElement(content, timestamp = null) {
    const taskBox = document.createElement("div");
    taskBox.className = "task_box";
    taskBox.draggable = true;
    taskBox.innerHTML = `
        <div class="task_content">
             <p>${timestamp || new Date().toLocaleString()}</p>
            <h3>${content}</h3>
        </div>
        <div class="task_button_div">
            <button class="task_buttons edit" onclick="editTask(this)">E</button>
            <button class="task_buttons delete" onclick="deleteTask(this)">D</button>
        </div>
    `;
    addTaskEventListeners(taskBox);
    return taskBox;
}

function editTask(button) {
    const taskBox = button.closest(".task_box");
    const taskTitle = taskBox.querySelector("h3");
    const newTitle = prompt("Edit task title:", taskTitle.textContent);
    if (newTitle) {
        taskTitle.textContent = newTitle;
        taskBox.querySelector("p").textContent = new Date().toLocaleString();
        saveBoards();
    }
}

function deleteTask(button) {
    if (confirm("Are you sure you want to delete this task?")) {
        button.closest(".task_box").remove();
        saveBoards();
    }
}

let draggedTask = null;

function handleDragStart() {
    draggedTask = this;
    this.classList.add("dragging");
    setTimeout(() => (this.style.display = "none"), 0);
}

function handleDragEnd() {
    this.classList.remove("dragging");
    this.style.display = "flex";
    draggedTask = null;
    saveBoards();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
}

function handleDragLeave() {
    this.classList.remove("drag-over");
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    if (draggedTask) {
        this.appendChild(draggedTask);
    }
}

function addBoardEventListeners(board) {
    board.addEventListener("dragover", handleDragOver);
    board.addEventListener("dragenter", handleDragEnter);
    board.addEventListener("dragleave", handleDragLeave);
    board.addEventListener("drop", handleDrop);
}

function addTaskEventListeners(task) {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
}



function saveBoards() {
    const boards = document.querySelectorAll(".task_board");

    const AllBoards = [];

    boards.forEach((board)=> {
        const boardTitle = board.querySelector(".task_board_title").textContent
        const boardId = board.id
        const tasks = [];

        board.querySelectorAll(".task_box").forEach((task)=>{
            tasks.push({
                content: task.querySelector("h3").textContent,
                timestamp: task.querySelector("p").textContent
            })
        })
        AllBoards.push({boardTitle,boardId,tasks})
    })

    localStorage.setItem("taskBoards",JSON.stringify(AllBoards))
console.log(AllBoards)
}



function loadBoards(){
    const savedBoards = JSON.parse(localStorage.getItem("taskBoards"));

    if(!savedBoards) return;

    const container = document.getElementById("taskBoardContainer");
    container.innerHTML ="";

    savedBoards.forEach((board)=>{
        const newBoard = document.createElement("div");
        newBoard.className = "task_board";
        newBoard.setAttribute("id",board.boardId)
        newBoard.innerHTML = `
            <div class="task_board_header">
                <div class="tools">
                    <div class="circle"><span class="red box"></span></div>
                    <div class="circle"><span class="yellow box"></span></div>
                    <div class="circle"><span class="green box"></span></div>
                </div>
                <h2 class="task_board_title">${board.boardTitle}</h2>
            </div>
        `;

        board.tasks.forEach(({ content, timestamp }) => {
            const taskBox = createTaskElement(content,timestamp)
            newBoard.appendChild(taskBox)
        });

        addBoardEventListeners(newBoard);
        container.appendChild(newBoard);
    })
console.log(savedBoards)
}
