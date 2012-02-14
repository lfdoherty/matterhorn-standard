
//#requires underscore/underscore

function log(msg){
	if(window.console && window.console.log) console.log(msg);
}
	
_.mixin({
	log: log,
	errout: function(msg){
		log(msg);
		throw msg;
	},
	remove: function(list, value){
		var i = list.indexOf(value);
		if(i === -1) _.errout('list does not contain value: ' + value);
		list.splice(i, 1);
	},
	removeAll: function(list, otherList){
		return _.filter(list, function(v){
			return otherList.indexOf(v) === -1;
		});
	},
	latch: function(count, millisecondsUntilFailure, doneCb, failureCb){
		var counter = count;
		
		var timeoutHandle;
		
		if(arguments.length === 4){
			timeoutHandle = setTimeout(function(){
				failureCb(counter);
			}, millisecondsUntilFailure);
		}else{
			_.assertLength(arguments, 2);
			doneCb = arguments[1];
			millisecondsUtilFailure = undefined;
		}
					
		return function(){
			--counter;
		
			if(counter === 0){
				
				if(timeoutHandle !== undefined){
					clearTimeout(timeoutHandle);
				}
				
				doneCb();
			}		
		}
	},
	assert: function(v){
		if(!v){
			_.errout('assertion failed');
		}
	},
	assertNot: function(v){
		if(v){
			_.errout('assertion failed');
		}
	},
	assertLength: function(arr, len, msg){
		if(arr.length !== len){
			var m = msg || 'Expected ' + len + ' values, but instead there are ' + arr.length;
			_.errout(m);
		}
	},
	assertString: function(v){
		if(typeof(v) !== 'string'){
			_.errout('Expected string, got ' + typeof(v) + ': ' + v);
		}
	},
	assertObject: function(v){
		if(typeof(v) !== 'object'){
			_.errout('Expected object, got ' + typeof(v) + ': ' + v);
		}
	},
	assertBoolean: function(v){
		if(v !== true && v !== false){
			_.errout('Expected boolean, got ' + typeof(v) + ': ' + v);
		}
	},
	assertFunction: function(v){
		if(typeof(v) !== 'function'){
			_.errout('Expected function, got ' + typeof(v) + ': ' + v);
		}
	},
	assertEqual: function(a, b){
		if(a !== b){
			if(typeof(exports) !== 'undefined'){
				_.errout('Values should be equal, but are not: ' + sys.inspect(a) + ', ' + sys.inspect(b));
			}else{
				_.errout('Values should be equal, but are not: ' + a.toString() + ', ' + b.toString());
			}
		}
	},
	assertArray: function(v){
		if(!(v instanceof Array)){
			_.errout('Expected Array, got ' + typeof(v) + ': ' + v);
		}
	},	
	assertNumber: function(v){
		if(typeof(v) !== 'number'){
			_.errout('Expected Number, got ' + typeof(v) + ': ' + v);
		}
		if(isNaN(v)) _.errout('value is NaN');
	},	
	assertInt: function(v){
		if(typeof(v) !== 'number'){
			_.errout('Expected integer, got ' + typeof(v) + ': ' + v);
		}
		if((v>>0) !== v){
			_.errout('value ' + v + ' is not the same as its integer conversion ' + (v>>0) + ' - expected integer.');
		}
	},
	assertPrimitive: function(v){
		if(_.isArray(v) || _.isObject(v)){
			_.errout('expected primitive, got ' + typeof(v) + ': ' + v);
		}
	},
	assertDefined: function(v){
		if(v === undefined){
			_.errout('value is undefined');
		}
	},
	assertUndefined: function(v){
		if(v !== undefined){
			_.errout('value should be undefined');
		}
	},
	isObject: function(v){
		return !_.isArray(v) && typeof(v) === 'object';
	},
	isInteger: function(v){
		return typeof(v) === 'number' && (v>>0) === v;
	},
	isIn: function(arr, value){
		_.assertArray(arr);
		return arr.indexOf(value) !== -1;
	},
	isPrimitive: function(v){
		return !_.isArray(v) && !_.isObject(v);
	},
	//Use to descend into a json object without having to check for attributes on each descent.
	//For example: the expression obj.a.b.c will be fine if obj = {a: {b: {c: 'blah'}}}, but throw an exception if obj = {}.
	//Using maybe(obj, 'a', 'b', 'c') will return undefined in the second case.
	maybe: function(obj){
		var cur = obj;
		for(var i=1;i<arguments.length;++i){
			if(cur === undefined) return undefined;
			
			cur = cur[arguments[i]];
		}
		return cur;
	}
});


