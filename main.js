
//exports.dir = __dirname;
exports.name = 'matterhorn-standard';
exports.module = module

require('matterhorn');
/*
app.js(exports,'dust', 'dust/dust-core-0.3.0.min');
secureApp.js(exports,'dust', 'dust/dust-core-0.3.0.min');

app.js(exports,'jquery-1.5', 'jquery/jquery-1.5.1');
secureApp.js(exports,'jquery-1.5', 'jquery/jquery-1.5.1');

app.js(exports,'jquery', 'jquery/jquery-1.5.1');
secureApp.js(exports,'jquery', 'jquery/jquery-1.5.1');

app.js(exports,'tinydom', 'tinydom');
secureApp.js(exports,'tinydom', 'tinydom');

app.js(exports,'domready', 'domready');
secureApp.js(exports,'domready', 'domready');

app.js(exports,'prng', 'random');
secureApp.js(exports,'prng', 'random');

app.js(exports,'native', 'native');
secureApp.js(exports,'native', 'native');
*/
var r = require('./js/random');

exports.random = r;
/*
function makeBothExported(pathPrefix, name){
	app.js(exports, name, pathPrefix+name);
	secureApp.js(exports, name, pathPrefix+name);
}

makeBothExported('qtip/jquery.', 'qtip');

app.css(exports,'qtip', 'qtip/jquery.qtip');
secureApp.css(exports,'qtip', 'qtip/jquery.qtip');

app.js(exports,'underscorem', 'underscore_extensions');
secureApp.js(exports,'underscorem', 'underscore_extensions');

app.js(exports, 'ajax', 'pollsave');
secureApp.js(exports, 'ajax', 'pollsave');


app.js(exports, 'browser-standardization', 'standardization');
secureApp.js(exports, 'browser-standardization', 'standardization');

makeBothExported('', 'date');
makeBothExported('', 'keys');

makeBothExported('raphael/', 'raphael');
makeBothExported('raphael/', 'g.raphael');
makeBothExported('raphael/', 'g.line');
makeBothExported('raphael/', 'g.dot');
makeBothExported('raphael/', 'g.pie');
makeBothExported('raphael/', 'g.bar');

*/
var _ = require('underscorem');
/*
app.js(exports, 'pagesave', 'save');
secureApp.js(exports, 'pagesave', 'save');
*/
var url = require('url');
var request = require('request');
/*
app.js(exports, 'echofile', 'echofile');
*/
app.post(exports, '/echofile/:filename', function(req, res){

	var content = req.body.content;
	var type = req.body.type;
	
	res.send(content, {
		'Content-Disposition': 'attachment',
		'Content-Type': type
	});	
});

app.post(exports, '/savepage/:filename', function(req, res){
	
	console.log(req.app);
	console.log(require('sys').inspect(req.body));
	
	var scripts = JSON.parse(req.body.scripts);
	var content = req.body.content;
	
	var scriptsContent = {};
	
	var cdl = _.latch(scripts.length, function(){
	
		var html = '<html><head>';
		_.each(scripts, function(scriptUrl){
			
			var content = scriptsContent[scriptUrl];
			
			html += '<style>' + content + '</style>';
		});
		
		html += '</head><body>' + content + '</body></html>';
		
		res.send(html, {
			'Content-Disposition': 'attachment'
		});	
	});
	
	_.each(scripts, function(scriptUrl){
	
		var u = url.parse(scriptUrl);
		
		var localUrl = url.parse(req.url);
		console.log('url: ' + req.url);
	
		var uri = 'http://localhost:' + req.app.settings.port + u.pathname + (u.search || '');
		console.log(uri);
		request({uri: uri}, function(error, response, body){
			
			if(error || response.statusCode !== 200){
				_.errout(error + ' ' + (response ? response.statusCode : ''));
			}
			
			scriptsContent[scriptUrl] = body;
			cdl();
						
		});		
	});
});

