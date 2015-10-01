var _ = require('underscore');
var React = require('react-native');
var Icons = require('react-native-icons');

var TodoRow = require('./../components/todorow');
var config = require('./../lib/config');

var { Icon } = Icons;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ListView
} = React;

var ListPage = React.createClass({
  getInitialState: function() {
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.rowID !== r2.rowID});

    return {
      todoItems: this.props.todoItems || [],
      dataSource: this.ds.cloneWithRows(this.props.todoItems || []),
    };
  },
  markAllAsDone: function() {
    var that = this;

    function markAllAsDone(todoItems) {
      _.each(todoItems, function(item, index) {
        if (item.children && item.children.length > 0) {
          item.children = markAllAsDone(item.children);
        }

        todoItems[index] = _.extend(item, config.rowTypes.done);
      });

      return todoItems;
    }

    var updatedTodoRows = markAllAsDone(this.state.todoItems);

    this.setState({
      todoItems: updatedTodoRows,
      dataSource: this.ds.cloneWithRows(updatedTodoRows)
    });

    updatedTodoRows = null;
  },  
  updateChildren: function() {
    function updateChildren(todoItem) {
      _.each(todoItem, function(item, index) {
        if (item.children && item.children.length > 0) {
          item.children = updateChildren(item.children);
        }

        todoItem[index] = _.extend(item, config.rowTypes.notDone);
      });

      return todoItem;
    }
  },
  onTextInputChange: function(e) {
  },
  clearTextInput: function() {
    this.refs.textInput.setNativeProps({text: ''});

    var that = this;
    setTimeout(function() {
      that.refs.textInput.focus();
    }, 1);    
  },
  createRow: function(e) {
    if (!e.nativeEvent.text || e.nativeEvent.text === '') {
      return false;
    }

    this.state.todoItems.unshift(_.extend({
      rowID: new Date().getTime(),
      text: e.nativeEvent.text,
      children: []
    }, config.rowTypes.notDone));
  
    if (this.props.updateRowChildren) {
      this.props.updateRowChildren(this.props.rowID, this.state.todoItems);
    }

    this.setState({
      dataSource: this.ds.cloneWithRows(this.state.todoItems)
    }, function() {
      this.clearTextInput();
    });    
  },
  updateRow: function(params) {
    if (!params.id) {
      return;
    }

    var thisRow = this.state.todoItems[params.id];

    if (thisRow.children && thisRow.children.length > 0) {
      function toggelAllChildren(childTodoItems) {
        _.each(childTodoItems, function(item, index) {
          if (item.children && item.children.length > 0) {
            item.children = toggelAllChildren(item.children);
          }

          childTodoItems[index] = _.extend(item, _.omit(params, 'id', 'rowID', 'text', 'children'));
        });

        return childTodoItems;
      };

      thisRow.children = toggelAllChildren(thisRow.children);
    }

    this.state.todoItems[params.id] = _.extend(thisRow, params);


  },
  deleteRow: function(rowID) {
    this.state.todoItems.splice(rowID, 1);

    if (this.props.updateRowChildren) {
      this.props.updateRowChildren(this.props.rowID, this.state.todoItems);   
    }
    
    this.setState({
      dataSource: this.ds.cloneWithRows(this.state.todoItems)
    });
  },  
  updateRowChildren: function(rowID, children) {
    if (this.state.todoItems[rowID]) {
      this.state.todoItems[rowID].children = children;
    }
  },
  rowOnPress: function(rowID) {
    this.props.navigator.push({
      title: '',
      component: require('./list'),
      passProps: {
        rowID: rowID,
        showBack: true,
        todoItems: this.state.todoItems[rowID].children,
        updateRowChildren: this.updateRowChildren
      }
    });
  },
  backOnPress: function() {
    this.props.navigator.pop();
  },
  renderBackButton: function() {
    if (this.props.showBack) {
      return (
        <TouchableOpacity
          style={styles.touchableAreaBackIcon} 
          onPress={() => this.backOnPress()}
          activeOpacity={0.2}
          >
          <Icon
            name='fontawesome|arrow-circle-o-left'
            size={30}
            color='#ead7d7'
            style={styles.backButtonIcon}
            />  
        </TouchableOpacity>
      );
    }
  },
  componentDidMount: function() {
    if (this.state.todoItems.length === 0) {
      this.refs.textInput.focus();
    }
  },  
  render: function() {
    return (
      <View style={styles.container}>
        <Text 
          style={styles.header}>
          todos
        </Text>      
        {this.renderBackButton()}        
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}> 
            <TouchableOpacity
              style={styles.touchableAreaIcon} 
              onPress={() => this.markAllAsDone()}
              activeOpacity={0.2}
              >
              <Icon
                name='fontawesome|chevron-down'
                size={18}
                color='#737373'
                style={styles.selectAllIcon}
                />  
            </TouchableOpacity>
            <TextInput
              ref="textInput" 
              // ref={component => this._textInput = component}
              style={styles.textInput}
              clearTextOnFocus={true}
              autoCorrect={false}
              placeholder={config.form.inputPlaceholderText}
              onChangeText={(text) => this.onTextInputChange({text})}
              onSubmitEditing={(e) => this.createRow(e)}
              returnKeyType='done'
            />
          </View>
          <ListView
            style={styles.todoListView}
            initialListSize={15}
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID, highlightRow) => (<TodoRow updateRow={this.updateRow} deleteRow={this.deleteRow} rowOnPress={this.rowOnPress} rowData={rowData} rowParams={{sectionID, rowID, highlightRow}} />)}
            // http://stackoverflow.com/questions/29496054/react-native-listview-leaving-space
            automaticallyAdjustContentInsets={false}
          />
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f5f5f5',
  },
  touchableAreaBackIcon: {
    height: 50,
    width: 50,
    top: 45,
    left: 10,
    justifyContent: 'center',
    position: 'absolute'
  },
  backButtonIcon: {
    alignSelf: 'center',
    width: 40,
    height: 40
  },
  headerBack: {
    fontFamily: 'Helvetica Neue',
    fontWeight: '100',
    justifyContent: 'center',
    fontSize: 20,
    textAlign: 'center',
    color: '#000'
  },  
  header: {
    fontFamily: 'Helvetica Neue',
    fontWeight: '100',
    fontSize: 80,
    textAlign: 'center',
    color: '#e7e7e7',
    marginTop: 20
  },
  wrapper: {
    borderWidth: 0.5,
    borderColor: '#B9B9B9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: {
      height: -1,
      width: -1
    },
    position: 'absolute', 
    top: 120, bottom: 10, left: 10, right: 10
  },
  formWrapper: {
    flexDirection: 'row',
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1
  },
  touchableAreaIcon: {
    height: 60,
    width: 60,
    justifyContent: 'center'    
  },
  selectAllIcon: {
    alignSelf: 'center',
    width: 40,
    height: 40
  }, 
  textInput: {
    flex: 1,
    height: 60,
    padding: 10,
    fontFamily: 'Helvetica Neue',
    fontWeight: '100',
    fontSize: 24,
    color: '#000'    
  },
  todoListView: {
    backgroundColor: '#F5FCFF'
  },
  toDoRow: {
    flex: 1,
    margin: 0,
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'center',
    backgroundColor: '#F5FCFF',    
  }
});

module.exports = ListPage;
