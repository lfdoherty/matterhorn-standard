
_.mixin({
	log: function(msg){
		if(typeof(exports) !== undefined){
			sys.debug(msg);
		}else{
			if(window.console && window.console.log) console.log(msg);
		}
	},
	errout: function(msg){
		if(typeof(exports) !== undefined){
			sys.debug(msg);
			sys.debug(new Error().stack);
			throw msg;
		}else{
			_.log(msg);
			throw msg;
		}
	},
	remove: function(list, value){
		var i = list.indexOf(value);
		if(i === -1) _.errout('list does not contain value: ' + value);
		list.splice(i, 1);
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
	assertFunction: function(v){
		if(typeof(v) !== 'function'){
			_.errout('Expected function, got ' + typeof(v) + ': ' + v);
		}
	},
	assertEqual: function(a, b){
		if(a !== b){
			if(typeof(exports) !== undefined){
				_.errout('Values should be equal, but are not: ' + sys.inspect(a) + ', ' + sys.inspect(b));
			}else{
				_.errout('Values should be equal, but are not: ' + a.toString() + ', ' + b.toString());
			}
		}
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


