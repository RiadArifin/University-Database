/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');


//#############################################
// These const/vars should be changed to use your own 
// ID, password, databse, and ports
const SERVER_PORT = 8207;
        var user = "m_arifin";
var password = "395462";
var database = 'm_arifin';
//#############################################


//These should not change, unless the server spec changes
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port



// Now create a connection String to be used for the mongo access
var connectionString = 'mongodb://' + user + ':' + password + '@' +
        host + ':' + port + '/' + database;


//#############################################
//the var for the university collections, no need to change
var universitiesCollection;
const NAME_OF_COLLECTION = 'universities';
//#############################################


//CORS Middleware, causes Express to allow Cross-Origin Requests
        var allowCrossDomain = function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        };


//set up the server variables
var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.static(__dirname));



//now connect to the db
mongodb.connect(connectionString, function (error, db) {

    //if something is wrong, it'll crash
    if (error) {
        throw error;
    }//end if


    //#############################################
    universitiesCollection = db.collection(NAME_OF_COLLECTION);
    //#############################################



    //the database connection and server will close when the application ends
    process.on('SIGTERM', function () {
        console.log("Shutting server down.");
        db.close();
        app.close();
    });


    //now start the application server
    var server = app.listen(SERVER_PORT, function () {
        console.log('Listening on port %d',
                server.address().port);
    });
});




//#############################################
app.post('/saveUniversity', function (request, response) {

    //request.body contains the stringified object
    console.log(request.body);

    /**
     * Code to insert the record to the mongoDB
     * 
     */
    universitiesCollection.insert(request.body,

            function (err, result) {//use empty to get all records
                if (err) {
                    return response.send(400, 'An error occurred saving a record.');
                }//end if

                return response.send(200, "Record saved successfully.");
            });

});
//#############################################



//#############################################
app.post('/getUniversity', function (request, response) {


    //case insensitive regex pattern using request.body.Name
    var searchKey = new RegExp(request.body.Name, "i");

    console.log('Retrieving records: ' + searchKey.toString());


    /**
     * Code to search the record with the key in the mongoDB
     * 
     * It should return the found object (this will be an array even if
     * there's only one record, or zero record (i.e. empty record)
     * 
     */

    universitiesCollection.find(
            {"Name": searchKey},
    function (err, result) {
        if (err) {
            return response.send(400, 'An error occurred retrieving records.');
        }//end if

        console.log(result);

        
        result.toArray(
                function (err, resultArray) {
                    if (err) {
                        return response.send(400,
                                'An error occurred processing your records.');
                    }//end if

                    //if succeeded, send it back to the calling thread
                    return response.send(200, resultArray);
                });
    });
});
//#############################################




//#############################################
app.post('/getAllUniversities', function (request, response) {

    console.log('Retrieving all the records.');

    /**
     * Code to get ALL the records on the mongoDB
     * 
     * Again, the result will be in an array even if 0 (empty array) or 1 record.
     * 
     */
    universitiesCollection.find(
            function (err, result) {//use empty to get all records
                if (err) {
                    return response.send(400, 'An error occurred retrieving records.');
                }//end if
                console.log(result);

                //now result is expected to be an array of rectangles
                result.toArray(
                        function (err, resultArray) {
                            if (err) {
                                return response.send(400,
                                        'An error occurred processing your records.');
                            }//end if

                            //if succeeded, send it back to the calling thread
                            return response.send(200, resultArray);
                        });
            });

});
//#############################################

//var sname = document.getElementById('name');
//#############################################
app.post('/deleteUniversity', function (request, response) {

    //case insensitive regex pattern using request.body.Name
    var searchKey = new RegExp(request.body.Name, "i");

    console.log('Retrieving records: ' + searchKey.toString());

    /**
     * Code to "remove" the record with the key in the mongoDB
     * 
     * It will return a JSON object representing the deletion result.
     * 
     * The attribute "n" contains the number of records deleted.
     */
    universitiesCollection.remove(
            {"Name": searchKey},
    function (err, returnedStr) {
        if (err) {
            return response.send(
                    400, 'An error occurred retrieving records.');
        }//end if

        var obj = JSON.parse(returnedStr);//convert it to an obj
        console.log(obj.n + " records"); //contain # of remvoved docs

        return response.send(200, returnedStr);
    });
});
//#############################################



