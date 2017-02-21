/*

step 1 make a folder

step 2 go into the folder

step 3 npm init

step 4 npm install mysql --save

step 5 make a connection.js file

step 6 copy and paste what I slacked out into connection.js

step 7 run it 

step 8 if it breaks change it until it works

*/



var mysql = require('mysql');

var inquirer = require('inquirer');



var connection = mysql.createConnection({

  host     : 'localhost',

  user     : 'root',

  password : 'root',

  database : 'departments',

});


var table = "departments";
var dbProductName = "";
var dbProductQuantity = 0;
var quantityNotFilled = 0;
var id  = 0;

function selectDepartments(table){

	connection.query('SELECT * from ' + table, function (error, results, fields) {

	  if (error) throw error;

	  console.log(results);
	  console.log('\n');

	});

}


function selectInventoryToBuy(table) {
	console.log("1")
 connection.query('SELECT * from products', function (error, results, fields)

   {

 	 console.log(results);
     console.log('\n');
     selectProductToBuy(table)
    

    });
    
   }; 


function selectProductToBuy(table) {
    console.log("2")
	inquirer.prompt([

	{type: "input",

	  name: "product_id_in",

	  message: "Put the id of the product you want to buy."}

	]).then(function(data){

	    id  = data.product_id_in;

        console.log("product inputted  " + id);

        table = "products"

        connection.query("SELECT * FROM " + table + " WHERE ?", {

 

 	  	            id : id

 	                }, function(error, results, fields) { 

	  	              if (error) return console.log(error);

                        dbProductName = results[0].product_name;
                        dbProductQuantity = results[0].stock_quantity
	  	                console.log('product read completed!')
	  	                console.log("product results selected  " + results[0].product_name);
	  	                console.log("Quantity In Stock         " + results[0].stock_quantity);
                        selectQuantityToBuy(table)
 	        });

        });
	};


function selectQuantityToBuy(table) {

    console.log("3")
	inquirer.prompt([

	{type: "input",

	  name: "quantity_in",

	  message: "How Many of this product do you want to buy?"}

	]).then(function(data){

		var quantity  = data.quantity_in;

        console.log("Checking Quantity For this Item " + dbProductName);
        
        table = "products"

        if (dbProductQuantity == 0)
        	{ 
            console.log("Temporarily Out of Stock Cannot Complete Your Order for   "
             + dbProductName + "for a quantity of  " + quantity)
            noSaleSwitch = "1"
            mainLogic()
            }
            else
               {
                if (quantity <= dbProductQuantity)
                  {
           	       dbProductQuantity = dbProductQuantity - quantity
           	       console.log("made a sale of   " + quantity + 
           		   "  Go Update Product and Add a sale")
           		   updateTable(id, table, dbProductQuantity)
           		   table = "sales"
           		   insertIntoTable(id, quantity, table)
           		   
    
                   }
                else
                   {
           	        quantityNotFilled = quantity - dbProductQuantity
                    console.log("We Partially Filled Your Order of  " + quantity + 
            	    " With a quantity of" + dbProductQuantity + 
            	    "We could not Fill the Remaining Order of  " + quantityNotFilled)
                    console.log(" ")
                    console.log("made a sale of   " + dbProductQuantity + 
           		    "Go Update Product and Add a sale")
           		    updateTable(id, table, 0)
           		    table = "sales"
           		    insertIntoTable(id, dbProductQuantity, table)
           		   
    
                   }


        	}



        
 	        });

        };

function updateTable(id, table, quant){

    connection.query("UPDATE " + table + " SET ? WHERE ?", [{

       stock_quantity : quant

       }, {

    	  	id : id

       }], function(err, res) { 

      if (err) return console.log(err);

         console.log('Update Completed of Product Quantity')

      });

      };

function insertIntoTable(id, quant, table){

    connection.query("INSERT INTO " + table + " SET ?", {

    product_id: id,

    quanttity_purchased: quant

    }, function(err, res) {

     if (err) return console.log(err);

       
       console.log('Completed Sales Insert')
       mainLogic()
    
    });

   };



 
 
 // =======================Bamazon Main Logic Starts Here =====================

function mainLogic(){

    inquirer.prompt([
    {
    type: "input",
    name: "command",
    message: "******** Welcome To Bamazon! --- Type done When Order Complete ********"},
    ]).then(function(data){
        if (data.command != 'done')
            {
            table = "products"
            selectInventoryToBuy(table);
           
            }
        else
            {
         console.log("");
         console.log("");
         console.log("************* Thank You For Ordering From Bamazon !! ******************")
            }
       
    });
}
connection.connect();
mainLogic();
  // 555555555555555555555555555555555555555555555555555555555555555555555555555  
 //    connection.connect();
 //    table = "products"
 //    selectInventoryToBuy(table);
    
// 		connection.query('SELECT * from products', function (error, results, fields) {

// 			console.log(results);

// 			console.log('\n');

// 			inquirer.prompt([

// 			{type: "input",

// 			  name: "quantity_in",

// 			  message: "How many would you like to buy?"}

// 			]).then(function(data){

// 				//do an insert into mysql 

// 				var quantity = data.quantity_in
// 				// ------------------------------------------------------------


//                 connection.query("SELECT " + table + " WHERE ?", {

 

//  	  	            id : id

//  	                }, function(err, res) { 

// 	  	              if (err) return console.log(err);

// 	  	                console.log('product read completed!')

//  	  });

// // }



// 				// ------------------------------------------------------------

// 				connection.query('INSERT into dranken_beers SET ?', {

// 					 : data.beer_id,

// 					dranker_id : dranker

// 				}, function (error, results, fields) {

// 					console.log('insert complete')

// 				});

// 			});

// 		});



// 	});

// });



// =======================End of Stop Here 1 ================================
// function insertIntoTable(name, type, abv, table){

//   connection.query("INSERT INTO " + table + " SET ?", {

//       name: name,

//       type: type,

//       abv: abv

//     }, function(err, res) { console.log('completed!')});

// }



// function deleteFromTable(id, table){

// 	connection.query("DELETE FROM " + table + " WHERE ?", {

// 	    id: id

// 	  }, function(err, res) { 

// 	  	if (err) return console.log(err);

// 	  	console.log('delete completed!')

// 	  });

// }



// //write update function

// function updateTable(id, table){

// 	connection.query("UPDATE " + table + " SET ? WHERE ?", [{

// 		name : 'bruno beer'

// 	  }, {

// 	  	id : id

// 	  }], function(err, res) { 

// 	  	if (err) return console.log(err);

// 	  	console.log('update completed!')

// 	  });

// }



// //write delete function





// // insertIntoTable('beer', 'i dont know beer', 100, 'beers');

// // deleteFromTable(7, 'beers');

// updateTable(1, 'beers');









