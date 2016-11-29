//$(document).ready(function(){
//});

//intialize Firebase
var config = {
    apiKey: "AIzaSyA6DjzJuXMwq6F1hN9RpFRRKbJNzdzcH58",
    authDomain: "rps-multiplayer-hw7.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-hw7.firebaseio.com",
    storageBucket: "rps-multiplayer-hw7.appspot.com",
    messagingSenderId: "703205861409"
};
firebase.initializeApp(config);

//create variable to represent firebase.database();
var fdb = firebase.database();

var needPlayerOne = true;
var needPlayerTwo = true;
var playerOneName = '';
var playerTwoName = '';
var playerOneLosses = 0;
var playerOneWins = 0;
//create turns
var turns = 0;

//check the database if playerOne and/or playerTwo exist(s)
fdb.ref('players').on('value', function(snapshot) {
	if(snapshot.child('playerOne').exists()){
		//need to make needPlayerOne = false here, because it didn't work in the
		needPlayerOne = false;
		playerOneName = snapshot.child('playerOne').val().name;
		playerOneLosses = snapshot.child('playerOne').val().losses;
		playerOneWins = snapshot.child('playerOne').val().wins;
		//update html for game-content-p1 for all other browsers:
		$("#game-content-firstplayer").html("<div>" + playerOneName + "</div>"+
	 	"<div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "</div>");
	 	//update html for game-content-secondplayer for all other browsers:
	 	$("#game-content-secondplayer").html("you are player two!");
	}
	if(snapshot.child('playerTwo').exists()){
		needPlayerTwo = false;
		playerTwoName = snapshot.child('playerTwo').val().name;
		playerTwoLosses = snapshot.child('playerTwo').val().losses;
		playerTwoWins = snapshot.child('playerTwo').val().wins;
		//update html for game-content-p2 for all other browsers:
		var gameContentP2 = "<div>" + playerTwoName + "</div>"+
			"<div>Wins: " + playerTwoWins+ " | Losses: "+  playerTwoLosses + "</div>";
		$("#game-content-secondplayer").html(gameContentP2);
	 	//update html for game-content-secondplayer-p1 for player1's browser:
	 	$("#game-content-secondplayer-p1").html(gameContentP2);
	 	//update
	 	$('#player-status-p1').html("<div class='text'>Hello " + playerOneName + ". You are Player 1.</div>"+
		"<div class='text' id='p1-status-update'>Your turn to choose!</div>");
	 }
	 if(snapshot.child('playerOne').exists() && snapshot.child('playerTwo').exists()){
		console.log("have two players");
		fdb.ref('turn').set('1');
		needPlayerOne = false;
		needPlayerTwo = false;
		//update player-status div so user may not enter another name
		$('#player-status').html("<div class='text' style='line-height:120%;'> Hello. Players " + playerOneName + " and " + playerTwoName +
			" are playing. Please feel free to observe.<br/>If you see no activity for an extended period of time, "+
			"please contact owner to remove players so others may play.<br/>Thank you.</div>");
		//empty communication-bar so 3rd+ users may not contribute to messaging
		$('#communication-bar').empty();
	}

	//remove a player if they disconnect
	fdb.ref('players').child('playerOne').onDisconnect().remove();
 	fdb.ref('players').child('playerTwo').onDisconnect().remove();
// //console log any errors
// }, function(errorObject){
// 	console.log("The read failed: " + errorObject.code);
// });
});

//start the game if turns are active
fdb.ref('turn').on('value', function(snapshot) {
	var turnNumber = parseInt(snapshot.val());
	if(turnNumber===1){
		//give player one options
		console.log("turn one now");
		game.generatePlayerOneOptions();
		game.checkResponseP1();
	}
	if(turnNumber===2){
		//player two decides
		console.log("turn 2 now");
		game.generatePlayerTwoOptions();
		game.checkResponseP2();
	}
	if(turnNumber===3){
		game.resoleChoices();
	}
});

var game =
{
	options:['rock', 'paper', 'scissors'],
	generatePlayerOneOptions: function(){
		var choices = '';
		for(var i = 0; i<game.options.length; i++){
			var newOption = '<div class="possible-answer" id="p1-' + game.options[i] +'">'+ game.options[i] + '</div>';
			choices += newOption;
		}
		var selectionDiv = $('<div class="selections" id = "selections-p1">');
		selectionDiv.html(choices);
		$('#game-content-p1').append(selectionDiv);
		//game.checkResponseP1();
	},
	generatePlayerTwoOptions: function(){
		$('#p2-status-update').text("Your turn to choose!");
		var choices = '';
		console.log("options are: " + game.options);
		for(var i = 0; i<game.options.length; i++){
			var newOption = '<div class="possible-answer" id="p2-' + game.options[i] +'">'+ game.options[i] + '</div>';
			choices += newOption;
		}
		var selectionDiv = $('<div class="selections" id = "selections-p2">');
		selectionDiv.html(choices);
		$('#game-content-p2').append(selectionDiv);
	},
	playerOneSelection: '',
	playerTwoSelection: '',
	checkResponseP1: function(){
		$('.possible-answer').on('click', function(){
			if($(this).attr("id") === 'p1-rock'){
				var replacement = $('<div class="chosen">');
				replacement.text("Rock");
				$('#selections-p1').replaceWith(replacement);
				playerOneSelection = "rock";
			} else if ($(this).attr("id") === 'p1-paper'){
				playerOneSelection = "paper";
				$('#selections-p1').replaceWith('<div class="chosen">Paper</div>');
			} else if ($(this).attr("id") === 'p1-scissors'){
				playerOneSelection = "scissors";
				$('#selections-p1').replaceWith('<div class="chosen">Scissors</div>');
			}
			console.log("user one copmleteds selection");
			$('#p1-status-update').text("Waiting for " + playerTwoName + " to choose.");
			fdb.ref('turn').set('2');
			fdb.ref('players').child('playerOne').child('choice').set(playerOneSelection);
		});
	},
	checkResponseP2: function(){
		$('.possible-answer').on('click', function(){
			if($(this).attr("id") === 'p2-rock'){
				var replacement = $('<div class="chosen">');
				replacement.text("Rock");
				$('#selections-p2').replaceWith(replacement);
				playerOneSelection = "rock";
				$('#p2-status-update').text("Waiting for " + playerTwoName + " to choose.");
				//fdb.ref('players').child('playerOne').child('choice').set("rock");				
			} else if ($(this).attr("id") === 'p1-paper'){
				playerOneSelection = "paper";
				//fdb.ref('players').child('playerOne').child('choice').set("paper");
				$('#selections-p1').replaceWith('<div class="chosen">Paper</div>');
				$('#p1-status-update').text("Waiting for " + playerTwoName + " to choose.");
			} else if ($(this).attr("id") === 'p1-scissors'){
				playerOneSelection = "scissors";
				//fdb.ref('players').child('playerOne').child('choice').set("scissors");
				$('#selections-p1').replaceWith('<div class="chosen">Scissors</div>');
				$('#p1-status-update').text("Waiting for " + playerTwoName + " to choose.");
			}
			fdb.ref('turn').set('3');
		});
	},
	resolveChoices:function(){
		if(game.playerOneSelection==="rock" && game.playerTwoSelection==="rock"){
			//tie
		} else if (game.playerOneSelection==="rock" && game.playerTwoSelection==="paper"){

		} else if (game.playerOneSelection==="rock" && game.playerTwoSelection==="scissors"){

		} else if (game.playerOneSelection==="paper" && game.playerTwoSelection==="rock"){

		} else if (game.playerOneSelection==="paper" && game.playerTwoSelection==="rock"){

		} else if (game.playerOneSelection==="paper" && game.playerTwoSelection==="rock"){

		} else if (game.playerOneSelection==='scissors' && game.playerTwoSelection==="rock"){

		} else if (game.playerOneSelection==='scissors' && game.playerTwoSelection==="rock"){

		} else if (game.playerOneSelection==='scissors' && game.playerTwoSelection==="rock"){

		}
		//don't forget to reset playerOneSelection and playerTwo Selection to '',
	//and reset p1AnswerSelected and p2AnswerSelected to false;
	}
};

//check if a playerOne and/or playerTwo exists (substitute playerOne or PlayerTwo for player when calling the function)
//https://gist.github.com/anantn/4323949
function checkIfPlayerExists(player) {
	var playerRef = fdb.ref('players');
	playerRef.child(player).once('value', function(snapshot) {
		var exists = (snapshot.val() !== null);
		playerExistsCallback(player, exists);
	});
	// ,function(errorObject) {
	// 	//if any errors are experienced, log them to the console
	// 	console.log("The read failed: " + errorObject.code);
	// });
}
function playerExistsCallback(player, exists) {
	if (exists) {
		return true;
	} else {
		return false;
	}
}

// button for adding players
$("#add-player").on("click", function(){
	if($("#name-input").val()===""){
		alert("you forgot to type your name.");
		// IMPORTANT! We have this line so that users can hit "enter" instead
		//of clicking on the button AND it won't move to the next page
		return false;
	}else if(needPlayerOne && needPlayerTwo){
		//take user name
		console.log("need player one?" + needPlayerOne);
		var playerName = $("#name-input").val().trim();
		playerOneName = playerName;
		console.log("player one name = " + playerOneName);
		//create object to go inside player array with name, wins, losses, choice
		var newPlayer = {
			name: playerName,
			wins:  0,
			losses: 0,
			choice: ""
		};
		//each element in players is a new object newPlayer
		//players[0] = {"playerOne":newPlayer};
		//players[1] = {"playerTwo":newPlayer};

		//difference between .set and .push??
		//use .push to upload new player information to firebase
		//inside .ref, create the "child" of the database called 'players'
		//.set overwrites data at the specified location
	 	fdb.ref('players').child('playerOne').set(newPlayer);
	 	needPlayerOne = false;
		console.log("Need player one?" + needPlayerOne);
		console.log("successful set of playerOne");
	 	//$("#game-content-p1").attr('data-player', 'p1');
	 	//update game-content-firstplayer div for player one only:
	 	var gcp1 = "<div class='game-box' id='game-content-p1'><div>" + playerOneName + "</div>"+
	 	"<div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "</div></div>";
	 	$("#game-content-firstplayer").replaceWith(gcp1);

	 	//update game-content-secondplayer div for player one only:
	 	var gcp2p1 = "<div class='game-box' id='game-content-secondplayer-p1'>Thank you. Now waiting for player 2.</div>";
	 	$("#game-content-secondplayer").replaceWith(gcp2p1);
		
		//update player-status div
		//create a new div just like the original, except with new id = player-status-p1
		var p1 = "<div id='player-status-p1'><div class='text'> Hello " + playerOneName + ". You are Player 1.</div>"+
		"<div class='text' id='p1-status-update'>Waiting for Player 2 to arrive.</div></div>";
		$('#player-status').replaceWith(p1);

		//update communication-bar for playerOne
		//change type = "button" so user presses enter for messages and page will NOT refresh!
		//HOWEVER, tried to include a button, but the act of replacing communication-bar with comBarP1 made the page refresh!!!
	 	var comBarP1 = '<form id="communication-bar-p1"><input type="text" id="message-input-p1"><input id = "add-message-p1" type = "submit" value = "Send"></form>';
	 	$('#communication-bar').replaceWith(comBarP1);
		//return false;
	}else if(needPlayerTwo && !needPlayerOne){
		playerTwoName = $("#name-input").val().trim();
		//create object to go inside player array with name, wins, losses, choice
		// var newPlayer = {
		// 	name: playerName,
		// 	wins:  0,
		// 	losses:0,
		// 	choice: ""
		// };
		fdb.ref('players').child('playerTwo').set({
			name: $("#name-input").val().trim(),
			wins: 0,
			losses: 0,
			choice:""
		});
		console.log("player two name = " + playerTwoName);
		//difference between .set and .push??
		//use .push to upload new player information to firebase
		//inside .ref, create the "child" of the database called 'players'
		//.set overwrites data at the specified location
	 	needPlayerTwo = false;
		console.log("Need player two?" + needPlayerTwo);
		console.log("successful set of playerTwo in firebase");
	 	//update game-content-secondplayer div for player two only:
	 	var gcp2 = "<div class='game-box' id='game-content-p2'><div>" + playerTwoName + "</div>"+
	 	"<div>Wins: " + playerTwoWins+ " | Losses: "+  playerTwoLosses + "</div></div>";
	 	$("#game-content-secondplayer").replaceWith(gcp2);
		
		//update player-status div
		//create a new div just like the original, except with new id = player-status-p1
		var p2 = "<div id='player-status-p2'><div class='text'>Hello " + playerTwoName + ". You are Player 2.</div>"+
		"<div class='text' id='p2-status-update'>Waiting for " + playerOneName + " to choose.</div></div>";
		$('#player-status').replaceWith(p2);

		//update player one's game-content-secondplayer
		$("#game-content-secondplayer-p1").html("<div>" + playerTwoName + "</div>"+
	 	"<div>Wins: " + playerTwoWins+ " | Losses: "+  playerTwoLosses + "</div>");

	 	//update communication-bar for playerTwo
	 	var comBarP2 = '<form id="communication-bar-p2"><input type="text" id="message-input-p2"><input id = "add-message-p2" type = "submit" value = "Send"></form>';
	 	$('#communication-bar').replaceWith(comBarP2);
	}
	//WHY DO I INCLUDE RETURN FALSE HERE?
	return false;
});

//message box code:
//https://firebase.google.com/docs/database/web/structure-data
//repeat for add-message-p2
// $('#add-message-p1').on("click", function(){
// 	if($('#add-input-p1').val()===""){
// 		alert("you forgot to type something.");
// 		return false;
// 	}else{
// 		var message = $("#message-input-p1").val().trim();
// 		var totalMessage = {
// 			name: playerOneName,
// 			message: message
// 		};
// 		fdb.ref('chat').push(totalMessage);
// 		$('#message-input-p1').val('');
// 		return false;
// 	}
// 	return false;
// });

// $('#add-message-p2').on("click", function(){
// 	if($('#add-input-p2').val()===""){
// 		alert("you forgot to type something.");
// 		return false;
// 	}else{
// 		var message = $("#message-input-p2").val().trim();
// 		var totalMessage = {
// 			name: playerTwoName,
// 			message: message
// 		};
// 		fdb.ref('chat').push(totalMessage);
// 		$('#message-input-p2').val('');
// 		return false;
// 	}
// 	return false;
// });

//Create Firebase event for whenever chat child is added
// fdb.ref('chat').on("child_added", function(childSnapshot, prevChildKey) {
// 	console.log(childSnapshot.val());
// 	var name = childSnapshot.val().name;
// 	var message = childSnapshot.val().message;
// 	$('#message-display-start').append('<div class="text-message">'+ name + ': ' + message + '</div>');
// });


//https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data


//function to join players to game
//utilize Firebase.ServerValue.TIMESTAMP
//if statement to decide who winner is based on results

//firebase also keeps track of turns

//three divs, first div contains:
//"player 1 name"
//Rock
//paper
//scissors
//wins: 0 losses: 0 ties: 0

//Once player 1 selects choice, this becomes primary content of player 1 div

//then player 2 screen says "it's your turn"

//if a player disconnects:
//https://firebase.google.com/docs/database/web/offline-capabilities