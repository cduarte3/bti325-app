var employees = [];
var departments = [];
var managers = [];
var fs = require('fs');
const { resolve } = require('path');

module.exports. initialize  = function (){
        return new Promise(function(resolve, reject)
        {
            fs.readFile('./data/employees.json',(err,data)=>
            {
                if (err) reject("Failure to read file employees.json!");
                employees = JSON.parse(data);
                if(employees != null)
                {
                    fs.readFile('./data/departments.json',(err,data)=>
                    {
                        if (err) reject("Failure to read file departments.json!");
                        departments = JSON.parse(data)
                    })
                }
                if(!err){
                    resolve("Both files were read successfully");
                }
            })
        });
}

module.exports. getAllEmployees = function (){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            resolve(employees);
        }
        else{
            reject("Employee array was empty");
        }
    })
}

module.exports. getManagers = function (){
    return new Promise(function(resolve, reject){
        for(i = 0; i < employees.length; ++i){
            if(employees[i].isManager == true){
                managers.push(employees[i]);
            }
        }
        if(managers.length > 0){
            resolve(managers);
        }
        else{
            reject("Manager array was empty");
        }
    })
}

module.exports. getDepartments = function (){
    return new Promise(function(resolve, reject){
        if(departments.length > 0){
            resolve(departments);
        }
        else{
            reject("Department array was empty");
        }
    })
}