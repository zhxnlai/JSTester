/** @jsx React.DOM */
var React = require('react');
var CodeMirror = require('react-code-mirror');
require('codemirror/mode/javascript/javascript');

// GLOBAL.jsonlint = require('jsonlint');

require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
require('codemirror/addon/lint/json-lint');

var JSTester = require('../../../../../src/JSTester.js');

var Demo = React.createClass({
  getInitialState: function() {
    return {
      inputText: "Input",
      optionsText: "Options",
      outputText: "Output",
    };
  },
  onInputTextChange: function(e) {
    this.setState({inputText: e.target.value});

    var output = JSTester.test(e.target.value, {});
    console.log("output: "+JSON.stringify(output));

  },
  onOptionsTextChange: function(e) {
    this.setState({optionsText: e.target.value});
  },
  onOutputTextChange: function(e) {
    this.setState({outputText: e.target.value});
  },
  onTestButtonClick: function(e) {

  },
  render: function() {
    return (
      <div className="demo-page">

        <div className="demo-page-content pure-g">

          <div className="pure-u-1">
            <h2 className="title-heading">JSTester Demo</h2>

            <button className="pure-button pure-button-primary" onClick={this.onTestButtonClick} >Test</button>
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
                  <CodeMirror className="editor" onChange={this.onOptionsTextChange} value={this.state.optionsText} gutters={["CodeMirror-lint-markers"]} lint={true} lineNumbers={true} mode="application/json" theme='monokai'/>
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
          </div>
        </div>
      );
    }
});




module.exports = Demo;
