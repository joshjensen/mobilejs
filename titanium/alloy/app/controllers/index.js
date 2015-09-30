var application = require('application');

if (OS_IOS) {
	application.navWindow = $.navWindow;
}

application.init();