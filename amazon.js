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
        console.table(res);
        purchase();
        // connection.end();
    });
};

function purchase() {
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw err;
    
    
    inquirer.
        prompt([
            {
            type: "list",
            message: "Enter the Item Id of the product you would like to purchase?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            },
            name:"productChoices"
            },
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "purchaseAmount"
            }

    ]).then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
            if (results[i].product_name === answer.productChoices) {
              chosenItem = results[i];
            }
          };
          if(chosenItem.stock_quantity >= answer.purchaseAmount) {
              var newStockQuantity = chosenItem.stock_quantity - parseInt(answer.purchaseAmount);
              console.log("Remaining Items in Stock: " + newStockQuantity);
              connection.query("UPDATE products SET ? WHERE ?", 
              [
                {
                      stock_quantity: newStockQuantity 
                    },
                {
                    item_id: chosenItem.item_id

                }
            ], function(err){
                if(err) throw err;
                console.log("Purchase was successful!!")
                purchase();
            }
            );
          }else{
              console.log("Sorry, out of stock!")
              purchase();
          }

    })

})
}

