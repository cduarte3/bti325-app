/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Christian Duarte Student ID: 158217208 Date: October 3rd 2022
*
* Your app’s URL (from Cyclic) : ______________________________________________
*
*************************************************************************/
var express = require("express"); // Include express.js module
var service = require("./data-service.js"); // include data - service module
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
var Obj = {"message": null};

var path = require("path"); // include moduel path to use __dirname, and function path.join()

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

app.get("/employees", function (req, res){
    service.getAllEmployees() .then(emp => res.json(emp)) .catch((err) => {res.json(Obj)});
});

app.get("/managers", function (req, res){
    service.getManagers() .then(man=> res.json(man)) .catch((err) => {res.json(Obj)});
});

app.get("/departments", function (req, res){
    service.getDepartments() .then (dep => res.json(dep)) .catch((err) => {res.json(Obj)});
});

app.get("*", function (req, res){
    res.send("Page Not Found");
    res.statusCode(404);
});

service.initialize()
.then(() => { app.listen(HTTP_PORT, onHttpStart) }) //setup http server to listen on HTTP_PORT
.catch((error)=>{ console.log(error)});