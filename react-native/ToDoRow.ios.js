var React = require('react-native');

var {
	View,
	Text,
	StyleSheet
} = React;

var ToDoRow = React.createClass({
	render: function() {
		return (
      		<View style={styles.toDoRow}>
        		<Text>
         			 Test
        		</Text>
      		</View>
		);
	}
});

var styles = StyleSheet.create({
  toDoRow: {
    flex: 1,
    margin: 0,
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'center',
    backgroundColor: '#F5FCFF',    
  }	
});

module.exports = ToDoRow;