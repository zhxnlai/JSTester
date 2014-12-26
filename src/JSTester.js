(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
    if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
      mod(root.JSTester || (root.JSTester = {})); // Plain browser env
    })(this, function(exports) {
      "use strict";
      var acorn = require('acorn');
      var walk = require('acorn/util/walk');

      var defaultOptions = {
        "BlockStatement" : true
      };
      exports.supportedStatements = defaultOptions;

      // var testWhiteList = function(input, list) {
      //   // convert the array to object
      //   var options = list;
      //   return test(input, options);
      // };
      // exports.testWhiteList = testWhiteList;
      //
      // var testBlackList = function(input, list) {
      //   var options = list;
      //
      //   return test(input, options);
      // };
      // exports.testBlackList = testBlackList;
      //
      // var testStructure = function(input, options) {
      // };
      // exports.testStructure = testStructure;

      // assume that opts.whiteList and opts.blackList follow the parse API
      var test = function(input, opts) {
        var options = {};
        // for (var opt in defaultOptions) {
        //   options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
        // }

        // validate that they are Arrays
        var whiteList = opts && has(opts, "whiteList") ? opts.whiteList : [];
        var blackList = opts && has(opts, "blackList") ? opts.blackList : [];
        var structure = opts && has(opts, "structure") ? opts.structure : [];

        // console.log("white list: "+JSON.stringify(whiteList));

        // test white and black list
        var visitors = {};

        // test whiteList
        var whiteListPassed = false;
        var whiteListAppeared = [];
        var whiteListNodeHandler = function(node, scope) {
          var nodeName = node.type;
          if (whiteListAppeared.contains(nodeName)) {
            return;
          }
          if (whiteListAppeared.push(nodeName) === whiteList.length) {
            whiteListPassed = true;
          }
        };
        for (var i=0; i<whiteList.length; i++) {
          visitors[whiteList[i]] = whiteListNodeHandler;
        }

        // test whiteList
        var blackListPassed = true;
        var blackListNodeHandler = function(node, scope) {
          blackListPassed = false;
        };
        for (var i=0; i<blackList.length; i++) {
          visitors[blackList[i]] = blackListNodeHandler;
        }

        console.log("visitors: "+JSON.stringify(visitors));

        var parsed = acorn.parse(input, {});
        // walk the tree and test
        walk.simple(parsed, visitors);

        var structureVisitor = {};
        // test whiteList
        var structurePassed = true;
        var structureNodeHandler = function(node, state) {
          console.log(JSON.stringify(state));
          structurePassed = false;
        };
        for (var i=0; i<structure.length; i++) {
          structureVisitor[structure[i]] = structureNodeHandler;
        }

        walk.ancestor(parsed, structureVisitor);

        return whiteListPassed && blackListPassed;
      };
      exports.test = test;

      Array.prototype.contains = function (v) {
        return this.indexOf(v) > -1;
      };

      function has(obj, propName) {
        return Object.prototype.hasOwnProperty.call(obj, propName);
      }
});
