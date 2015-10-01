(function initialize(args) {

  $.todoRow.rowData = args;

	$.icon.setText(args.icon || '');
	$.icon.setColor(args.iconColor || '#000');

	$.text.setText(args.text || '');

})(arguments[0]);
