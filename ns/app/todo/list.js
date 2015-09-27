var application = require("application");

var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var viewModule = require("ui/core/view");

var textFieldModule = require("ui/text-field");
var enums = require("ui/enums");

var todos = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();

var page;
var textInputRef;

function notificationObserverCallback() {
	setTimeout(function() {
		viewModule.getViewById(page, 'textInput').focus();
		todos.unshift({ name: pageData.get("todo") });
		pageData.set("todo", "");
	}, 1);
}

exports.onLoaded = function(args) {
    page = args.object;
    // pageData.set("task", "");
    
    pageData.set("todos", todos);
    
    page.bindingContext = pageData;
    textInputRef = viewModule.getViewById(page, 'textInput');
    application.ios.addNotificationObserver('UITextFieldTextDidEndEditingNotification', notificationObserverCallback);
};