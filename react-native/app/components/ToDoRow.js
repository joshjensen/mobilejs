var React = require('react-native');
var Icons = require('react-native-icons');
var Swipeout = require('react-native-swipeout');

var _ = require('underscore');

var {
	View,
	Text,
  Icon,
  LayoutAnimation,
  TouchableOpacity,
	StyleSheet
} = React;

var { Icon } = Icons;

var ToDoRow = React.createClass({
  getInitialState: function() {
    this.rightSwipeButtons = [{
      text: 'Delete',
      backgroundColor: "#f44412",
      onPress: this.deleteRow
    }];   

    return _.extend({
      closed: false        
    }, this.props.rowData);
  },  
  onPressCheckbox: function() {
    var rowParams = this.props.rowParams;
    var rowData = this.props.rowData;

    var toUpdate = {};

    if (rowData.isChecked) {
      toUpdate = {
        id: rowParams.rowID,
        isChecked: false,
        lineThrough: 'none',
        icon: 'fontawesome|square-o',
        iconColor: '#737373',
        leftSwipeButtons: [{
          text: 'Done',
          backgroundColor: "#4ad757"
        }]                 
      }; 
    } else {
      toUpdate = {
        id: rowParams.rowID,
        isChecked: true,
        lineThrough: 'line-through',
        icon: 'fontawesome|check-square-o',
        iconColor: '#25c73a',
        leftSwipeButtons: [{
          text: 'Undo',
          backgroundColor: "#737373"
        }]             
      };
    }

    this.setState(_.extend(rowData, toUpdate));
    this.props.updateRow(this.state);
  },
  deleteRow: function() {
    this.setState({
      closed: true
    });    

    this.props.deleteRow(this.props.rowParams.rowID);    
  },
  onLeftOpen: function() {
    this.onPressCheckbox();

    this.setState({
      closed: true
    });
  },
  textStyle: function() {
    return {
      // alignSelf: 'center',
      textDecorationLine: this.props.rowData.lineThrough || 'none'
    };    
  },
	render: function() {
		return (
  		<View key={new Date().getTime()}>
        <Swipeout 
          close={this.state.closed}
          left={this.props.rowData.leftSwipeButtons}        
          right={this.rightSwipeButtons}
          onLeftOpen={this.onLeftOpen}
        >
          <View style={styles.toDoRow}>
            <TouchableOpacity
              style={styles.touchableAreaIcon} 
              onPress={() => this.onPressCheckbox()}
              activeOpacity={0.2}
              >
              <Icon
                name={this.props.rowData.icon}
                size={30}
                color={this.props.rowData.iconColor}
                style={styles.iconSquare}
                />  
            </TouchableOpacity>
            <View style={styles.textWrapper}>
              <Text 
                numberOfLines={5}
                style={this.textStyle()} 
                >
                {this.props.rowData.text}
              </Text> 
            </View>           
          </View>
        </Swipeout>        
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
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1    
  },	
  touchableAreaIcon: {
    alignSelf: 'center',
  },
  iconSquare: {
    marginTop: 2,
    marginLeft: 4,
    alignSelf: 'center',
    width: 30,
    height: 30
  },
  textWrapper: {
    width: 280,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

ToDoRow.propTypes = {
  rowParams: React.PropTypes.object.isRequired
}

module.exports = ToDoRow;