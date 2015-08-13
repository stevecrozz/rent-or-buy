var assert = require("assert");
var Month = require("../src/rent-or-buy/month");
var amortize = require("../src/rent-or-buy/amortize");
var _ = require('underscore');

describe('Month', function() {
  var table;
  var params;
  var month0;
  var month1;
  var month2;

  beforeEach(function(){
    table = amortize(240000, 360, 0.04);
    params = {
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

    month0 = Month(_.extend({}, params, {
      initialHomeValue: 300000
    }));

    month1 = Month(_.extend({}, params, {
      lastMonth: month0,
      mortgage: table[0]
    }));

    month2 = Month(_.extend({}, params, {
      lastMonth: month1,
      mortgage: table[1]
    }));
  });

  context('month 0', function(){
    it('rent payment is zero', function(){
      assert.equal(month0.rentPayment(), 0);
    });

    it('repairs expense is zero', function(){
      assert.equal(month0.repairsExpense(), 0);
    });

    it('insurance expense is zero', function(){
      assert.equal(month0.insuranceExpense(), 0);
    });

    it('property tax expense is zero', function(){
      assert.equal(month0.propertyTaxExpense(), 0);
    });

    it('home value is initial', function(){
      assert.equal(month0.homeValue(), 300000);
    });

    it('equity is initial', function(){
      assert.equal(month0.equity(), 60000);
    });

    it('mortgage interest deduction value is zero', function(){
      assert.equal(month0.mortgageInterestDeductionValue(), 0);
    });

    it('cost to buy is $60,000', function(){
      assert.equal(month0.buyCost(), 60000);
    });

    it('cost to rent is zero', function(){
      assert.equal(month0.rentCost(), 0);
    });

    it('total cash used to buy is $60,000', function(){
      assert.equal(month0.totalCashUsedToBuy(), 60000);
    });

    it('total cash used to rent is zero', function(){
      assert.equal(month0.totalCashUsedToRent(), 0);
    });

    it('opportunity cost vs investment', function(){
      assert.equal(month0.opportunityCostVsInvestment(), 0);
    });
  });

  context('month 1', function(){
    it('rent payment is $1000', function () {
      assert.equal(month1.rentPayment(), 1000);
    });

    it('repairs expense is $250', function(){
      assert.equal(month1.repairsExpense(), 250);
    });

    it('insurance expense is $125', function(){
      assert.equal(month1.insuranceExpense(), 125);
    });

    it('property tax expense is $275', function(){
      assert.equal(month1.propertyTaxExpense(), 275);
    });

    it('home value is $300,750', function(){
      assert.equal(month1.homeValue(), 300750);
    });

    it('equity is $61,095.80', function(){
      assert.equal(month1.equity(), 61095.80);
    });

    it('mortgage interest deduction value is $266.40', function(){
      assert.equal(month1.mortgageInterestDeductionValue(), 266.40);
    });

    it('cost to buy is $692.58', function(){
      assert.equal(month1.buyCost(), 692.58);
    });

    it('cost to rent is $1,000', function(){
      assert.equal(month1.rentCost(), 1000);
    });

    it('total cash used to buy is $61,445.85', function(){
      assert.equal(month1.totalCashUsedToBuy(), 60692.58);
    });

    it('total cash used to rent is $1,000', function(){
      assert.equal(month1.totalCashUsedToRent(), 1000);
    });

    it('opportunity cost vs investment', function(){
      assert.equal(month0.opportunityCostVsInvestment(), 0);
    });
  });

  context('month 2', function(){
    it('rent payment is $1002.73', function () {
      assert.equal(month2.rentPayment(), 1002.73);
    });

    it('repairs expense is $250.63', function(){
      assert.equal(month2.repairsExpense(), 250.63);
    });

    it('insurance expense is $125.31', function(){
      assert.equal(month2.insuranceExpense(), 125.31);
    });

    it('property tax expense is $275', function(){
      assert.equal(month2.propertyTaxExpense(), 275.69);
    });

    it('home value is $301,501.88', function(){
      assert.equal(month2.homeValue(), 301501.88);
    });

    it('equity is $62,194.63', function(){
      assert.equal(month2.equity(), 62194.63);
    });

    it('mortgage interest deduction value is $266.40', function(){
      assert.equal(month2.mortgageInterestDeductionValue(), 266.02);
    });

    it('cost to buy is $690.21', function(){
      assert.equal(month2.buyCost(), 690.21);
    });

    it('cost to rent is $1,002.73', function(){
      assert.equal(month2.rentCost(), 1002.73);
    });

    it('total cash used to buy is $61,382.79', function(){
      assert.equal(month2.totalCashUsedToBuy(), 61382.79);
    });

    it('total cash used to rent is $2,002.73', function(){
      assert.equal(month2.totalCashUsedToRent(), 2002.73);
    });
  });
});
