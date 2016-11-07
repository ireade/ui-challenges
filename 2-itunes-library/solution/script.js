// Source - http://stackoverflow.com/a/17567696
window.onload = function() {
(function(d){
 var
 ce=function(e,n){var a=document.createEvent("CustomEvent");a.initCustomEvent(n,true,true,e.target);e.target.dispatchEvent(a);a=null;return false},
 nm=true,sp={x:0,y:0},ep={x:0,y:0},
 touch={
  touchstart:function(e){sp={x:e.touches[0].pageX,y:e.touches[0].pageY}},
  touchmove:function(e){nm=false;ep={x:e.touches[0].pageX,y:e.touches[0].pageY}},
  touchend:function(e){if(nm){ce(e,'fc')}else{var x=ep.x-sp.x,xr=Math.abs(x),y=ep.y-sp.y,yr=Math.abs(y);if(Math.max(xr,yr)>20){ce(e,(xr>yr?(x<0?'swipeLeft':'swipeRight'):(y<0?'swipeUp':'swipeDown')))}};nm=true},
  touchcancel:function(e){nm=false}
 };
 for(var a in touch){d.addEventListener(a,touch[a],false);}
})(document);
};



/* Variables ******************* */

const cards = Array.from( document.querySelectorAll('.card') );
const initialCard = document.querySelector('[data-card-start]') || cards[0];
const innerContainer = document.querySelector('.card-container-inner');
const outerContainer = document.querySelector('.card-container-outer')

let activeCard = null;


/* Functions ******************* */

function alignActiveCard(card) {

	const halfOuterContainerWidth = outerContainer.clientWidth / 2;
	const halfCardContainerWidth = card.clientWidth / 2;
	const cardOffset = card.offsetLeft;

	const left = halfOuterContainerWidth - cardOffset - halfCardContainerWidth;
	innerContainer.style.transform = `translateX(${ left }px)`;
}

function setActiveCard(card) {
	cards.map(card => {
		card.classList.remove('js-active');
	});

	card.classList.add('js-active');
	card.focus();
	activeCard = card;
	setTimeout(() => { alignActiveCard(card) }, 1000);
}

function removeActiveCardFocus() {
	if ( !activeCard ) return;
	activeCard = null;
	cards.map(card => {
		card.classList.remove('js-active');
	});
}

function swipeCard(direction) {

	let focusedElement = document.querySelector('.card.js-active') ? activeCard : document.activeElement;
	if ( !focusedElement ) return;
	if ( !focusedElement.classList.contains('card') ) return;

	let focusedElementIndex = 0;
	for (let i = 0; i < cards.length; i++) {
		if (cards[i] === focusedElement) focusedElementIndex = i
	}

	switch(direction) {
		case 'right':
			setActiveCard( cards[focusedElementIndex - 1] );
			break;
		case 'left':
			setActiveCard( cards[focusedElementIndex + 1] );
			break;
		default:
			break;
	}

	removeActiveCardFocus();
}


/* Event Listeners ******************* */

cards.map(card => {
	card.addEventListener('keyup', function(e) {
		switch(e.keyCode) {
			case 9: // Tab
				setActiveCard(this);
				break;
			case 39: // Left Arrow
				swipeCard('left');
				break;
			case 37: // Right Arrow
				swipeCard('right');
				break;
			default:
				break;
		}
	});
	card.addEventListener('click', function(e) {	
		setActiveCard(this);
	});
})

document.body.addEventListener('swipeRight', function() {
	swipeCard('right');
});

document.body.addEventListener('swipeLeft', function() {
	swipeCard('left');
});



/* Initialise ******************* */

setActiveCard(initialCard);


