//#requires domready tinydom

function echofile(content, name, type){
	
	$.id('content').value = content;
	$.id('type').value = JSON.stringify({name: name, type: type});
	
	$.id('_special_save_form_').action = urlPrefix + '/echofile/' + name + '.' + type;
	
	$.id('_special_save_form_').submit();
	
}


(function(){


domready(function(){
	
	var html = '';
		html += '<form id="_special_save_form_" style="display:none" method="post" action="' + urlPrefix + '/echofile">';
		html += '<input type="hidden" id="content" name="content"/>';
		html += '<input type="hidden" id="type" name="type"/>';
		html += '<input id="submitsave" style="background-color: transparent; border: none" type="submit" value=""/>';
		html += '</form>';
	
	
	$.appendBody(html);
});

})();
