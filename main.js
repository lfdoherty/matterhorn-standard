
//exports.dir = __dirname;
exports.name = 'matterhorn-standard';
exports.module = module

require('matterhorn');

var r = require('./js/random');

exports.random = r;

var _ = require('underscorem');

var url = require('url');
var request = require('request');

exports.load = function(app, secureApp){
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
}
