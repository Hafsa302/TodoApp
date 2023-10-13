// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, push, onChildAdded, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYHFDoV-_0hkquJQutpbdzHp4TWAc3JdQ",
  authDomain: "todo-app01-cdd34.firebaseapp.com",
  projectId: "todo-app01-cdd34",
  storageBucket: "todo-app01-cdd34.appspot.com",
  messagingSenderId: "834798782740",
  appId: "1:834798782740:web:24c64516f31a6662a3da01",
  measurementId: "G-J5L46SJPC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

var input = document.getElementById("inp");
var list = document.getElementById("list");
var addbtn = document.getElementById("addbtn")
let todoListt = [];


addbtn.addEventListener ('click', function (){

    
    if (input.value === "") {
        // alert("Enter Your Task")
        Swal.fire('Enter Your Task')

    } else {

        var task = input.value;

        var parentTodoRef = ref(database, "ParentTodo");

        // ====================Push the new task to the database
        var newTaskRef = push(parentTodoRef);
        set(newTaskRef, {
            UserTask: task
        });

        input.value = "";
    }

})

// ========================Function to render the task list
function render() {

    list.innerHTML = "";
    for (let i = 0; i < todoListt.length; i++) {
        list.innerHTML += `
      <li class="list-group-item fs-4  ">
        <div class="list-card">
          <div class = "col-7 text-break col-md-8 ">
            ${todoListt[i].UserTask}
          </div>
          <div>
            <button type="button" class="btn btn-success" onclick="editTodo(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="btn btn-danger"  onclick="delTodo(${i})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </li>`;
    }

}

// =========================Function to edit a task
window.editTodo = function (i) {
    var newTask = prompt("Enter Your New Value", todoListt[i].UserTask);
    if (newTask !== null) {
        todoListt[i].UserTask = newTask;
        update(ref(database, `ParentTodo/${todoListt[i].id}`), {
            UserTask: newTask
        });
        render();
    }
};

// =====================Function to delete a task
window.delTodo = function (i) {
    var taskId = todoListt[i].id;
    remove(ref(database, `ParentTodo/${taskId}`));
    todoListt.splice(i, 0);
    render();

};

// ======================Function to delete all tasks
window.deleteAll = function () {
    if (todoListt.length !== 0) {

        var parentTodoRef = ref(database, "ParentTodo");
        // var confirmDelete = confirm('Are you sure?');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to Delete this!",
            icon: 'warning',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your Tasks has been deleted.',
                    'success'
                )
            }
        })
        remove(parentTodoRef);
        todoListt = [];
        render();
    }
    else {
        // alert("Todos Not Availables")
        Swal.fire('Tasks Not Availables')

    }
};

var parentTodoRef = ref(database, "ParentTodo");

onValue(parentTodoRef, (snapshot) => {
    todoListt = [];
    snapshot.forEach((onChildAdded) => {
        var taskData = onChildAdded.val();
        taskData.id = onChildAdded.key;
        todoListt.push(taskData);
    });
    render();
});