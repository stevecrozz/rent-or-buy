var round = require('./dollar-round');

function payment(principal, payments, apr) {
  rate = apr / 12;
  return principal * rate / (1 - (1 / Math.pow(1 + rate, payments)));
}

function amortize(principal, payments, apr) {
  var monthlyInterest = apr / 12;
  var monthlyPayment = payment(principal, payments, apr);
  var months = [];

  for(i = 1; i <= payments; i++) {
    var monthInfo = {};
    monthInfo.n = i;
    monthInfo.interestPayment = round(principal * monthlyInterest);
    monthInfo.principalPayment = round(monthlyPayment - monthInfo.interestPayment);
    monthInfo.totalPayment = round(monthInfo.interestPayment + monthInfo.principalPayment);

    principal -= monthInfo.principalPayment;

    if (principal < 0) {
      monthInfo.totalPayment = round(monthInfo.totalPayment + principal);
      monthInfo.principalPayment = round(monthInfo.principalPayment + principal);
      monthInfo.principal = 0;
    } else {
      monthInfo.principal = round(principal);
    }

    months.push(monthInfo);
  }

  return months;
}

module.exports = amortize;
