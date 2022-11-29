const Sequelize = require('sequelize');

var sequelize = new Sequelize('ahmquiha', 'ahmquiha', '2s8OdegHt3Xbr0BDxX7UjpT3E-TtakTV', {
    host: 'ziggy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    query: { raw: true }
});

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    depratment: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports. initialize  = function (){
    return new Promise(function (resolve, reject) {
        sequelize.sync() 
        .then (() => resolve())
        .catch(() => reject('unable to sync the database'));
    });
}

module.exports. getAllEmployees = function (){
    return new Promise(function (resolve, reject) {
        Employee.findAll().then((employ)=>{
            resolve(employ);
        })
        .catch(() => reject("no results available"));
    });
}

module.exports. getDepartments = function (){
    return new Promise(function (resolve, reject) {
        Department.findAll().then((depart)=>{
            resolve(depart);
        })
        .catch(() => reject("no results available"));
    });
}

module.exports. addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(var x in employeeData){
            if(employeeData[x] == ""){
                employeeData[x] = null
            };
        }
        Employee.create(employeeData)
        .then(()=> resolve())
        .catch(() => reject("unable to create employee"));
    });
}

module.exports. addDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for(var x in departmentData){
            if(departmentData[x] == ""){
                departmentData[x] = null
            };
        }
        Department.create(departmentData) 
        .then(() => resolve())
        .catch(() => reject("unable to create department"));
    });
}

module.exports. getEmployeesByStatus = function(Status){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {status: Status}
        }) .then ((em)=> resolve(em[0]))
        .catch(()=>reject('no results returned'));
    });
}

module.exports. getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {departmentId: department}
        }) .then ((em)=> resolve(em[0]))
        .catch(()=>reject('no results returned'));
    });
}

module.exports. getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeManagerNum: manager}
        }) .then ((em)=> resolve(em[0]))
        .catch(()=>reject('no results returned'));
    });
}

module.exports. getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeNum: num}
        }) .then ((em)=> resolve(em[0]))
        .catch(()=>reject('no results returned'));
    });
}

module.exports. deleteEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: {employeeNum:num}
        }) .then(()=>resolve())
        .catch(()=>reject("could not delete"));
    });
}

module.exports. getDepartmentById = function(ID){
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {departmentId: ID}
        }) .then ((de)=> resolve(de))
        .catch(()=>reject('no results returned'));
    });
}

module.exports. updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(var x in employeeData){
            if(employeeData[x] == ""){
                employeeData[x] = null
            };
        }
        Employee.update(employeeData, {where: { employeeNum: {[sequelize.eq] : employeeData.employeeNum}}}).then((employ)=>{
            resolve(employ);
        })
        .catch(()=> reject("unable to update employee"));
    });
}

module.exports. updateDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for(var x in departmentData){
            if(departmentData[x] == ""){
                departmentData[x] = null
            };
        }
        Department.update(departmentData, {where: { departmentId: {[sequelize.eq] : departmentData.departmentId}}}).then(()=>{
            resolve();
        })
        .catch(()=> reject("unable to update department"));
    });
}