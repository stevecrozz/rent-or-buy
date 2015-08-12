var round = require('./dollar-round');

/**
 * Represents one month of comparison between renting and buying. All
 * calculations should be taken as 'current' at the beginning of the month
 * directly after payments are made
 */
var Month = function(options) {
  this.opts = options;
};

Month.prototype.homeValue = function() {
  multiplier = 1 + (this.opts.annualHomeValueIncreaseRate / 12.0);
  return round(this.opts.lastMonth.homeValue() * multiplier);
}

Month.prototype.repairsExpense = function() {
  return this.annualizedByValueExpense(this.opts.annualRepairRate);
}

Month.prototype.insuranceExpense = function() {
  return this.annualizedByValueExpense(this.opts.annualInsuranceRate);
}

Month.prototype.propertyTaxExpense = function() {
  return this.annualizedByValueExpense(this.opts.annualPropertyTaxRate);
}

Month.prototype.equity = function() {
  var homeValueIncrease = this.homeValue() - this.opts.lastMonth.homeValue();
  return round(
    this.opts.lastMonth.equity() +
    this.opts.mortgage.principalPayment +
    homeValueIncrease);
}

Month.prototype.rentPayment = function() {
  if (this.opts.lastMonth.rentPayment() === 0) return this.opts.initialRent;

  multiplier = 1 + (this.opts.annualRentIncreaseRate / 11.0);
  return round(this.opts.lastMonth.rentPayment() * multiplier);
}

Month.prototype.mortgageInterestDeductionValue = function() {
  return round(
    this.opts.totalMarginalTaxRate * this.opts.mortgage.interestPayment);
}

Month.prototype.buyCost = function() {
  var costBeforeOpportunityCost = round(
    this.opts.mortgage.interestPayment +
    this.repairsExpense() +
    this.insuranceExpense() +
    this.propertyTaxExpense() -
    this.mortgageInterestDeductionValue()
  );

  var cashBuy = this.opts.lastMonth.totalCashUsedToBuy() + costBeforeOpportunityCost;
  var cashRent = this.opts.lastMonth.totalCashUsedToRent() + this.rentCost();
  var cashDifference = cashBuy - cashRent;
  var monthlyReturn = this.opts.annualInvestmentReturnRate / 12;
  var interest = round(cashDifference * monthlyReturn);
  var interestAfterTaxes = interest * (1 - this.opts.totalInvestmentTaxRate);

  return round(costBeforeOpportunityCost + interestAfterTaxes);
}

Month.prototype.opportunityCostVsInvestment = function(){
  var cashDifference = this.totalCashUsedToBuy() - this.totalCashUsedToRent();
  var monthlyReturn = this.opts.annualInvestmentReturnRate / 12;
  var interest = round(cashDifference * monthlyReturn);
  return interestAfterTaxes = interest * (1 - this.opts.totalInvestmentTaxRate);
}

Month.prototype.rentCost = function(){
  return round(this.rentPayment());
}

Month.prototype.totalCashUsedToBuy = function() {
  return round(
    this.opts.lastMonth.totalCashUsedToBuy() +
    this.buyCost()
  );
}

Month.prototype.totalCashUsedToRent = function() {
  return round(this.opts.lastMonth.totalCashUsedToRent() + this.rentCost());
}

Month.prototype.annualizedByValueExpense = function(rate) {
  return round(this.opts.lastMonth.homeValue() * (rate / 12));
}

/**
 * month zero is just a container for initial state
 */
Month0 = function(options) {
  this.opts = options;
}

Month0.prototype.mortgageInterestDeductionValue = function() { return 0; }
Month0.prototype.rentPayment = function() { return 0; }
Month0.prototype.equity = function() { return this.opts.downPayment; }
Month0.prototype.propertyTaxExpense = function() { return 0; }
Month0.prototype.homeValue = function() { return this.opts.initialHomeValue; }
Month0.prototype.repairsExpense = function() { return 0; }
Month0.prototype.insuranceExpense = function() { return 0; }
Month0.prototype.buyCost = function() { return this.opts.downPayment; }
Month0.prototype.rentCost = function() { return 0; }
Month0.prototype.totalCashUsedToBuy = function() { return this.buyCost(); }
Month0.prototype.totalCashUsedToRent = function() { return 0; }
Month0.prototype.opportunityCostVsInvestment = function(){ return 0; }

module.exports = function(options){
  if (options.mortgage) {
    // regular month
    return new Month(options);
  } else {
    // no mortgage means this should be a "month 0" (before a payment is made)
    return new Month0(options);
  }
};
