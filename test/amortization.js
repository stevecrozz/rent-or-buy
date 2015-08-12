var assert = require("assert");
var amortize = require('../src/rent-or-buy/amortize');

describe('#amortize', function() {
  it('calculates the right number of tuples', function() {
    var table = amortize(240000, 360, 0.04);
    assert.equal(table.length, 360);
  });

  it('has the right first payment details', function() {
    var table = amortize(240000, 360, 0.04);
    assert.equal(table[0].principal, 239654.20);
    assert.equal(table[0].principalPayment, 345.80);
    assert.equal(table[0].interestPayment, 800.00);
    assert.equal(table[0].totalPayment, 1145.80);
  });

  it('has the right last payment details', function() {
    var table = amortize(240000, 360, 0.04);
    assert.equal(table[359].principal, 0);
    assert.equal(table[359].principalPayment, 1139.63);
    assert.equal(table[359].interestPayment, 3.80);
    assert.equal(table[359].totalPayment, 1143.43);
  });
});
