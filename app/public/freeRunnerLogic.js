//BOX RUNNER
//by Patrick Hernandez

//** Originally, the game would allow the user to 'jump' over the red cubes, thus I named them 'hurdles'

//Measurements and box id reference
var box = $('#boxside');
var boxPos = {width: 20, height: 20};
var hurdlePos = {width: 30, height: 30};
var coinPos = {width: 30, height: 30};

//Window measurments for responsive gameplay
var windowHeightSize = $(window).height();
var windowWidthSize = $(window).width();
var laneWrapperHeight = $('.laneWrapper').height();
var laneWrapperWidth = $('.laneWrapper').width();

console.log(windowHeightSize + " " + windowWidthSize);

//1% of the height and width of the on load browser size
var onePercentH = windowHeightSize / 100;
var onePercentW = windowWidthSize / 100;

//Top and Bottom lane measurements based on screen size
var percent15 = parseFloat(onePercentH * 15); 
var laneTop = (percent15 + 178);
var laneBottom = (percent15 + 265);

//Determines the speed of obsticales based on screen width
//184.32 a second
var percent120 = parseFloat(onePercentW * 120);
console.log("120% of screen: " + percent120);
var findSpeed = (percent120 / 184.32);
console.log("Speed: " + findSpeed);
var speedRound = Math.round(findSpeed);
console.log("Speed Rounded: " + speedRound);
var speed = speedRound * 1000;


//initial score on reset
//loggedIn variable tracks if a user is logged in or not with sessions
var score = 0;
var loggedIn;

//Tracks the hurdle to delete it when animation is complete
//**This prevents lag and build up of hurdles off screen
var lane1hurdlesPassed = 0;
var lane2hurdlesPassed = 0;
var lane3hurdlesPassed = 0;
var lane4hurdlesPassed = 0;
var lane5hurdlesPassed = 0;

//Tracks if game is started or not, user starts in lane 1
var launch = false;
var lane = 1;

//Sessions will make this var the username of whoever is currently logged in
var name;

//Global counters to track each hurdle that is produced (lanes 1 - 5)
var h1counter = 0;
var h2counter = 0;
var h3counter = 0;
var h4counter = 0;
var h5counter = 0;

//tracks the number of coins generated and coins collected during gameplay
var coinCounter = 0;
var coinsCollected = 0;

//Intervals for obsticales, set to global for placement comparison
var interval1;
var interval2;
var interval3;
var interval4;
var interval5;

//Tracks navbar dropdowns (0 = closed, 1 = open)
var profileStatus = 0;
var shopStatus = 0;
var loginStatus = 0;
var hsStatus = 0;
/*var logOutStatus = 0;
var signUpStatus = 0;*/



//=======
//TODO LIST:
//after animation deleteHurdle function will add 1 to hurdle value then delete -- done
//function startLaneDetection for lane collision check to avoid over movement -- done
//cant access any nav buttons while game is started -- done
//user authentication --done
//sign up working correctly -- done
//setup store/profile/signup modal and login div -- done
//put hat on character -- done
//selected hat stays on character after run and on login -- done
//responsive gameplay --done
//onkeydown, if counter >= 5, stop animation -- done
//build algo for wall error -- done
//db collection for current open lobbies -- done
//fix item purchase while active glitch -- done


//change box catch dimensions -- see prototype
    //media query box top
//build algo to stop coin and hurdle collision -- attempted
    //--combine hurdle and coin generator to make chain of events, pitfalls as well

//delete room from lobby board on disconnect -- done
//lowercase when logging in check -- done
//add paralax cloud movement -- done
//user is able to remove hat -- WONT WORK??
//real time lobby updates -- run ajax on click not on page load

//style profile/multi-lobby/
//players defeated in profile
//add intructions for non mem and mem
//add options dropdown: music settings/instructions on:off/color
//add logo
//add logo to nav tab
//fix multiplayer button from splitting when browser is wide
//be able to move and drag highscore list to plant on page?
//add duel rank
//duel highscores

//look into background ideas
//send user name to mongodb as is, then when cross ref, setLowercase

//add pitfalls
//alert to refresh window after resizing
//increase in difficulty?

//==========

//Function to grab difference between two numbers
function diff(a,b){return Math.abs(a-b);};

//Prototype to capitalize the first letter in a string
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//For paralax cloud1 movement
var backgroundScroll = function(params) {
    params = $.extend({
        scrollSpeed: 35,
        imageWidth: $('#cloud1').width(),
        imageHeight: $('#cloud1').height()
    }, params);
    var step = 1,
        current = 0,
        restartPosition = - (params.imageWidth - params.imageHeight);
    var scroll = function() {
        current -= step;
        if (current == restartPosition){
            current = 0;
        }   
        $('#cloud1').css('backgroundPosition', current + 'px 0');
    };
    this.init = function() {
        setInterval(scroll, params.scrollSpeed);
    };
};
var scroll = new backgroundScroll();
scroll.init();

//For paralax cloud2 movement
var background2Scroll = function(params) {
    params = $.extend({
        scrollSpeed: 35,
        imageWidth: $('#cloud2').width(),
        imageHeight: $('#cloud2').height()
    }, params);
    var step = 1,
        current = 0,
        restartPosition = - (params.imageWidth - params.imageHeight);
    var scroll = function() {
        current -= step;
        if (current == restartPosition){
            current = 0;
        }   
        $('#cloud2').css('backgroundPosition', current + 'px 0');
    };
    this.init = function() {
        setInterval(scroll, params.scrollSpeed);
    };
};
var scroll = new background2Scroll();
scroll.init();

//Code for background color spectrum
var picker = $("#backgroundColorPicker");
var previousСolor;
var isChange = false;

picker.spectrum({
    preferredFormat : "rgb",
    move : function (tinycolor) {
        $("body").css("background-color", tinycolor.toRgbString());
        $("#ledge-block").css("background-color", tinycolor.toRgbString());
        $("#ledge-block2").css("background-color", tinycolor.toRgbString());
        $("#ledge-block3").css("background-color", tinycolor.toRgbString());
        $("#ledge-block4").css("background-color", tinycolor.toRgbString());
    },
    show : function (tinycolor) {
        isChange = false;
        previousСolor = tinycolor;
    },
    hide : function (tinycolor) {
        if (!isChange && previousСolor) {
            $("body").css("background-color", previousСolor.toRgbString());
            $("#ledge-block").css("background-color", tinycolor.toRgbString());
            $("#ledge-block2").css("background-color", tinycolor.toRgbString());
            $("#ledge-block3").css("background-color", tinycolor.toRgbString());
            $("#ledge-block4").css("background-color", tinycolor.toRgbString());

        }

    },
    change : function (tinycolor) {
        isChange = true;
        $("body").css("background-color", tinycolor.toRgbString());
        $("#ledge-block").css("background-color", tinycolor.toRgbString());
        $("#ledge-block2").css("background-color", tinycolor.toRgbString());
        $("#ledge-block3").css("background-color", tinycolor.toRgbString());
        $("#ledge-block4").css("background-color", tinycolor.toRgbString());
        saveBgColor(tinycolor.toRgbString());
    }
});

//ajax call that saves the background color to database
function saveBgColor(bgColor){
    $.ajax({

        method: 'POST',

        url: '/saveBgColor',

        data: {
            username: name,
            bgColor: bgColor
        },

        success: function(response){
            alert('Background color saved!');
        }

    });  
}

//If any place on the page is clicked after a game is over, the page will reload
$('#gameOverModal').on('click', function(){
    location.reload();
});

//Code for login dropdown
$('#loginBtn').on('click', function() {
    if (loginStatus == 0 && launch == false){
        $('#loginDiv').animate({
            top: "38px"
        }, 500);
        loginStatus += 1;
    } else if (loginStatus == 1 && launch == false){
        $('#loginDiv').animate({
            top: "-150px"
        }, 500);
        loginStatus = 0;
    } else if (launch == true){
        console.log("Game has already started");
    }
});

//Code for when a user attempts to login
$("#submitLoginInfo").on("click", function(){
    var usernameInput = $("#usernameInput").val().trim();
    var passwordInput = $("#passwordInput").val().trim();
    console.log(usernameInput + " " + passwordInput);
    loginAttempt(usernameInput, passwordInput);
    return false;
});

//Shows signUpModal when user clicks 'sign up'
$("#signUp").on("click", function(){
	/*signUpStatus += 1;*/
	$('#signUpModal').modal('show');
});

//submits new user to the database
$("#submitNewUser").on("click", function(){
	var usernameSignUp = $("#signupUserName").val().trim();
    var passwordSignUp = $("#signupPassword").val().trim();
    var passwordCheck = $("#signupPasswordCheck").val().trim();
    var usernameCharCountCheck = $.trim($("#signupUserName").val());
    var passwordCharCountCheck = $.trim($("#signupPassword").val());
    
    //if the username or password is not filled out, user will be alerted
    //if password and password verify do not match, user will be alerted
    //else new user created!
    if (usernameCharCountCheck <= 0 || passwordCharCountCheck <= 0){
    	alert('Please fill out both forms');
    } else if (passwordSignUp != passwordCheck){
    	alert('Passwords do not match')
    } else {
	    $.ajax({

	        method: 'POST',

	        url: '/submitNewUser',

	        data: {
	            newUser: usernameSignUp,
	            newPass: passwordSignUp
	        },

	        success: function(response){
		        console.log(response);
		        if (response == 'success'){
		        	alert('Successfully signed up! You may now login!');
                    $('#signUpModal').modal('hide');
		        } else {
		        	alert('Error');
		        }
	        }

	    });
    }
});

//If login credentials are accepted, page is reloaded and data is pulled for user on reload
$("#loginAccept").on("click", function(){
	location.reload();
});

//Asks user if they are sure they want to log out
$("#logOutRequest").on("click", function(){
	/*logOutStatus += 1;*/
	$('#logOutModal').modal('show');
});

//If user confirms they want to log out, logout ajax call is run
$("#logOutConfirm").on("click", function(){
	$.ajax({

        method: 'GET',

        url: '/logout',

        success: function(response){
        	if (response == "success"){
        		alert("You have logged out");
        		location.reload();
        	}
        }

    });
});


//Code for multiplayer lobby
//**This is simply the code for the modal, to see multiplayer gameplay open: freeRunnerMulti.js

//Shows the multiplayer lobby modal on click
$('#multiplayerBtn').on('click', function(){
    $('#lobbyModal').modal('show');
});

//When Create lobby is clicked, a random number is generated and passed through createRoom()
$('#createLobby').on('click', function(){
    var room = Math.floor(Math.random() * (50000000000000 - 10000000000000)) + 10000000000000;
    createRoom(room);
});




//Code for profile dropdown
$('#profileBtn').on('click', function(){
    if (profileStatus == 0 && launch == false){
        $('#profileDiv').animate({
            top: "38px"
        }, 500);
        profileStatus += 1;
    } else if (profileStatus == 1 && launch == false){
        $('#profileDiv').animate({
            top: "-150px"
        }, 500);
        profileStatus = 0;
    } else if (launch == true){
        console.log("Game has already started");
    }
});

//attempt to remove hat from user
$('#hatPlaceHolder').on('click', function(){
    $('#spot' + currentHat).html("<img data-id='1' id='itemPorfile" + currentHat + "pic' class='hatProfile' src='css/images/hat" + currentHat + ".png'>");
});

//checks to see if you own the hat before you can wear it
//**Avoids user clicking and empty space and still getting the hat
$('.pItem').on('click', function(){
	var hatId = $(this).attr('data-id');
	var purchasedCheck = $('#itemProfile' + hatId + 'pic').attr('data-id');

	if (purchasedCheck != 1){
		console.log("You don't have this hat!");
	} else {
		if (currentHat != null){
			$('#spot' + currentHat).html("<img data-id='1' id='itemProfile" + currentHat + "pic' class='hatProfile' src='css/images/hat" + currentHat + ".png'>");
		}
		selectHat(hatId);
	}
});

//The users current hat that is on
var currentHat;

//Allows user to select hat from his profile
function selectHat(itemId){
	currentHat = itemId;
	$('#currentHat').remove();
	$('#spot' + itemId).empty();
	$('#spot' + itemId).html("ON");
	$('.box').append("<img id='currentHat' class='hat' src='css/images/hat" + itemId + ".png'>");
    currentHatUpdate(itemId);
}

//updates which hat the user is currently wearing
function currentHatUpdate(itemId){
    $.ajax({

        method: 'POST',

        url: '/updateCurrentHat',

        data: {
                currentUser: name,
                currentHat: itemId
        },

        success: function(response){
            console.log(response + "what is this");
        }

    });
}

//Code for Options Modal
//Opens options modal IF game is not launched
$('#optionsBtn').on('click', function() {
    if (launch == false){
        $('#optionsModal').modal('show');
    } else if (launch == true){
        console.log("Game has already started");
    }
});

//instructions setting is set to false at first, but is redefined based on user preference (on/off)
var instructionsBtn = false;

//saves user preference to database and changes btn on screen
$('#instructionsBtn').on('click', function() {
    $.ajax({

        method: 'POST',

        url: '/checkInstructionOptn',

        data: {
                username: name
        },

        success: function(response){
            console.log(response);
            if (response[0].instructions == 'false'){
                $('#instructionsBtn').html('On');
                $('.instructions').show();
                updateInstructions('true');
            } else if (response[0].instructions == 'true') {
                $('#instructionsBtn').html('Off');
                $('.instructions').hide();
                updateInstructions('false');
            }
        }

    });
});

//updates database on click to save user preference
function updateInstructions(status){
    $.ajax({

        method: 'POST',

        url: '/updateInstructionOptn',

        data: {
                username: name,
                data: status
        },

        success: function(response){
            console.log('successfully updated instructions');
        }

    });
}


//Code for High Score dropdown
//Opens High Score tab IF game is not launched
$('#hsBtn').on('click',  function() {
    if (hsStatus == 0 && launch == false){
        $('#highscoreDiv').animate({
            top: "38px"
        }, 500);
        hsStatus += 1;
    } else if (hsStatus == 1 && launch == false){
        $('#highscoreDiv').animate({
            top: "-150px"
        }, 500);
        hsStatus = 0;
    } else if (launch == true){
        console.log("Game has already started");
    }
});



//Code for shop modal

$('#shopBtn').on('click', function() {
    if (launch == false){
        $('#shopModal').modal('show');
    } else if (launch == true){
        console.log("Game has already started");
    }
});

//tracks which item is currently in view @ shop
var nextSlide = 2;
var currentSlide = 1;
var itemDataId = 1;
var previousSlide = 0;

//Makes all items that are not currently selected transparent
function itemSlide(){
    $('#item' + currentSlide + "pic").addClass('currentItem');
    $('#item' + currentSlide + "pic").removeClass('notSelected');
    $('#item' + previousSlide + "pic").addClass('notSelected');
    $('#item' + previousSlide + "pic").removeClass('currentItem');
    $('#item' + nextSlide + "pic").addClass('notSelected');
    $('#item' + nextSlide + "pic").removeClass('currentItem');
};

//Slides all shop items to the right and updates current slide
$('#shopSelectRight').on('click', function(){
    if (currentSlide == 4){
        console.log('no more items left!');
    } else {
        $('.itemDiv').animate({
            marginLeft: "-=138"
        }, 250);
        itemDataId += 1;
        $("#purchaseItem").attr("data-id", itemDataId);
        currentSlide += 1;
        previousSlide += 1;
        nextSlide += 1;
        itemSlide();
    }

});

//Slides all shop items to the left and updates current slide
$('#shopSelectLeft').on('click', function(){
if (currentSlide == 0){
        console.log('no more items left!');
    } else {
        $('.itemDiv').animate({
            marginLeft: "+=138"
        }, 250);
        itemDataId -= 1;
        $("#purchaseItem").attr("data-id", itemDataId);
        currentSlide -= 1;
        previousSlide -= 1;
        nextSlide -= 1;
        itemSlide();
    }
});

//Runs makePurchase() when user tries to purchase selected item
$('#purchaseItem').on('click', function(){
    var itemId = $(this).attr('data-id');
    var cost = $('#price' + itemDataId).attr('data-id');
    makePurchase(itemId, cost);
});



//Code for user commands
//Swtich case for fast response time
$(document).keyup(function(e) {
    switch (e.which) {
    case 40:
        down();
        break;
    case 38:
        up();
        break;
    case 32:
        /*jump();*/
        break;
    case 80:
        /*pause();*/
        break;
    }
});

//Tracks if SHIFT and S have been selected at the same time
var map = {16: false, 83: false};
$(document).keydown(function(e) {
    if (e.keyCode in map == true) {
        map[e.keyCode] = true;
        if (map[16] && map[83] == true) {
	    		start();
        }
    }
}).keyup(function(e) {
    if (e.keyCode in map == true) {
        map[e.keyCode] = false;
    }
});

//If the game has not already been started, runs start() on SHIFT & S keyup
function start(){
    if (launch == false){
    	//Moves start ledge images to the left
    	// **creates illusion of movement
        $('#ledge-pic').animate({
            left: "-=550px"
        }, 3000);
        $('#ledge-block').animate({
            left: "-=550px"
        }, 3000);
        $('#ledge-block2').animate({
            left: "-=550px"
        }, 3000);
        $('#ledge-block3').animate({
            left: "-=550px"
        }, 3000);
        $('#ledge-block4').animate({
            left: "-=550px"
        }, 3000);

        //Creates first 'herd', starts score
        createHerd();
        startScore();

        //All background items fade out to deter lag.
        $('#start').fadeOut();
        $('#cloud1').fadeOut();
        $('#cloud2').fadeOut();
        $('.instructions').fadeOut();

        //If a user is logged in, coins are added to game play
        //Else login tab is closed if it is currently open
        if (loggedIn == true){
        	startCoinGenerator();
        } else {
            $('#loginDiv').animate({
                top: "-=150px"
            }, 500);
            loginStatus = 0;    
        }

        //Sets launch variable to true
        //** This is important because the user cannot open any tab while gameplay is running
    	//** This variable is used for multiple checking operations
        launch = true;

        //Closes the profile tab if it is currently open
        $('#profileDiv').animate({
            top: "-=150px"
        }, 500);
        profileStatus = 0;

        //A constant lane check to z-index the hurdles accordingly based on the users current lane
        //** This allows the user to be able to pass 'in between' two hurdles
        var laneCheck = setInterval(function(){
            if (lane == 1){
                $('.h1z').css("z-index", "5");
                $('.h2z').css("z-index", "5");
            } else if (lane == 2){
                $('.h1z').css("z-index", "3");
                $('.h2z').css("z-index", "5");
                $('.h3z').css("z-index", "5");
            } else if (lane == 3){
                $('.h1z').css("z-index", "2");
                $('.h2z').css("z-index", "3");
                $('.h3z').css("z-index", "5");
                $('.h4z').css("z-index", "5");
            } else if (lane == 4){
                $('.h1z').css("z-index", "1");
                $('.h2z').css("z-index", "2");
                $('.h3z').css("z-index", "3");
                $('.h4z').css("z-index", "5");
                $('.h5z').css("z-index", "5");
            } else if (lane == 5){
                $('.h4z').css("z-index", "3");
                $('.h5z').css("z-index", "5");
            }
        }, 1);

        //A constant barrier check which does not allow the user to go over the top or bottom ledge
        var barrierCheck = setInterval(function(){
            var posCheck = box.position();
            if (posCheck.top <= parseFloat(laneTop) && lane == 1){
                box.stop();
            } else if (posCheck.top >= parseFloat(laneBottom) && lane == 5){
                box.stop();
            }

        }, 1);

    } else {
        console.log("Game already started!");
    }
}

//Allows user to pause the game

/*function pause(){
    alert("PAUSE");
}

//Allows user to jump

function jump(){
    $('.box').animate({
        top: '-=100'
    }, 1100);
    fall()
}

//Fall function brings user back down

function fall(){
    $('.box').animate({
        top: '+=100'
    }, 1100); 
}*/

//Moves the user up, updates their current lane accordingly
function up(){
    var pos = box.position();
    console.log(pos.top + " " + laneTop);

    if (pos.top <= parseFloat(laneTop) && lane == 1){
        console.log("Fall");
    } else if (pos.top > laneTop && launch == true) {
        box.animate({
            top: '-=22',
            left: '+=22'
        }, 150, 'linear'); 
    }

    if (lane <= 1){
        console.log("Fall");
    } else {
        lane--;
        console.log("lane: " + lane);
    }
}

//Moves the user down, updates their current lane accordingly
function down(){
    var pos = box.position();
    console.log(pos.top + " " + laneBottom)
    if (pos.top >= parseFloat(laneBottom) && lane == 5){
        console.log("Fall");
    } else if (pos.top < laneBottom && launch == true) {
        box.animate({
            top: '+=22',
            left: '-=22'
        }, 150, 'linear'); 
    }

    if (lane >= 5){
        console.log("Fall");
    } else {
        lane++;
        console.log("lane: " + lane);
    }
}

//Code for Score

//Score Interval set to global so it can be stopped later
var scoreInt;

//startScore function invoked during start()
//** updating the score real time on the page caused lag, so for now it is commented out
function startScore(){
    /*$("#scoreDiv").html('<h3>Score: <span id="score"></span></h3>')*/
    scoreInt = setInterval(function(){
        score += 1;
        /*$('#score').html(score);*/
    }, 10);
}

//Code for Coins

//GenerateCoins Interval set to global so it can be stopped later
var generateCoins;

//startCoinGenerator function invoked during start()
//A coin is generated every 1.8 seconds
function startCoinGenerator(){
    var coinsGenerated = 0;
    generateCoins = setInterval(function(){
        coinsGenerated += 1;
        console.log("Coins generated: " + coinsGenerated);
        coinCheck();
    }, 1800); 
}

function coinCheck(){
    //Time until next coin
    var nextCoin = Math.floor(Math.random() * (3000 - 2500)) + 2500;

    //Picks random lane
    var coinLane = Math.floor(Math.random() * (5 - 1)) + 1;
    
    //Attempt to deter coin and hurdle overlap
    //** DOES NOT WORK.. yet
    if (diff(nextCoin, interval1) < 400 && coinLane == 1 || 
        diff(nextCoin, interval2) < 400 && coinLane == 2 || 
        diff(nextCoin, interval3) < 400 && coinLane == 3 ||
        diff(nextCoin, interval4) < 400 && coinLane == 4 ||
        diff(nextCoin, interval5) < 400 && coinLane == 5){
        console.log("ERROR coin was delayed due to unauthorized placement");
        nextCoin += 150;
        coinGenerator(nextCoin, coinLane);
        console.log("Coin interval: " + nextCoin);
    } else {
        coinGenerator(nextCoin, coinLane);
        console.log("Coin interval: " + nextCoin);
    }
}

//Generates a coin on the game and sets collision check interval
function coinGenerator(nextCoin, coinLane){

        var nextCoinTimer = setTimeout(function(){

            coinCounter++;

            if (coinLane == 1){
                $('.lane').append('<div class="h1z hurdle" id="coin-' + coinCounter + '" style="position:fixed;left:110%;top:168.5px;">' + '<img id="hcube" src="css/images/coin.png">' + '</div>');
            } else if (coinLane == 2){
                $('.lane').append('<div class="h2z hurdle" id="coin-' + coinCounter + '" style="position:fixed;left:108%;top:191.4px;">' + '<img id="hcube" src="css/images/coin.png">' + '</div>');
            } else if (coinLane == 3){
                $('.lane').append('<div class="h3z hurdle" id="coin-' + coinCounter + '" style="position:fixed;left:106%;top:214.3px;">' + '<img id="hcube" src="css/images/coin.png">' + '</div>');
            } else if (coinLane == 4){
                $('.lane').append('<div class="h4z hurdle" id="coin-' + coinCounter + '" style="position:fixed;left:104%;top:237.2px;">' + '<img id="hcube" src="css/images/coin.png">' + '</div>');
            } else if (coinLane == 5){
                $('.lane').append('<div class="h5z hurdle" id="coin-' + coinCounter + '" style="position:fixed;left:102%;top:260.1px;">' + '<img id="hcube" src="css/images/coin.png">' + '</div>');
            }
            
            $('#coin-' + coinCounter).animate({
                left: '-=120%'
            }, speed, 'linear');

            var coin = $('#coin-' + coinCounter);

            var updateCoin = setInterval(function(){

                var newCoin = coin.position();

                newBoxPos = box.position();

                if (newBoxPos.top < newCoin.top + coinPos.width && newBoxPos.top + boxPos.width > newCoin.top && newBoxPos.left < newCoin.left + coinPos.height && boxPos.height + newBoxPos.left > newCoin.left && lane == coinLane) {
                    coin.remove();
                    coinsCollected += 1;
                    score += 100;
                }

            }, 1);
        }, nextCoin);
}

//Code for Hurdles

//a HERD of HURDLES is 5
var createHerdOfHurdles;

//Generates a herd of hurdles every 1.8 seconds
function createHerd(){
    var herd = 0;
    /*var herdInterval = Math.floor(Math.random() * (1800 - 1600)) + 1600;*/
    createHerdOfHurdles = setInterval(function(){
        herd += 1;
        console.log("===== Herd: " + herd + "=====")
        createIntervals();
    }, 1800); 
}

//Creates random Intervals for each herd, creating the space difference between them
//**IF all hurdles are to close to eachother, algo with grab two of them and push them back
//**This allows the user to always have a path
function createIntervals(){

    interval1 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
    interval2 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
    interval3 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
    interval4 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
    interval5 = Math.floor(Math.random() * (3000 - 1500)) + 1500;

    if (diff(interval1, interval2) < 500 && diff(interval2, interval3) < 500 && diff(interval3, interval4) < 500 && diff(interval4, interval5) < 500){
        console.log("#ERROR: WALL CREATED#");
        interval1 += 700;
        interval3 += 700;
        console.log("Int1: " + interval1 + " +700 delay");
        console.log("Int2: " + interval2);
        console.log("Int3: " + interval3 + " +700 delay");
        console.log("Int4: " + interval4);
        console.log("Int5: " + interval5);
        console.log("=====Wall Fixed=====");
        createHurdles(interval1, interval2, interval3, interval4, interval5);
    } else {
        createHurdles(interval1, interval2, interval3, interval4, interval5);
        console.log("Int1: " + interval1);
        console.log("Int2: " + interval2);
        console.log("Int3: " + interval3);
        console.log("Int4: " + interval4);
        console.log("Int5: " + interval5);
        console.log("====================");
    }

}

//This function could definitely be broken down into a smaller chunk, however, I haven't had time to do so.
//I will comment out section one, but since the remaining 4 are the same, I will leave those uncommented.

//createHurdles takes in all 5 randomly generated intervals as params
function createHurdles(interval1, interval2, interval3, interval4, interval5){

	//grabs current position of user
    var newBoxPos = box.position();

    //Code for hurdle in lane 1
    //uses the first interval and sets a timeout with it
    var newHurdle1 = setTimeout(function(){

    	//adds 1 to the hurdle1 counters
        h1counter++;

        //appends the hrudle 110% off the page
        $('.lane').append('<div class="h1z hurdle" id="hurdle1-' + h1counter + '" style="position:fixed;left:110%;top:168.5px;">' + '<img id="hcube" src="css/images/hcube.png">' + '</div>');
        
        //moves the hurdle across the page using a speed determined by the page width
        $('#hurdle1-' + h1counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane1hurdlesPassed++;
            //deletes hurdle after it is off the page
            $('#hurdle1-' + lane1hurdlesPassed).remove();
        });

        //creates unique class for the hurdle to be tracks for collision
        var hurdle1 = $('#hurdle1-' + h1counter);

        //sets constant update to check for collision between hurdle and user
        var update1 = setInterval(function(){

        	//grabs hurdles current position
            var newHurdlePos1 = hurdle1.position();

            //grabs users updated position
            newBoxPos = box.position();

            //checks if the user and THIS hurdle have collided and if they do: all hurdles are stopped, all intervals are cleared, gameover modal is shown, and game is reset 
            if (newBoxPos.top < newHurdlePos1.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos1.top && newBoxPos.left < newHurdlePos1.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos1.left && lane == 1) {
                clearInterval(update1);
                clearInterval(scoreInt);
                clearInterval(createHerdOfHurdles);
                clearInterval(generateCoins);
                console.log(loggedIn);
                $('#gameOverScore').html(score);
                $('#gameOverCoin').html(coinsCollected);
                var stopHurdles = setInterval(function(){
                    $('.hurdle').stop();
                }, 1);
                if (loggedIn == true){
                    updateAfterRun();
                } else {
                    $('#gameOverModal').modal('show');
                    $('#gameOverCoinDiv').remove();
                }
            }

        }, 1);

    }, interval1);

    //Code for hurdle in lane 2
    var newHurdle2 = setTimeout(function(){

        h2counter++;

        $('.lane').append('<div class="h2z hurdle" id="hurdle2-' + h2counter + '" style="position:fixed;left:108%;top:191.4px;">' + '<img id="hcube" src="css/images/hcube.png">' + '</div>');
        
        $('#hurdle2-' + h2counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane2hurdlesPassed++;
            $('#hurdle2-' + lane2hurdlesPassed).remove();
        });

        var hurdle2 = $('#hurdle2-' + h2counter);

        var update2 = setInterval(function(){

            var newHurdlePos2 = hurdle2.position();

            newBoxPos = box.position();

            if (newBoxPos.top < newHurdlePos2.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos2.top && newBoxPos.left < newHurdlePos2.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos2.left && lane == 2) {
                 clearInterval(update2);
                clearInterval(scoreInt);
                clearInterval(createHerdOfHurdles);
                clearInterval(generateCoins);
                console.log(loggedIn);
                $('#gameOverScore').html(score);
                $('#gameOverCoin').html(coinsCollected);
                var stopHurdles = setInterval(function(){
                    $('.hurdle').stop();
                }, 1);
                if (loggedIn == true){
                    updateAfterRun();
                } else {
                    $('#gameOverModal').modal('show');
                    $('#gameOverCoinDiv').remove();
                }
            }

        }, 1);

    }, interval2);

	//Code for hurdle in lane 3
    var newHurdle3 = setTimeout(function(){

        h3counter++;

        $('.lane').append('<div class="h3z hurdle" id="hurdle3-' + h3counter + '" style="position:fixed;left:106%;top:214.3px;">' + '<img id="hcube" src="css/images/hcube.png">' + '</div>');
        
        $('#hurdle3-' + h3counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane3hurdlesPassed++;
            $('#hurdle3-' + lane3hurdlesPassed).remove();
        });

        var hurdle3 = $('#hurdle3-' + h3counter);

        var update3 = setInterval(function(){

            var newHurdlePos3 = hurdle3.position();

            newBoxPos = box.position();

            if (newBoxPos.top < newHurdlePos3.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos3.top && newBoxPos.left < newHurdlePos3.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos3.left && lane == 3) {
                clearInterval(update3);
                clearInterval(scoreInt);
                clearInterval(createHerdOfHurdles);
                clearInterval(generateCoins);
                console.log(loggedIn);
                $('#gameOverScore').html(score);
                $('#gameOverCoin').html(coinsCollected);
                var stopHurdles = setInterval(function(){
                    $('.hurdle').stop();
                }, 1);
                if (loggedIn == true){
                    updateAfterRun();
                } else {
                    $('#gameOverModal').modal('show');
                    $('#gameOverCoinDiv').remove();
                }
            }

        }, 1);

    }, interval3);

	//Code for hurdle in lane 4
    var newHurdle4 = setTimeout(function(){

        h4counter++;

        $('.lane').append('<div class="h4z hurdle" id="hurdle4-' + h4counter + '" style="position:fixed;left:104%;top:237.2px;">' + '<img id="hcube" src="css/images/hcube.png">' + '</div>');
        
        $('#hurdle4-' + h4counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane4hurdlesPassed++;
            $('#hurdle4-' + lane4hurdlesPassed).remove();
        });

        var hurdle4 = $('#hurdle4-' + h4counter);

        var update4 = setInterval(function(){

            var newHurdlePos4 = hurdle4.position();

            newBoxPos = box.position();

            if (newBoxPos.top < newHurdlePos4.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos4.top && newBoxPos.left < newHurdlePos4.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos4.left && lane == 4) {
                clearInterval(update4);
                clearInterval(scoreInt);
                clearInterval(createHerdOfHurdles);
                clearInterval(generateCoins);
                console.log(loggedIn);
                $('#gameOverScore').html(score);
                $('#gameOverCoin').html(coinsCollected);
                var stopHurdles = setInterval(function(){
                    $('.hurdle').stop();
                }, 1);
                if (loggedIn == true){
                    updateAfterRun();
                } else {
                    $('#gameOverModal').modal('show');
                    $('#gameOverCoinDiv').remove();
                }
            }

        }, 1);

    }, interval4);

	//Code for hurdle in lane 5
    var newHurdle5 = setTimeout(function(){

        h5counter++;

        $('.lane').append('<div class="h5z hurdle" id="hurdle5-' + h5counter + '" style="position:fixed;left:102%;top:257.1px;">' + '<img id="hcube" src="css/images/hcube.png">' + '</div>');
        
        $('#hurdle5-' + h5counter).animate({
        left: '-=120%'
        }, speed, 'linear', function(){
            lane5hurdlesPassed++;
            $('#hurdle5-' + lane5hurdlesPassed).remove();
        });

        var hurdle5 = $('#hurdle5-' + h5counter);

        var update5 = setInterval(function(){

            var newHurdlePos5 = hurdle5.position();

            newBoxPos = box.position();

            if (newBoxPos.top < newHurdlePos5.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos5.top && newBoxPos.left < newHurdlePos5.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos5.left && lane == 5) {
                clearInterval(update5);
                clearInterval(scoreInt);
                clearInterval(createHerdOfHurdles);
                clearInterval(generateCoins);
                console.log(loggedIn);
                $('#gameOverScore').html(score);
                $('#gameOverCoin').html(coinsCollected);
                var stopHurdles = setInterval(function(){
                    $('.hurdle').stop();
                }, 1);
                if (loggedIn == true){
                    updateAfterRun();
                } else {
                    $('#gameOverModal').modal('show');
                    $('#gameOverCoinDiv').remove();
                }
            }

        }, 1);

    }, interval5);

}

//Removes all hurdles on collision to avoid double or endless collisions
function removeHurdles(counter, lane){
	for (i = 0; i < counter; i++){
		$('#hurdle' + lane + '-' + i).remove();	
	}
}

//routes for data


//On page load, isAuthenticated is run to see if a user is logged in or not using sessions
isAuthenticated();

function isAuthenticated(){
    $.ajax({

        method: 'GET',

        url: '/isAuthenticated',

        success: function(response){
            console.log(response);
            //user is not signed in
            if (response == "invalid"){
            	$(".homeBtn").hide();
                //====
                $("#multiplayerBtn").hide();
                /*grabMultiplayerData();*/
                //====
                $('.instructions').html('<b><h4><span>Dodge the </span><span><img id="hcubeInstruction" src="css/images/hcube.png">s</span><span> for a higher score!</span></h4></b>');
                $("#shopBtn").hide();
                $("#hsBtn").hide();
                $("#optionsBtn").hide();

            } else {
                console.log(response);
                loggedIn = true;
                name = response.user
                grabUserData(name);
                grabHighScoreData();
                grabMultiplayerData();
                $("#loginBtn").hide();
                $(".homeBtn").show();
                $("#multiplayerBtn").show();
                $("#shopBtn").show();
                $("#hsBtn").show();
                $("#optionsBtn").show();
            }
        }

    });
}

//Grabs all multiplayer lobbies currently open and posts them to the lobby
function grabMultiplayerData(){
    $.ajax({

        method: 'POST',

        url: '/lobbyData',

        success: function(response){
            var num = 0;
            for (i = 0; i < response.length; i++){
                num++;
                if (response[i].playerCount == 1){
                    $('#lobbyBoard').append("<a id='joinRoom' data-id='" + response[i].roomId + "'><div class='lobby'>" + num + "<span class='lobbyName'>" + response[i].p1user.capitalizeFirstLetter() + "'s Lobby</span><span>1/2</span><span id='#lobbyStatus'>open</span></div></a>");
                } else if (response[i].playerCount == 2){
                    $('#lobbyBoard').append("<a><div class='lobby'>" + num + "<span class='lobbyName'>" + name.capitalizeFirstLetter() + "'s Lobby</span><span>2/2</span><span id='#lobbyStatus'>closed</span></div></a>");
                }
            }
        }

    }); 
}

//On click 'join room', joinRoom() is invoked with the roomid as a param
$('#lobbyBoard').on('click', '#joinRoom', function(){
    var selectedRoom = $(this).attr("data-id");
    console.log('selected room: ' + selectedRoom);
    joinRoom(selectedRoom);
});

//On join room the url is replaced with the current room url
function joinRoom(roomId){
    $.ajax({

        method: 'POST',

        url: '/joinRoom',

        data: {
            roomId: roomId,
            username: name
        },
        success: function(response){
            console.log("==Join room response==");
            console.log(response);
            console.log("======================");
            var url = window.location.origin + '/multiplayer/room/' + response[0].roomId;
            window.location.replace(url);
        }

    });
}

//on createRoom, the url is replaced using the random number generated
function createRoom(roomId){
    //connect to sec
    $.ajax({

        method: 'POST',

        url: '/createRoom',

        data: {
            roomId: roomId,
            username: name
        },
        success: function(response){
/*            console.log(response);*/

            var url = window.location.origin + '/multiplayer/room/' + response.roomId;
            window.location.replace(url);
        }

    });

}

//runs when user attempts to log in
function loginAttempt(username, password){
    $.ajax({

        method: 'POST',

        url: '/loginAttempt',

        data: {
            user: username,
            pass: password
        },
        success: function(response){
            console.log(response)
            if (response == 'success'){
                $('#successModal').modal('show');
            } else if (response == 'invalid'){
                $('#unsuccessModal').modal('show');
            }
            
            //if response success reload page
        }

    });
}

//grabs highscore data on page load
function grabHighScoreData(){
    $.ajax({

        method: 'GET',

        url: '/highScoreData',

        success: function(response){
            console.log(response);

            $('.rank1name').append(response.rank1[0]);
            $('.rank1score').html(response.rank1[1]);

            $('.rank2name').append(response.rank2[0]);
            $('.rank2score').html(response.rank2[1]);

            $('.rank3name').append(response.rank3[0]);
            $('.rank3score').html(response.rank3[1]);

            $('.rank4name').append(response.rank4[0]);
            $('.rank4score').html(response.rank4[1]);

            $('.rank5name').append(response.rank5[0]);
            $('.rank5score').html(response.rank5[1]);
        }

    });
}

//grabs user data if a user is logged in
function grabUserData(username){
    $.ajax({

        method: 'POST',

        url: '/userData',

        data: {
            username: username
        },

        success: function(response){
            /*console.log("HERE" + response)*/
            $('#profileHs').html(response.score);
            $('#profileCoins').html(response.coins);
            $('#shopCoins').html(response.coins);
            $('#userName').html(response.username.capitalizeFirstLetter());

			if (response.bgColor != "rgb(255, 255, 255)"){
                $("body").css("background-color", response.bgColor);
                $("#ledge-block").css("background-color", response.bgColor);
                $("#ledge-block2").css("background-color", response.bgColor);
                $("#ledge-block3").css("background-color", response.bgColor);
                $("#ledge-block4").css("background-color", response.bgColor);
                $("#start").css("color", "black");
                $(".instructions").css("color", "black");
            }

            if (response.instructions == 'true'){
                $('#instructionsBtn').html('On');
                $('.instructions').show();
            } else if (response.instructions == 'false'){
                $('#instructionsBtn').html('Off');
                $('.instructions').hide();
            }

            for (i = 0; i < response.items.length; i++){

               if (response.items[i] == true){
                $("#spot" + i).html("<img data-id='1' id='itemProfile" + i + "pic' class='hatProfile' src='css/images/hat" + i + ".png'>")
               } else if (response.items[i] == false) {
                $("#spot" + i).empty();
                console.log('Not purchased yet');
               } else if (response.items[i] == 'active'){
                $('.box').append("<img id='currentHat' class='hat' src='css/images/hat" + i + ".png'>");
                $('#spot' + i).html("<div id='hatPlaceHolder'>ON</div>");
                currentHat = i;
               }

            }
        }

    });
}

//updates the users data and highscores after game is over
function updateAfterRun(){
    $.ajax({

        method: 'POST',

        url: '/updateAfterRun',

        data: {
            username: name,
            coinsCollected: coinsCollected,
            score: parseInt(score)
        },
        success: function(response){
            $('#gameOverModal').modal('show');
        }

    });
}

//runs when user attempts to make purchase, makes sure they have enough coins or they dont already own that item
function makePurchase(itemId, cost){
    console.log(cost);
    $.ajax({

        method: 'POST',

        url: '/makePurchase',

        data: {
            itemId: itemId,
            cost: cost,
            username: name
        },

        success: function(response){
            if (response.ok == 1){
            	alert('Successfully purchased item!')
                updateAllItemData();
            } else if (response == 'insufficient'){
                alert('Not enough coins');
            } else if (response == 'owned'){
            	alert('You already own that item!');
            }
        }

    });
}

//updates database on purchase
function updateAllItemData(){
    $.ajax({

        method: 'POST',

        url: '/userData',

        data: {
            username: name
        },

        success: function(response){
            $('#profileCoins').html(response.coins);
            $('#shopCoins').html(response.coins);


            for (i = 0; i < response.items.length; i++){
                console.log(response.items[i]);
               if (response.items[i] == true){
                $("#spot" + i).html("<img data-id='1' id='itemProfile" + i + "pic' class='hatProfile' src='css/images/hat" + i + ".png'>");
               } /*else if (response.items[i] == 'active'){
                $('.box').append("<img id='currentHat' class='hat' src='css/images/hat" + i + ".png'>");
                $('#spot' + i).html("ON");
                currentHat = i;
               }*/
               else {
                console.log('Not purchased yet');
               }

            }

        }

    });
}



//==========Code for dropoffs=============

/*var newDropOff = setInterval(function(){
    createDrop();
}, 10000);*/

/*function createDrop(){
    s += 1;
    $('.lane').append(
        '<img class="drop-off" id="dropoff' + s + '" src="dropoff.png" style="top:40.75%;left:110%;"><img class="ledge-pic2" id="ledge-pic2' + s + '" src="startLedge2.png" style="top:40.50%;left:115%;">'
    );
    moveLedge();
}

function moveLedge(){
    p += 1;
    $('#dropoff' + p).animate({
        left: '-=165%'
    }, 15000, 'linear');
    $('#ledge-pic2' + p).animate({
        left: '-=165%'
    }, 15000, 'linear');
    newHurdleSection();
}
*/
/*var deleteDropOff = setInterval(function(){
    t += 1;
    $('#dropoff' + t).remove();
    $('#ledge-pic2' + t).remove();
}, 15000);*/

//===========================================
