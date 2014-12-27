var JSTester = require('./JSTester.js');
var should = require('should');

var inputVariableDeclaration1 = "var a1 = 1;\n";
var inputIf1 = "var b = 3;\nif (b === 2) {\n    b = 4;\n}";
var inputForIn1 = "var obj = {a:1, b:2, c:3};\n    \nfor (var prop in obj) {\n  console.log(\"o.\" + prop + \" = \" + obj[prop]);\n}\n";
var inputReturn1 = "var a = function () {\n    return \"a\";\n}";

var optionsInvalid1 = {
  "whiteList": ["ad", "IfStataement", "e.", "ForInSftatement"],
  "blackList": ["ad", "IfStatxement"]
};
var optionsInvalid2 = {
  "whiteList": ["ad", "IfStataement", "ForInSftatement"],
  "blackList": ["ad", "IfStatement"]
};

var optionsEmpty1 = {};
var optionsEmpty2 = {
  "whiteList": ["ad"],
  "blackList": ["ad", "IfStaaftdement"]
};
var optionsEmpty3 = {
  "whiteList": [],
  "blackList": []
};

// input for dedupe
var optionsDedupe1 = {
  "whiteList": ["IfStatement", "IfStatement", "VariableDeclaration"],
  "blackList": ["ForInStatement"]
};
var optionsDedupe2 = {
  "blackList": ["ForInStatement", "ForInStatement"]
};

var optionsConflict1 = {
  "whiteList": ["VariableDeclaration"],
  "blackList": ["VariableDeclaration", "ForInStatement"]
};
describe("JSTester", function() {
  describe("optionsValidation", function() {
    it("should return error when all options are invalid", function() {
      JSTester.test(inputVariableDeclaration1, optionsInvalid1).should.have.property("success", false);
    });
    it("should be able to filter invalid options", function() {
      JSTester.test(inputVariableDeclaration1, optionsInvalid2).should.have.property("success", true);
    });
    it("should be able to filter duplicates in white and black list", function() {
      JSTester.test(inputIf1, optionsDedupe1).should.have.property("success", true);
      JSTester.test(inputForIn1, optionsDedupe2).should.have.property("success", false);
    });
    it("should return error when conflicts occur", function() {
      JSTester.test(inputVariableDeclaration1, optionsConflict1).should.have.property("success", false);
    });
    it("should return error when options is empty", function() {
      JSTester.test(inputVariableDeclaration1, optionsEmpty1).should.have.property("success", false);
      JSTester.test(inputVariableDeclaration1, optionsEmpty2).should.have.property("success", false);
      JSTester.test(inputVariableDeclaration1, optionsEmpty3).should.have.property("success", false);
    });


  });
});


describe("JSTester", function() {
  describe("whiteList", function() {
    it("should be able to test a whitelist of specific functionality", function() {
      JSTester.test(inputForIn1, {whiteList: ["ForInStatement", "VariableDeclaration"]}).should.have.property("success", true);
      JSTester.test(inputForIn1, {whiteList: ["ForInStatement", "VariableDeclaration"]}).should.have.property("success", true);
      JSTester.test(inputReturn1, {whiteList: ["VariableDeclaration", "ReturnStatement"]}).should.have.property("success", true);
      JSTester.test(inputReturn1, {whiteList: ["ForInStatement", "ReturnStatement"]}).should.have.property("success", false);
      JSTester.test(inputVariableDeclaration1, {whiteList: ["ForInStatement", "ReturnStatement"]}).should.have.property("success", false);
    });
  });
});

describe("JSTester", function() {
  describe("blackList", function() {
    it("should be able to test a blacklist of specific functionality", function() {
      JSTester.test(inputForIn1, {blackList: ["ForStatement", "ReturnStatement"]}).should.have.property("success", true);
      JSTester.test(inputForIn1, {blackList: ["ForInStatement", "ReturnStatement"]}).should.have.property("success", false);
      JSTester.test(inputReturn1, {blackList: ["ForInStatement", "ReturnStatement"]}).should.have.property("success", false);
    });
  });
});


describe("JSTester", function() {
  describe("structure", function() {
    it("should be able to determine the rough structure of the program.", function() {
      JSTester.test(inputForIn1, {structure: ["ForStatement", "ReturnStatement"]}).should.have.property("success", false);
      JSTester.test(inputForIn1, {structure: ["ForInStatement", "ReturnStatement"]}).should.have.property("success", false);
      JSTester.test(inputForIn1, {structure: ["ForInStatement"]}).should.have.property("success", true);
      JSTester.test(inputReturn1, {structure: ["FunctionExpression", "ReturnStatement"]}).should.have.property("success", true);
      JSTester.test(inputReturn1, {structure: ["ReturnStatement", "FunctionExpression"]}).should.have.property("success", false);
    });
  });
});
