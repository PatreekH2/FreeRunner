//BOX RUNNER MULTIPLAYER
//by Patrick Hernandez

//player1 and player2 box class references and measurements
var box = $('.boxside');
var box2 = $('.box2');
var boxPos = {width: 20, height: 20};
var hurdlePos = {width: 30, height: 30};

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
var laneTop = (percent15 + 169);
var laneBottom = (percent15 + 256);
var lane2Top = (percent15 + 51);
var lane2Bottom = (percent15 + 117);

//Determines the speed of obsticales based on screen width
//184.32px a second
var percent120 = parseFloat(onePercentW * 120);
console.log("120% of screen: " + percent120);
var findSpeed = (percent120 / 184.32);
console.log("Speed: " + findSpeed);
var speedRound = Math.round(findSpeed);
console.log("Speed Rounded: " + speedRound);
var speed = speedRound * 1000;

//Tracks the hurdle to delete when animation is complete
    //Lane 1
var lane1hurdlesPassed = 0;
var lane2hurdlesPassed = 0;
var lane3hurdlesPassed = 0;
var lane4hurdlesPassed = 0;
var lane5hurdlesPassed = 0;
    //Lane 2
var lane2_1hurdlesPassed = 0;
var lane2_2hurdlesPassed = 0;
var lane2_3hurdlesPassed = 0;
var lane2_4hurdlesPassed = 0;
var lane2_5hurdlesPassed = 0;

//Boolean for if game is started or not
var launch = false;

//Start lane for both players
var lane = 1;
var lane2 = 1;

//For login verification and global username
var loggedIn;
var name;

//Global counters to track each hurdle that is produced (lanes 1 - 5)
var h1counter = 0;
var h2counter = 0;
var h3counter = 0;
var h4counter = 0;
var h5counter = 0;

var h2_1counter = 0;
var h2_2counter = 0;
var h2_3counter = 0;
var h2_4counter = 0;
var h2_5counter = 0;

//Intervals for obsticales, global for placement comparison
var interval1;
var interval2;
var interval3;
var interval4;
var interval5;

var newHurdle1;
var newHurdle2;
var newHurdle3;
var newHurdle4;
var newHurdle5;

//Tracks number of groups created
var herd = 0;


$('#resultsBtn').hide();


//TODO:

//fix z-index for o-lane -- done
//Add hats to multiplayer -- done
//Fix start position for box1 -- done
//Find and Fix repeating hat glitch --done
//Alert both users if there is a collision -- done
//Add rematch option -- done
//On disconnect/refresh, both players ejected too lobby --done

//sync hurdles no matter screen size

//Add results modal reopen button on nav after finishing a game --done
//leave button, are you sure you want to leave?




//=========
//Capitalize First Letter

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//==========
var socket = io.connect();

grabCurrentRoomData();

$('.box2').hide();

function grabCurrentRoomData(){
    $.ajax({

        method: 'POST',

        url: window.location.pathname,

        success: function(response){
            console.log("Grabbing Current Room Data");
            console.log("Current Room: " + response);
            connect(response);
        }

    });
}

var player;
var p1Status = false;
var p2Status = false;


var rematchStatus = false;

//DID NOT WORK DUE TO REFRESH PAGE ON REMATCH
/*socket.on('disconnected', function(room) {
    //remove from db so it's not in lobby anymore
    if (rematch.rematchStatus == true){
        $.ajax({

            method: 'POST',

            url: '/resetRematchStatus',

            success: function(response){
                rematchStatus = response.rematchStatus;
                console.log('rematch status reset!');
            }

        });  
        console.log('Rematch active!');
    } else if (rematchStatus == false){
                alert('Other player has disconnected! Lobby is closed!');
                window.location.replace(window.location.origin);
    }
});*/


function connect(currentRoom){
    $.ajax({

        method: 'POST',

        url: '/connectPlayers',

        data: {
            roomId: currentRoom
        },

        success: function(response){
            console.log("Connecting Players...");
            console.log(response);
            if (response[0].playerCount == 1){

/*                if (response[0].rematch == false){

                }*/
                socket.emit('createRoom', {room: response[0].roomId, name: response[0].p1user, hat: response[0].p1hat});

                player = 1;
                console.log('I am player' + player);
            
            } else if (response[0].playerCount == 2){

                socket.emit('joinRoom', {room: response[0].roomId, name: response[0].p2user, hat: response[0].p2hat});

                player = 2;
                console.log('I am player' + player);

            }
            gameSetup();
        }
    });
}

function gameSetup(){
    socket.on('setup', function(usersInfo) {

        $('.box2').show();

        if (player == 1){
            $("#messageDiv").html("<span>Player 1: " + usersInfo.user1.capitalizeFirstLetter() + "</span><span id='p1ready'><i class='fa fa-times-circle' id='notReady' aria-hidden='true'></i></span>" + "<br>" + "<span>Player 2: " + usersInfo.user2.capitalizeFirstLetter() + "</span><span id='p2ready'><i class='fa fa-times-circle' id='notReady' aria-hidden='true'></i></span>" + "<br><br>" + "<button type='button' id='playerReady' data-id='1' class='btn btn-default'>Ready!</button>");
            if (usersInfo.user2hat == 0){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (usersInfo.user2hat == 1){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (usersInfo.user2hat == 2){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (usersInfo.user2hat == 3){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (usersInfo.user2hat == 4){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 2');
            }
        } else if (player == 2){
            $("#messageDiv").html("<span>Player 1: " + usersInfo.user1.capitalizeFirstLetter() + "</span><span id='p1ready'><i class='fa fa-times-circle' id='notReady' aria-hidden='true'></i></span>" + "<br>" + "<span>Player 2: " + usersInfo.user2.capitalizeFirstLetter() + "</span><span id='p2ready'><i class='fa fa-times-circle' id='notReady' aria-hidden='true'></i></span>" + "<br><br>" + "<button type='button' id='playerReady' data-id='2' class='btn btn-default'>Ready!</button>");
            if (usersInfo.user1hat == 0){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (usersInfo.user1hat == 1){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (usersInfo.user1hat == 2){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (usersInfo.user1hat == 3){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (usersInfo.user1hat == 4){
                $('.box2').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 1');
            }
        }
    });

    socket.on('readyStatusChange', function(playerReady) {
        if (playerReady == 1){
            $('#p1ready').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p1Status = true;
            console.log("p1stat: " + p1Status + " | " + "p2stat: " + p2Status);
            checkReadyStatus();
        } else if (playerReady == 2){
            $('#p2ready').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p2Status = true;
            console.log("p1stat: " + p1Status + " | " + "p2stat: " + p2Status);
            checkReadyStatus();
        }
    });
}

$('#messageDiv').on('click', '#playerReady', function(){
    var playerNumber = $(this).attr("data-id");
    console.log(playerNumber);
    socket.emit('playerReady', playerNumber);
});

function checkReadyStatus(){
    if (p1Status == false || p2Status == false){
        console.log('waiting for both players to be ready..');
    } else if (p1Status == true && p2Status == true){
        var delay = setTimeout(function(){
            startCountDown();
        }, 500);
    }
};

function startCountDown(){
    countDown = 5;
    $('#messageDiv').html('Get Ready...');
    var delay2 = setTimeout(function(){
        $('#messageDiv').html('<p id="countDown" style="font-size:75px;">5<p>');
        var startCountDown = setInterval(function(){
            if (countDown > 1){
                countDown--;
                $('#countDown').html(countDown);
            } else if (countDown == 1){
                $('#countDown').html('GO!');
                clearInterval(startCountDown);
                start();
                trackMovement();
            }
        }, 1000);
    }, 2000);
}

function trackMovement(){
    console.log('tracking movement...');
    socket.on('movePlayerUp', function(user) {
        if (player == 1 && user == 1){

            console.log('I am p1, move player1 up');

            $('.boxside').animate({
                top: '-=22',
                left: '+=22'
            }, 150, 'linear');

            if (lane <= 1){
                console.log("Fall");
            } else {
                lane--;
                console.log("lane: " + lane);
            }

        } else if (player == 2 && user == 1){

            console.log('I am p2, move player1 up');

            $('.box2').animate({
                top: '-=22',
                left: '+=22'
            }, 150, 'linear');

            if (lane2 <= 1){
                console.log("Fall");
            } else {
                lane2--;
                console.log("lane: " + lane2);
            }

        } else if (player == 1 && user == 2){

            console.log('I am p1, move player2 up');

            $('.box2').animate({
                top: '-=22',
                left: '+=22'
            }, 150, 'linear');

            if (lane2 <= 1){
                console.log("Fall");
            } else {
                lane2--;
                console.log("lane: " + lane2);
            }
        } else if (player == 2 && user == 2){

            console.log('I am p2, move player2 up');

            $('.boxside').animate({
                top: '-=22',
                left: '+=22'
            }, 150, 'linear');

            if (lane <= 1){
                console.log("Fall");
            } else {
                lane--;
                console.log("lane: " + lane);
            }
        }
    });

    socket.on('movePlayerDown', function(user) {
        if (player == 1 && user == 1){

            console.log('I am p1, move player1 down');

            $('.boxside').animate({
                top: '+=22',
                left: '-=22'
            }, 150, 'linear');

            if (lane >= 5){
                console.log("Fall");
            } else {
                lane++;
                console.log("lane: " + lane);
            }

        } else if (player == 2 && user == 1){

            console.log('I am p2, move player1 down');

            $('.box2').animate({
                top: '+=22',
                left: '-=22'
            }, 150, 'linear');

            if (lane2 >= 5){
                console.log("Fall");
            } else {
                lane2++;
                console.log("lane: " + lane2);
            }

        } else if (player == 1 && user == 2){

            console.log('I am p1, move player2 down');

            $('.box2').animate({
                top: '+=22',
                left: '-=22'
            }, 150, 'linear');


            if (lane2 >= 5){
                console.log("Fall");
            } else {
                lane2++;
                console.log("lane: " + lane2);
            }

        } else if (player == 2 && user == 2){

            console.log('I am p2, move player2 down');

            $('.boxside').animate({
                top: '+=22',
                left: '-=22'
            }, 150, 'linear');

            if (lane >= 5){
                console.log("Fall");
            } else {
                lane++;
                console.log("lane: " + lane);
            }

        }
    });
}

//Function to grab difference between two numbers
function diff(a,b){return Math.abs(a-b);};

//Code for nav

    //==================

    //Code for user commands

var pos;

$(document).keyup(function(e) {
    switch (e.which) {
    case 40:
        pos = box.position();
        down(pos);
        break;
    case 38:
        pos = box.position();
        up(pos);
        break;
    }
});

function up(pos){
    /*console.log(pos.top + " " + laneTop);*/

    if (pos.top <= parseFloat(laneTop)){
        console.log("Fall");
    } else if (pos.top > laneTop) {
        if (player == 1){
            console.log('Move player 1 up!');
            socket.emit('moveup', 1);
        } else if (player == 2){
            console.log('Move player 2 up!');
            socket.emit('moveup', 2);
        }
    }
}

function down(pos){
    /*console.log(pos.top + " " + laneBottom);*/

    if (pos.top >= parseFloat(laneBottom)){
        console.log("Fall");
    } else if (pos.top < laneBottom) {
        if (player == 1){
            console.log('Move player 1 down!');
            socket.emit('movedown', 1);
        } else if (player == 2){
            console.log('Move player 2 down!');
            socket.emit('movedown', 2);
        }
    }
}

function start(){
    if (launch == false){
        $('#messageDiv').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-pic').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block2').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block3').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block4').animate({
            left: "-=650px"
        }, 3000);

        $('.ledge-pic2').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block1-2').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block2-2').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block3-2').animate({
            left: "-=650px"
        }, 3000);
        $('.ledge-block4-2').animate({
            left: "-=650px"
        }, 3000);

        createHerd();

        launch = true;

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
                $('.h3z').css("z-index", "4");
                $('.h4z').css("z-index", "5");
            } else if (lane == 4){
                $('.h1z').css("z-index", "1");
                $('.h2z').css("z-index", "2");
                $('.h3z').css("z-index", "3");
                $('.h4z').css("z-index", "4");
                $('.h5z').css("z-index", "5");
            } else if (lane == 5){
                $('.h4z').css("z-index", "3");
                $('.h5z').css("z-index", "5");
            }
            if (lane2 == 1){
                $('.h1_2z').css("z-index", "5");
                $('.h2_2z').css("z-index", "5");
            } else if (lane2 == 2){
                $('.h1_2z').css("z-index", "3");
                $('.h2_2z').css("z-index", "5");
                $('.h3_2z').css("z-index", "5");
            } else if (lane2 == 3){
                $('.h1_2z').css("z-index", "2");
                $('.h2_2z').css("z-index", "3");
                $('.h3_2z').css("z-index", "5");
                $('.h4_2z').css("z-index", "5");
            } else if (lane2 == 4){
                $('.h1_2z').css("z-index", "1");
                $('.h2_2z').css("z-index", "2");
                $('.h3_2z').css("z-index", "3");
                $('.h4_2z').css("z-index", "5");
                $('.h5_2z').css("z-index", "5");
            } else if (lane2 == 5){
                $('.h4_2z').css("z-index", "3");
                $('.h5_2z').css("z-index", "5");
            }
        }, 1);

        var barrierCheck = setInterval(function(){
            var posCheck = box.position();
            if (posCheck.top <= parseFloat(laneTop) && lane == 1){
                box.stop();
            } else if (posCheck.top >= parseFloat(laneBottom) && lane == 5){
                box.stop();
            }

/*            var pos2Check = box2.position();
            if (pos2Check.top <= parseFloat(laneTop) && lane == 1){
                $('.box2').stop();
            } else if (pos2Check.top >= parseFloat(laneBottom) && lane == 5){
                $('.box2').stop();
            }*/

        }, 1);

    } else {
        console.log("Game already started!");
    }
}


//Code for results modal
$('.quitMulti').on('click', function(){
    var confirmQuit = confirm("Are you sure you want to leave multiplayer?");
    //add room id to send over as data
    if (confirmQuit == true){
        $.ajax({

            method: 'POST',

            url: '/removeRoom',

            success: function(response){
                rematchStatus = response.rematchStatus;
                window.location.replace(window.location.origin);
            }

        }); 
    } else {
        console.log('did not leave');
    }
});

//Code for Hurdles

//create unique rematch button based on player
//checkRematchStatus function
//If both true, reset db? and refresh page
//player "1" will refresh first while player "2" will have a delay, thus reseting their current player options

var p1rematch = false;
var p2rematch = false;
var p1Podium;
var p2Podium;

$('#rematchDiv').on('click', '.rematch', function(){
    var playerNumRematch = $(this).attr("data-id");
    console.log(playerNumRematch);
    socket.emit('playerRematch', playerNumRematch);
});

$('nav').on('click', '#resultsBtn', function(){
     $('#resultsModal').modal('show');
});

function rematch(){
    socket.on('rematchStatusChange', function(rematchReady) {
        if (rematchReady == 1 && p1Podium == 1){
            $('#spot1rematch').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p1rematch = true;
            console.log("p1RematchStat: " + p1rematch + " | " + "p2RematchStat: " + p2rematch);
            checkRematchStatus();

        } else if (rematchReady == 1 && p1Podium == 2){
            $('#spot2rematch').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p1rematch = true;
            console.log("p1RematchStat: " + p1rematch + " | " + "p2RematchStat: " + p2rematch);
            checkRematchStatus();

        } else if (rematchReady == 2 && p2Podium == 1){
            $('#spot1rematch').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p2rematch = true;
            console.log("p1stat: " + p1rematch + " | " + "p2stat: " + p2rematch);
            checkRematchStatus();

        } else if (rematchReady == 2 && p2Podium == 2){
            $('#spot2rematch').html('<i id="ready" class="fa fa-check-circle" aria-hidden="true"></i>');
            p2rematch = true;
            console.log("p1stat: " + p1rematch + " | " + "p2stat: " + p2rematch);
            checkRematchStatus();
        }
    });
}

function checkRematchStatus(){
    if (p1rematch == false || p2rematch == false){
        console.log('waiting for both players to rematch..');
    } else if (p1rematch == true && p2rematch == true){
        $.ajax({

            method: 'POST',

            url: window.location.pathname,

            success: function(response){
                console.log("Grabbing Current Room Data");
                console.log("Current Room: " + response);
                setRematch(response);
            }

        });
    }
};

function setRematch(currentRoom){
    $.ajax({

        method: 'POST',

        url: '/rematch',

        data: {
            roomId: currentRoom
        },

        success: function(response){
            rematchStatus = response.rematchStatus
            //if player == 1 refresh right away
            if (player == 1){
                location.reload();
            } else if (player == 2){
                var rematchDelay = setTimeout(function(){
                    $.ajax({

                        method: 'POST',

                        url: '/p2rematch',

                        data: {
                            roomId: currentRoom
                        },

                        success: function(response){
                                location.reload();
                        }
                    });
                }, 1000);
            }
        }
    });
}

function createHerd(){

    socket.on('results', function(playerInfo) {
        var stopHurdles = setInterval(function(){
            $('.hurdle').stop();
        }, 100);

        rematch();

        $('#resultsBtn').show();

        var winner = playerInfo.winner;

        console.log(winner);

            if (player == 1){
                $('#rematchDiv').html('<button type="button" data-id="1" class="btn btn-default rematch">Rematch?</button>');
            } else if (player == 2){
                $('#rematchDiv').html('<button type="button" data-id="2" class="btn btn-default rematch">Rematch?</button>');
            }

        if (playerInfo.playerNum == 1){         

            clearInterval(createHerdOfHurdles);

            p2Podium = 1;
            p1Podium = 2;

            $('#gameResultsWinner').html(winner.capitalizeFirstLetter() + " wins!");
            $('#overheadName1').html(playerInfo.winner.capitalizeFirstLetter());
            $('#overheadName2').html(playerInfo.loser.capitalizeFirstLetter());

            if (playerInfo.p1hat == 0){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (playerInfo.p1hat == 1){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (playerInfo.p1hat == 2){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (playerInfo.p1hat == 3){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (playerInfo.p1hat == 4){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 1');
            }

            if (playerInfo.p2hat == 0){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (playerInfo.p2hat == 1){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (playerInfo.p2hat == 2){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (playerInfo.p2hat == 3){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (playerInfo.p2hat == 4){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 2');
            }

            $('#resultsModal').modal('show');

        } else if (playerInfo.playerNum == 2){         

            clearInterval(createHerdOfHurdles);

            p1Podium = 1;
            p2Podium = 2;

            $('#gameResultsWinner').html(winner.capitalizeFirstLetter() + " wins!");
            $('#overheadName1').html(playerInfo.winner.capitalizeFirstLetter());
            $('#overheadName2').html(playerInfo.loser.capitalizeFirstLetter());

            if (playerInfo.p1hat == 0){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (playerInfo.p1hat == 1){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (playerInfo.p1hat == 2){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (playerInfo.p1hat == 3){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (playerInfo.p1hat == 4){
                $('#winnerCube').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 1');
            }

            if (playerInfo.p2hat == 0){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat0.png">');
            } else if (playerInfo.p2hat == 1){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat1.png">');
            } else if (playerInfo.p2hat == 2){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat2.png">');
            } else if (playerInfo.p2hat == 3){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat3.png">');
            } else if (playerInfo.p2hat == 4){
                $('#loserCube').append('<img id="currentHat" class="hat" src="/css/images/hat4.png">');
            } else {
                console.log('no hat active for player 2');
            }

            $('#resultsModal').modal('show');

        } else if (playerInfo.playerNum == 'tie'){

            clearInterval(createHerdOfHurdles);

            $('#gameResultsWinner').html("Tie!");

            $('#winnerCube').remove();
            $('#loserCube').remove();

            $('#resultsModal').modal('show');
        }
    });

    /*var herdInterval = Math.floor(Math.random() * (1800 - 1600)) + 1600;*/
    var createHerdOfHurdles = setInterval(function(){
        herd += 1;
        console.log("===== Herd: " + herd + "=====")
        createIntervals();
    }, 1800); 
}

function createIntervals(){


/*    if (player == 1 && herd == 1){
        interval1 = 1800;
        interval2 = 2200;
        interval3 = 2700;
        interval4 = 1500;
        interval5 = 2000;
        socket.emit('sendIntervals', {i1: interval1, i2: interval2, i3: interval3, i4: interval4, i5: interval5});
    } else */if (player == 1 && herd != 1){
        interval1 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
        interval2 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
        interval3 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
        interval4 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
        interval5 = Math.floor(Math.random() * (3000 - 1500)) + 1500;
        socket.emit('sendIntervals', {i1: interval1, i2: interval2, i3: interval3, i4: interval4, i5: interval5});
    }

    socket.on('setIntervals', function(interval) {
        if (diff(interval.i1, interval.i2) < 500 && diff(interval.i2, interval.i3) < 500 && diff(interval.i3, interval.i4) < 500 && diff(interval.i4, interval.i5) < 500){
            console.log("#ERROR: WALL CREATED#");
            interval.i1 += 700;
            interval.i3 += 700;
            createHurdles(interval.i1, interval.i2, interval.i3, interval.i4, interval.i5);
            createHurdles2(interval.i1, interval.i2, interval.i3, interval.i4, interval.i5);
        } else {
            createHurdles(interval.i1, interval.i2, interval.i3, interval.i4, interval.i5);
            createHurdles2(interval.i1, interval.i2, interval.i3, interval.i4, interval.i5);
        }
    });

}

//run function and/or send emit
//send over 'player' for emit, on socket if player == 1 p2wins, etc

function createHurdles(interval1, interval2, interval3, interval4, interval5){

    var newBoxPos = box.position();

    newHurdle1 = setTimeout(function(){

        h1counter++;

        $('.lane').append('<div class="h1z hurdle" id="hurdle1-' + h1counter + '" style="position:fixed;left:110%;top:168.5px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle1-' + h1counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane1hurdlesPassed++;
            $('#hurdle1-' + lane1hurdlesPassed).remove();
        });

        var hurdle1 = $('#hurdle1-' + h1counter);

        var update1 = setInterval(function(){

            var newHurdlePos1 = hurdle1.position();

            newBoxPos = box.position();

            if (newBoxPos.top < newHurdlePos1.top + hurdlePos.width && newBoxPos.top + boxPos.width > newHurdlePos1.top && newBoxPos.left < newHurdlePos1.left + hurdlePos.height && boxPos.height + newBoxPos.left > newHurdlePos1.left && lane == 1) {
            	$('.hurdle').remove();
                socket.emit('endGame', player);
            }

        }, 1);

    }, interval1);

    newHurdle2 = setTimeout(function(){

        h2counter++;

        $('.lane').append('<div class="h2z hurdle" id="hurdle2-' + h2counter + '" style="position:fixed;left:108%;top:191.4px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
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
            	$('.hurdle').remove();
                socket.emit('endGame', player);
            }

        }, 1);

    }, interval2);

    newHurdle3 = setTimeout(function(){

        h3counter++;

        $('.lane').append('<div class="h3z hurdle" id="hurdle3-' + h3counter + '" style="position:fixed;left:106%;top:214.3px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
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
                $('.hurdle').remove();
                socket.emit('endGame', player);
            }

        }, 1);

    }, interval3);

    newHurdle4 = setTimeout(function(){

        h4counter++;

        $('.lane').append('<div class="h4z hurdle" id="hurdle4-' + h4counter + '" style="position:fixed;left:104%;top:237.2px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
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
                $('.hurdle').remove();
                socket.emit('endGame', player);
            }

        }, 1);

    }, interval4);

    newHurdle5 = setTimeout(function(){

        h5counter++;

        $('.lane').append('<div class="h5z hurdle" id="hurdle5-' + h5counter + '" style="position:fixed;left:102%;top:260.1px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
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
               	$('.hurdle').remove();
                socket.emit('endGame', player);
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

//======================================================================================

function createHurdles2(interval1, interval2, interval3, interval4, interval5){

    var newBox2Pos = box2.position();

    var newHurdle2_1 = setTimeout(function(){

        h2_1counter++;

        $('.lane2').append('<div class="h1_2z hurdle" id="hurdle2_1-' + h1counter + '" style="position:fixed;left:110%;top:168.5px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle2_1-' + h1counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane2_1hurdlesPassed++;
            $('#hurdle2_1-' + lane1hurdlesPassed).remove();
        });

    }, interval1);

    var newHurdle2_2 = setTimeout(function(){

        h2_2counter++;

        $('.lane2').append('<div class="h2_2z hurdle" id="hurdle2_2-' + h2counter + '" style="position:fixed;left:108%;top:191.4px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle2_2-' + h2counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane2_2hurdlesPassed++;
            $('#hurdle2_2-' + lane2hurdlesPassed).remove();
        });

    }, interval2);

    var newHurdle2_3 = setTimeout(function(){

        h2_3counter++;

        $('.lane2').append('<div class="h3_2z hurdle" id="hurdle2_3-' + h3counter + '" style="position:fixed;left:106%;top:214.3px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle2_3-' + h3counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane2_3hurdlesPassed++;
            $('#hurdle2_3-' + lane3hurdlesPassed).remove();
        });

    }, interval3);

    var newHurdle2_4 = setTimeout(function(){

        h2_4counter++;

        $('.lane2').append('<div class="h4_2z hurdle" id="hurdle2_4-' + h4counter + '" style="position:fixed;left:104%;top:237.2px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle2_4-' + h4counter).animate({
            left: '-=120%'
        }, speed, 'linear', function(){
            lane2_4hurdlesPassed++;
            $('#hurdle2_4-' + lane4hurdlesPassed).remove();
        });

    }, interval4);

    var newHurdle2_5 = setTimeout(function(){

        h2_5counter++;

        $('.lane2').append('<div class="h5_2z hurdle" id="hurdle2_5-' + h5counter + '" style="position:fixed;left:102%;top:260.1px;">' + '<img id="hcube" src="/css/images/hcube.png">' + '</div>');
        
        $('#hurdle2_5-' + h5counter).animate({
        left: '-=120%'
        }, speed, 'linear', function(){
            lane2_5hurdlesPassed++;
            $('#hurdle2_5-' + lane5hurdlesPassed).remove();
        });

    }, interval5);

}


//routes for data

    //grabs user name on page load (testing purposes)

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
                /*$(".homeBtn").attr("id","loginBtn");*/
                $("#battleBtn").hide();
                $("#shopBtn").hide();
                $("#hsBtn").hide();
                $("#optionsBtn").hide();

            } else {
                console.log(response);
                loggedIn = true;
                name = response.user
                grabUserData(name);
                $("#loginBtn").hide();
                $(".homeBtn").show();
                $("#battleBtn").show();
                $("#shopBtn").show();
                $("#hsBtn").show();
                $("#optionsBtn").show();
            }
        }

    });
}

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
            $('#userName').html(response.username);

            if (response.bgColor != "rgb(255, 255, 255)"){
                $("body").css("background-color", response.bgColor);
                $(".ledge-block").css("background-color", response.bgColor);
                $(".ledge-block2").css("background-color", response.bgColor);
                $(".ledge-block3").css("background-color", response.bgColor);
                $(".ledge-block4").css("background-color", response.bgColor);
                $(".ledge-block5").css("background-color", response.bgColor);
                $(".ledge-block1-2").css("background-color", response.bgColor);
                $(".ledge-block2-2").css("background-color", response.bgColor);
                $(".ledge-block3-2").css("background-color", response.bgColor);
                $(".ledge-block4-2").css("background-color", response.bgColor);
            }

            for (i = 0; i < response.items.length; i++){

               if (response.items[i] == true){
                $("#spot" + i).html("<img data-id='1' id='itemProfile" + i + "pic' class='hatProfile' src='/css/images/hat" + i + ".png'>")
               } else if (response.items[i] == false) {
                $("#spot" + i).empty();
                console.log('Not purchased yet');
               } else if (response.items[i] == 'active'){
                $('.box').append("<img id='currentHat' class='hat' src='/css/images/hat" + i + ".png'>");
                $('#spot' + i).html("<div id='hatPlaceHolder'>ON</div>");
                currentHat = i;
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
        '<img class="drop-off" id="dropoff' + s + '" src="/dropoff.png" style="top:40.75%;left:110%;"><img class="ledge-pic2" id="ledge-pic2' + s + '" src="/startLedge2.png" style="top:40.50%;left:115%;">'
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
