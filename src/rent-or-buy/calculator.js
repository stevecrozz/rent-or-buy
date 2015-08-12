var _ = require('underscore');
var Month = require('./month');
var amortize = require('./amortize');

var table = amortize(240000, 360, 0.04);
var params = {
  annualHomeValueIncreaseRate: 0.03,
  annualRentIncreaseRate: 0.03,
  annualInvestmentReturnRate: 0.07,
  annualRepairRate: 0.01,
  annualInsuranceRate: 0.005,
  annualPropertyTaxRate: 0.011,
  totalMarginalTaxRate: 0.333,
  totalInvestmentTaxRate: 0.253,
  initialRent: 1000,
  downPayment: 60000
};

var month0 = Month(_.extend({}, params, {
  initialHomeValue: 300000
}));

var months = [ month0 ];

for(i = 0; i < 30; i++) {
  var lastMonth = months[months.length - 1];

  months.push(Month(_.extend({}, params, {
    lastMonth: lastMonth,
    mortgage: table[i]
  })));

  var thisMonth = months[months.length - 1];
  console.log(thisMonth.buyCost());
}

