/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//##############################################
var SERVER_URL = 'http://dev.cs.smu.ca:8207';//add the url with your own port number
//##############################################


function validateData() {
    //first get the values from the fields
    var name = $("#name").val();
    var address = $("#address").val();
    var phone = $("#phone").val();

    //check empty fields
    if (name == '') {
        alert("Please enter the name of the university!");
        $("#name").focus();
        return false;
    }
    if (address == '') {
        alert("Please enter the address of the university!");
        $("#address").focus();
        return false;
    }
    if (phone == '') {
        alert("Please enter the phone number of the university!");
        $("#phone").focus();
        return false;
    }

    //check address
    //check 1st char if it's a number
    var firstChar = address.trim().substr(0, 1);
    if (isNaN(firstChar)) {
        alert("Address should start with a number!");
        $("#address").focus();
        return false;
    }

    var pattern = /[a-z]/i;

    if (!(pattern.test(address))) {
        alert("Address should contain letters!");
        $("#address").focus();
        return false;
    }


    //check phone
    var tokens = phone.split('-');
    for (var i = 0; i < tokens.length; i++) {
        if (isNaN(tokens[i])) {
            alert("Please use only numbers or hyphens!");
            $("#phone").focus();
            return false;
        }//end if
    }//end for

    return true;
}


function emptyFields() {
    $("#name").val('');
    $("#address").val('');
    $("#phone").val('');
}//end emptyFields()




$('#saveButton').click(
        function () {

            if (validateData()) {

                //create an object
                var newObj = {
                    "Name": $("#name").val(),
                    "Address": $("#address").val(),
                    "PhoneNumber": $("#phone").val()
                };
                $.post(SERVER_URL + "/saveUniversity",
                        newObj,
                        function (data) {
                            alert("Operation successful! " + data);
                        }).fail(function (error) {
                    alert("Error: " + error.responseText);
                });


                /**
                 * Implement the rest
                 * 
                 * 1) "post" the data (newObj) to the server
                 *      (the data should be saved by your server-side script
                 * 2) If error, alert the user
                 * 
                 */

            }//end if validateData()
            emptyFields();
        }//end function

);


$('#searchButton').click(
        function () {

            //empty the fields if something in
            emptyFields();

            //first grab the name of the university
            var key = $('#searchKey').val();

            var universities = [];//place holder
            var i;
            /**
             * Implement the rest
             * 
             * 1) "post" the key to the server
             * 2) Obtain the returned universities array (even it there's only
             *    1 or zero (empty) object, it'll still be an array!
             * 3) If the array is null (error) or empty (length==0), then alert
             *    the user
             * 4) If there's at least on erecord, extract the attribute values
             * 5) Fill the corrresponding input fields
             * 6) Alert any errors to the user.
             */

            $.post(SERVER_URL + "/getUniversity", key,
                    function (data) {
                        alert("Result received successfully!");
                        universities = data;

                        for (i = 0; i < universities.length; i++) {
                            if (key == universities[i].Name) {
                                alert("The record is found.");
                                $("#name").val(universities[i].Name);
                                $("#address").val(universities[i].Address);
                                $("#phone").val(universities[i].PhoneNumber);
                                $('#searchKey').val("");
                                break;
                            }
                        }

                    }).fail(function (error) {
                alert("Error: " + error.responseText);
            });

        }//end function
);



$('#deleteButton').click(
        function () {


            //first grab the name of the university
            var key = $('#searchKey').val();
            var universities = [];//place holder
            var i;
            /**
             * Implement the rest
             * 
             * 1) "post" the key to the server
             * 2) Get the returned object (deletion results, "data")
             * 3) data.n contains the number of records deleted
             * 4) If data.n is larger than zero, tell the user if the deletion succeeded
             * 5) If zero, tell that record wasn't found
             * 6) Alert any errors to the user.
             */

            $.post(SERVER_URL + "/deleteUniversity", key,
                    function (data) {
                        alert("Result received successfully!");
                        universities = data;

                        for (i = 0; i < universities.length; i++) {
                            if (key == universities[i].Name) {
                                alert("The record is found.");
                                $("#name").val(universities[i].Name);
                                $("#address").val(universities[i].Address);
                                $("#phone").val(universities[i].PhoneNumber);
                                $('#searchKey').val("");
                                break;
                            }
                        }

                    }).fail(function (error) {
                alert("Error: " + error.responseText);
            });

        }//end function
);


$('#displayButton').click(
        function () {

            //#############################################

            var universities = [];//place holder
            var i;
            /**
             * Implement the rest
             * 
             * 1) request the server to return the university object "array"
             * 2) If the array is empty, tell the user that no record found
             *    and empty the table
             * 3) If record(s) found, fill the table
             * 4) Alert any errors to the user.
             */
            $.post(SERVER_URL + "/getAllUniversities",
                    function (data) {
                        alert("Result received successfully!");

                        universities = data;

                        var table = document.getElementById("displayTable");
                        var row = table.insertRow(0);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        cell1.innerHTML = "Name";
                        cell2.innerHTML = "Address";
                        cell3.innerHTML = "Phone";

                        for (i = 0; i < universities.length; i++) {
                            var table = document.getElementById("displayTable");
                            var row = table.insertRow(i + 1);
                            var cell1 = row.insertCell(0);
                            var cell2 = row.insertCell(1);
                            var cell3 = row.insertCell(2);
                            cell1.innerHTML = universities[i].Name;
                            cell2.innerHTML = universities[i].Address;
                            cell3.innerHTML = universities[i].PhoneNumber;

                            console.log(universities[i]);
                        }

                    }).fail(function (error) {
                alert("Error: " + error.responseText);
            });


        }//end function
);
