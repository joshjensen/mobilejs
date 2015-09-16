var args = arguments[0] || {};

(function initalize() {
	initEvents();
})();

function addTableRow(_params) {

}

function initEvents() {
	$.toDoInput.addEventListener('return', function(e) {
		$.toDoInput.focus();
		args.updateCard(e);
	});

	$.toDoTable.addEventListener('click', function(e) {
	});
}