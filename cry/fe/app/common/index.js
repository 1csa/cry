/* eslint-disable no-undef */
define('index', ['require', 'exports'], function(require, exports) {
  var add = function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return a.reduce(function(sum, item) {
      return sum + item;
    });
  };
  exports.add = add;
  var mul = function() {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      a[_i] = arguments[_i];
    }
    return a.reduce(function(sum, item) {
      return sum * item;
    });
  };
  exports.mul = mul;
});
define('util/date', ['require', 'exports'], function(require, exports) {
  var format = function(a) {
    return a.toLocaleDateString();
  };
  exports.format = format;
});
