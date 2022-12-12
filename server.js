/*************************************************************************
* BTI325– Assignment 6
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part * of this assignment has been copied manually or electronically from any 
other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Christian Duarte Student ID: 158217208 Date: December 11th 2022
*
* Your app’s URL (from Cyclic) : 
*
*************************************************************************/
var express = require("express"); // Include express.js module
var service = require("./data-service.js"); // include data - service module
var multer = require("multer"); // Include multer.js module
const exphbs = require("express-handlebars"); // include handlebars module
const Sequelize = require('sequelize'); // include sequilize module
const dataServiceAuth = require('./data-service-auth.js') // include data serivce module
var clientSessions = require("client-sessions"); // include client-sessions module
var app = express();
var fs = require('fs');
var HTTP_PORT = process.env.PORT || 8080;
var Obj = { "message": null };

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('ahmquiha', 'ahmquiha', '2s8OdegHt3Xbr0BDxX7UjpT3E-TtakTV', {
    host: 'ziggy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize.authenticate()
    .then(() => console.log("connection success"))
    .catch((e) => {
        console.log("connection failed.");
        console.log(e);
    });

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell server to use handle bars as the template engine
//app.engine(".hbs", exphbs({
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

const upload = multer({ storage: storage });

var path = require("path"); // include moduel path to use __dirname, and function path.join()
const { fstat } = require("fs");
const e = require("express");

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.use(clientSessions({
    cookieName: "session",
    secret: "A6",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
})

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else { next(); }
}

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render("userHistory");
});

// form without file upload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
    res.render(path.join(__dirname, 'views/', 'home.hbs'));
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.render(path.join(__dirname, 'views/', 'about.hbs'));
});

// setup another route to listen on /employees/add
app.get("/employees/add", ensureLogin, (req, res) => {
    service.getDepartments()
        .then((data) => {
            res.render('addEmployee.hbs', { departments: data });
        })
        .catch((err) => {
            res.render('addEmployee.hbs', { departments: [] });
        });
});

// setup another route to listen for departments/add
app.get("/departments/add", ensureLogin, (req, res) => {
    res.render('addDepartment.hbs');
});

// setup another route to listen on /images/add
app.get("/images/add", ensureLogin, (req, res) => {
    res.render('addImage.hbs');
});

app.get("/employees", ensureLogin, (req, res) => {
    if (req.query.status) {
        service.getEmployeesByStatus(req.query.status).then(emp => res.render("employees", { data: emp })).catch((err) => { res.render(err) });
    }
    else if (req.query.department) {
        service.getEmployeesByDepartment(req.query.department).then(emp => res.render("employees", { data: emp })).catch((err) => { res.render(err) });
    }
    else if (req.query.manager) {
        service.getEmployeesByManager(req.query.manager).then(emp => res.render("employees", { data: emp })).catch((err) => { res.render(err) });
    }
    else {
        service.getAllEmployees()
            .then((emp) => {
                if (emp.length > 0) res.render("employees", { data: emp });
                else res.removeHeader("employees", { message: "no results" });
            })
            .catch((err) => {
                res.render("employees", { message: "no results" });
            });
    }
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(service.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as"departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.get("/department/:departmentId", ensureLogin, (req, res) => {
    service.getDepartmentById(req.params.departmentId)
        .then((department) => {
            // console.log(data);
            res.render("department", { department: department[0] });
        })
        .catch((err) => {
            res.status(404).send("Department Not Found");
        });
});

app.post("/employee/update", ensureLogin, (req, res) => {
    service.updateEmployee(req.body).then(res.redirect("/employees")).catch(err => { res.render({ message: "no result" }) });
});
app.post("/department/update", ensureLogin, (req, res) => {
    service.updateDepartment(req.body).then(res.redirect("/departments")).catch(err => { res.render({ message: "no result" }) });
});

app.get("/departments", ensureLogin, (req, res) => {
    service.getDepartments()
        .then((dep) => {
            if (dep.length > 0) res.render("departments", { data: dep });
            else res.removeHeader("departments", { message: "no results" });
        })
        .catch((err) => {
            res.render("departments", { message: "no results" });
        });
});
app.get("/images", ensureLogin, (req, res) => {
    fs.readdir(__dirname + "/public/images/uploaded", (err, items) => {
        res.render("images", ({ data: items }));
        //res.json({images : items});
    })
});

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    service.deleteEmployeeByNum(req.params.empNum)
        .then(() => res.redirect("/employees"))
        .catch(() => res.status(500).send("Unable to Remove Employee / Employee not found)"));
});

//adding register
app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
        .then(() => {
            res.render("register", { successMessage: "User created" });
        })
        .catch((err) => {
            res.render("register", { errorMessage: err, userName: req.body.userName });
        });
});

//adding login
app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then((user) => {
        //console.log(user);
        req.session.user = {
            userName: user.userName,
            email: user.email,
            loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch((err) => {
        //console.log(err);
        res.render('login', { errorMessage: err, userName: req.body.userName });
    });
})

// adding images
app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => {
    res.redirect("/images");
});

// adding employees
app.post("/employees/add", ensureLogin, (req, res) => {
    service.addEmployee(req.body).then(res.redirect("/employees"))
        .catch((err) => {
            res.status(500).send("error");
        });
});
// adding departments
app.post("/departments/add", ensureLogin, (req, res) => {
    service.addDepartment(req.body).then(res.redirect("/departments"))
        .catch((err) => {
            res.status(500).send("error");
        });
});

app.get("*", (req, res) => {
    res.send("Page Not Found");
});

service.initialize()
    .then(dataServiceAuth.initialize)
    .then(() => { app.listen(HTTP_PORT, onHttpStart) }) //setup http server to listen on HTTP_PORT
    .catch((error) => { console.log(error) });

app.use((req, res) => {
    res.send("Page Not Found");
});
