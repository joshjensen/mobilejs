var application = require("application");

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var swipeDelete = require("../utils/ios-swipe-delete");

var topmost = null;
var rowOnPress;
var toggleCheck;

exports.navigatedTo = function(args) {
    var page = args.object;
    var todoItems;

    if (args.object.todoItems) {
        todoItems = args.object.todoItems;
    } else {
        if (page.navigationContext && page.navigationContext.todoItems) {
            todoItems = page.navigationContext.todoItems;
        } else {
            todoItems = new observableArray.ObservableArray([]);
        }
        args.object.todoItems = todoItems;
    }

    var pageData = new observableModule.Observable();
    var listView = page.getViewById("listView");

    var icon = page.getViewById("icon");

    pageData.set("todoItems", todoItems);

    page.bindingContext = pageData;

    if (page.ios) {
        var iosFrame = frameModule.topmost().ios;
        iosFrame.navBarVisibility = "always";
        iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.96, 0.96, 0.96, 1);

        // TODO: Replace with a “returnKey” listener in 1.4.
        // See https://github.com/NativeScript/sample-Groceries/issues/17
        application.ios.addNotificationObserver("UITextFieldTextDidEndEditingNotification", addTodo);

        // TODO: This solution is very specific to deleting and doesn't handle other swipe actions.
        // UI for NativeScript has a built-in solution for this coming in the next week or so.
        // If I get my hands on it in time I can throw that in here.
        
        swipeDelete.enable(listView, function(index) {
            todoItems.splice(index, 1);
        });
    }

    // page.onNavigatingFrom = function() {
    //     listView.off('itemTap', rowOnPress);
    // }
    
    // listView.on('itemTap', rowOnPress);

    // icon.on('tap', function() {
    //     console.log('test');
    // });    
    
    function updateRowChildren(rowID, children) {
        if (todoItems.getItem(rowID)) {
            var item = todoItems.getItem(rowID);
            item.children = children;
            todoItems.setItem(rowID, item);
        }
    }

    function addTodo() {
        var name = pageData.get("todo");
        if (name) {
            page.getViewById("textInput").focus();
            todoItems.unshift({ name: name, done: false, children: new observableArray.ObservableArray([])});
            // args.object.todoItems = todoItems;
            if (page.navigationContext && page.navigationContext.updateRowChildren) {
                page.navigationContext.updateRowChildren(page.navigationContext.rowID, todoItems);
            }
            pageData.set("todo", "");
        }
    }

    rowOnPress = function(args) {
        console.log(args);

        frameModule.topmost().navigate({
            moduleName: "todo/list",
            context: {
                rowID: args.index,
                updateRowChildren: updateRowChildren,
                todoItems: todoItems.getItem(args.index).children
            }
        });        
    }

    toggleCheck = function(args) {
        var currentItem = args.view.bindingContext;
        var index = todoItems.indexOf(currentItem);
        todoItems.setItem(index, { name: currentItem.name, done: !currentItem.done });        
    };
};

exports.rowOnPress = function(args) {
    rowOnPress(args);
};

exports.toggleCheck = function(args) {
    toggleCheck(args);
};