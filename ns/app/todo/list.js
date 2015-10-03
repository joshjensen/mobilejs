var application = require("application");

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var _ = require('underscore');
var swipeDelete = require("../utils/ios-swipe-delete");
var config = require('./../config');

var topmost;

// Shared Exports
var rowOnPress;
var onPressCheckbox;
var markAllAsDoneOnTap;

exports.navigatedTo = function(args) {
  var page = args.object;
  var todoItems;

  var pageData = new observableModule.Observable();
  page.bindingContext = pageData;

  var listView = page.getViewById("listView");

  if (!topmost) {
    topmost = frameModule.topmost();
  }

  pageData.set("showBack", topmost.canGoBack());

  if (args.object.todoItems) {
    todoItems = args.object.todoItems;
  } else {
    if (page.navigationContext && page.navigationContext.todoItems) {
      pageData.set("showBack", true);
      todoItems = page.navigationContext.todoItems;
    } else {
      todoItems = new observableArray.ObservableArray([]);
    }
    args.object.todoItems = todoItems;
  }

  pageData.set("todoItems", todoItems);

  if (page.ios) {
    var iosFrame = frameModule.topmost().ios;
    iosFrame.navBarVisibility = "never";
    iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.96, 0.96, 0.96, 1);

    // TODO: Replace with a "returnKey" listener in 1.4.
    // See https://github.com/NativeScript/sample-Groceries/issues/17
    application.ios.addNotificationObserver("UITextFieldTextDidEndEditingNotification", createRow);

    // TODO: This solution is very specific to deleting and doesn't handle other swipe actions.
    // UI for NativeScript has a built-in solution for this coming in the next week or so.
    // If I get my hands on it in time I can throw that in here.
    
    swipeDelete.enable(listView, function(index) {
        todoItems.splice(index, 1);
    });
  }
    
  function updateRowChildren(rowID, children) {
    if (todoItems.getItem(rowID)) {
      var item = todoItems.getItem(rowID);
      item.children = children;
      todoItems.setItem(rowID, item);
    }
  }

  function createRow(args) {
    var text = pageData.get('textInput');
    if (text) {
      page.getViewById("textInput").focus();

      todoItems.unshift(_.extend({
        text: text,
        children: new observableArray.ObservableArray([])
      }, config.rowTypes.notDone));

      if (page.navigationContext && page.navigationContext.updateRowChildren) {
        page.navigationContext.updateRowChildren(page.navigationContext.rowID, todoItems);
      }        
      
      pageData.set("textInput", "");
    }
  }

  markAllAsDoneOnTap = function () {
    function markAllAsDone(_todoItems) {
      _todoItems.forEach(function(item, index) {
        console.log('test');
        if (item.children && item.children.length > 0) {
          item.children = markAllAsDone(item.children);
        }

        // ObservableArray's support JS Array.prototype methods
        _todoItems.setItem(index, _.extend({
          text: item.text,
          children: item.children
        }, config.rowTypes.done));         
      });

      return _todoItems;
    }

    todoItems = markAllAsDone(todoItems);
    args.object.todoItems = todoItems;
  };    

  rowOnPress = function(args) {
    topmost.navigate({
      moduleName: "todo/list",
      context: {
        rowID: args.index,
        updateRowChildren: updateRowChildren,
        todoItems: todoItems.getItem(args.index).children
      }
    });        
  }

  onPressCheckbox = function(args) {
    var currentItem = args.view.bindingContext;

    var index = todoItems.indexOf(currentItem);
    var toUpdate = {};
    
    if (currentItem.isChecked) {
        toUpdate = config.rowTypes.notDone;
    } else {
        toUpdate = config.rowTypes.done; 
    }     

    todoItems.setItem(index, _.extend({
        text: currentItem.text,
        children: currentItem.children
    }, toUpdate));
  };

};

exports.onBackTap = function() {
  if (topmost && topmost.canGoBack()) {
    topmost.goBack();
  }
};

exports.markAllAsDoneOnTap = function() {
  markAllAsDoneOnTap.apply(this, arguments);
}

exports.rowOnPress = function() {
  rowOnPress.apply(this, arguments);
};

exports.onPressCheckbox = function() {
  onPressCheckbox.apply(this, arguments);
};