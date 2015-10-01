var application = require("application");

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var swipeDelete = require("../utils/ios-swipe-delete");

var page;
var todos = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();
pageData.set("todos", todos);

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;

    if (page.ios) {
        var iosFrame = frameModule.topmost().ios;
        iosFrame.navBarVisibility = "never";
        iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.96, 0.96, 0.96, 1);

        // TODO: Replace with a “returnKey” listener in 1.4.
        // See https://github.com/NativeScript/sample-Groceries/issues/17
        application.ios.addNotificationObserver("UITextFieldTextDidEndEditingNotification", addTodo);

        // TODO: This solution is very specific to deleting and doesn't handle other swipe actions.
        // UI for NativeScript has a built-in solution for this coming in the next week or so.
        // If I get my hands on it in time I can throw that in here.
        var listView = page.getViewById("listView");
        swipeDelete.enable(listView, function(index) {
            todos.splice(index, 1);
        });
    }
};

function addTodo() {
    var name = pageData.get("todo");
    if (name) {
        page.getViewById("textInput").focus();
        todos.unshift({ name: name, done: false });
        pageData.set("todo", "");
    }
}

exports.toggle = function(args) {
    var currentItem = args.view.bindingContext;
    var index = todos.indexOf(currentItem);
    todos.setItem(index, { name: currentItem.name, done: !currentItem.done });
}