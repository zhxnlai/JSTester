/** @jsx React.DOM */
var React = require('react');
var LocalStorageMixin = require('react-localstorage');
var CodeMirror = require('react-code-mirror');
require('codemirror/mode/javascript/javascript');

var JSTester = require('../../../../../src/JSTester.js');

var Demo = React.createClass({
  mixins: [LocalStorageMixin],

  getInitialState: function() {
    return {
      inputText: "var a1 = 1;\nvar a2 = \"a\";\n\n\nif (1===1) {\n  var a = [1,2,3,4];\n  for (b in a) {\n    var answer = 6 * 7;\n\n  }\n\n}\n\n",
      optionsText: "{\n\t\"whiteList\": [\"VariableDeclaration\", \"IfStatement\", \"ForInStatement\"],\n    \"blackList\": [],\n    \"structure\": [\"IfStatement\", \"ForInStatement\"]\n }",
      outputText: "//Output",
    };
  },
  onInputTextChange: function(e) {
    this.setState({inputText: e.target.value});


  },
  onOptionsTextChange: function(e) {
    this.setState({optionsText: e.target.value});
  },
  onOutputTextChange: function(e) {
    this.setState({outputText: e.target.value});
  },
  onTestButtonClick: function(e) {
    var opts = JSON.parse(this.state.optionsText);
    var output = JSTester.test(this.state.inputText, opts);
    console.log("output: "+JSON.stringify(output));
    this.setState({outputText: JSON.stringify(output, null, "\t")});
  },
  onResetButtonClick: function(e) {
    this.setState(this.getInitialState());
  },

  render: function() {
    return (
      <div className="demo-page">
        <div className="demo-page-content pure-g">
          <div className="pure-u-1">
            <h2 className="nav-title">JSTester Demo</h2>
            <button className="nav-button pure-button pure-button-primary" onClick={this.onTestButtonClick} >Test</button>
            <button className="nav-button pure-button" onClick={this.onResetButtonClick} >Reset</button>
          </div>
          <div className="pure-u-1 description">
            <h3>Usage</h3>
            <p>JSTester.test(input, options) <br/>
            input should be a string containing the program to be tested. The test will fail if the program has syntax error.<br/>
            options can not be empty. It can be configured to test whitelist, blacklist and structure.<br/>
            see <a href="https://github.com/zhxnlai/JSTester">here</a> for more details
            </p>
          </div>
          <div className="pure-u-1">
            <div className="pure-u-1-2 left-panel">
              <div className="input-container">
                <h3>Input</h3>
                <CodeMirror className="editor" onChange={this.onInputTextChange} value={this.state.inputText} lineNumbers={true} mode="javascript" theme='monokai'/>
              </div>
            </div>
            <div className="pure-u-1-2 right-panel">
              <div className="pure-u-1">
                <div className="options-container">
                  <h3>Options</h3>
                  <CodeMirror className="editor" onChange={this.onOptionsTextChange} value={this.state.optionsText} lineNumbers={true} mode="application/json" theme='monokai'/>
                </div>
              </div>

              <div className="pure-u-1">
                <div className="output-container">
                  <h3>Output</h3>
                  <CodeMirror className="editor" onChange={this.onOutputTextChange} value={this.state.outputText} lineNumbers={true} mode="text/javascript" theme='monokai'/>
                </div>
              </div>

            </div>
          </div>
          <div className="footer pure-u-1">
            <div className="credit pure-u-1-2">
              <p>This is a demo site for JSTester</p>
            </div>
            <div className="github pure-u-1-2">
              <a href="https://github.com/zhxnlai/JSTester">Github</a>
            </div>
          </div>
        </div>
      </div>
      );
    }
});




module.exports = Demo;
