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

        // TODO: This should be done in a cross-platform-friendly way so it just works on Android.
        // I need to do some digging into the necessary syntax to use though.
        application.ios.addNotificationObserver("UITextFieldTextDidEndEditingNotification", addTodo);

        // TODO: This solution is very specific to deleting and doesn't handle other swipe actions.
        // UI for NativeScript has a built-in solution for this coming in the next week or so.
        // If I get my hands on it in time I can throw that in here.

        // TODO: Implement an Android deleting solution.
        // What are your thoughts on trash can icons? http://docs.nativescript.org/getting-started#deleting-from-a-list---android
        var listView = page.getViewById("listView");
        swipeDelete.enable(listView, function(index) {
            todos.splice(index, 1);
        });
    }
};

function addTodo() {
    page.getViewById("textInput").focus();
    todos.unshift({ name: pageData.get("todo") });
    pageData.set("todo", "");
}