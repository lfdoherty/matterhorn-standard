"use strict";

//#requires domready native

var Keys = {};


(function(){

if(typeof(isIE) === 'undefined'){
	var isChrome = navigator.userAgent.indexOf('Chrome') !== -1;
	var isIE = navigator.userAgent.indexOf('MSIE') !== -1;
	var isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
	var isSafari = navigator.userAgent.indexOf('Safari') !== -1;

	var isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;
	var isWindows = navigator.userAgent.indexOf('Windows') !== -1;
	var isLinux = navigator.userAgent.indexOf('Linux') !== -1;

}

	var specialKeys = { 27: 'esc', 9: 'tab', 32:'space', 13: 'return', 8:'backspace', 145: 'scroll', 
	    20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',
	    35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 
	    109: '-',
	    112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 
	    120:'f9', 121:'f10', 122:'f11', 123:'f12',
	    
	   // 144: 'numlock',
	 //   145: 'scrolllock',
	    
	    186: ';', 187: '=', 188: ',', 190: '.', 191: '/', 192: "`",
	    219: '[', 220: '\\', 221: ']', 222: "'"
	    	
	    , 17: 'ctrl'
	    , 16: 'shift'
	    , 18: 'alt'
	    , 224: 'ctrl'//command key for Mac
	};
/*
	var shiftNums = { "`":"~", "1":"!", "2":"@", "3":"#", "4":"$", "5":"%", "6":"^", "7":"&", 
	    "8":"*", "9":"(", "0":")", "-":"_", "=":"+", ";":":", "'":"\"", ",":"<", 
	    ".":">",  "/":"?",  "\\":"|" };
	*/
	var shiftNums = { "~":"`", "!":"1", "@":"2", "#":"3", "$":"4", "%":"5", "^":"6", "&":"7", 
			"*":"8", "(":"9", ")":"0", "_":"-", "+":"=", ":":";", "\"":"'", "<":",", 
			">":".",  "?":"/",  "|":"\\", '{':'[', '}':']'};
		
	function deshift(hk){
		if(shiftNums[hk]) return shiftNums[hk];
		return hk;
	}
	function humanize(which, keyCode, keyChar, type){
		//log('humanizing(' + which + ',' + keyCode + ',' + keyChar + ')');
		if(which === 13) return specialKeys[which]
		if(keyChar !== 0 && keyChar !== undefined){
			if(keyChar === 32 || keyChar === ' ') return specialKeys[which];
			return deshift(String.fromCharCode(which).toLowerCase());
		}
		if(isIE){
			if(type === 'keypress' && keyCode && keyCode >= 32 && keyCode < 127){
				if(keyCode === 32 || keyCode === ' ') return specialKeys[keyCode];
				return deshift(String.fromCharCode(keyCode).toLowerCase());
			}else if(type == 'keydown' || type === 'keyup'){
				return deshift(specialKeys[keyCode]) || deshift(String.fromCharCode(keyCode).toLowerCase());
			}
		}
		if(which === undefined || which === 0){
			return deshift(specialKeys[keyCode]);
		}
		if(type === 'keypress' && keyCode === 0){
			return String.fromCharCode(which).toLowerCase();
		}
		if(isMac && (type === 'keyup' || type === 'keydown') && which === 91){
			return 'ctrl';
		}
		return deshift(specialKeys[which]) || String.fromCharCode(which).toLowerCase();
	}
	function removeAny(combo){
		var comboStrs = combo.split('+');
		var anyIndex = -1;
		for(var i=0;i<comboStrs.length;++i){
			if(comboStrs[i] === 'any'){
				anyIndex = i;
				break;
			}
		}
		if(anyIndex === -1) throw 'no any found in (' + combo + ')';
		comboStrs.splice(anyIndex, 1);
		var result = comboStrs.join('+');
		return result;
	}
	function sortCombo(combo){
		 var comboStrs = combo.split('+');
		 comboStrs.sort();
		 var result = comboStrs.join('+');
		 return result;
	}
	  
	function checkValidity(type, combo, forceForSpecificBrowser){
		if(!forceForSpecificBrowser || isIE){
			if(type === 'keypress' && combo.indexOf('backspace') !== -1){
				return "IE does not provide keypress events for backspace, invalid combo (" + combo + ")";
			}else if(type === 'keypress' && combo.indexOf('ctrl') !== -1){
				return "IE does not provide keypress events for ctrl-combos, invalid combo (" + combo + ")";
			}
		}
		if(!forceForSpecificBrowser || isMac){
			if(type === 'keyup' && combo.indexOf('ctrl') !== -1){
				return "OS X does not provide keyup events for ctrl-combos, invalid combo (" + combo + ")";
			}
		}
	}
	domready(function(){
		setupKeys();
	});
	
	var down = {};
	var areDown = [];
	
	var lastEvent = {};
	
	var listeners = {keyup: {}, keydown: {}, keypress: {}};
	var anyListeners = {keyup: [], keydown: [], keypress: []};
	
	//log('setting up Keys.bind');
	Keys.bind = function(type, combo, listener, unbind, forceForSpecificBrowser){
		
		if(arguments.length < 3){
			throw 'Keys.bind needs at least three arguments: Keys.bind(event type, key combo, listener[, unbind, forceForSpecificBrowser])';
		}
		
		var check = checkValidity(type, combo, forceForSpecificBrowser);
		if(check){
			throw check;
		}
		
		var fixedCombo = sortCombo(combo.toLowerCase());
		
		if(unbind) return Keys.unbind(type, fixedCombo, listener);

		if(fixedCombo.indexOf("any") !== -1){
			var withoutAnyCombo = removeAny(fixedCombo);
			var arr = anyListeners[type];
			arr.push({matcher: withoutAnyCombo.split('+'), listener: listener});
		}else{
			var arr = listeners[type][fixedCombo];
			if(!arr){
				arr = [];
				listeners[type][fixedCombo] = arr;
			}
			if(arr.indexOf(listener) === -1) arr.push(listener);
		}
		
		//log('binding(' + type + ',\t' + fixedCombo + ',\t' + arr.length + ')');
	}
	
	Keys.unbind = function(type, combo, listener){
		var arr = listeners[type][sortCombo(combo.toLowerCase())];
		if(!arr) return false;
		
		var index = arr.indexOf(listener);
		if(index === -1) return false;
		
		arr.splice(index, 1);
		return true;
	}
	Keys.reset = function(){
		down = {};
		areDown = [];
		lastEvent = {};
		console.log('keys reset')
	}
	Keys.down = function(key){
		return down[key];
	}
	
	function preventListener(e){
		preventDefaultNative(e);
		return false;
	}
	Keys.prevent = function(type, combo){
		Keys.bind(type, combo, preventListener);
	}
	
	function state(){
		var stateStr = '';
		for(var i=0;i<areDown.length;++i){
			stateStr += areDown[i];
			if(i + 1 < areDown.length) stateStr += '+';
		}
		return sortCombo(stateStr);
	}
	function matchAnyListeners(activeKey, s, type){
		var set = anyListeners[type];
		var keys = s.split('+');
		var result = [];
		for(var i=0;i<set.length;++i){
			var m = set[i].matcher;
			var matchedAll = true;
			for(var j=0;j<m.length;++j){
				if(keys.indexOf(m[j]) === -1){
					matchedAll = false;
					break;
				}
			}
			if(matchedAll && set[i].matcher.indexOf(activeKey) !== -1){
				result.push(set[i].listener);
			}
		}
		return result;
	}
	
	function keydown(e, skipReification, hew){
		
		var ew = e.which;
		hew = hew || humanize(e.which, e.keyCode, e.charCode, 'keydown');
		console.log('keydown')
		if(!skipReification){
			var le = lastEvent[hew];
			if(le === 'down'){
				if(window.logKeys) log('repeat keydown reified.1(' + hew + '): ' + ew);
				keypress(e, true, hew);
				keyup(e, true, hew);
			}else if(le === 'press'){
				if(window.logKeys) log('repeat keydown reified.2(' + hew + '): ' + ew);
				keyup(e, true, hew);
			}
		}
		
		down[hew] = true;
		if(areDown.indexOf(hew) == -1) areDown.push(hew);
		
		var s = state();

		if(window.logKeys){
			log('keydown state(' + hew + '): ' + s);
			log('all: ' + JSON.stringify(down))
		}
		var list = (listeners.keydown[s] || []).concat(matchAnyListeners(hew, s, 'keydown'));
		//log('list: ' + list.length);
		for(var i=0;i<list.length;++i){
			list[i](e);
		}
		lastEvent[hew] = 'down';
	}
	function keypress(e, skipReification, hew){
		
		var ew = e.which;
		hew = hew || humanize(e.which, e.keyCode, e.charCode, 'keypress');
		
		if(!skipReification){
			var le = lastEvent[hew];
			if(le === 'press'){
				if(window.logKeys) log('repeat keypress reified.1(' + hew + '): ' + ew);
				keyup(e, true, hew);
				keydown(e, true, hew);
			}else if(le === 'up'){
				if(window.logKeys) log('repeat keypress reified.2(' + hew + '): ' + ew);
				keydown(e, true, hew);
			}
		}
		
		var s = state();
		if(window.logKeys) log('keypress state(' + hew + '): ' + s);
		var list = (listeners.keypress[s] || []).concat(matchAnyListeners(hew, s, 'keypress'));
		//log('list: ' + list.length);
		for(var i=0;i<list.length;++i){
			list[i](e);
		}
		
		lastEvent[hew] = 'press';
	};
	function keyup(e, skipReification, hew){

		var ew = e.which || e.keyCode;
		hew = hew || humanize(e.which, e.keyCode, e.charCode, 'keyup');
		
		if(!skipReification){
			var le = lastEvent[hew];
			if(le === 'up'){
				if(window.logKeys) log('repeat keyup reified.1(' + hew + '): ' + ew);
				keydown(e, true, hew);
				keypress(e, true, hew);
			}else if(le === 'down'){
				if(window.logKeys) log('repeat keyup reified.2(' + hew + '): ' + ew);
				keypress(e, true, hew);
			}
		}
		
		var s = state();

		if(isMac && hew === 'ctrl'){
			//when the command key is down, Mac browsers don't report keyup events for some keys,
			//so we have to clear the state at keyup.
			down = {};
			areDown = [];
		}else{
			down[hew] = false;
			var index = areDown.indexOf(hew);
			//log('areDown removing(' + hew + ')');
			if(index != -1) areDown.splice(index, 1);
		}
		//log(index);
		if(window.logKeys) {
			log('keyup state(' + hew + '): ' + s);
			log('all: ' + JSON.stringify(down))
		}
		var list = (listeners.keyup[s] || []).concat(matchAnyListeners(hew, s, 'keyup'));
		//log('list: ' + list.length);
		for(var i=0;i<list.length;++i){
			list[i](e);
		}
		
		lastEvent[hew] = 'up';
	}
	function makeUnwrapper(f){
		return function(e){f(e);}
	}
	function setupKeys(){
		//TODO - use shiftKey, altKey, metaKey, ctrlKey to override failed key state?

		attachNativeListener(document, 'keydown', makeUnwrapper(keydown));
		attachNativeListener(document, 'keypress', makeUnwrapper(keypress));
		attachNativeListener(document, 'keyup', makeUnwrapper(keyup));
		
		//jQuery(window).bind("blur", Keys.reset);
		//jQuery(window).bind("focus", Keys.reset);
		attachNativeListener(window, 'blur', Keys.reset);
		attachNativeListener(window, 'focus', Keys.reset);
	}
	
})();
