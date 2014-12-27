JSTester
========
JSTester is a simple structure tester for JavaScript programs.

Demo
---
You can find a demo at http://zhxnlai.github.io/JSTester.

Usage
---
~~~javascript
JSTester.test(input, options)
~~~
### input
`input` should be a string containing the program to be tested. It will be parsed by [acorn](https://github.com/marijnh/acorn) and the test will fail if the program has syntax errors.

### options
`options` is an object and can not be empty. The available options are `whiteList`, `blackList` and `structure`. You can get an array of available options at `JSTester.validOptions`. The value of a option should an array of node types from the [Mozilla Parser API specification](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API). You can get the supported node types at `JSTester.validNodeTypes`.

`whiteList` means that the program **MUST** use functionalities represented by the node types in the supplied array.
`blackList` means that the program **MUST NOT** use functionalities represented by the node types in the supplied array.
`structure` means that the program **MUST** have a rough structure represented by the node types in the supplied array.

Here is an example:
~~~json
{
  "whiteList": ["ForStatement", "VariableDeclaration"],
  "blackList": ["WhileStatement", "IfStatement"],
  "structure": ["ForStatement","IfStatement"]
}
~~~
This would mean that the program MUST use a 'for loop' and a 'variable declaration', MUST NOT use a 'while loop' or an 'if statement' and that there should be a 'for loop' and inside of it there should be an 'if statement'.

###output
The return value will be an object. `output.success` will be a boolean specifying whether the test is performed successfully and the program has passed the test.

If an error occurs, `output.success` will be set to `false` and `output.error` will be set to a string specifying the error description. Here is an example output with error:
~~~json
{
  "success": false,
  "error": "options is empty or no valid options"
}
~~~

If no error occurs and the program failed the test, `output.success` will be set to `false` and `output.failed` will be set to an object describing the test result. Here is an example:
~~~json
{
  "success": false,
  "failed": {
    "whiteList": [
      "ForStatement"
    ]
  }
}
~~~
This would mean that the program does not have a 'for statement'.

Testing
---
Unit tests with [Mocha](https://github.com/mochajs/mocha) and [should.js](https://github.com/tj/should.js) are available in the test.js file. You can run tests by executing `$ Mocha` in the `./src` folder.
