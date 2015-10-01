(function initialize(args) {

  $.todoRow.rowData = args;
  $.todoRow.toggleDelete = toggleDelete;
  $.todoRow.icon = $.icon;

	$.icon.setText(args.icon || '');
	$.icon.setColor(args.iconColor || '#000');

	$.text.setText(args.text || '');

  

})(arguments[0]);

function toggleDelete() {
  if ($.deleteIcon.getVisible()) {
    $.deleteIcon.setVisible(false);
    $.deleteIcon.animate(Titanium.UI.createAnimation({
      right: 0,
      opacity: 0,
      duration: 200
    }));
    $.text.animate(Titanium.UI.createAnimation({
      right: 10,
      duration: 200
    }));

    $.todoRow.deleteIsVisible = false;
  } else {
    $.deleteIcon.setVisible(true);
    $.deleteIcon.animate(Titanium.UI.createAnimation({
      right: 10,
      opacity: 1,
      duration: 200
    }));
    $.text.animate(Titanium.UI.createAnimation({
      right: 40,
      duration: 200
    }));    
    $.todoRow.deleteIsVisible = true;
  }
}