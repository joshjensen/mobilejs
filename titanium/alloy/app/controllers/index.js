var cards = [{
	id: 'all',
	name: 'All',
	updateCard: updateCard
}, {
	id: 'active',
	name: 'Active',
	updateCard: updateCard
}, {
	id: 'completed',
	name: 'Completed',
	updateCard: updateCard
}];

(function initalize() {
	$.mainWindow.open();
	addCards();
})();

function addCards() {
	for (var i = 0; i < cards.length; i++) {
		$.mainWindow.add(Alloy.createController('card/index', cards[i]).getView());
	}
}

function updateCard(_params) {
	console.log(_params);
}
