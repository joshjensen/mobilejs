var config = require('config');
var application = require('application');

(function initialize(args) {
	$.todoItems = args.todoItems || [];
  $.rowID = (args.rowID === false) ? false : args.rowID;
  $.updateRowChildren = args.updateRowChildren || false;

  // console.log(args);

  $.textInput.focus();
  $.todoTable.setData(buildRows($.todoItems));

  addEventListeners();
  toggleBackButton();
})(arguments[0]);

function toggleBackButton() {
  if (!$.updateRowChildren) {
    $.headerWrapper.remove($.backButton);
  }
}

function markAllAsDone() {

}

function updateChildren() {

}

function clearTextInput() {
  $.textInput.setValue('');
}

function createRow(e) {
  if (e.value && e.value !== '') {

    $.todoItems.unshift(_.extend({
      text: e.value,
      children: []
    }, config.rowTypes.notDone));
  
    $.todoTable.setData(buildRows($.todoItems));   

    if ($.updateRowChildren) {
      $.updateRowChildren($.rowID, $.todoItems);
    }
  }

  clearTextInput();
}

function buildRows(rows) {
  return _.map(rows, function(row){ 
    return Alloy.createController('todorow', row).getView();
  });
}

function updateRow() {

}

function deleteRow() {

}

function updateRowChildren(rowID, children) {
  // console.log($.todoItems);
  // console.log($.todoItems[rowID]);
  // console.log($.todoItems[rowID].rowData);
  // console.log($.todoItems[rowID].rowData.children);
  if ($.todoItems[rowID]) {
    console.log(children);
    $.todoItems[rowID].children = children;
  }  

  console.log($.todoItems[rowID]);
}

function rowOnPress(e) {
  var rowData = $.todoItems[e.index];
  var source = e.source;

  console.log(rowData);

  if (source.id === 'icon') {
    var newRowParams = {};
    if (rowData.isChecked) {
      newRowParams= config.rowTypes.notDone;
    } else {
      newRowParams = config.rowTypes.done; 
    }

    source.applyProperties({
      text: newRowParams.icon || '',
      color: newRowParams.iconColor || '#000',
    });

    e.rowData.rowData = _.extend(rowData, newRowParams);
  }

  if (source.id !== 'icon') {
    application.navWindow.openWindow(
      Alloy.createController('list', {
        rowID: e.index,
        todoItems: rowData.children || [],
        updateRowChildren: updateRowChildren
      }).getView()
    );
  }
}

function backOnPress() {
  removeEventListeners();  
  $.listWindow.close();
}

function addEventListeners() {
  $.backButton.addEventListener('click', backOnPress);
  $.todoTable.addEventListener('click', rowOnPress);
  $.textInput.addEventListener('return', createRow);
}

function removeEventListeners() {
  $.backButton.removeEventListener('click', backOnPress);
  $.todoTable.removeEventListener('click', rowOnPress);
  $.textInput.removeEventListener('return', createRow);
}



// function createRow(text) {
//     $.todoItems.unshift(_.extend({
//       rowID: new Date().getTime(),
//       text: text,
//       children: []
//     }, config.rowTypes.notDone));
// }

// function updateItems() {
//   $.todoListSection.setItems($.todoItems);
// }