/////////////////////////////////////////////////////////////////////////
//                  Storage for Default tables
/////////////////////////////////////////////////////////////////////////
var array_easy = ["5", "6", "4", ".", ".", "3", "2", ".", "1", 
                  "8", "7", "2", ".", "1", ".", "3", "9", ".", 
                  "3", "9", "1", ".", ".", ".", ".", ".", "5",
                  "4", "2", "9", "6", "5", "7", "3", "1", "8",
                  ".", ".", "8", "2", "3", "1", "9", "4", "7",
                  "7", "1", "3", "8", "4", "9", "5", "2", "6",
                  ".", ".", "6", ".", "3", "5", "8", "4", "2",
                  "4", "2", "3", "7", "8", "9", "1", ".", ".",
                  ".", "5", "8", "2", "6", "4", "9", "3", "7",]

var array_medium = ["8", "7", ".", ".", "4", ".", "6", "2", "5", 
                    "4", "5", ".", ".", "2", ".", ".", "1", ".", 
                    "2", "1", ".", "8", "5", ".", ".", "9", ".",
                    "7", "6", ".", "5", ".", "4", ".", "8", ".",
                    "9", "3", "1", "8", "6", "2", "5", ".", "7",
                    "5", "4", "8", "3", ".", "1", "9", "6", "2",
                    "2", ".", "7", "9", "5", "8", "4", ".", "6",
                    ".", "9", "4", "6", "7", "3", "2", ".", "5",
                    ".", ".", "5", "1", ".", "4", ".", ".", ".",]

var array_hard = ["4", ".", ".", "9", ".", ".", ".", ".", ".", 
                  ".", ".", ".", ".", "4", ".", ".", ".", ".", 
                  "5", "3", "9", "6", ".", "1", "7", ".", "4",
                  ".", "9", "6", ".", "4", "7", ".", ".", ".",
                  ".", "7", "8", "5", ".", "2", "1", "9", "6",
                  "2", "5", "3", "9", "1", "6", "8", "4", "7",
                  ".", ".", "1", ".", "8", "4", "2", ".", ".",
                  ".", "8", ".", ".", ".", ".", ".", "5", "4",
                  "4", ".", "2", "3", ".", "5", "1", "7", "8",]

/////////////////////////////////////////////////////////////////////////
//                  Axos Get Request
/////////////////////////////////////////////////////////////////////////
// Store Clicks on "Get Sudoku Button"
var GetSudokuButton = 0;
//let arrOfNumbers
arrOfNumbers = [];
// Stores the 2D array
var array = [];
var errorDef = false;
var storeDifficulti = null;
function doAjaxx() {

    // Remove winner div if any
    document.getElementById("resultMsg").style.display="none";

    GetSudokuButton ++;
    // If Get sudoku is clicked again Clears the table.
    if (GetSudokuButton == 2) {
        for (var i = 0; i < 9; i++) {
            // 9 x Elements in each list
            for (var j = 0; j < 9; j++) {
                var className = "cell" + i + j
                var check = document.getElementById(className);
                if (check.value != null){
                    document.getElementById(className).disabled = false;
                    document.getElementById(className).value = null;
                }
                }
            }
        arrOfNumbers.length = 0;
        array.length = 0;
        GetSudokuButton = 1;
        }  // End On Double Click 

    // Retrive the difficulti
    var difficult = document.getElementById("difficultySelector").value;
    storeDifficulti = difficult;
    //The URL to which we will send the request
    var url = 'https://veff213-sudoku.herokuapp.com/api/v1/sudoku';
    
    //Perform an AJAX POST request to the url, and set the param 'myParam' in the request body to paramValue
    axios.post(url, { difficulty: difficult })
        .then(function (response) {
            //When successful, print 'Success: ' and the received data
            console.log("Success: ", response.data);
            
            // Komin með Flatan lista
            for (var i in response.data.board.boxes)
                for (var j in response.data.board.boxes[i])
                    arrOfNumbers.push(response.data.board.boxes[i][j])
            
            // Get the ID of the Board and write it to a Paragraph
            var idofBoard = response.data.board._id;
            // Write id to para func
            writeToParagr(idofBoard);

            // Change 1D list to 2D and store it Newarray
            chunkArrayInGroups(arrOfNumbers);
            
            // Add the Elements to the table
            addElementsToTable();

        })
        .catch(function (error) {
            errorDef = true;
            //When unsuccessful, print the error.
            console.log("The error is : ",  error);
        })
        .then(function () {
            // IF CONNECTION FAIL PRINT DEFAULT TABLE.
            if (errorDef) {
                if (difficult == "easy") {
                    arrOfNumbers = array_easy;
                } else if (difficult == "medium") {
                    arrOfNumbers = array_medium;
                } else {
                    arrOfNumbers = array_hard;
                }   
                // If error Id is -1
                idofBoard = -1;
                writeToParagr(idofBoard);
                // Change 1D list to 2D and store it Newarray
                chunkArrayInGroups(arrOfNumbers);

                // Add the Elements to the table
                addElementsToTable();
            }
            // This code is always executed, independent of whether the request succeeds or fails.
        });
}


// Got into problems with getting 2d from the POST request i got 3D [][][] so i retrived flat 
// And this function changes it to 2D

function chunkArrayInGroups(arrOfNumbers) {
    var size = 9
    var set = arrOfNumbers.length/size; 
    var count = 0; 

    out:
    for(var i = 0; i<set; i++){
      array[i] = []; //ensure each element i is an array
      for (var j=0; j<size; j++){
        if (count === arrOfNumbers.length) {
          break out;
        }
        array[i][j] = arrOfNumbers[count]; //obtain values from passed array, arr
        count++; 
      }
    }      
    return array;
  }

  /////////////////////////////////////////////////////////////////////////
//                  Write id to paragraph
/////////////////////////////////////////////////////////////////////////
function writeToParagr(idofBoard) {

    var getParagraph = document.getElementById("sudokuId")
    // Empty the paragr. if there is any
    document.getElementById("sudokuId").innerHTML = "";
    // Add the paragr.
    var text = document.createTextNode("The ID of the board is: " + idofBoard);
    getParagraph.appendChild(text);
}

/////////////////////////////////////////////////////////////////////////
//                  Add elements to HTML Table
/////////////////////////////////////////////////////////////////////////

function addElementsToTable() {

    // 9 x Lists
    for (var i = 0; i < array.length; i++) {
        // 9 x Elements in each list
        for (var j = 0; j < array.length; j++) {
            if (array[i][j] == ".") {
                var className = "cell" + i + j
                graycolor = document.getElementById(className)
                graycolor.style.backgroundColor = "white";
                continue;
            } else {
                var className = "cell" + i + j
                graycolor = document.getElementById(className)
                document.getElementById(className).value = array[i][j];
                document.getElementById(className).disabled = true;
                graycolor.style.backgroundColor = "#C3C3C3";
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////
//                  Check input value
/////////////////////////////////////////////////////////////////////////
function checkValidations() {
    
    loop:  // Loop to find and Retrive Input values.
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array.length; j++) {
                var className = "cell" + i + j;
                var inputValue = document.getElementById(className);
                var inputValueNumber = document.getElementById(className).value;

                if (inputValue && inputValue.value && inputValue.disabled != true) {
                    break loop;
                } else {
                    continue;
                }
            }
    } // End Of Loop
    var className_1 = className
    // store two var of row one for later use
    var rowNr = j;
    var rowNr_2 = j;
    // Variable for column
    var boxNr = i;
    var boxNr_2 = i


    // Check where the loop should start for Horizantal check
    if (j > 2 && j < 6) {
        var rowNr = 3;
    } else if (j > 5 && j < 9) {
        var rowNr = 6;
    } else {
        var rowNr = 0;
    }

    // fix the box so it goes to start if not there
    if (i == 0 || i < 3) {
        var boxNr = 0;
    } else if (i > 2 && i < 6) {
        var boxNr = 3;
    } else {
        var boxNr = 6;
    }

    // Loop horizantaly and check the values if it Violates 
    for (var columns = 0; columns != 3; columns++) {
        for (var length = 0; length != 3; length++) {
            var className = "cell" + boxNr + rowNr;
            var inputValueCheck = document.getElementById(className);
            // if it violates Mark the cell Red
            if (inputValueCheck.value == inputValue.value && inputValueCheck.disabled == true && inputValue.disabled == false) {
                inputValue.style.backgroundColor = "#F08080";
            } else if (length == 2) {
                rowNr = rowNr - 2;
                boxNr ++;
            } else {
                rowNr ++;
                continue;
            }
        }
    } // End Of Loop Horizantal
    boxNr = boxNr - 3;


    // IF it did not violate Horizantaly it tests Verticaly else it skips it.
    if (inputValue.style.backgroundColor != "#F08080") {

            // fix the box so it goes to start if not there
        if (i == 0 || i < 3) {
            var boxNr_2 = boxNr_2
        } else if (i > 2 && i < 6) {
            var boxNr_2 = boxNr_2 - 3;
        } else {
            var boxNr_2 = boxNr_2 - 6;
        }

                // Check where the loop should start for Horizantal check
        if (j > 2 && j < 6) {
            var rowNr_2 = rowNr_2 - 3;
        } else if (j > 5 && j < 9) {
            var rowNr_2 = rowNr_2 - 6;
        } else {
            var rowNr_2 = rowNr_2;
        }
        // Vertival Loop
        for (var columns = 0; columns != 3; columns++) {
            for (var length = 0; length != 3; length++) {
                var className = "cell" + boxNr_2 + rowNr_2;
                var inputValueCheck = document.getElementById(className);
                
                // While check Second or third or so on no value is then return nothing and stop
                if (inputValueCheck == null) {
                    return;
                } else {
                    colorToYellow();
                }
                

                // if it violates Mark the cell Red
                if (inputValueCheck.value == inputValue.value && inputValueCheck.disabled == true && inputValue.disabled == false) {
                    inputValue.style.backgroundColor = "#F08080";
                } else if (length == 2) {
                    rowNr_2 = rowNr_2 - 6;
                    boxNr_2 = boxNr_2 + 3;
                } else {
                    rowNr_2 = rowNr_2 + 3;
                    continue;
                }
            }
        } // End of Loop Vertical
    }

    if (isNaN(inputValue.value) == true || inputValue.value > 9){
        inputValue.style.backgroundColor = "#F08080";
    }

    // If the background hasn't been colored red then DISABLE the field 
    if (inputValue.style.backgroundColor != "rgb(240, 128, 128)") {
        document.getElementById(className_1).disabled = true;
        inputValue.style.backgroundColor = "#C3C3C3";
    }


    // Timout function to change the Red wrong input value back to White. or Disable and grayscale the input
    setTimeout(function(){ if (inputValue.style.backgroundColor == "rgb(240, 128, 128)"){
        inputValue.style.backgroundColor = "white";
        document.getElementById(className_1).value = null;
        colorToWhite(); 
        } else {
            colorToWhite(); 
        }}, 5000);

    // Check if all cells are full / if winner
    checkIfwinner();

    // Go again through the array and check if there is another number
    setTimeout(function(){
        for (var i = 0; i < 81; i++) {
            checkAgain = checkValidations();
            if (checkAgain == null) {
                break;
            } else {
                continue;
            }
        }
    }, 5000);
}

//////////////////////////////////////////////////////
// Color the empty input Fields to yellow
//////////////////////////////////////////////////////
function colorToYellow() {
    for (var i = 0; i < array.length; i++) {
        // 9 x Elements in each list
        for (var j = 0; j < array.length; j++) {
            var className = "cell" + i + j;
            var windowtocolor = document.getElementById(className);
            if (windowtocolor.value) {
                continue;
            } else {
                windowtocolor.style.backgroundColor = "#FFFF99";
            }
        }
    }
}

//////////////////////////////////////////////////////
// Color the empty input Fields back to white
//////////////////////////////////////////////////////
function colorToWhite() {
    for (var i = 0; i < array.length; i++) {
        // 9 x Elements in each list
        for (var j = 0; j < array.length; j++) {
            var className = "cell" + i + j;
            var windowtocolor = document.getElementById(className);
            if (windowtocolor.value) {
                continue;
            } else {
                windowtocolor.style.backgroundColor = "white";
            }
        }
    }
}

//////////////////////////////////////////////////////
//              Check If winner
//////////////////////////////////////////////////////
function checkIfwinner() {
    counter = 0;
    for (var i = 0; i < array.length; i++) {
        // 9 x Elements in each list
        for (var j = 0; j < array.length; j++) {
            var className = "cell" + i + j;
            var windowtocolor = document.getElementById(className);
            if (windowtocolor.value) {
                counter ++;
                continue;
            } else {
                continue;
            }
        }
    }
    if (counter == 81) {
        document.getElementById("resultMsg").style.display="block";
        givePoints();
    }
    counter = 0;
}

//////////////////////////////////////////////////////
//              Points
//////////////////////////////////////////////////////
var points = 0
function givePoints(storeDifficulti) {
    var getParagraph = document.getElementById("pointsGive")
    // Empty the paragr. if there is any
    document.getElementById("pointsGive").innerHTML = "";
    
    if (storeDifficulti == "easy") {
        points = points + 1;
    } else if (storeDifficulti == "medium") {
        points = points + 2;
    } else {
        points = points + 3;
    }
    var text = document.createTextNode("Points: " + points);
    getParagraph.appendChild(text);
}

//////////////////////////////////////////////////////
//              Time counter
//////////////////////////////////////////////////////
