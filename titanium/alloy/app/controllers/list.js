var config = require('config');
var application = require('application');

(function initialize(args) {
	$.todoItems = args.todoItems || [];

	application.addPage($.getView());

  $.textInput.focus();

  $.todoTable.setData([Alloy.createController('todorow', _.extend({
      rowID: new Date().getTime(),
      text: 'Lorem ipsum Nostrud in voluptate. Lorem ipsum Nostrud in voluptate. Lorem ipsum Nostrud in voluptate. Lorem ipsum Nostrud in voluptate. Lorem ipsum Nostrud in voluptate. Lorem ipsum Nostrud in voluptate.',
      children: []
    }, config.rowTypes.notDone)).getView()]);

})(arguments[0]);

function createRow(text) {
    $.todoItems.unshift(_.extend({
      rowID: new Date().getTime(),
      text: text,
      children: []
    }, config.rowTypes.notDone));
}

function updateItems(items) {
  $.todoListSection.setItems(items);
}