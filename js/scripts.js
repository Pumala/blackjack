// Set messages after game over. - DONE
// The table/game looks like Rob made it. Change this - DONE
// What about those 11, 12, 13s? - NOT AN ISSUE
// What about aces? - DONE
// The player can hit forever? - DONE
// There is no win counter / bet system - DONE
// There is no 'deck' to draw from. - DONE
// The cards aren't red or black like they should / could be - DONE
// The cards are lame. Find images. - DONE
// There is no delay on showing the cards ... it's instant - DONE
// You can see the dealer's second card on deal. That's unfair to the house.
// make a win counter for dealer / player - DONE
// better message styling - DONE

// 1. When the user clicks deal, deal.
var theDeck = [];
var playersHand = [];
var dealersHand = [];
var topOfTheDeck = 4;

var bet = 0;
var balance = 100;

var betSubmit = false;


$(document).ready(function(){

	$('.add-balance-1').click(function(){
		bet++;
		$('.bet-amount').text(bet);
		balance--;
		$('.bank-balance').text(balance);
	});

	$('.add-balance-5').click(function(){
		bet+=5;
		$('.bet-amount').text(bet);
		balance-=5;
		$('.bank-balance').text(balance);
	});

	$('.add-balance-10').click(function(){
		bet+=10;
		$('.bet-amount').text(bet);
		balance-=10;
		$('.bank-balance').text(balance);
	});

	$('.add-balance-20').click(function(){
		bet+=20;
		$('.bet-amount').text(bet);
		balance-=20;
		$('.bank-balance').text(balance);
	});

	$('.subtract-button-1').click(function(){
		bet--;
		$('.bet-amount').text(bet);
		balance++;
		$('.bank-balance').text(balance);
	});

	$('.subtract-button-5').click(function(){
		bet-=5;
		$('.bet-amount').text(bet);
		balance+=5;
		$('.bank-balance').text(balance);
	});

	$('.subtract-button-10').click(function(){
		bet-=10;
		$('.bet-amount').text(bet);
		balance+=10;
		$('.bank-balance').text(balance);
	});

	$('.subtract-button-20').click(function(){
		bet-=20;
		$('.bet-amount').text(bet);
		balance+=20;
		$('.bank-balance').text(balance);
	});

	$('.bet-button').click(function(){
		betSubmit = true;
		$('.deal-button, .hit-button, .stand-button').removeAttr("disabled");
		$('.subtract-button-20, .subtract-button-10, .subtract-button-5, .subtract-button-1, .add-balance-20, .add-balance-5, .add-balance-10, .add-balance-1').hide();
	});

	$('.deal-button').click(function(){
		if(betSubmit == false){
			document.getElementById('message').innerHTML = "Please place a bet first.";
		}
		else if(betSubmit == true){
			createDeck();  // run a function that creates an array of 1h to 13c
			shuffleDeck(); // shuffle the deck

			// remove reset message
			document.getElementById('message').innerHTML = "";

			// Push onto the playersHand array the new card. Then, place it in the DOM.
			playersHand.push(theDeck[0]);
			setTimeout(function(){
				placeCard('player', 'one', theDeck[0]);
			}, 500);
			
			playersHand.push(theDeck[2]);
			setTimeout(function(){
				placeCard('player', 'two', theDeck[2]);
			}, 1000);
			
			dealersHand.push(theDeck[1]);
			setTimeout(function(){
				placeCard('dealer', 'one', theDeck[1]);
			}, 1500);	
			
			dealersHand.push(theDeck[3]);
			setTimeout(function(){
				placeCard('dealer', 'two', theDeck[3]);
			}, 2000);

			calculateTotal(playersHand, 'player');
			calculateTotal(dealersHand, 'dealer');
		}
	});	

	
	$('.hit-button').click(function(){
		
		var slotForNewCard = "";
		if(playersHand.length == 2){
			slotForNewCard = "three";}
			else if(playersHand.length == 3){
				slotForNewCard = "four";
			}else if(playersHand.length == 4){
				slotForNewCard = "five";
			}else if(playersHand.length == 5){
				slotForNewCard = "six";
			}
			setTimeout(function(){
				placeCard('player', slotForNewCard, theDeck[topOfTheDeck]);
				playersHand.push(theDeck[topOfTheDeck]);
				var playersTotal = calculateTotal(playersHand, 'player');
				topOfTheDeck++;
				
				if((playersTotal > 21) || (playersTotal === 21)){
					checkWin();
				}
			}, 500);
		}
	);
	
	$('.stand-button').click(function(){
		// player clicked on stand. What happens to the player? Nothing.
			var slotForNewCard = "";
			var dealerTotal = calculateTotal(dealersHand, 'dealer');
			while(dealerTotal < 17){
				 // dealer has less than 17, hit away!
				 if(dealersHand.length == 2){
				 	slotForNewCard = "three";
				 }else if(dealersHand.length == 3){
				 	slotForNewCard = "four";
				 }else if(dealersHand.length == 4){
				 	slotForNewCard = "five";
				 }else if(dealersHand.length == 5){
				 	slotForNewCard = "six";
				 }
				 placeCard('dealer', slotForNewCard, theDeck[topOfTheDeck]);
				 dealersHand.push(theDeck[topOfTheDeck]);
				 dealerTotal = calculateTotal(dealersHand, 'dealer');
				 topOfTheDeck++;
			// Dealer has at least 17. Check to see who won
		}
		checkWin();		
	});

	$('.reset-button').click(function(){
		reset();
	});

	if($('.bank-balance').text <= 0){
		$('.message').html("You should probably quit while you're ahead. The house always wins in the end.")
	}

});

function checkWin(){
	// Get player total
	var playersTotal = calculateTotal(playersHand, 'player');
	// Get dealer total
	var dealersTotal = calculateTotal(dealersHand, 'dealer');
	

	if(playersTotal === 21){
		$('#message').html("Blackjack! You win this round!");
		$('#playerWin').html(+1);
		balance += bet + bet;
		$('.bank-balance').text(balance);
		// player wins
	}else if(dealersTotal === 21){
		$('#message').html("Aw man, the house got blackjack. Time for a new hand.");
		$('#dealerWin').html(+1);
		// dealer wins
	}else if(playersTotal > 21){
		$('#message').html("Oh, good try, but you went over 21. House wins.");
		$('#dealerWin').html(+1);
		// player has busted
		// set a message somewhere that says this
	}else if(dealersTotal > 21){
		$('#message').html("The dealer went over 21, you win!");
		$('#playerWin').html(+1);
		balance += bet + bet;
		$('.bank-balance').text(balance);
		// dealer has busted
		// set a message somewhere that says this
	}else{
		// neither player has more than 21
		if(playersTotal > dealersTotal){
			$('#message').html("Neither of you have blackjack, but you're closer. That's a win!");
			$('#playerWin').html(+1);
			balance += bet + bet;
		$('.bank-balance').text(balance);
			// player won. say this somewhere
		}else if(dealersTotal > playersTotal){
		 	$('#message').html("Neither of you have blackjack, but the dealer's closer. The house wins.");
		 	$('#dealerWin').html(+1);
		 	// dealer won. say this somewhere
		}else{
			$('#message').html("Looks like nobody won and you tied. Time for a new hand.");
			// push. tie. say this somewhere
		}
	}
	// disable buttons
	disableAllBtns();
}

function disableAllBtns(){
	var buttons = document.getElementsByClassName("button");
	for(i=0; i < buttons.length; i++){
		buttons[i].classList.remove('active');
		buttons[i].classList.add('hidden');
	}
}

function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;
	var cardImages = '<img src="images/'+cardToPlace+'.png">';
	
	// $(classSelector).html(cardImages);
	$(classSelector).delay(200).fadeOut(500, function(){
		$(this).html(cardImages).fadeIn(500);
	})
	
}


function createDeck(){
	// Fill the deck with 
	// - 52 cards. 
	// - 4 suits
	// 	- h, s, d, c
	var suits = ['h', 's', 'd', 'c'];
	for(var s=0; s<suits.length; s++){
		for(var c=1; c<=13; c++){
			theDeck.push(c+suits[s]);
		}
	}
}

function shuffleDeck(){
	for(var i = 1; i<1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
}

function calculateTotal(hand, whosTurn){
	// console.log(whosTurn);
	var total = 0;
	var cardValue = 0;
	var hasAce = false; //init acs as false
	
	for(var i = 0; i < hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1))
		//account for face cards values
		if(cardValue > 10){
			cardValue = 10;
		}else if((cardValue == 1) && ((total + 11) <= 21)){
			cardValue = 11;
			hasAce = true;
		}else if((total + cardValue >21) && (hasAce === true)){
			total -= 10;
			hasAce = false;
		}
		total += cardValue;
	}
	

	// Update the HTML with the new total
	var elementToUpdate = '.'+whosTurn+'-total-number';
	$(elementToUpdate).text(total);

	return total;
}

function reset(){
	//empty the deck
	//reset the place in the deck
	//reset the player's total cards
	//reset the dealer's total cards
	//reset the player's hand array
	//reset the dealer's hand array
	//reset the message
	//reset all the cards (divs and empty class)
	theDeck = [];
	
	shuffleDeck();
	
	playersHand = [];
	var playersTotal = calculateTotal(playersHand, 'player');
	
	dealersHand = [];
	var dealersTotal = calculateTotal(dealersHand, 'dealer');

	topOfTheDeck = 4;

	document.getElementById('message').innerHTML = "Are you feeling lucky?";

	var cards = document.getElementsByClassName('card');
	for(var i=0; i < cards.length; i++){
		cards[i].classList.add('empty');
		cards[i].innerHTML = " ";
	}

	// reset buttons
	var buttons = document.getElementsByClassName("button");
	for(var i = 0; i < buttons.length; i++){
		buttons[i].classList.remove('hidden');
		buttons[i].classList.add('active');	
	}

	betSubmit = false;

	$('.bet-amount').text('0');
	bet = 0;

	$('.subtract-button-20, .subtract-button-10, .subtract-button-5, .subtract-button-1, .add-balance-20, .add-balance-5, .add-balance-10, .add-balance-1').show();
}