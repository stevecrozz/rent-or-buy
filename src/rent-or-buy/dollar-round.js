module.exports = function(value) {
  var exp = Math.pow(10, 2);
  return Math.round(value * exp) / exp;
};
