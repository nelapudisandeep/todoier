const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();
// middlewares
app.use(express.static('./public'));
app.use(express.json());


//different formats for resending the data to the client
let todoHtmlFormat = [];
let undoneTodoHtmlFormat = [];
let errorUploadingToDatabase;
let actualEndDate;
let presentDate = JSON.stringify(new Date());


//function to check whether two dates are in the last date conditions or not
function verifyLastDatedness(referenceDate,actualEndDate){
    referenceDateArray = referenceDate.split('-');
    let referenceYear = parseInt(referenceDateArray[0]);
    let referenceMonth = parseInt(referenceDateArray[1]);
    let referenceDay = parseInt(referenceDateArray[2]);

    actualEndDateArray = actualEndDate.split('-');
    let EndYear = parseInt(actualEndDateArray[0]);
    let EndMonth = parseInt(actualEndDateArray[1]);
    let EndDay = parseInt(actualEndDateArray[2]);

    if(referenceYear!=EndYear){
        return false;
    }else{
        if(referenceMonth!=EndMonth){
            return false;
        }else{
            if(referenceDay-EndDay < 3 || EndDay<referenceDay){
                return true;
            }else{
                return false;
            }
        }
    }
    return true;
}

// Routes
app.post('/todo',(req,res)=>{
    // verifying the data received
    let todoContent = req.body.todoContent;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    database.insert(req.body);
    //setting the status
    let responseObje = {};
    if(todoContent && !errorUploadingToDatabase){
        responseObje = {
            'status':'success'
        }
    }else{
        responseObje = {
            'status' : 'failure'
        }
    };
    res.send(responseObje);
});


//send back the data of particualr format to its own respective client pages
// for todo.html
app.get('/getTodos',(req,res)=>{
    database.find({},(error,docs)=>{
        if(error){
            console.error(error);
        }else{
            //preparing the data in different formats
            for(let i = 0;i<docs.length;i++){
                todoHtmlFormat[i] = {
                    'content': docs[i].todoContent,
                    'info':{
                        'start':docs[i].startDate,
                        'end':docs[i].endDate
                    }
                }
            }
        }
        res.send(JSON.stringify(todoHtmlFormat));
    });
});

//for home.html 
app.get('/getUndoneTodos',(req,res)=>{
    database.find({},(err,docs)=>{
        if(err){
            console.log(err);
        }else{
           for(let i = 0;i<docs.length;i++){
                actualEndDate = docs[i].endDate;
                let referenceDate = presentDate.split("T")[0].slice(1);
                if(verifyLastDatedness(referenceDate,actualEndDate)){
                    undoneTodoHtmlFormat[i] = {
                        'timeStamp' : actualEndDate,
                        'itemContent' : docs[i].todoContent
                    };
                }
           }
        }
    });
    res.send(JSON.stringify(undoneTodoHtmlFormat));
})

// port listening
app.listen(PORT,()=>console.log('listening on the port : '+PORT));
