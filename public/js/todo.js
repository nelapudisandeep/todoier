let showTodos = document.querySelector("#showTodos");
let todoList =  document.querySelector("#todoList");
let todosAll = [];

function createListItem(todosAll){
    todosAll.forEach(todoItem=>{
        let li = document.createElement('li');
        li.setAttribute('class','todoItem');

        let content_p = document.createElement('p');
        content_p.textContent = todoItem.content;
        let span_p = document.createElement('span');
        span_p.textContent = "i";
        span_p.setAttribute('class','infoCard');
        content_p.append(span_p);

        let div = document.createElement('div');
        div.setAttribute('class','info');
        let start_p = document.createElement('p');
        start_p.setAttribute('class','startDate');
        let end_p = document.createElement('p');
        end_p.setAttribute('class','lastDate');
        start_p.textContent = "Created :";
        end_p.textContent = "Last Date : ";
        let  span_start = document.createElement('span');
        span_start.textContent =  todoItem.info.start;
        let span_end = document.createElement('span');
        span_end.textContent =  todoItem.info.end;

        start_p.append(span_start);
        end_p.append(span_end);
        div.append(start_p,end_p);

        li.append(content_p,div);
        todoList.append(li);
    });
    
    let infoBtn = document.querySelectorAll('.infoCard');
    infoBtn.forEach(infoCardItem=>{
        infoCardItem.addEventListener('click',e=>{
            e.preventDefault();
            let targetElement = infoCardItem.parentNode.parentNode.children[1];
            if(targetElement.style.display === "none"){
                targetElement.style.display = "block";
            }else{
                targetElement.style.display = "none";
            }
        });
    });
}

// submitting a todo to the server

let inputTodo = document.querySelector('input[type="text"]');
let submitTodo = document.querySelector('input[type="submit"]');
let startDate = document.querySelector("#startDate");
let endDate = document.querySelector('#lastDate');
let error = document.querySelector("#error");
let success = document.querySelector("#success");
submitTodo.addEventListener('click',e=>{
    e.preventDefault();
    // console.log(endDate.value);
    if(inputTodo.value && endDate.value){
        let todoToServerObject  = {
            'todoContent':inputTodo.value,
            'timeStamp' : new Date().toDateString(),
            'startDate' : startDate.value,
            'endDate' : endDate.value
        };

        // sending data to the server
        const options = {
            method : 'POST',
            headers :{
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(todoToServerObject)
        }

        fetch('/todo',options)
        .then(response=>response.json())
        .then(data =>{  
            status = data.status;
            //response depending upon the status of the request sent to the server
            if(status === "success"){
                inputTodo.value = "";
                startDate.value = "";
                endDate.value = "";
                showAlert(status);
            }else{
                inputTodo.value = "";
                startDate.value = "";
                endDate.value = "";
                showAlert(status);
            }
        });

        
            }
        });

function showAlert(status){
    if(status){
        success.style.display = "block";
        setTimeout(()=>{
            success.style.display = "none";
        },1000)
    }else{
        error.style.display = "block";
        setTimeout(()=>{
            error.style.display = "none";
        },1000);
    }
}

// getting data from server
let loading = document.querySelector("#loading");
showTodos.addEventListener('click',e=>{
    e.preventDefault();
    if(todosAll.length === 0){
        fetch('/getTodos')
        .then(res=>res.json())
        .then(data=>{
            todosAll = data;
            createListItem(todosAll);
        });
    }
    else{
        if(todoList.style.display === "none"){
            todoList.style.display = "flex";
            showTodos.textContent = "Hide Todos";
        }else{
            todoList.style.display = "none";
            showTodos.textContent = "Show Todos";
        }
    }
});
