let tasksData ={}

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done]
let dragElement = null;


function addTask(title,desc,column){
    const div = document.createElement("div");

    div.classList.add("task")
    div.setAttribute("draggable","true")

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    column.appendChild(div);

    div.addEventListener("drag",(e)=>{
        dragElement = div;
    })

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    })

    return div;
}


function updateTaskCount(){
    columns.forEach(col=>{
            const task = col.querySelectorAll(".task");
            const count = col.querySelector(".right");

            tasksData[col.id] = Array.from(task).map(t =>{
                return{
                    title : t.querySelector("h2").innerText,
                    desc : t.querySelector("p").innerText,
                }
            })

            localStorage.setItem("tasks",JSON.stringify(tasksData));
            count.innerText = task.length;
    })
}

if(localStorage.getItem("tasks")){

    const data = JSON.parse(localStorage.getItem("tasks"));

    for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title,task.desc,column);
        })
    }

    updateTaskCount();

}


const tasks = document.querySelectorAll(".task");


//Select the task to be dragged on next section, i.e., done or progress
tasks.forEach(task=>{
    task.addEventListener("drag",(e)=>{
        dragElement = task;
    })
})


//Drag the task wich is in progress or done to that section by just using eventListner dragenter, dragleave, dragover and drop
function addDragEventsOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })

    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover",(e)=>{
        e.preventDefault();
    })
    column.addEventListener("drop",(e)=>{
        e.preventDefault();
        console.log("Dropped ",dragElement,column);

        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();

    })
   
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// Modal Logics
const toggleModalButton = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const modalBg = document.querySelector(".modal .bg")
const addTaskBtn = document.querySelector("#add-new-task")


toggleModalButton.addEventListener("click",()=>{
    modal.classList.toggle("active")
})

modalBg.addEventListener("click",()=>{
    modal.classList.remove("active")
})

addTaskBtn.addEventListener("click",(e)=>{
    const taskTitle = document.querySelector("#task-title-input").value
    const taskDesc = document.querySelector("#task-desc-input").value



    addTask(taskTitle,taskDesc,todo);
    updateTaskCount();
    modal.classList.remove("active")


     document.querySelector("#task-title-input").value = "";
     document.querySelector("#task-desc-input").value = "";
})