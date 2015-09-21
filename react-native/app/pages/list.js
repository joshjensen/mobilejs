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
  getInitialState: function() {
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.rowID !== r2.rowID});

      // var useArray = [];
      //   for (var i = 0; i < 100; i++) {
      //     useArray.push({
      //       text: 'Lorem ipsum Amet voluptate in reprehenderit commodo commodo ut nulla elit officia culpa nostrud cillum in et pariatur dolore et amet minim reprehenderit veniam fugiat Duis nulla ut Ut dolore nulla dolor eu in ut dolor nostrud fugiat veniam occaecat minim incididunt qui sint sit fugiat amet ea cillum nisi dolore qui voluptate non dolore ut laboris dolor dolor ut sed veniam ea eiusmod magna aute ea officia commodo amet veniam ex laborum esse occaecat mollit irure id exercitation aliqua sunt incididunt est et ut aute nisi consectetur ex quis culpa ex ea in sed culpa aliqua dolor aliquip sint quis nisi dolore anim laboris nostrud veniam enim eu Duis ad deserunt est laborum dolore labore quis sit ut consectetur minim deserunt laborum minim fugiat dolore eu eu in sit aute ad Excepteur proident non dolore quis non sit elit incididunt reprehenderit Excepteur commodo non et adipisicing aute sint ex id do amet id velit anim ex minim Duis aute pariatur tempor in do ex consectetur minim voluptate commodo non veniam consequat non dolor ex do minim consectetur deserunt ullamco culpa irure in non incididunt aliqua occaecat ullamco dolor voluptate.,',
      //       isChecked: false,
      //       lineThrough: 'none',
      //       icon: 'fontawesome|square-o',
      //       iconColor: '#737373',
      //       leftSwipeButtons: [{
      //         text: 'Done',
      //         backgroundColor: "#4ad757"
      //       }]          
      //     });
      //   };

    // console.log(this.ds);
    return {
      todoItems: [],
      dataSource: this.ds.cloneWithRows([]),
    };
  },
  onPressSelectAll: function() {
    console.log(arguments);
  },  
  onTextInputChange: function(e) {
    // this.setState({
    //   todo: e.text
    // });
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

    this.state.todoItems.unshift({
      rowID: new Date().getTime(),
      text: e.nativeEvent.text,
      isChecked: false,
      lineThrough: 'none',
      icon: 'fontawesome|square-o',
      iconColor: '#737373',
      leftSwipeButtons: [{
        text: 'Done',
        backgroundColor: "#4ad757"
      }]          
    });
    
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

    this.state.todoItems[params.id] = params;
  },
  deleteRow: function(rowID) {
    this.state.todoItems.splice(rowID, 1);

    this.setState({
      dataSource: this.ds.cloneWithRows(this.state.todoItems)
    });
  },  
  componentDidMount: function() {
    // this._textInput.focus();
    this.refs.textInput.focus();

  },  
  render: function() {
    return (
      <View style={styles.container}>
        <Text 
          style={styles.header}>
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
            renderRow={(rowData, sectionID, rowID, highlightRow) => (<ToDoRow updateRow={this.updateRow} deleteRow={this.deleteRow} rowData={rowData} rowParams={{sectionID, rowID, highlightRow}} />)}
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
    height: 60,
    width: 60,
    justifyContent: 'center'    
  },
  selectAllIcon: {
    alignSelf: 'center',
    width: 20,
    height: 20  
    
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
