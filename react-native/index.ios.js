var React = require('react-native');

var ListPage = require('./app/pages/list');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} = React;

// var ListPage = require('App/Pages/List');

var todomjs = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ListPage,
          // passProps: { myProp: 'foo' },
        }}
      />      
    );
  }
});

var styles = StyleSheet.create();

AppRegistry.registerComponent('todomjs', () => todomjs);
