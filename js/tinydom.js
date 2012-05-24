//Copyright 2011 Sam Carr under the MIT License
//See LICENSE for details.
(function () {

	if(typeof(jQuery) !== 'undefined') jQuery.noConflict();

    //Root, or window.
    var root = this;
    var $ = function () {};
    $.appendHead = function (a) {
        return document.head.innerHTML += a
    };
    $.appendBody = function (a) {
        return document.body.innerHTML += a
    };


    $.prependHead = function (a) {
        var oldIH = document.head.innerHTML;
        return document.head.innerHTML = a + oldIH
    };
    $.prependBody = function (a) {
        var oldIH = document.head.innerHTML;
        return document.head.innerHTML = a + oldIH
    };


    $.replaceHead = function (a) {
        return document.head.innerHTML = a;
    };
    $.replaceBody = function (a) {
        return document.body.innerHTML = a;
    };


    //Clears the head of everything
    $.ClearHead = function () {
        return document.head.innerHTML = "" ? true : false
    };
    //Clears the body of everything
    $.ClearBody = function () {
        return document.body.innerHTML = "" ? true : false
    };

    //Able to load a JS file
    $.loadJS = function (src) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = src;
        x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
/*
    //Currently Broken
    var loadCSS = function (url) {
            var sheet = document.createElement("link");
            sheet.setAttribute("rel", "stylesheet");
            sheet.setAttribute("type", "text/css");
            sheet.setAttribute("href", url);
            document.head.appendChild(sheet)
        };
*/
    $.id = function (a) {
        return document.getElementById(a)
    };

    $.tag = function (a) {
        return document.getElementsByTagName(a)
    };
    
    $.clazz = function(a){
		var result = document.querySelectorAll('.'+a);
		//console.log(result)
		//console.log(result.length)
		//if(result === undefined) return [];
		result = Array.prototype.slice.call(result);
		return result;
	};

    $.head = document.head;

    $.body = document.body;

    //buildSugar renamed HtmlSugar
    $.HS = function (c) {
        function f(a, b) {
            c.push([]);
            return d(a, b)
        }
        function d(a, b) {
            b = "" + (b || "");
            a && e("<", a, ">");
            b && e(b);
            a && e("</", a.split(" ")[0], ">");
            return d
        }
        d.toString = function () {
            return c.pop().join("")
        };

        function e() {
            c[c.length - 1].push(c.join.call(arguments, ""))
        }
        return f
    }([]);

//Always will replace tinyDOM
root['tinyDOM'] = $;
if (!root['$']) root['$'] = $;
})();
