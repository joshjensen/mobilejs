var application = require('application');


application.mainModule = 'todo/list';
application.cssFile = './app.css';

if (application.ios) {
  var fontModule = require('ui/styling/font');
  fontModule.ios.registerFont('fontawesome-webfont.ttf');
}

application.start();
