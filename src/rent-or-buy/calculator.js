var _ = require('underscore');
var Month = require('./month');
var amortize = require('./amortize');

var calc = function(options){
  var table = amortize(
    options.loanAmount,
    options.loanMonths,
    options.loanApr);

  var month0 = Month(_.extend({}, options, {
    initialHomeValue: 300000
  }));

  var months = [ month0 ];

  for(i = 0; i < options.loanMonths; i++) {
    var lastMonth = months[months.length - 1];

    months.push(Month(_.extend({}, options, {
      lastMonth: lastMonth,
      mortgage: table[i]
    })));

    var thisMonth = months[months.length - 1];
  }

  months.shift(); // remove month0

  return {
    months: months
  };
};

module.exports = calc;
