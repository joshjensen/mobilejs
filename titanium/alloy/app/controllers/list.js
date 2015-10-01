var config = require('config');
var application = require('application');

(function initialize(args) {
	$.todoItems = args.todoItems || [];
  $.rowID = (args.rowID === false) ? false : args.rowID;
  $.updateRowChildren = args.updateRowChildren || false;

  $.todoTable.setData(buildRows($.todoItems));

  addEventListeners();
  toggleBackButton();

  setTimeout(function() {
    $.textInput.focus();
  }, 1);
})(arguments[0]);

function toggleBackButton() {
  if (!$.updateRowChildren) {
    $.headerWrapper.remove($.backButton);
  }
}

function markAllAsDone() {

  function markAllAsDone(todoItems) {
    _.each(todoItems, function(item, index) {
      if (item.children && item.children.length > 0) {
        item.children = markAllAsDone(item.children);
      }

      todoItems[index] = _.extend(item, config.rowTypes.done);
    });

    return todoItems;
  }

  $.todoItems = markAllAsDone($.todoItems);
  $.todoTable.setData(buildRows($.todoItems)); 

  updatedTodoRows = null;
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
    
    $.textInput.focus();
  }

  clearTextInput();
} 

function buildRows(rows) {
  return _.map(rows, function(row){ 
    return Alloy.createController('todorow', row).getView();
  });
}

function updateRow(rowID, params) {
  if (rowID === false) {
    return;
  }

  var thisRow = $.todoItems[rowID];

  if (thisRow.children && thisRow.children.length > 0) {
    function toggelAllChildren(childTodoItems) {
      _.each(childTodoItems, function(item, index) {
        if (item.children && item.children.length > 0) {
          item.children = toggelAllChildren(item.children);
        }

        childTodoItems[index] = _.extend(item, _.omit(params, 'id', 'rowID', 'text', 'children'));
      });

      return childTodoItems;
    };

    thisRow.children = toggelAllChildren(thisRow.children);
  }

  $.todoItems[rowID] = _.extend(thisRow, params);
}

function onPressCheckbox(rowData, e) {
  var toUpdate = {};
  if (rowData.isChecked) {
    toUpdate = config.rowTypes.notDone;
  } else {
    toUpdate = config.rowTypes.done; 
  }

  e.row.icon.applyProperties({
    text: toUpdate.icon || '',
    color: toUpdate.iconColor || '#000',
  });

  newRowParams = _.extend(rowData, toUpdate);

  e.rowData.rowData = newRowParams;
  updateRow(e.index, newRowParams)  
}

function deleteRow(e) {
  $.todoItems.splice(e.index, 1);   
  $.todoTable.setData(buildRows($.todoItems));
}

function updateRowChildren(rowID, children) {
  if ($.todoItems[rowID]) {
    $.todoItems[rowID].children = children;
  }
}

function rowOnPress(e) {
  var rowData = $.todoItems[e.index];
  var source = e.source;

  if (source.id === 'icon') {
    onPressCheckbox(rowData, e);
    return;
  }

  if (source.id === 'deleteIcon') {
    deleteRow(e);
    return;    
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

function onSwipe(e) {
  console.log(e);
  console.log(JSON.stringify(e.row));
  console.log(JSON.stringify(e.row.children));

  if (e.direction === 'right' && e.row.deleteIsVisible) {
    e.row.toggleDelete();
  }

  if (e.direction === 'right' && !e.row.deleteIsVisible) {
    var rowData = $.todoItems[e.index];

    onPressCheckbox(rowData, e); 
  }

  if (e.direction === 'left') {
    e.row.toggleDelete();  
  }
  
}

function addEventListeners() {
  $.backButton.addEventListener('click', backOnPress);
  $.selectAllIcon.addEventListener('click', markAllAsDone);
  $.todoTable.addEventListener('singletap', rowOnPress);
  $.textInput.addEventListener('return', createRow);
  $.todoTable.addEventListener('swipe', onSwipe);
}

function removeEventListeners() {
  $.backButton.removeEventListener('click', backOnPress);
  $.selectAllIcon.removeEventListener('click', markAllAsDone);
  $.todoTable.removeEventListener('singletap', rowOnPress);
  $.textInput.removeEventListener('return', createRow);
  $.todoTable.removeEventListener('swipe', onSwipe);
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