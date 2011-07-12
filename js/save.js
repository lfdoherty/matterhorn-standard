
(function(){
/*
jQuery.fn.outerHtml = function(s) {
	return (s)
		? this.before(s).remove()
		: jQuery("&lt;p&gt;").append(this.eq(0).clone()).html();
}*/

function save(){
	var html = '';
	
	var scripts = [];
	$('head').children().each(function(i, d){
		if(d.nodeName === 'LINK'){
			scripts.push(d.href);
		}
	});
	
	$('body').children().each(function(i, d){
	
		if(d.nodeName === "SCRIPT"){
		}else{
			var f = $(d);
			//html += f.outerHtml();
			var stuff = f.clone().wrap('<div></div>').parent();
			stuff.find('#_special_save_form_').remove();
			stuff.find('#savebuttonwrapper').remove();
			html += stuff.html();
		}
	});
	
	$('input#content').val(html);
	$('input#scripts').val(JSON.stringify(scripts));
	
	$('#_special_save_form_').submit();
	
}

$(document).ready(function(){
	
	var html = '';
	html += '<div id="savebuttonwrapper" style="position: fixed; top: 0; left: 45%;font-size: larger;background-color: lightBlue;padding: 0.33ex 1em;">';
		html += '<form id="_special_save_form_" method="post" action="' + urlPrefix + '/savepage/' + document.title + '.html">';
		html += '<input type="hidden" id="content" name="content"/>';
		html += '<input type="hidden" id="scripts" name="scripts"/>';
		html += '<input id="submitsave" style="background-color: transparent; border: none" type="submit" value="Save Page as HTML"/>';
		html += '</form>';
	html += '</div>';
	
	
	$('body').append(html);
	
	$('#_special_save_form_').click(function(e){
		e.preventDefault();
		
		save();
	});
});

})();
