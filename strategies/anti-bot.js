var https = require("https");
var buyTelegram = "https://api.telegram.org/bot509830771:AAG8t1qqG72MmYbYZOUP338vR1BAR8ZdLgo/sendMessage?chat_id=517227720&text=BoughtBTC@";
var soldTelegram = "https://api.telegram.org/bot509830771:AAG8t1qqG72MmYbYZOUP338vR1BAR8ZdLgo/sendMessage?chat_id=517227720&text=SoldBTC@";
// Let's create our own buy and sell strategy 
var strat = {};

// Prepare everything our strat needs
strat.init = function() {
  this.newHigh = 0;
  this.newLow = 1000000;
  this.percentage = this.settings.margin_percentage;
  this.candleLengthPercentage = this.settings.candle_length_percentage;
  this.nextAction = "buy";
  console.log("MARGIN PERCENTAGE SET TO: ", this.percentage);
  console.log("CANDLE LENGTH PERCENTAGE SET TO: ", this.candleLengthPercentage);
}

// What happens on every new candle?
strat.update = function(candle) {
  // your code!
}

// For debugging purposes.
strat.log = function() {
  // your code!
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
    var candleLength = candle.high - candle.low;
    // console.log("Current Candle Length: ", ((candleLength * 100) / candle.high));
    if(candle.high > this.newHigh) {
        this.newHigh = candle.high;
        // console.log("New High set to: ", candle.close);
    }
    if(candle.low < this.newLow) {
        this.newLow = candle.low;
        // console.log("New Low set to: ", candle.close);
    }
    if (((candleLength * 100) / candle.high) > this.candleLengthPercentage) {
        console.log("SPIKE DETECTED!!!!");
        var margin = (this.percentage / 100) * candle.close;
        console.log("Margin is: ", margin);
        if (this.nextAction === "sell" && this.newHigh > this.newLow + margin) {
            this.advice("short");
            console.log("selling BTC @", candle.close);
            this.nextAction = "buy";
            https.get(soldTelegram + candle.close);
            return;
        }
        if (this.nextAction === "buy" && this.newLow < this.newHigh - margin) {
            this.advice("long");
            console.log("buying BTC @", candle.close);
            this.nextAction = "sell";
            https.get(buyTelegram + candle.close);
            return;
        }
    }

}

module.exports = strat;
