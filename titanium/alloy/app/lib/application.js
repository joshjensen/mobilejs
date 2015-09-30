var listsModel = require('models/lists');

function addPage(alloyController) {
	alloyController.getView.open();
}

function removePage(alloyController) {
	alloyController.getView.close();
}

function buildListWindow(list) {
	Alloy.createController('list', {
		list: list
	});
}

exports.navWindow = null;

exports.addPage = addPage;
exports.removePage = removePage;

exports.init = function() {
	buildListWindow({
		todoItems: listsModel
	});
};