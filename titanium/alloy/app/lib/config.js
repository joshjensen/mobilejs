module.exports = {
	form: {
		inputPlaceholderText: 'What needs to be done?'	
	},
	rowTypes: {
		done: {
    	isChecked: true,
      lineThrough: 'line-through',
      icon: '',
      iconColor: '#25c73a',
      leftSwipeButtons: [{
        text: 'Undo',
        backgroundColor: "#737373"
      }]         
    },
		notDone: {
			isChecked: false,
    	lineThrough: 'none',
    	icon: '',
    	iconColor: '#737373',
    	leftSwipeButtons: [{
      		text: 'Done',
      		backgroundColor: "#4ad757"
    	}]        
    }
	}
}