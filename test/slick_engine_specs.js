String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};

Slick.debug = function(message){
	try{console.log(Array.prototype.slice.call(arguments));}catch(e){};
	throw new Error(message);
};
// Slick.debug = false;

function makeSlickTestSearch(selector, count, disableQSA) {
	// if (document.querySelectorAll)
	// return new Function(" var count; try{ count = document.querySelectorAll('"+String.escapeSingle(selector)+"').length; console.log('"+String.escapeSingle(selector)+"', count); }catch(e){ \ncount="+count+" }; value_of( Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( count );");
	return new Function("Slick.disableQSA = "+!!disableQSA+";\n value_of( Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( "+count+" ); delete Slick.disableQSA;");
}

// Slick.parse.debug = true;

var combinators = ' ,>,+,~,   , > , + , ~ '.split(',');
// var tags = 'a abbr acronym address applet area b base basefont bdo big blockquote br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var'.split(' ');
var tags = 'a abbr div A ABBR DIV'.split(' ');
var attribOperators = '= != *= ^= $= ~= |='.split(' ');
var attrs = 'attr lang fred-rocks'.split(' ');
var vals = 'myValueOfDoom;"double";\'single\';"dou\\"ble";\'sin\\\'gle\';();{};\'thing[]\';"thing[]"'.split(';');



var s,f,kid,template;
(function(SlickFindingSpecs){
	SlickFindingSpecs.before_all();
	
	var count, selector, selectors = {
		'*':1825,
		'html': 1,
		'body': 1,
		'head': 1,
		'div': 59,
		
		'.example': 43,
		'.note': 14,
		'.fn': 5,
		
		'.a1': 4,
		'.a1 .a1': 2,
		'.a1   .a1': 2,
		'.a1 > .a1': 2,
		'.a1 + .a1': 0,
		
		'.a1   *': 12,
		'.a1 > *': 3,
		'.a1 + *': 2,
		'.a1 ~ *': 6,
		
		'.a1 !  *': 6,
		'.a1 !> *': 4,
		'.a4 !+ *': 2,
		'.a4 !~ *': 4,
		
		'.a4': 4,
		'.a4   .a4': 2,
		'.a4 > .a4': 2,
		'.a4 + .a4': 0,
		
		'[class]': 324,                       '[title]': 13,
		':not([class])':1825-324,             ':not([title])': 1825-13,
		
		// '[class=""]': 1,                      '[title=""]': 0,
		// '[class!=""]': 324,                   '[title!=""]': 13,
		// 
		// '[class]:not([class=""])': 324,       '[title]:not([title=""])': 13,
		// ':not([class]):not([class=""])': 324, ':not([title]):not([title=""])': 13,
		// ':not([class=""])':324,               ':not([title=""])': 1825,
		// 
		// '[class]:not([class!=""])': 324,       '[title]:not([title!=""])': 13,
		// ':not([class]):not([class!=""])': 324, ':not([title]):not([title!=""])': 13,
		// ':not([class!=""])':324,               ':not([title!=""])': 1825,
		
		'body div': 59,
		'div p': 140,
		'div > p': 134,
		'div + p': 22,
		'div ~ p': 183,
		'div & p': 0,
		
		'div[class^=exa][class$=mple]': 43,
		'div p a': 12,
		'div, p, a': 683,
		
		'DIV.example': 43,	// test casing
		'ul .tocline2': 12,
		'div.example, div.note': 44,
		
		'#title': 1,
		'h1#title': 1,
		'body #title': 1,
		
		'ul.toc li.tocline2': 12,
		'ul.toc > li.tocline2': 12,
		'h1#title + div > p': 0,
		
		// contains
		// var count = [];Array.prototype.slice.call($$('*')).forEach(function(el){ el.innerHTML.search(/Selectors/)+1 && count.push(el); });count
		'h1[id]:contains(Selectors)': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('h1');
			for (var i=0; i < elements.length; i++) {
				if (elements[i].id != null && elements[i].id != '')
				if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
			}
			return count;
		})(),
		'h1[id]:contains("Selectors")': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('h1');
			for (var i=0; i < elements.length; i++) {
				if (elements[i].id != null && elements[i].id != '')
				if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
			}
			return count;
		})(),
		':contains(Selectors)': 58,
		// (function(){
		// 	var count = 0;
		// 	var elements = template.getElementsByTagName('*');
		// 	for (var i=0; i < elements.length; i++) {
		// 		if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
		// 	}
		// 	return count;
		// })(),
		':contains("Selectors")': 58,
		// (function(){
		// 	var count = 0;
		// 	var elements = template.getElementsByTagName('*');
		// 	for (var i=0; i < elements.length; i++) {
		// 		if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
		// 	}
		// 	return count;
		// })(),
		'p:contains(selectors)': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('p');
			for (var i=0; i < elements.length; i++) {
				if (/selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
			}
			return count;
		})(),
		'p:contains("selectors")': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('p');
			for (var i=0; i < elements.length; i++) {
				if (/selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
			}
			return count;
		})(),
		
		// attribs
		'[href][lang][class]': 1,
		'[class]': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('*');
			for (var i=0; i < elements.length; i++) {
				if (elements[i].className != null && elements[i].className != '') count++;
			}
			return count;
		})(),
		'[class=example]': 43,
		'[class^=exa]': 43,
		'[class$=mple]': 44,
		'[class*=e]': 
		(function(){
			var count = 0;
			var elements = template.getElementsByTagName('*');
			for (var i=0; i < elements.length; i++) {
				if (elements[i].className != null && elements[i].className.match(/e/)) count++;
			}
			return count;
		})(),
		'[lang|=tr]': 1,
		'[class][class!=made_up]': 324,
		'[class~=example]': 43,
		
		// pseudos
		'div:not(.example)': 16,
		'p:nth-child(even)': 158,
		'p:nth-child(2n)': 158,
		'p:nth-child(odd)': 166,
		'p:nth-child(2n+1)': 166,
		'p:nth-child(n)': 324,
		'p:only-child': 3,
		'p:last-child': 19,
		'p:first-child': 54,
		
		"":0
	};
	
	SlickFindingSpecs['":contains()" elements should really contain the word'] = function(){
		var els = document.search(':contains(selectors)');
		for (var i=0,el; el=els[i]; i++) value_of( el.innerHTML ).should_match( 'selectors' );
		
		var els = document.search(':contains(Selectors)');
		for (var i=0,el; el=els[i]; i++) value_of( el.innerHTML ).should_match( 'Selectors' );
		
	};
	
/*
	SlickFindingSpecs['Get QSA Results'] = function(){
		var qsa_results = ['{\n'], count;
		for (selector in selectors) {
			qsa_results.push("\t'");
			qsa_results.push(String.escapeSingle(selector));
			qsa_results.push("': ");
			try{
				count = document.querySelectorAll(selector).length;
			}catch(e){
				count = -1;
			}
			qsa_results.push(count);
			qsa_results.push(',\n');
		}
		qsa_results.push('\t"":0\n}');
		// console&&console.log&&console.log(qsa_results.join(''));
	};
*/
	
	for (selector in selectors) {
		
		if (document.querySelectorAll)
			SlickFindingSpecs['should find '+selectors[selector]+' "'+selector+'" with QSA' ] = makeSlickTestSearch(selector, selectors[selector], false);
		SlickFindingSpecs['should find '+selectors[selector]+' "'+selector+'" without QSA' ] = makeSlickTestSearch(selector, selectors[selector], true);
		
	};
	
	
	describe('Slick Finding', SlickFindingSpecs);
	
})({
	'should exist': function(){
		value_of( Slick ).should_not_be_undefined();
	},
	
	before: function(){
		document.body.style.display='none';
		
		f = f || document.getElementById('_firebugConsole');
		f&&f.parentNode.removeChild(f);
		
		s = s || document.getElementById('jsspec_container');
		s.parentNode.removeChild(s);
		
		while ((kid = template.childNodes[0])){
			document.body.appendChild(kid);
		}
	},
	
	after: function(){
		while ((kid = document.body.childNodes[0])){
			template.appendChild(kid);
		}
		
		s&&document.body.appendChild(s);
		f&&document.body.appendChild(f);
		
		// Show test results after each run?
		// document.body.style.display='';
	},
	
	after_all: function(){
		document.body.style.display='';
	},
	
	before_all: function(){
		template = document.createElement('div');
		template.innerHTML = TEMPLATE;
	}
	
});
