var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
//new array to hold tasks for saving
var tasks = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeing if it has a data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = 
  "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);
  
  var taskActionsEl = createTaskActions(taskIcCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksToDoEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksToDoEl.append(listItemEl);
      break;
      default:
        console.log("Something went wrong!");
  }
//save task an object with name, type, tatus and id  property then oush into task array
taskDataObj.id = taskIdCounter;

tasks.push(taskDataObj);
//save to localStorage
saveTasks();
//increase task counter for next task id
taskIdCounter++;
};

var createTaskActions = function(taskId) {
  //create container to hold elements
var actionContainerEl = document.createElement("div");
actionContainerEl.className = "task-actions";

//create edit button
var editButtonEl = document.createElement("button");
editButtonEl.textContent = "Edit";
editButtonEl.className = "btn edit-btn";
editButtonEl.setAttribute("data-task-id", taskId);
actionContainerEl.appendChild(editButtonEl);
//create delete button
var deleteButtonEl = document.createElement("button");
deleteButtonEl.textContent = "Delete";
deleteButtonEl.className = "btn delte-btn";
deleteButtonEl.setAttribute("data-task-id", taskId);
actionContainerEl.appendChild(deleteButtonEl);
// create change status dropdown
var statusSelectEl = document.createElement("select");
statusSelectEl.setAttribute("name", "status-change");
statusSelectEl.setAttribute("data-task-id", taskId);
statusSelectEl.className = "select-status";
actionContainerEl.appendChild(statusSelectEl);
//create status options
var statusChoices = ["To Do", "In Progress", "Completed"];

for (var i = 0; i < statusChoices.length; i++) {
  //creeate option element
  var statusOptionEl = document.createElement("option");
  statusOptionEl.setAttribute("value", statusChoices[i]);
  statusOptionEl.textContent = statusChoices[i];
  //append to select
  statusSelectEl.appendChild(statusOptionEl);
}
return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
var taskSelected = document.querySelector(
  ".task-item[data-task-id='" + taskId + "']"
  );
  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  //loop through task array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  
alert("Task Updated!");

//remove data attribute from form
formEl.removeAttribute("data-task-id");
//update formEl button to go back to dahing "Add Task" not "Edit Task"
formEl.querySelector("#save-task").textContent = "Add Task";
// save task to locaStorage
saveTasks();
};


var taskButtonHandler = function(event) {
  //get target element event
  var targetEl = event.target;

  //edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }//delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
  };

  var taskStatusChangeHandler = function(event) {
    console.log(even,target.value);
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(
      ".task-item[data-task-id='" + taskId + "']"
      );

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    
    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
    tasksCompletedEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
      tasksInProgressEl.appendChild(taskSelected);
  
    //update tasks in task array
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
      }
    }
  }//save to localStorage
  saveTasks();
};
// retreive tasks from localStorage


var editTask = function(taskId) {
  console.log(taskId);
  //get task list item element
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
//get content from task name and type
var taskName = taskSelected.querySelector("h3.task-name").textContent;
 console.log(taskName);

var taskType = taskSelected.querySelector("span.task-type").textContent;
console.log(taskType);

//write values of taskname and tasktype to form to be edited
document.querySelector("input[name='task-name']").value = taskName;
document.querySelector("select[name='task-type']").value = taskType;

//set data attribute to the form with a value of the tasks id so it knows which one is being edited
formEl.setAttribute("data-task-id", taskId);
//update form's button to reflect editing a task rather than creating a new one
formEl.querySelector("#save-task").textContent = "Save Task"
};
 
var deleteTask = function(taskId) {
 console.log(taskId);
 //find task list element with taskId value and remove it 
 var taskSelected = document.querySelector(".task-item[data-task-id+'" + taskId + "']");
 taskSelected.remove();

 //create a new arrat to hold updated list of tasks
 var updatedTaskArr = [];
 //loop through current tasks
 for (var i = 0; i < tasks.length; i++) {
   //if tasks[i].id doesnt match the value of taskId, lets keep that task
   //and push it into a new array
   if (tasks[i].id !== parseInt(taskId)) {
     updatedTaskArr.push(tasks[i]);
   }
  }//reassign tasks arrat to be the same as updatedtaskArr
  tasks = updatedTaskArr;
  saveTasks();
};

   var saveTasks = function() {
   localStorage.setItem("tasks", JSON.stringify("tasks"));

  
   };
   var loadTasks = function() {
     var savedTasks = localStorage.getItem("tasks");
     //if there are no taka, set tasks to emoty array and return out of function
     if (!savedTasks) {
       return false;
     }
     console.log("Saved tasks found!");
     //else load up saved tasks
     //parse into array of objects
     savedTasks = JSON.parse(saveTasks);

     //loop through savedTasks array
     for (var i = 0; i < savedTasks.length; i++) {
       //pass each task object int ot he 'createTaskEL()' funciton
       createTaskEl(savedTasks[i]);
     }
  
 };
  //create a new task
  formEl.addEventListener("submit", taskFormHandler);

  //for edit and delete buttons
  pageContentEl.addEventListener("click", taskButtonHandler);

//for changing status
pageContentEl.addEventListener("change", taskStatusChangeHandler);
  
loadTasks();
