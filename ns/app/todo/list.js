var application = require("application");

var frameModule = require("ui/frame");
var viewModule = require("ui/core/view");
var observableModule = require("data/observable");
var observableArray = require("data/observable-array");

var topmost;

function navigatedTo(args) {
    var page = args.object;
    var todos = new observableArray.ObservableArray([{text: 'test'}]);
    var pageData = new observableModule.Observable();

    page.bindingContext = pageData;

    if (!topmost) {
    	topmost = frameModule.topmost(); 	
    }
    
	var iosFrame = topmost.ios;
	if (iosFrame) {
		iosFrame.navBarVisibility = 'never';
		iosFrame.controller.view.window.backgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.96, 0.96, 0.96, 1);
	}
    
    if (page.navigationContext) {
    	console.log(page.navigationContext);
    }

    if (!page.navigationContext) {
		var navigationEntry = {
		    moduleName: "todo/list",
		    context: {info: "something you want to pass to your page"},
		    animated: true
		};
		topmost.navigate(navigationEntry);    	
    }

    pageData.set("todos", todos);
    
    // viewModel = page.navigationContext;
    // page.bindingContext = null;
    // page.bindingContext = viewModel;
    function notificationObserverCallback() {
        setTimeout(function() {
            viewModule.getViewById(page, 'textInput').focus();
            todos.unshift({ name: pageData.get("todo") });
            pageData.set("todo", "");
        }, 1);

        // var navigationEntry = {
        //     moduleName: "todo/list",
        //     context: {info: "something you want to pass to your page"},
        //     animated: true
        // };
        // topmost.navigate(navigationEntry);
    }    

    application.ios.addNotificationObserver('UITextFieldTextDidEndEditingNotification', notificationObserverCallback);
}
exports.navigatedTo = navigatedTo;