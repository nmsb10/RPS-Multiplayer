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
var playerOneChoice = '';
var playerTwoChoice = '';
var playerOneName = '';
var playerTwoName = '';
var playerOneLosses = 0;
var playerOneWins = 0;
var playerOneTies = 0;
var playerTwoLosses = 0;
var playerTwoTies = 0;
var playerTwoWins = 0;

var gameContentP1 = '';
var gameContentP2 = '';
//create turns
var turn = 0;

// button for adding players
$("#add-player").on("click", function(){
	if($("#name-input").val()===""){
		alert("you forgot to type your name.");
		return false;
	}else if(needPlayerOne && needPlayerTwo){
		//if need both players, set the first name entered to playerOne
		var playerName = $("#name-input").val().trim();
		//create object to go inside player array with name, wins, losses, ties, choice
		var newPlayer = {
			name: playerName,
			wins:  0,
			losses: 0,
			ties: 0,
			choice: ""
		};
		//difference between .set and .push??
		//use .push to upload new player information to firebase
		//inside .ref, create the "child" of the database called 'players'
		//.set overwrites data at the specified location
	 	fdb.ref('players').child('playerOne').set(newPlayer);

	 	//update player-status div for player one only (remove name-input field)
		//create a new div just like the original, except with new id = player-status-p1
		var p1 = "<div class='text' id='player-status-p1'><div id='player-welcome-p1'> Hello " + playerOneName + ". You are Player 1.</div>"+
		"<div id='status-update-p1'>Waiting for Player 2 to arrive.</div></div>";
		$('#player-status').replaceWith(p1);

		//update game-content-firstplayer div for player one only:
	 	var gcp1 = "<div class='game-box' id='game-content-p1'><div>" + playerOneName + "</div>"+
	 	"<div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "<br/>Ties: " + playerOneTies + "</div></div>";
	 	$("#game-content-firstplayer").replaceWith(gcp1);

	 	//update game-content-secondplayer div for player one only:
	 	var gcp2p1 = "<div class='game-box' id='game-content-secondplayer-p1'>Thank you. Now waiting for player 2.</div>";
	 	$("#game-content-secondplayer").replaceWith(gcp2p1);

		//update communication-bar for player one only
		//change type = "button" so user presses enter for messages and page will NOT refresh!
		//HOWEVER, tried to include a button, but the act of replacing communication-bar with comBarP1 made the page refresh!!!
	 	var comBarP1 = '<form id="communication-bar-p1"><input type="text" id="message-input-p1"><input id = "add-message-p1" type = "submit" value = "Send"></form>';
	 	$('.communication-bar').replaceWith(comBarP1);
		//return false;
	}else if(needPlayerTwo && !needPlayerOne){
		playerTwoName = $("#name-input").val().trim();
		//can set the playerTwo object directly into the firebase
		fdb.ref('players').child('playerTwo').set({
			name: playerTwoName,
			wins: 0,
			losses: 0,
			ties: 0,
			choice:""
		});

		//update player-status div
		//create a new div just like the original, except with new id = player-status-p2
		var p2 = "<div class='text' id='player-status-p2'><div id='player-welcome-p2'>Hello " + playerTwoName + ". You are Player 2.</div>"+
		"<div id='status-update-p2'>Waiting for " + playerOneName + " to choose.</div></div>";
		$('#player-status').replaceWith(p2);

		//update game-content-firstplayer div for player two only:
	 	var gcp1p2 = "<div class='game-box' id='game-content-firstplayer-p2'><div>" + playerOneName + "</div>"+
	 	"<div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "<br/>Ties: " + playerOneTies + "</div></div>";
	 	$("#game-content-firstplayer").replaceWith(gcp1p2);

	 	//update game-content-secondplayer div for player two only:
	 	var gcp2 = "<div class='game-box' id='game-content-p2'><div>" + playerTwoName + "</div>"+
	 	"<div>Wins: " + playerTwoWins+ " | Losses: "+  playerTwoLosses + "<br/>Ties: " + playerTwoTies + "</div></div>";
	 	$("#game-content-secondplayer").replaceWith(gcp2);

		//update communication-bar for playerTwo
	 	var comBarP2 = '<form id="communication-bar-p2"><input type="text" id="message-input-p2"><input id = "add-message-p2" type = "submit" value = "Send"></form>';
	 	$('.communication-bar').replaceWith(comBarP2);

	 	//return false;
	}else if(needPlayerOne && !needPlayerTwo){
		//if need only playerOne, set the first name entered to playerOne
		var nextName = $("#name-input").val().trim();
		//create object to go inside player array with name, wins, losses, ties, choice
		fdb.ref('players').child('playerOne').set({
			name: nextName,
			wins: 0,
			losses: 0,
			ties: 0,
			choice:""
		});
	 	//update player-status div for player one only (remove name-input field)
		//create a new div just like the original, except with new id = player-status-p1
		// var p1 = "<div id='player-status-p1'><div id='player-welcome-p1'> Hello " + playerOneName + ". You are Player 1.</div>"+
		// "<div id='status-update-p1'>Waiting for Player 2 to arrive.</div></div>";
		// $('#player-status').replaceWith(p1);

		// //update game-content-firstplayer div for player one only:
	 // 	var gcp1 = "<div class='game-box' id='game-content-p1'><div>" + playerOneName + "</div>"+
	 // 	"<div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "<br/>Ties: " + playerOneTies + "</div></div>";
	 // 	$("#game-content-firstplayer").replaceWith(gcp1);

	 // 	//update game-content-secondplayer div for player one only:
	 // 	var gcp2p1 = "<div class='game-box' id='game-content-secondplayer-p1'>Thank you. Now waiting for player 2.</div>";
	 // 	$("#game-content-secondplayer").replaceWith(gcp2p1);

		// //update communication-bar for player one only
		// //change type = "button" so user presses enter for messages and page will NOT refresh!
		// //HOWEVER, tried to include a button, but the act of replacing communication-bar with comBarP1 made the page refresh!!!
	 // 	var comBarP1 = '<form id="communication-bar-p1"><input type="text" id="message-input-p1"><input id = "add-message-p1" type = "submit" value = "Send"></form>';
	 // 	$('.communication-bar').replaceWith(comBarP1);
	}
	// IMPORTANT! We have this line so that users can hit "enter" instead
		//of clicking on the button AND it won't move to the next page??
	//WHY DO I INCLUDE RETURN FALSE HERE?
	return false;
});

//check the database if playerOne and/or playerTwo exist(s)
fdb.ref('players').on('value', function(snapshot) {
	var p1choice = snapshot.child('playerOne').child('choice').val();
	var p2choice = snapshot.child('playerTwo').child('choice').val();
	var hasPlayerOne = snapshot.hasChild('playerOne');
	var hasPlayerTwo = snapshot.hasChild('playerTwo');
	if(snapshot.child('playerOne').exists()){
		needPlayerOne = false;
		//define playerOne variables so can be referenced everywhere else
		playerOneChoice = snapshot.child('playerOne').val().choice;
		playerOneName = snapshot.child('playerOne').val().name;
		playerOneLosses = snapshot.child('playerOne').val().losses;
		playerOneTies = snapshot.child('playerOne').val().ties;
		playerOneWins = snapshot.child('playerOne').val().wins;
		//update html for game-content-p1 for all other browsers to prepare for playerTwo:
		gameContentP1 = "<div>" + playerOneName + "</div><div>Wins: " + playerOneWins+ " | Losses: "+  playerOneLosses + "<br/>Ties: " + playerOneTies + "</div>";
		$("#game-content-firstplayer").html(gameContentP1);
		$('#game-content-firstplayer-p2').html(gameContentP1);
		$('#game-content-p1').html(gameContentP1);
	 	//update html for game-content-secondplayer for all other browsers:
	 	$("#game-content-secondplayer").html("you are player two!");
	 	//display player one's choice if they have one
	 	var selection1 = $('<div class="chosen">');
		selection1.text(playerOneChoice);
		//var selectionT = $('<div class="chosen">');
		//selectionT.text(playerTwoChoice);
	 	if(p1choice!==''){
	 		$("#game-content-p1").append(selection1);
	 	}
	 	//display both players choices when applicable
	 	// if(p1choice!=='' && p2choice!==''){
	 	// 	$("#game-content-p1").append(selection1);
	 	// 	$('#game-content-secondplayer-p1').append(selectionT);
	 	// 	$('#game-content-firstplayer').append(selection1);
	 	// 	$('#game-content-secondplayer').append(selectionT);
	 	// }
	}
	if(snapshot.child('playerTwo').exists()){
		needPlayerTwo = false;
		//define playerTwo variables from the database
		playerTwoChoice = snapshot.child('playerTwo').val().choice;
		playerTwoName = snapshot.child('playerTwo').val().name;
		playerTwoLosses = snapshot.child('playerTwo').val().losses;
		playerTwoTies = snapshot.child('playerTwo').val().ties;
		playerTwoWins = snapshot.child('playerTwo').val().wins;
		//update html for game-content-p2 for all other browsers:
		gameContentP2 = "<div>" + playerTwoName + "</div><div>Wins: " + playerTwoWins+ " | Losses: "+  playerTwoLosses + "<br/>Ties: " + playerTwoTies + "</div>";
		$("#game-content-secondplayer").html(gameContentP2);
		$('#game-content-secondplayer-p1').html(gameContentP2);
		$('#game-content-p2').html(gameContentP2);
		//display player two's choice when they have one
	 	var selection2 = $('<div class="chosen">');
		selection2.text(playerTwoChoice);
		var selectionO = $('<div class="chosen">');
		selectionO.text(playerOneChoice);
	 	if(p2choice!==''){
	 		$("#game-content-p2").append(selection2);
	 	}
	 	//display both players choices when applicable
	 	if(p2choice!=='' && p1choice!==''){
	 		$("#game-content-p2").append(selection2);
	 		$('#game-content-firstplayer-p2').append(selectionO);
	 		$('#game-content-secondplayer-p1').append(selection2);
	 		$('#game-content-firstplayer').append(selectionO);
	 		$('#game-content-secondplayer').append(selection2);
	 	}
	 }
	 //in the event playerOne disconnects
	 if(hasPlayerTwo && !hasPlayerOne){
		needPlayerTwo = false;
		needPlayerOne = true;
		//define playerTwo variables from the database
		playerTwoChoice = snapshot.child('playerTwo').val().choice;
		playerTwoName = snapshot.child('playerTwo').val().name;
		playerTwoLosses = snapshot.child('playerTwo').val().losses;
		playerTwoTies = snapshot.child('playerTwo').val().ties;
		playerTwoWins = snapshot.child('playerTwo').val().wins;

		//update player-status div for player one only (add name-input field)
		//create a new div just like the original
		var defaultPlayerStatus = "<div id='player-status'><form><input type = 'text' id='name-input' placeholder='what is your name?'"+
		"<input id = 'add-player' type = 'submit' value = 'Start'></form></div>";
		$('#player-status-p1').replaceWith(defaultPlayerStatus);
		$('#player-status').replaceWith(defaultPlayerStatus);

	 	//update html for game-content-firstplayer for all other browsers:
	 	$("#game-content-firstplayer-p1").html("you are player one!");
	 	$("#game-content-firstplayer").html("you are player one!");

	 	//update communication bar
	 	var commbar = "<form class='communication-bar'><input type='text' id='message-input'>"+
	 	"<input id = 'add-message' type = 'submit' value = 'Send'></form>";
	 	$('.communication-bar').replaceWith(commbar);
	}
	if(snapshot.child('playerOne').exists() && snapshot.child('playerTwo').exists()){
		needPlayerOne = false;
		needPlayerTwo = false;
		//update player-status div so user may not enter another name
		$('#player-status').html("<div class='text' style='line-height:120%;'> Hello. Players " + playerOneName + " and " + playerTwoName +
			" are playing. Please feel free to observe.<br/>If you see no activity for an extended period of time, "+
			"please contact owner to remove players so others may play.<br/>Thank you.</div>");
		//empty communication-bar so 3rd+ users may not contribute to messaging
		$('.communication-bar').empty();

		//if playerone already  has a choice, don't reset turn to 1!
		//need this so when you update playerOne's choice, we don't reset turn to 1
		if(p1choice===''){
			fdb.ref('turn').set('1');
			turn=1;
		}
	 }
	 if(!hasPlayerTwo && !hasPlayerOne){
	 	fdb.ref('turn').remove();
	 }

	//remove a player if they disconnect
//if a player disconnects:
//https://firebase.google.com/docs/database/web/offline-capabilities
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
		//clear any prior player choices
		$('.chosen').remove();
		$('#win-status').text('good luck!');
		//give player one options
		game.generatePlayerOneOptions();
		game.checkResponseP1();
	}
	if(turnNumber===2){
		//player two decides
		$('#win-status').text('selections underway...');
		game.generatePlayerTwoOptions();
		game.checkResponseP2();
	}
	if(turnNumber===3){
		game.resolveChoices();
	}
});

var game =
{
	twoPlayers:function(){
		if(!needPlayerOne && !needPlayerTwo){
			return true;
		}else{
			return false;
		}
	},
	options:['rock', 'paper', 'scissors'],
	generatePlayerOneOptions: function(){
		var choices = '';
		for(var i = 0; i<game.options.length; i++){
			var newOption = '<div class="possible-answer" id="p1-' + game.options[i] +'">'+ game.options[i] + '</div>';
			choices += newOption;
		}
		var selectionDiv = $('<div class="selections" id = "selections-p1">');
		selectionDiv.html(choices);
		$('#status-update-p1').html("Your turn to choose :)");
		$('#status-update-p2').text("Waiting for " + playerOneName + " to choose.");
		$('#game-content-p1').append(selectionDiv);
	},
	generatePlayerTwoOptions: function(){
		$('#status-update-p2').text("Your turn to choose.");
		$('#status-update-p1').text("Waiting for " + playerTwoName + " to choose.");
		var choices = '';
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
			fdb.ref('players').child('playerOne').child('choice').set(playerOneSelection);
			fdb.ref('turn').set('2');
			turn=2;
		});
	},
	checkResponseP2: function(){
		$('.possible-answer').on('click', function(){
			if($(this).attr("id") === 'p2-rock'){
				var replacement = $('<div class="chosen">');
				replacement.text("Rock");
				$('#selections-p2').replaceWith(replacement);
				playerTwoSelection = "rock";
			} else if ($(this).attr("id") === 'p2-paper'){
				playerTwoSelection = "paper";
				$('#selections-p2').replaceWith('<div class="chosen">Paper</div>');
			} else if ($(this).attr("id") === 'p2-scissors'){
				playerTwoSelection = "scissors";
				$('#selections-p2').replaceWith('<div class="chosen">Scissors</div>');
			}
			//remember: MUST set playerTwo's choice BEFORE changing turn to 3. Otherwise,
			//the turn 3 code will run BEFORE playerTwo's choice has been added.
			fdb.ref('players').child('playerTwo').child('choice').set(playerTwoSelection);
			fdb.ref('turn').set('3');
			turn = 3;
		});
	},
	answerTimer:0,
	resolveChoices:function(){
		//create a timer, update game status messages for both players with countdown,
		//set turn to 1 at end
		//make sure player divs are properly cleared / set as appropriate
		//update both players divs to reveal choices. Also update any 3rd party viewers.
		$('#game-content-secondplayer-p1').html(gameContentP2 + '<div class="chosen">' + playerTwoChoice + '</div>');
		$('#game-content-firstplayer-p2').html(gameContentP1 + '<div class="chosen">' + playerOneChoice + '</div>');
		$('#game-content-firstplayer').html(gameContentP1 + '<div class="chosen">' + playerOneChoice + '</div>');
		$('#game-content-secondplayer').html(gameContentP2 + '<div class="chosen">' + playerTwoChoice + '</div>');
		var currentTies = parseInt(playerOneTies);
		var p1wins = parseInt(playerOneWins);
		var p1losses = parseInt(playerOneLosses);
		var p2wins = playerTwoWins;
		var p2losses = playerTwoLosses;
		console.log("player one choice: " + playerOneChoice);
		console.log("player two choice: " + playerTwoChoice);
		if(playerOneChoice==="rock" && playerTwoChoice==="rock"){
			//REMEMBER: must update scores FIRST, then update html.
			$('#win-status').html('<div id="resolved-game">You<br/>tie</div>');
			currentTies++;
		} else if (playerOneChoice==="rock" && playerTwoChoice==="paper"){
			p1losses++;
			p2wins++;
			$('#win-status').html('<div id="resolved-game">'+ playerTwoName + '<br/>wins</div>');
		} else if (playerOneChoice==="rock" && playerTwoChoice==="scissors"){
			p1wins++;
			p2losses++;
			$('#win-status').html('<div id="resolved-game">'+ playerOneName + '<br/>wins</div>');			
		} else if (playerOneChoice==="paper" && playerTwoChoice==="rock"){
			p1wins++;
			p2losses++;
			$('#win-status').html('<div id="resolved-game">'+ playerOneName + '<br/>wins</div>');
		} else if (playerOneChoice==="paper" && playerTwoChoice==="paper"){
			currentTies++;
			$('#win-status').html('<div id="resolved-game">You<br/>tie</div>');
		} else if (playerOneChoice==="paper" && playerTwoChoice==="scissors"){
			p1losses++;
			p2wins++;
			$('#win-status').html('<div id="resolved-game">'+ playerTwoName + '<br/>wins</div>');
		} else if (playerOneChoice==='scissors' && playerTwoChoice==="rock"){
			p1losses++;
			p2wins++;
			$('#win-status').html('<div id="resolved-game">'+ playerTwoName + '<br/>wins</div>');
		} else if (playerOneChoice==='scissors' && playerTwoChoice==="paper"){
			p1wins++;
			p2losses++;
			$('#win-status').html('<div id="resolved-game">'+ playerOneName + '<br/>wins</div>');
		} else if (playerOneChoice==='scissors' && playerTwoChoice==="scissors"){
			currentTies++;
			$('#win-status').html('<div id="resolved-game">You<br/>tie</div>');
		}
		//update scores
		fdb.ref('players').child('playerOne').child('ties').set(currentTies);
		fdb.ref('players').child('playerTwo').child('ties').set(currentTies);
		fdb.ref('players').child('playerOne').child('wins').set(p1wins);
		fdb.ref('players').child('playerTwo').child('wins').set(p2wins);
		fdb.ref('players').child('playerOne').child('losses').set(p1losses);
		fdb.ref('players').child('playerTwo').child('losses').set(p2losses);

		game.setAnswerTimer();
		game.timedAnswerReveal();
	},
	setAnswerTimer: function(){
		game.answerTimer = 8;
	},
	timedAnswerReveal: function(){
		counter = setInterval(game.answerReveal, 1000);
	},
	answerReveal: function(){
		game.answerTimer --;
		$('#status-update-p1').html("next opportunity to play in: "+ game.answerTimer + " seconds.");
		$('#status-update-p2').html("next opportunity to play in: "+ game.answerTimer + " seconds.");
		if(game.answerTimer === 1){
			$('#status-update-p1').html("next opportunity to play in: "+ game.answerTimer + " second!");
			$('#status-update-p2').html("next opportunity to play in: "+ game.answerTimer + " second!");
		}else if(game.answerTimer === 0){
			game.stop();
			//update the turn when timer is 0
			//reset playerOneSelection and playerTwo Selection to '',
			fdb.ref('players').child('playerTwo').child('choice').set('');
			fdb.ref('players').child('playerOne').child('choice').set('');//remember that setting playerOne's choice to '' will trigger: fdb.ref('turn').set('1');
		}
	},
	stop: function(){
		clearInterval(counter);
	}
};

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
// fdb.ref('chat').on('value', function(snapshot){
// });

// fdb.ref('chat').on("child_added", function(childSnapshot, prevChildKey) {
// 	console.log(childSnapshot.val());
// 	var name = childSnapshot.val().name;
// 	var message = childSnapshot.val().message;
// 	$('#message-display-start').append('<div class="text-message">'+ name + ': ' + message + '</div>');
// });


//https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data
//utilize Firebase.ServerValue.TIMESTAMP