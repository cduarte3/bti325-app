var employees = [];
var departments = [];
var managers = [];
var fs = require('fs');
const { resolve } = require('path');
const { isNullOrUndefined } = require('util');

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

module.exports. addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        if (employeeData.isManager == undefined){
            employeeData.isManager = false;
        }
        else{
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    })
}

module.exports. getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            var E2 = [];
            for(var i = 0; i < employees.length; i++){
                if(employees[i].status == status){
                    E2.push(employees[i]);
                }
            }
            resolve(E2);
        }
        else{
            reject("Employees did not have the specified status");
        }
    })
}

module.exports. getEmployeesByDepartment = function(department){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            var E3 = [];
            for(var i = 0; i < employees.length; i++){
                if(employees[i].department == department){
                    E3.push(employees[i]);
                }
            }
            resolve(E3);
        }
        else{
            reject("Employees did not have the specified Department");
        }
    })
}

module.exports. getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            var E4 = [];
            for(var i = 0; i < employees.length; i++){
                if(employees[i].employeeManagerNum == manager){
                    E4.push(employees[i]);
                }
            }
            resolve(E4);
        }
        else{
            reject("Employees did not have the specified Manager");
        }
    })
}

module.exports. getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            for(var i = 0; i < employees.length; i++){
                if(employees[i].employeeNum == parseInt(num)){
                    resolve (employees[i]);
                }
            }
        }
        else{
            reject("Employee did not have the specified Employee Num");
        }
    })
}