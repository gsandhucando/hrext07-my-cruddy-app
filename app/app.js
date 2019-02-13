/*
Init app
interact with DOM
interact with localstorage
1. player has money and can bet it
2. player can hold cards
3. dealer
 */
let Player = function (name, money) {
  this.name = name;
  this.money = money;
  this.hand = [];
}
Player.prototype = {
  shuffle: function (cards) {
    let usedCards = new Set();
    let newCards = [];
    while (cards.length > 0) {
      let shuffleCards = Math.floor(Math.random() * cards.length);
      let choosenCard = cards[shuffleCards];
      if (!usedCards.has(shuffleCards)) {
        newCards.push(choosenCard);
        cards.splice(shuffleCards, 1);
      } else {
        continue;
      }
    }
    return newCards;
  },
  hit: function (cards) {
    this.hand.push(cards.pop());
    let result = 0;
    for (let i = 0; i < this.hand.length; i++) {
      result += this.hand[i].calculateWorth();
    }
    return result;
  }
}

let Card = function (suit, value) {
  //0 = hearts, 1 = spades, 2 = dimonds, 3 = clubs
  this.suit = suit;
  this.value = value;
}
Card.prototype = {
  calculateWorth: function () {
    if (this.value >= 10 && this.value <= 13) {
      return 10;
    } else if (this.value === 14) {
      const choice = Math.round(Math.random());
      return choice === 0 ? 11 : 1;
    } else {
      return this.value;
    }
  },
  getSuit: function () {
    switch (this.suit) {
      case 0:
        return 'HEART'
      case 1:
        return 'SPADE'
      case 2:
        return 'DIMONDS'
      case 3:
        return 'CLUB'
    }
  },
  getFace: function () {
    switch (this.value) {
      case 14:
        return 'A'
      case 13:
        return 'K'
      case 12:
        return 'Q'
      case 11:
        return 'J'
      default:
        return this.value
    }
  }
}
let cards = [];

for (let x = 0; x <= 3; x++) {
  for (let i = 2; i <= 14; i++) {
    const newCard = new Card(x, i);
    cards.push(newCard)
  }
}




$(document).ready(function () {
  let player, dealer, deck, bet, previousBet = 0,
    playerTotal, dealerTotal;

  let gameOver = false;
  $('#hit').on('click', () => {
    makePlayerChoice(1, playerTotal);
    if (!gameOver) {
      $('#hit-choice').show()
    }
  })
  $('#stay').on('click', () => {
    makePlayerChoice(0, playerTotal);
  })
  $('#bet-submit').on('click', () => {
    bet = parseInt($('#bet-choice').val());
    if (player.money > bet) {
      player.money -= bet;
      $('#bet').hide();
      showPlayerHand(dealer, 'dealer-hand')
      showPlayerHand(player, 'player-hand')
      let combineHand = player.hand[0].calculateWorth() + player.hand[1].calculateWorth();
      window.setTimeout(() => {
        $('#card-value').html(combineHand + ' total')
      })
      playerTotal = combineHand
      dealerTotal = dealer.hit(deck);
      $('#hit-choice').show();
      //dealer ai

    }
  })
  $('#gameover').hide();
  $('#message-one').hide();
  $('#bet').hide();
  $('#hit-choice').hide();
  let handlePlayerSubmit = function () {
    let playerName = $('.player-name').val();
    console.log('creatingPlayer')
    player = new Player(playerName, 100);
    $('#player').html(player.name);
    $('#money').html(player.money);
    $('.container-form').html('');
    startGame();
    runGame();
  }

  let makePlayerChoice = function (choice, hand) {
    showPlayerHand(player, 'player-hand')
    showPlayerHand(dealer, 'dealer-hand', false)
    $('#hit-choice').hide();
    // hit or stay
    playerTotal = choice === 1 ? player.hit(deck) : hand;
    if (dealerTotal >= 17 && dealerTotal <= 21) {
      // dealer stays
      $('#message-two').html('Dealer Stays')
      if (playerTotal < dealerTotal) {
        gameOver = true;
        dealer.money += bet;
        showPlayerHand(player, 'player-hand')
        showPlayerHand(dealer, 'dealer-hand')
        $('#gameover').show();
        $('#money').html(player.money)
        $('#end-message').html(player.name + ' Lose!')
      } else {
        player.money += bet * 2;
        gameOver = true;
        showPlayerHand(player, 'player-hand')
        showPlayerHand(dealer, 'dealer-hand')
        $('#gameover').show();
        $('#money').html(player.money)
        $('#end-message').html(player.name + ' Wins!')
      }
    } else if (dealerTotal <= 16) {
      dealerTotal = dealer.hit(deck)
      $('#message-two').html('Dealer Hits')
      makePlayerChoice(0, playerTotal)
    } else {
      //dealer bust
      player.money += bet * 2;
      gameOver = true;
      showPlayerHand(player, 'player-hand')
      showPlayerHand(dealer, 'dealer-hand')
      $('#gameover').show();
      $('#money').html(player.money)
      $('#end-message').html(player.name + ' Wins!')
    }
  }

  let startGame = function () {

    // $('.game-message').html('Starting game, shuffling deck.')
    dealer = new Player('Dealer', 1000);
    deck = dealer.shuffle(cards);
    player.hand.push(deck.pop());
    player.hand.push(deck.pop());
    dealer.hand.push(deck.pop());
    dealer.hand.push(deck.pop());
    $('#message-one').show()
  }

  let runGame = function () {
    console.log(bet, ' bet')
    playerTotal = player.hand[0].calculateWorth() + player.hand[1].calculateWorth()
    dealerTotal = dealer.hand[0].calculateWorth() + dealer.hand[1].calculateWorth()
    if (playerTotal > 21) {
      //bust
      dealer.money += bet;
      gameOver = true;
      showPlayerHand(player, 'player-hand')
      showPlayerHand(dealer, 'dealer-hand', false)
      $('#gameover').show();
      $('#money').html(player.money)
      $('#end-message').html(player.name + ' Lose!')
    } else {
      $('#bet').show();
    }
  }
  let showPlayerHand = function (player, id, showAll = true) {
    let hand = $('#' + id);
    let str = '';
    if (showAll) {
      for (let i = 0; i < player.hand.length; i++) {
        str += player.hand[i].getSuit() + ' | ' + player.hand[i].getFace() + ' ';
      }
    } else {
      str += player.hand[1].getSuit() + ' | ' + player.hand[1].getFace() + ' ';
    }
    hand.html(str);
  }

  $('.name-submit').click(handlePlayerSubmit)
  //game logic -------------------------------->
  // if (player.money > bet) {
  //   player.money -= bet;
  //   console.log(dealer.hand[1])
  //   console.log(player.hand, 'players hand')
  //   let combineHand = player.hand[0].calculateWorth() + player.hand[1].calculateWorth();
  //   console.log(combineHand, ' players hard value')
  //   let playerTotal = combineHand
  //   let dealerTotal = dealer.hit(deck)
  //   //dealer ai
  //   while(!gameOver){
  //     if(playerTotal > 21) {
  //       //bust
  //       dealer.money += bet;
  //       gameOver = true;
  //       console.log(gameOver, 'gameover')
  //     } else {
  //      // hit or stay
  //      playerTotal = player.hit(deck)
  //      console.log('player hit', playerTotal)
  //     }
  //     if(dealerTotal >= 17 && dealerTotal <= 21) {
  //     // dealer stays
  //     continue;
  //     } else if (dealerTotal <= 16) {
  //       dealerTotal = dealer.hit(deck)
  //       console.log('dealer hit', dealerTotal)
  //     } else {
  //     //dealer bust
  //       player.money += bet * 2;
  //       gameOver = true;
  //       console.log(gameOver, 'gameover')
  //   }
  // }
  // }




});