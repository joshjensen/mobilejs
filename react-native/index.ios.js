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
        style={styles.topLevelNavigator}
        navigationBarHidden={true}
        initialRoute={{
          title: '',
          component: ListPage
        }}
      />      
    );
  }
});

var styles = StyleSheet.create({
  topLevelNavigator: {
    flex: 1
  },
});

AppRegistry.registerComponent('todomjs', () => todomjs);
