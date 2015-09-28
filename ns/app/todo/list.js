var application = require("application");

var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var viewModule = require("ui/core/view");

var todos = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();

var page;
var topmost;
var textInputRef;

function notificationObserverCallback() {
	setTimeout(function() {
		viewModule.getViewById(page, 'textInput').focus();
		todos.unshift({ name: pageData.get("todo") });
		pageData.set("todo", "");
	}, 1);

	var navigationEntry = {
	    moduleName: "todo/list",
	    context: {info: "something you want to pass to your page"},
	    animated: true
	};
	topmost.navigate(navigationEntry);

}

exports.onLoaded = function(args) {
    page = args.object;
    topmost = frameModule.topmost(); 
	
	var iosFrame = frameModule.topmost().ios;
	if (iosFrame) {
		iosFrame.navBarVisibility = 'never';
		iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.96, 0.96, 0.96, 1);
	}
    
    pageData.set("todos", todos);
    
    page.bindingContext = pageData;
    textInputRef = viewModule.getViewById(page, 'textInput');
    application.ios.addNotificationObserver('UITextFieldTextDidEndEditingNotification', notificationObserverCallback);
};