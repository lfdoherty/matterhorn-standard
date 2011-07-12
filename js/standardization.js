
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt , fromParam)
  {
    var len = this.length;

    var from = fromParam || 0;
    for (; from < len; ++from)
    {
      if (from in this && this[from] === elt){
    	  return from;
      }
    }
    return -1;
  };
}
if (!Array.prototype.contains)
{
	Array.prototype.contains = function(entry) {
		return this.indexOf(entry) !== -1;
	}
}

if(!String.prototype.trim){
	String.prototype.trim = function trim(str){
		return this.replace(/^\s+|\s+$/g,"");
	} 
}

log = function(str){
	if(window.console && console.log){
		console.log(str);
	}
}
