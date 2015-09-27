var application = require('application');
application.mainModule = 'todo/list';

if (application.ios) {
  var fontModule = require('ui/styling/font');
  fontModule.ios.registerFont("IndieFlower.ttf");
  fontModule.ios.registerFont('fontawesome-webfont.ttf');
}

application.cssFile = './app.css';
application.start();
