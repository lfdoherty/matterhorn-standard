
function preventDefaultNative(event){
	if(event.preventDefault) event.preventDefault();
	else event.returnValue = false;
}

function getPositionNative(elm){

	var x, y = 0;

	x = elm.offsetLeft;
	y = elm.offsetTop;
	elm = elm.offsetParent;

	while(elm != null){

		x = parseInt(x) + parseInt(elm.offsetLeft);
		y = parseInt(y) + parseInt(elm.offsetTop);
		elm = elm.offsetParent;
	}

	return {Top:y, Left: x};
}


function attachNativeListener(obj, eventName, listener){
	if (obj.attachEvent) {
		obj.attachEvent('on'+eventName, listener);
	}else{
		obj.addEventListener(eventName, listener, false);
	}
}

function detachNativeListener(obj, eventName, listener){
	if (obj.detachEvent) {
	    obj.detachEvent( 'on'+eventName, listener );
	} else {
	    obj.removeEventListener(eventName, listener, false );
	}
}

