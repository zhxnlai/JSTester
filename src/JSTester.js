(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") return mod(exports); // CommonJS
    if (typeof define == "function" && define.amd) return define(["exports"], mod); // AMD
      mod(root.JSTester || (root.JSTester = {})); // Plain browser env
    })(this, function(exports) {
      "use strict";
      var acorn = require('acorn');
      var walk = require('acorn/util/walk');

      var validNodeTypes = {
        // basic
        "Printable": true,
        "Node": true,
        "SourceLocation": true,
        "Position": true,
        "Program": true,
        "Function": true,
        "BlockStatement": true,
        "ExpressionStatement": true,
        "IfStatement": true,
        "LabeledStatement": true,
        "BreakStatement": true,
        "ContinueStatement": true,
        "WithStatement": true,
        "SwitchStatement": true,
        "ReturnStatement": true,
        "ThrowStatement": true,
        "TryStatement": true,
        "CatchClause": true,
        "WhileStatement": true,
        "DoWhileStatement": true,
        "ForStatement": true,
        "ForInStatement": true,
        "FunctionDeclaration": true,
        "FunctionExpression": true,
        "VariableDeclaration": true,
        "VariableDeclarator": true,
        "ArrayExpression": true,
        "ObjectExpression": true,
        "Property": true,
        "SequenceExpression": true,
        "UnaryExpression": true,
        "BinaryExpression": true,
        "AssignmentExpression": true,
        "UpdateExpression": true,
        "LogicalExpression": true,
        "ConditionalExpression": true,
        "NewExpression": true,
        "CallExpression": true,
        "MemberExpression": true,
        "ObjectPattern": true,
        "PropertyPattern": true,
        "ArrayPattern": true,
        "SwitchCase": true,
        "Identifier": true,
        "Literal": true,
        "Block": true,
        "Line": true,

        // ES6
        "ArrowFunctionExpression": true,
        "YieldExpression": true,
        "GeneratorExpression": true,
        "ComprehensionExpression": true,
        "ComprehensionBlock": true,
        "ModuleSpecifier": true,
        "MethodDefinition": true,
        "SpreadElement": true,
        "SpreadElementPattern": true,
        "ClassProperty": true,
        "ClassBody": true,
        "ClassDeclaration": true,
        "ClassExpression": true,
        "ClassImplements": true,
        "NamedSpecifier": true,
        "ExportSpecifier": true,
        "ExportBatchSpecifier": true,
        "ImportSpecifier": true,
        "ImportNamespaceSpecifier": true,
        "ImportDefaultSpecifier": true,
        "ExportDeclaration": true,
        "ImportDeclaration": true,
        "TaggedTemplateExpression": true,
        "TemplateLiteral": true,
        "TemplateElement": true,
      };
      exports.validNodeTypes = validNodeTypes;

      var validOptions = ["whiteList", "blackList", "structure"];
      exports.validOptions = validOptions;

      var test = function(input, opts) {
        if (!opts) {
          return {success: false, error: "options is not specified"};
        }
        var options = {};
        // validate options
        exports.validOptions.forEach(function(optionKey) {
          if (has(opts, optionKey) && Array.isArray(opts[optionKey])) {
            // validate node types
            var optionValue = opts[optionKey],
            validatedOptionValue = optionValue.reduce(function(acc, nodeType) {
              if (has(exports.validNodeTypes, nodeType)) {
                acc.push(nodeType);
              } else {
                console.log("Node type \""+nodeType+"\" is invalid.");
              }
              return acc;
            }, []);
            if (validatedOptionValue.length > 0) {
              options[optionKey] = validatedOptionValue;
            }
          }
        });

        if (Object.keys(options).length === 0) {
          return {success: false, error: "options is empty"};
        }

        options.whiteList = has(options, "whiteList") ? unique(options.whiteList) : [];
        options.blackList = has(options, "blackList") ? unique(options.blackList) : [];
        options.structure = has(options, "structure") ? options.structure : [];

        if (options.whiteList.union(options.blackList).length>0) {
          return {success: false, error: "white list and black list are conflicting"};
        }

        // console.log("options: "+JSON.stringify(options));

        try {
          var parsed = acorn.parse(input, {});
        } catch (err) {
          return {success: false, error: "parserError: "+err};
        }

        // test white and black list
        var listsTestResults = function(whiteList, blackList) {
          var visitors = {};

          var whiteListOutput = [],
          whiteListNodeHandler = simpleWalkNodeHandler(whiteList, whiteListOutput);
          whiteList.forEach(function (nodeType) {
            visitors[nodeType] = whiteListNodeHandler;
          });

          var blackListOutput = [],
          blackListNodeHandler = simpleWalkNodeHandler(blackList, blackListOutput);
          blackList.forEach(function (nodeType) {
            visitors[nodeType] = blackListNodeHandler;
          });

          walk.simple(parsed, visitors);

          var missingInWihteList = whiteList.reduce(function(acc, nodeType) {
            if (!whiteListOutput.contains(nodeType)) {
              acc.push(nodeType);
            }
            return acc;
          }, []);
          return {
            "missingFromWhiteList": missingInWihteList,
            "presentInblackList": blackListOutput,
          };
        }(options.whiteList, options.blackList);

        // test structure
        var structureTestResults = function(structure) {
          var visitors = {}, successful = false, maxJ = 0;
          var structureNodeHandler = function(node, state) {
            if (successful) {
              return;
            }
            var j = 0;
            state.forEach(function(node) {
              if (node.type === structure[j]) {
                j++;
                maxJ = Math.max(maxJ, j);
              }
              if (j === structure.length) {
                successful = true;
                return;
              }
            });
          };

          structure.forEach(function (nodeType) {
            visitors[nodeType] = structureNodeHandler;
          });

          walk.ancestor(parsed, visitors);

          var missing = successful ? [] : structure.slice(maxJ, structure.length);
          return {
            missingFromStructure: missing,
          };
        }(options.structure);

        var failed = {};
        if (listsTestResults.missingFromWhiteList.length !== 0) {
          failed.whiteList = listsTestResults.missingFromWhiteList;
        }
        if (listsTestResults.presentInblackList.length !== 0) {
          failed.blackList = listsTestResults.presentInblackList;
        }
        if (structureTestResults.missingFromStructure.length !== 0) {
          failed.structure = structureTestResults.missingFromStructure;
        }

        var ret = {};
        if (Object.keys(failed).length === 0) {
          ret.success = true;
        } else {
          ret.success = false;
          ret.failed = failed;
        }
        // console.log("failed "+failed);
        return ret;
      };

      exports.test = test;

      var simpleWalkNodeHandler = function(inputArray, outputArray) {
        var isOutputArrayFull = false;
        return function(node, scope) {
          if (isOutputArrayFull) {
            return;
          }
          var nodeName = node.type;
          if (!outputArray.contains(nodeName)) {
            if (outputArray.push(nodeName) === inputArray.length) {
              isOutputArrayFull = true;
            }
          }
        };
      };

      Array.prototype.contains = function (v) {
        return this.indexOf(v) > -1;
      };

      Array.prototype.union = function (other) {
        var union = [], self = this.slice(0);
        other.forEach(function(v) {
          if (self.contains(v)) {
            union.push(v);
          }
        });
        return union;
      };

      function has(obj, propName) {
        return Object.prototype.hasOwnProperty.call(obj, propName);
      }

      function unique(a) {
        return a.sort().filter(function(item, pos) {
          return !pos || item != a[pos - 1];
        });
      }

});
