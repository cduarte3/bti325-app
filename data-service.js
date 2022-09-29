let employees = [];
let departments = [];
var fs = require('fs');

module.exports. initialize  = function (){
    fs.readFile('./data/employees.json',(err,data)=>{
        if (err) reject("Failure to read file employees.json!");
        employees = JSON.parse(data);
        if(employees != null){
            fs.readFile('./data/departments.json',(err,data)=>{
                if (err) reject("Failure to read file departments.json!");
                departments = JSON.parse(data)
            })
        }
    })
}