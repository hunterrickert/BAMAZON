const mysql = require("mysql");
const inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected to BAMAZON")
    connection.threadId + "\n";
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", 
    function(err, res) {
        if(err) throw err;
        // console.table(res);
        // connection.end();
    });
};

inq

