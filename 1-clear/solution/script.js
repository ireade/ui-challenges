/*

  THINGS TO NOTE
		- Each task list item has a class of .task
		- When the task is being swiped right, try adding the class of .completing
		- When the task is being swiped left, try adding the class of .deleting
		- A completed task should have a class of .completed
    
    - The check and crosses are added as :before and :after pseudo-elements of the .task li so you don't need to add them
    
      GOOD LUCK!

*/


var tasks = document.getElementsByClassName("task");


/* ***************

	HELPER FUNCTIONS

*************** */

/* FUNCTION TO GET CURRENT MARGIN OF ELEMENT 
   (ALSO CONVERT TO % MARGIN IF IN PIXELS) */
function getCurrentMargin(element) {

	var currentMargin = element.style.marginLeft;

	if ( currentMargin.indexOf("px") > -1 ) {
		// Convert px margin to percentage 
		currentMargin = currentMargin.split("px")[0];
		var marginInPercentage = ( currentMargin / element.offsetWidth ) * 100;
		currentMargin = marginInPercentage;

	} else if ( currentMargin.indexOf("%") > -1 ) {
		currentMargin = currentMargin.split("%")[0];

	} else {
		currentMargin = 0;
	}

	return parseInt(currentMargin);
}



/* FUNCTION TO HANDLE SWIPING OF LIST ELEMENTS  */
function swipeElement(elementID, swipingRight, swipingIn) {

	var element = document.getElementById(elementID);

	// Swiping an element out - marking as completed or done
	function swipeElementOut() {
		var currentMargin = getCurrentMargin(element),
			currentMargin = swipingRight ? currentMargin += 1 : currentMargin -= 1;
	
		element.style.marginLeft = currentMargin + '%';

		if ( currentMargin == 100 | currentMargin == -100 ) {
			
			clearInterval(interval);

			// Either append completed item to bottom or delete item
			swipingRight ? appendCompletedItem(element) : element.remove();
		}
	}

	// Swiping an element in - appending completed item to list
	function swipeElementIn() {
		var currentMargin = getCurrentMargin(element);
			currentMargin -= 1;

		element.style.marginLeft = currentMargin + '%';

		if ( currentMargin == 0 ) { clearInterval(interval); }
	}

	var interval = swipingIn ? setInterval(swipeElementIn, 5) : setInterval(swipeElementOut, 5);
}


/* FUNCTION TO HANDLE ADDING COMPLETED ITEM TO BOTTOM OF LIST */
function appendCompletedItem(element) {
	element.classList.remove('completing');
	element.classList.add('completed');

	document.getElementsByClassName("task-list")[0].appendChild(element);

	swipeElement(element.id , false, true);
}




/* ***************

	EVENT LISTENER HANDLERS

*************** */

/* HANDLE WHEN MOUSE MOVES */
var handleMouseMove = function(event) {

	if ( cursorXPosition === 0 ) { cursorXPosition = event.x; }

	// Set the margin-left of the list item to move with the mouse
	cursorXPositionDiff = event.x - cursorXPosition;
	event.target.style.marginLeft = cursorXPositionDiff + 'px';

	var taskIsNotCompleted = !(event.target.className.indexOf("completed") > -1);

	// ADD CLASS IF THE cursorXPositionDiff GETS TO A CERTAIN AMOUNT
	if ( cursorXPositionDiff > 40 && taskIsNotCompleted ) {
		event.target.classList.add('completing');

	} else if ( cursorXPositionDiff < -40 ) {
		event.target.classList.add('deleting');

	} else {
		event.target.classList.remove('completing');
		event.target.classList.remove('deleting');
	} 
}


/* HANDLE WHEN MOUSE IS RELEASED */
var handleMouseUp = function(event) {

	var className = event.target.className;

	if ( className.indexOf('completing') > -1 ) {
		// SWIPE AWAY CURRENT LIST ITEM (RIGHT)
		swipeElement(event.target.id, true);

	} else if ( className.indexOf('deleting') > -1 ) {
		// SWIPE AWAY CURRENT LIST ITEM (LEFT)
		swipeElement(event.target.id, false);

	} else {
		// REPOSITION LIST ITEM BACK TO NORMAL POSITION
		event.target.style.marginLeft = "";
	}

	this.removeEventListener("mousemove", handleMouseMove, false);
	addMouseDownEventListener();
}




/* ***************

	ADD EVENT LISTENERS

*************** */

function addMouseDownEventListener() {

	// Reset values to use in handleMouseMove()
	cursorXPosition = 0;
	cursorXPositionDiff = 0;

	// Loop through all tasks and add the event listener to each
	for ( var i = 0; i < tasks.length; i++ ) {
		tasks[i].addEventListener("mousedown", function(event) {
			this.addEventListener("mousemove", handleMouseMove, false);
			this.addEventListener("mouseup", handleMouseUp, false);
		})
	}

}



/* ***************

	INIT

*************** */

var cursorXPosition = 0;
var cursorXPositionDiff = 0;

// Add IDs to all Task Items
for ( var i = 0; i < tasks.length; i++ ) {
	tasks[i].id = "task_" + i;
}

addMouseDownEventListener();
