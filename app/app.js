/*
Init app
interact with DOM
interact with localstorage
1. player has money and can bet it
2. player can hold cards
3. dealer
 */
let Player = function(name, money) {
  this.name = name;
  this.money = money;
  this.hand = [];
}
Player.prototype = {
  shuffle: function(cards) {
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
  }
}

let Card = function(suit, value) {
  //0 = hearts, 1 = spades, 2 = dimonds, 3 = clubs
  this.suit = suit; 
  this.value = value;
}
Card.prototype = {
  calculateWorth: function() {
    if (this.value >= 10 && this.value <= 13) {
      return 10;
    }
    else if (this.value === 14) {
      return 1;
    } else {
      return this.value;
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

$(document).ready(function(){
  // this is where we jquery
  //var keyData = 'ourKey'; // going to need to make this dynamic?
  const player = new Player('Sonu', 100);
  const dealer = new Player('Dealer', 1000);
  const deck = dealer.shuffle(cards);
  console.log(deck);
  player.hand.push(deck.pop());
  player.hand.push(deck.pop());
  dealer.hand.push(deck.pop());
  dealer.hand.push(deck.pop());
  console.log('player place bet')
  const bet = 50;
  if (player.money > bet) {
    console.log(dealer.hand[1])
    console.log(player.hand, 'players hand')
  }


  $('.btn-add').on('click', function(e){
    console.log(e);
    var keyData = $('.input-key').val();
    var valueData = $('.input-value').val();
    // write to db
    localStorage.setItem(keyData, valueData);
    // read from db
    var displayText = keyData + ' | ' + localStorage.getItem(keyData);
    // this only displays the last one? might want to switch to html
    // and append a div
    // <div class="display-data-item" data-keyValue="keyData">valueData</div>
    // if you use backticks ` you can use ${templateLiterals}
    // TODO make this vars make sense across the app
    $('.container-data').html('<div class="display-data-item" data-keyValue="'+ keyData +'">'+valueData+'</div>');
    $('.input-key').val('');
    $('.input-value').val('');
  });


  // update db
    // need to expand when  more than 1 item is added

  // delete item
  $('.container-data').on('click', '.display-data-item', function(e){
    console.log(e.currentTarget.dataset.keyvalue);
    var keyData = e.currentTarget.dataset.keyvalue;
    localStorage.removeItem(keyData);
    $('.container-data').text('');
  });
  // delete all?
  $('.btn-clear').click(function(){
    localStorage.clear();
    $('.container-data').text('');
  });

});