// var listsModel = require('models/lists');

// function addPage(alloyController) {

//   exports.navWindow.openWindow(alloyController.getView());

//   // var view = alloyController.getView();
//   // view.open();
//   // view.animate(Ti.UI.createAnimation({
//   //   left: 0,
//   //   duration: 100
//   // }));
// }

// function removePage(alloyController) {
// 	alloyController.getView.close();
// }

// exports.navWindow = null;

// exports.addPage = addPage;
// exports.removePage = removePage;

exports.init = function() {
  Alloy.createController('list', {});
};