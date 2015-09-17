var React = require('react-native');
var Icons = require('react-native-icons');

var ToDoRow = require('./../components/ToDoRow');

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
  onPressSelectAll: function() {
    console.log(arguments);
  },
  onTextFieldChange: function(text) {
    console.log(text);
  },
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','']),
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          todos
        </Text>
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}> 
            <TouchableOpacity
              style={styles.touchableAreaIcon} 
              onPress={() => this.onPressSelectAll()}
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
              style={styles.textInput}
              onChangeText={(text) => this.onTextFieldChange({text})}
              clearTextOnFocus={true}
              autoCorrect={false}
              placeholder={config.form.inputPlaceholderText}
              value={this.state.text}
            />
          </View>
          <ListView
            style={styles.todoListView}
            initialListSize={15}
            dataSource={this.state.dataSource}
            // renderRow={(rowData) => this.renderToDoRow(rowData)}
            renderRow={function renderToDoRow() {return (<ToDoRow />)}}
            // http://stackoverflow.com/questions/29496054/react-native-listview-leaving-space
            automaticallyAdjustContentInsets={false}
            // bounces={false}
          />
        </View>
      </View>
    );
  },
  renderToDoRow: function(todo) {
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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontFamily: 'Helvetica Neue',
    fontWeight: '100',
    fontSize: 80,
    textAlign: 'center',
    color: '#ead7d7',
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
    alignSelf: 'center'
  },
  selectAllIcon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    marginRight: 15,        
    
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
