JSTester
========
JSTester is a simple structure tester for JavaScript programs.

Usage
---
~~~javascript
JSTester.test(input, options)
~~~
`input` should be a string containing the program to be tested. The test will fail if the program has syntax errors.

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
