/**
* @jsx React.DOM
*/

var React = require('react'),
Router = require('react-router'),
Route = Router.Route,
Routes = Router.Routes,
Redirect = Router.Redirect,
DefaultRoute = Router.DefaultRoute,

Demo = require('./components/pages/demo.jsx');

var AppRoutes = (
  // <Routes scrollBehavior="scrollToTop">
  <Route name="demo" path="/" handler={Demo} />

);

module.exports = AppRoutes;
