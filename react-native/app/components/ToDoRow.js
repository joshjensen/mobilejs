var _ = require('underscore');
var React = require('react-native');
var Icons = require('react-native-icons');
var Swipeout = require('react-native-swipeout');

var config = require('./../lib/config');

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
      toUpdate = _.extend({id: rowParams.rowID}, config.rowTypes.notDone);
    } else {
      toUpdate = _.extend({id: rowParams.rowID}, config.rowTypes.done);
    }

    var newRowParams = _.extend(rowData, toUpdate);

    this.setState(newRowParams);
    this.props.rowParams.updateRow(newRowParams);
  },
  deleteRow: function() {
    this.setState({
      closed: true
    });

    this.props.rowParams.deleteRow(this.props.rowParams.rowID);
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
  rowOnPress: function() {
    this.props.rowParams.rowOnPress(this.props.rowParams.rowID);
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
            <TouchableOpacity
              style={styles.textWrapper}
              onPress={() => this.rowOnPress(this.props.rowData.rowID)}
              >
              <Text
                numberOfLines={5}
                style={this.textStyle()}
                >
                {this.props.rowData.text}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: '#ffffff',
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
