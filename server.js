/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Christian Duarte Student ID: 158217208 Date: October 3rd 2022
*
* Your app’s URL (from Cyclic) : https://fine-ruby-battledress.cyclic.app/
*
*************************************************************************/
var express = require("express"); // Include express.js module
var service = require("./data-service.js"); // include data - service module
var multer = require("multer"); // Include multer.js module
var app = express();
var fs = require('fs');
var HTTP_PORT = process.env.PORT || 8080;
var Obj = {"message": null};
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer ({storage:storage});

var path = require("path"); // include moduel path to use __dirname, and function path.join()
const { fstat } = require("fs");

// form without file upload
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));
// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, 'views/', 'home.html'));
});

 // setup another route to listen on /about
app.get("/about", function (req, res){
    res.sendFile(path.join(__dirname, 'views/', 'about.html'));
});

 // setup another route to listen on /employees/add
app.get("/employees/add", function (req, res){
    res.sendFile(path.join(__dirname, 'views/', 'addEmployee.html'));
});

 // setup another route to listen on /images/add
app.get("/images/add", function (req, res){
    res.sendFile(path.join(__dirname, 'views/', 'addImage.html'));
});

app.get("/employees", function (req, res){
    if(req.query.status){
        service.getEmployeesByStatus(req.query.status) .then(emp => res.json(emp)) .catch((err) => {res.json(Obj)});
    }
    else if(req.query.department){
        service.getEmployeesByDepartment(req.query.department) .then(emp => res.json(emp)) .catch((err) => {res.json(Obj)});
    }
    else if(req.query.manager){
        service.getEmployeesByManager(req.query.manager) .then(emp => res.json(emp)) .catch((err) => {res.json(Obj)});
    }
    else{
        service.getAllEmployees() .then(emp => res.json(emp)) .catch((err) => {res.json(Obj)});
    }
});

app.get("/employee/:value", function (req, res){
    service.getEmployeeByNum(req.params.value) .then(man=> res.json(man)) .catch((err) => {res.json(Obj)});
});

app.get("/managers", function (req, res){
    service.getManagers() .then(man=> res.json(man)) .catch((err) => {res.json(Obj)});
});

app.get("/departments", function (req, res){
    service.getDepartments() .then (dep => res.json(dep)) .catch((err) => {res.json(Obj)});
});

// adding images
app.get("/images", (req, res)=>{
    fs.readdir(__dirname + "/public/images/uploaded", (err, items)=>{
        res.json({images : items});
    })
});
app.post("/images/add", upload.single("imageFile"),(req,res)=>{
    res.redirect("/images");
});

//adding employees
app.post("/employees/add", (req,res)=>{
    service.addEmployee(req.body) .then (res.redirect("/employees"));
});

service.initialize()
.then(() => { app.listen(HTTP_PORT, onHttpStart) }) //setup http server to listen on HTTP_PORT
.catch((error)=>{ console.log(error)});

app.use((req, res)=>{
    res.send("Page Not Found");
    res.statusCode(404);
});