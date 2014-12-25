(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
    if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
      mod(root.JSTester || (root.JSTester = {})); // Plain browser env
    })(this, function(exports) {
      "use strict";
      var acorn = require('acorn');

      var defaultOptions = {

      };
      exports.defaultOptions = defaultOptions;

      var test = function(input, options) {
        var results = acorn.parse(input, {});
        return results;
      };
      exports.test = test;

});
