/**
* @jsx React.DOM
*/

(function () {

  var React = require('react'),
  Router = require('react-router'),
  AppRoutes = require('./app-routes.jsx'),
  injectTapEventPlugin = require("react-tap-event-plugin");

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  //Render the main app component
  // React.render(AppRoutes, document.body);
  Router.run(AppRoutes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

})();
