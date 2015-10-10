var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} = React;

var todomjs = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.topLevelNavigator}
        navigationBarHidden={true}
        initialRoute={{
          title: '',
          component: require('./app/pages/list')
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
