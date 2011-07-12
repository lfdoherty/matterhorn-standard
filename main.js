
exports.dir = __dirname;
exports.name = 'matterhorn-standard';

app.js(exports,'dust', ['dust/dust-core-0.3.0.min']);
secureApp.js(exports,'dust', ['dust/dust-core-0.3.0.min']);

app.js(exports,'jquery-1.5', ['jquery/jquery-1.5.1']);
secureApp.js(exports,'jquery-1.5', ['jquery/jquery-1.5.1']);

app.js(exports,'prng', ['seedrandom/seedrandom', 'random']);
secureApp.js(exports,'prng', ['seedrandom/seedrandom', 'random']);

var r = require('./js/random');

exports.random = r;

app.js(exports,'qtip', ['qtip/jquery.qtip']);
secureApp.js(exports,'qtip', ['qtip/jquery.qtip']);

app.css(exports,'qtip', ['qtip/jquery.qtip']);
secureApp.css(exports,'qtip', ['qtip/jquery.qtip']);

app.js(exports,'underscorem', ['underscore/underscore','underscore_extensions']);
secureApp.js(exports,'underscorem', ['underscore/underscore','underscore_extensions']);

app.js(exports, 'ajax', ['pollsave']);
secureApp.js(exports, 'ajax', ['pollsave']);


app.js(exports, 'browser-standardization', ['standardization']);
secureApp.js(exports, 'browser-standardization', ['standardization']);

app.js(exports, 'date', ['date']);
secureApp.js(exports, 'date', ['date']);



var _ = require('underscorem');

app.js(exports, 'pagesave', ['save']);
secureApp.js(exports, 'pagesave', ['save']);

var url = require('url');
var request = require('request');

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
		
		/*var u = url.parse(scriptUrl);
		
		var options = {
			host: u.hostname,
			port: u.port,
			path: u.pathname + (u.search || '')
		};
		
		
		console.log(options);
		
		http.get(options, function(res){
		
			console.log('got reply: ' + res.url);
		
			var data = '';
			res.on('data', function (chunk) {
				console.log('got data: ' + chunk);
				data += chunk;
			});
			
			res.on('end', function(){
				console.log('ending: ' + data);
				scriptsContent[scriptUrl] = data;
				cdl();
			});
		});	*/	
	});
	
	
});

