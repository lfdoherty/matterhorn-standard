
/*
pollsave assumes RESTian PUT semantics for URIs - that it will never be asked to save multiple different resources to the same URI.
*/
var pollsave;


(function(){

var after = {},
	saving = {},
	delayed = {};

function doAfter(uri){
	if(after[uri]){
		var a = after[uri];
		delete after[uri]; 
		a();
	}
}

//delay specifies the time to wait for further saves before making this one, assuming there are no saves pending for that URI yet.
//delay===0 will force a save right away if saves are delayed, but e.g. delay===10 will not accelerate saving if there is a delay===1000 save pending.
pollsave = function(json, uri, delay, successCallback, failureCallback){
	
	if(saving[uri]){
		//console.log('will save when current save completes: ' + uri);
		after[uri] = function(){pollsave(json, uri, delay, successCallback, failureCallback);}
	}else{

		if(delay > 0){

			after[uri] = function(){pollsave(json, uri, 0, successCallback, failureCallback);}

			if(!delayed[uri]){

				delayed[uri] = true;
		
				setTimeout(function(){
					delete delayed[uri];
					doAfter(uri);
				}, delay);

			}

		}else{

			saving[uri] = true; 
			delete after[uri];//just for the case where a delay===0 call is made while a delay>0 call has yet to complete its timeout

			var xmlhttp=new XMLHttpRequest();
			xmlhttp.open("POST",uri,true);
			xmlhttp.setRequestHeader("Content-type","application/json; charset=utf-8");

			xmlhttp.addEventListener("load",function(){
				if(xmlhttp.status === 200){
					saving[uri] = false;

					successCallback(xmlhttp.responseText);

					doAfter(uri);
				}else{
					failureCallback(xmlhttp.responseText);
				}
			}, false);

			xmlhttp.addEventListener("error",function(e){
				console.log('ajax error: ' + e.target.status);

				saving[uri] = false;

				var retry = failureCallback();

				if(retry){
					if(after[uri]){	
						doAfter(uri);
					}else{
						pollsave(json, uri, 0, successCallback, failureCallback);
					}
				}
			}, false);

			xmlhttp.send(JSON.stringify(json));

		
		}
	}	
}

})();
