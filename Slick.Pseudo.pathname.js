/*
---
description: |
  If Slick exists, adds a custom :pathname() pseudoclass to Slick.
    Usage: `Slick.search(':pathname("/path/name.ext")')`
  
  If Slick doesn't exist, adds a global matchPathname method.
    Usage: `matchPathname.call(node, document.location.pathname)`

author   : Thomas Aylott
provides : Slick.Pseudo.pathname
version  : 1.0
license  : MIT-style
...
*/
(function(){
	
	var hrefMatches = {};
	var default_page = /(\/|\/(index|default)\.\w{3,4})$/i;
	var esc = Slick.parse.escapeRegExp;
	function getPathname(){
		var pathname;
		// pathname = this.pathname;
		if (!pathname) pathname = this.href || this.getAttribute('href') || this.getAttribute('src') || '';
		return pathname.replace(/^(https?|file):\/\/.*?\/|[\?#].*$/g,'').replace(/^(?!\/)/,'/');
	};
	
	function matchPathname(rawURL){
		if (!hrefMatches[rawURL]){
			var url = rawURL;
			var urls = [];
			
			if (!default_page.test(url)) url += '/';
			
			if (default_page.test(url)){
				url = esc(url.replace(default_page, '').replace(/^\//,''));
				urls.push(url + '/?$');
				urls.push(url + default_page.source);
			}
			url = rawURL.replace(/^\//,'');
			urls.push(esc(url) + '/?$');
			
			var urlPattern = [];
			for (var i=0; i < urls.length; i++) urlPattern.push('^/?'+ urls[i]);
			urlPattern = RegExp(urlPattern.join('|'));
			
			hrefMatches[rawURL] = function(){ return urlPattern.test(this); };
		}
		return hrefMatches[rawURL].call(getPathname.call(this));
	}
	
	if (this.Slick) this.Slick.definePseudo('pathname', matchPathname);
	else this.matchPathname = matchPathname;
	
}).apply(this);
