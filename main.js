
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

