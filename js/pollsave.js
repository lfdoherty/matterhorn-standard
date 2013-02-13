

/*
pollsave assumes RESTian PUT semantics for URIs - that it will never be asked to save multiple different resources to the same URI.
*/


var after = {},
	saving = {},
	delayed = {};

function doAfter(uri){
	if(after[uri]){
		var a = after[uri];
		delete after[uri]; 
		a();
	}
}//trest

//delay specifies the time to wait for further saves before making this one, assuming there are no saves pending for that URI yet.
//delay===0 will force a save right away if saves are delayed, but e.g. delay===10 will not accelerate saving if there is a delay===1000 save pending.
module.exports = pollsave

function pollsave(json, uri, delay, successCallback, failureCallback){
	
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

		
			function loadCallback(responseText){
				saving[uri] = false;
				successCallback(responseText);
				doAfter(uri);
			}
			function errorCallback(e, status){
				console.log('ajax error: ' + status);

				saving[uri] = false;
				
				var retry;
				
				if(e.responseText){
					var response;
					try{
						response = JSON.parse(e.responseText)
					}catch(e){
						response = e.responseText
					}
					retry = failureCallback(response);
				}else{
					retry = failureCallback();
				}

				if(retry){
					if(after[uri]){	
						doAfter(uri);
					}else{
						pollsave(json, uri, 0, successCallback, failureCallback);
					}
				}
			}
			
			var xhr = new XMLHttpRequest();    
			console.log('uri: ' + uri) 
			//console.log('href: ' + window.location.href)
			xhr.open("POST", uri, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('Accepts', 'application/json; charset=utf-8');
			xhr.onreadystatechange = function (oEvent) {  
				if (xhr.readyState === 4) {  
					if (xhr.status === 200) {
						var json = JSON.parse(xhr.responseText) 
						loadCallback(json)
					} else {  
						console.log("Error", xhr.statusText, uri);  
						if(errorCallback) errorCallback(xhr.status, xhr.statusText)
					}  
				}  
			};  
			xhr.send(JSON.stringify(json)); 
		}
	}	
}

function postJson(url, content, cb, errCb){
	if(arguments.length !== 3 && arguments.length !== 4) throw new Error('postJson(url,content,cb[,errCb]) should not be called with ' + arguments.length + ' arguments')

    var xhr = new XMLHttpRequest();  
    
    console.log('postJson: ' + url)
    
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function (oEvent) {  
		if (xhr.readyState === 4) {  
			if (xhr.status === 200) {  
				cb()
			} else {  
				console.log("Error", xhr.statusText, url);  
				if(errCb) errCb(xhr.status, xhr.statusText)
			}  
		}  
	};  
	xhr.send(JSON.stringify(content)); 
}

