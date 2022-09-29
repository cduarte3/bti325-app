var D = require("./data-service.js");
var express = require("express"); // Include express.js module
var service = require("../bti325-app/data-service.js"); // include data - service module
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

var path = require("path"); // include moduel path to use __dirname, and function path.join()

app.use(express.static('public'));
app.use(express.static('views'));
// call this function after the http server starts listening for requests
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

 // setup another route to listen on /about
 app.get("/about", function (req, res){
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

//setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

app.get("/employees", function (req, res){
    res.send("TODO: Return all employees");
});

app.get("/managers", function (req, res){
    res.send("TODO: Return all employees who isManager = true");
});

app.get("/departments", function (req, res){
    res.send("TODO: Return all the departments listed");
});

app.get("*", function (req, res){
    res.send("Page Not Found");
    res.statusCode(404);
});

D.initialize();