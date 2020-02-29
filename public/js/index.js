
function createListItems(dataObject){
    let contentArray = dataObject;
    let parentElement = document.querySelector('#listContainer');
    // removing all the childhren of the parentElement before we add the data
    parentElement.innerHTML = "";
    contentArray.forEach(itemContent => {
        let li = document.createElement('li');
        li.setAttribute('class','taskUndone');
        li.textContent = itemContent.itemContent;
        let span = document.createElement('span');
        span.textContent = itemContent.timeStamp;
        span.setAttribute('class','timeSpan');
        li.append(span);
        parentElement.append(li);
    });
}

let undone = document.querySelector('#undone');
let finalDisplayArray = [];
undone.addEventListener('click',(e)=>{
    e.preventDefault();
    if(finalDisplayArray.length === 0){
        fetch('/getUndoneTodos')
        .then(res=>res.json())
        .then(data=>{
            data.forEach((dataItem)=>{
                if(dataItem != null){
                    finalDisplayArray.push(dataItem);
                }
            });
        });
    }
    if(finalDisplayArray != 0){
        createListItems(finalDisplayArray);
    }
});
