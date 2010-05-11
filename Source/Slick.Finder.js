/*
---
name: Slick.Finder
description: The new, superfast css selector engine.
provides: Slick.Finder
requires: Slick.Parser
...
*/

(function(){
	
var exports = this;

var timeStamp = +new Date();

var doc, root;

// Feature / Bug detection

var isNativeCode = function(fn){
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

var isXML = function(document){
	return (!!document.xmlVersion) || (!!document.xml) || (Object.prototype.toString.call(document) === '[object XMLDocument]') ||
	(document.nodeType === 9 && document.documentElement.nodeName !== 'HTML');
};

var hasAttribute, contains, documentSorter, isXMLDocument, getUID;

var setDocument = function(document){
	
	// convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
	
	if (document.nodeType === 9); // document
	else if (document.ownerDocument) document = document.ownerDocument; // node
	else if (document.navigator) document = document.document; // window
	else return;
	
	// check if it's the old document
	
	if (doc === document) return;
	doc = document;
	root = document.documentElement;
	
	// document sort
	
	brokenStarGEBTN
	= starSelectsClosedQSA
	= idGetsName
	= brokenMixedCaseQSA
	= brokenGEBCN
	= false;
	
	var starSelectsClosed, starSelectsComments,
		brokenSecondClassNameGEBCN, cachedGetElementsByClassName;
	
	if (!(isXMLDocument = isXML(document))){
		
		var testNode = document.createElement('div'), selected;
		root.appendChild(testNode);
		
		// IE returns comment nodes for getElementsByTagName('*') for some documents
		testNode.appendChild(document.createComment(''));
		starSelectsComments = (testNode.getElementsByTagName('*').length > 0);
		
		// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
		try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.getElementsByTagName('*');
			starSelectsClosed = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		brokenStarGEBTN = starSelectsComments || starSelectsClosed;
		
		// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
		if (testNode.querySelectorAll) try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.querySelectorAll('*');
			starSelectsClosedQSA = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		// IE returns elements with the name instead of just id for getElementById for some documents
		try {
			var id = 'idgetsname' + timeStamp;
			testNode.innerHTML = ('<a name='+id+'></a><b id='+id+'></b>');
			idGetsName = testNode.ownerDocument.getElementById(id) === testNode.firstChild;
		} catch(e){};
		
		// Safari 3.2 QSA doesnt work with mixedcase on quirksmode
		try {
			testNode.innerHTML = '<a class="MiXedCaSe"></a>';
			brokenMixedCaseQSA = !testNode.querySelectorAll('.MiXedCaSe').length;
		} catch(e){};

		try {
			testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
			testNode.getElementsByClassName('b').length;
			testNode.firstChild.className = 'b';
			cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
		} catch(e){};
		
		// Opera 9.6 GEBCN doesnt detects the class if its not the first one
		try {
			testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
			brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
		} catch(e){};
		
		brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
		
		root.removeChild(testNode);
		testNode = null;
		
	}
	
	// hasAttribute
	
	hasAttribute = (root && isNativeCode(root.hasAttribute)) ? function(node, attribute) {
		return node.hasAttribute(attribute);
	} : function(node, attribute) {
		node = node.getAttributeNode(attribute);
		return !!(node && (node.specified || node.nodeValue));
	};
	
	// contains
	
	contains = (root && isNativeCode(root.contains)) ? function(context, node){ // FIXME: Add specs: local.contains should be different for xml and html documents?
		return context.contains(node);
	} : (root && root.compareDocumentPosition) ? function(context, node){
		return context === node || !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		if (node) do {
			if (node === context) return true;
		} while ((node = node.parentNode));
		return false;
	};
	
	// document order sorting
	// credits to Sizzle (http://sizzlejs.com/)
	
	documentSorter = (root.compareDocumentPosition) ? function(a, b){
		if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
		return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
	} : ('sourceIndex' in root) ? function(a, b){
		if (!a.sourceIndex || !b.sourceIndex) return 0;
		return a.sourceIndex - b.sourceIndex;
	} : (document.createRange) ? function(a, b){
		if (!a.ownerDocument || !b.ownerDocument) return 0;
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
	} : null ;
	
	getUID = (isXMLDocument) ? getUIDXML : getUIDHTML;
	
};

// Main Method

var localFound, localUniques, push, positions = {};

var search = function(context, expression, append, first){
	
	var found = localFound = (first) ? null : (append || []);
	
	// no need to pass a context if its the current document
	
	if (expression == null){
		expression = context;
		context = document; // the current document, not local.document, cause it would be confusing
	}
	
	// context checks

	if (!context) return found; // No context
	if (context.navigator) context = context.document; // Convert the node from a window to a document
	else if (!context.nodeType) return found; // Reject misc junk input

	// setup
	
	var parsed, i;

	var uniques = localUniques = {};
	
	if (doc !== (context.ownerDocument || context)) setDocument(context);

	// expression checks
	
	if (typeof expression == 'string'){ // expression is a string
		
		// Overrides
			
		for (i = overrides.length; i--;){
			var override = overrides[i];
			if (override.regexp.test(expression)){
				var result = override.method.call(context, expression, found, first);
				if (result === false) continue;
				if (result === true) return found;
				return result;
			}
		}
		
		parsed = Slick.parse(expression);
		if (!parsed.length) return found;
		
	} else if (expression == null){ // there is no expression
		return found;
	} else if (expression.Slick === true){ // expression is a parsed Slick object
		parsed = expression;
	} else if (contains(context.documentElement || context, expression)){ // expression is a node
		(found) ? found.push(expression) : found = expression;
		return found;
	} else { // other junk
		return found;
	}
	
	// cache elements for the nth selectors
	
	positions.NTH = {};
	positions.NTHLast = {};
	positions.NTHType = {};
	positions.NTHTypeLast = {};
	
	// should sort if there are nodes in append and if you pass multiple expressions.
	// should remove duplicates if append already has items
	var shouldUniques = !!(append && append.length);
	
	// if append is null and there is only a single selector with one expression use pushArray, else use pushUID
	push = (!shouldUniques && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) ? pushArray : pushUID;
	
	if (found == null) found = [];
	
	// avoid duplicating items already in the append array
	if (shouldUniques) for (i = found.length; i--;) uniques[getUID(found[i])] = true;
	
	// default engine
	
	var j, m, n;
	var combinator, tag, id, classList, classes, attributes, pseudos;
	var currentItems, currentExpression, currentBit, lastBit, expressions = parsed.expressions;
	
	search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

		combinator = currentBit.combinator;
		if (!combinators[combinator]) continue search;
		
		tag        = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
		id         = currentBit.id;
		classList  = currentBit.classList;
		classes    = currentBit.classes;
		attributes = currentBit.attributes;
		pseudos    = currentBit.pseudos;
		lastBit    = (j === (currentExpression.length - 1));
	
		if (lastBit){
			localUniques = uniques;
			localFound = found;
		} else {
			localUniques = {};
			localFound = [];
		}

		if (j === 0){
			combinators[combinator](context, tag, id, classes, attributes, pseudos, classList);
			if (first && lastBit && found.length) break search;
		} else {
			if (first && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
				combinators[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
				if (found.length) break search;
			} else for (m = 0, n = currentItems.length; m < n; m++) combinators[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
		}
		
		currentItems = localFound;
	}
	
	if (shouldUniques || (parsed.expressions.length > 1)) sort(found);
	
	return (first) ? (found[0] || null) : found;
};

// Utils

var uidx = 1;
var uidk = 'slick:uniqueid';

var getUIDXML = function(node){
	var uid = node.getAttribute(uidk);
	if (!uid){
		uid = uidx++;
		node.setAttribute(uidk, uid);
	}
	return uid;
};

var getUIDHTML = function(node){
	return node.uniqueNumber || (node.uniqueNumber = uidx++);
};

// sort based on the setDocument documentSorter method.

var sort = function(results){
	if (!documentSorter) return results;
	results.sort(documentSorter);
	return results;
};

var cacheNTH = {};

var matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

var parseNTHArgument = function(argument){
	var parsed = argument.match(matchNTH);
	if (!parsed) return false;
	var special = parsed[2] || false;
	var a = parsed[1] || 1;
	if (a == '-') a = -1;
	var b = +parsed[3] || 0;
	parsed =
		(special == 'n')	? {a: a, b: b} :
		(special == 'odd')	? {a: 2, b: 1} :
		(special == 'even')	? {a: 2, b: 0} : {a: 0, b: a};
		
	return (cacheNTH[argument] = parsed);
};

createNTHPseudo = function(child, sibling, posObj, ofType){
	return function(node, argument){
		var uid = getUID(node);
		if (!positions[posObj][uid]){
			var parent = node.parentNode;
			if (!parent) return false;
			var el = parent[child], count = 1;
			if (ofType){
				var nodeName = node.nodeName;
				do {
					if (el.nodeName !== nodeName) continue;
					positions[posObj][getUID(el)] = count++;
				} while ((el = el[sibling]));
			} else {
				do {
					if (el.nodeType !== 1) continue;
					positions[posObj][getUID(el)] = count++;
				} while ((el = el[sibling]));
			}
		}
		argument = argument || 'n';
		var parsed = cacheNTH[argument] || parseNTHArgument(argument);
		if (!parsed) return false;
		var a = parsed.a, b = parsed.b, pos = positions[posObj][uid];
		if (a == 0) return b == pos;
		if (a > 0){
			if (pos < b) return false;
		} else {
			if (b < pos) return false;
		}
		return ((pos - b) % a) == 0;
	}
};

var pushArray = function(node, tag, id, classes, attributes, pseudos){
	if (matchSelector(node, tag, id, classes, attributes, pseudos)) localFound.push(node);
};

var pushUID = function(node, tag, id, classes, attributes, pseudos){
	var uid = getUID(node);
	if (!localUniques[uid] && matchSelector(node, tag, id, classes, attributes, pseudos)){
		localUniques[uid] = true;
		localFound.push(node);
	}
};

var matchPseudo = function(node, pseudoName, argument){
	if (pseudos[pseudoName]) return pseudos[pseudoName](node, argument);
	var attribute = getAttribute(node, name);
	return (argument) ? argument == attribute : !!attribute;
};

var matchNode = function(node, selector){
	var parsed = Slick.parse(selector);
	if (!parsed) return true;
	
	// simple (single) selectors
	if(parsed.length == 1 && parsed.expressions[0].length == 1){
		var exp = parsed.expressions[0][0];
		return matchSelector(node, (isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.classes, exp.attributes, exp.pseudos);
	}

	var nodes = search(doc, parsed);
	for (var i = 0, item; item = nodes[i++];){
		if (item === node) return true;
	}
	return false;
};

var matchSelector = function(node, tag, id, classes, attributes, pseudos){
	if (tag){
		if (tag == '*'){
			if (node.nodeName < '@') return false; // Fix for comment nodes and closed nodes
		} else {
			if (node.nodeName != tag) return false;
		}
	}
	if (id && node.getAttribute('id') != id) return false;
	
	var i, part, cls;
	if (classes) for (i = classes.length; i--;){
		cls = ('className' in node) ? node.className : node.getAttribute('class');
		if (!(cls && classes[i].regexp.test(cls))) return false;
	}
	if (attributes) for (i = attributes.length; i--;){
		part = attributes[i];
		if (part.operator ? !part.test(getAttribute(node, part.key)) : !hasAttribute(node, part.key)) return false;
	}
	if (pseudos) for (i = pseudos.length; i--;){
		part = pseudos[i];
		if (!matchPseudo(node, part.key, part.value)) return false;
	}
	return true;
};

var combinators = {

	' ': function(node, tag, id, classes, attributes, pseudos, classList){ // all child nodes, any level
		
		var i, item, children;

		if (!isXMLDocument){
			getById: if (id){
				item = doc.getElementById(id);
				if ((!item && node.all) || (idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
					// all[id] returns all the elements with that name or id inside node
					// if theres just one it will return the element, else it will be a collection
					children = node.all[id];
					if (!children) return;
					if (!children[0]) children = [children];
					for (i = 0; item = children[i++];) if (item.getAttributeNode('id').nodeValue == id){
						push(item, tag, null, classes, attributes, pseudos);
						break;
					} 
					return;
				}
				if (!item){
					// if the context is in the dom we return, else we will try GEBTN, breaking the getById label
					if (contains(doc.documentElement, node)) return;
					else break getById;
				} else if (doc !== node && !contains(node, item)) return;
				push(item, tag, null, classes, attributes, pseudos);
				return;
			}
			getByClass: if (node.getElementsByClassName && classes && !brokenGEBCN){
				children = node.getElementsByClassName(classList.join(' '));
				if (!(children && children.length)) break getByClass;
				for (i = 0; item = children[i++];) push(item, tag, id, null, attributes, pseudos);
				return;
			}
		}
		getByTag: {
			children = node.getElementsByTagName(tag);
			if (!(children && children.length)) break getByTag;
			if (!brokenStarGEBTN) tag = null;
			for (i = 0; item = children[i++];) push(item, tag, id, classes, attributes, pseudos);
		}
	},
	
	'!': function(node, tag, id, classes, attributes, pseudos){  // all parent nodes up to document
		while ((node = node.parentNode)) if (node !== doc) push(node, tag, id, classes, attributes, pseudos);
	},

	'>': function(node, tag, id, classes, attributes, pseudos){ // direct children
		if ((node = node.firstChild)) do {
			if (node.nodeType === 1) push(node, tag, id, classes, attributes, pseudos);
		} while ((node = node.nextSibling));
	},
	
	'!>': function(node, tag, id, classes, attributes, pseudos){ // direct parent (one level)
		node = node.parentNode;
		if (node !== doc) push(node, tag, id, classes, attributes, pseudos);
	},

	'+': function(node, tag, id, classes, attributes, pseudos){ // next sibling
		while ((node = node.nextSibling)) if (node.nodeType === 1){
			push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'!+': function(node, tag, id, classes, attributes, pseudos){ // previous sibling
		while ((node = node.previousSibling)) if (node.nodeType === 1){
			push(node, tag, id, classes, attributes, pseudos);
			break;
		}
	},

	'^': function(node, tag, id, classes, attributes, pseudos){ // first child
		node = node.firstChild;
		if (node){
			if (node.nodeType === 1) push(node, tag, id, classes, attributes, pseudos);
			else this['+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'!^': function(node, tag, id, classes, attributes, pseudos){ // last child
		node = node.lastChild;
		if (node){
			if (node.nodeType === 1) push(node, tag, id, classes, attributes, pseudos);
			else this['!+'](node, tag, id, classes, attributes, pseudos);
		}
	},

	'~': function(node, tag, id, classes, attributes, pseudos){ // next siblings
		while ((node = node.nextSibling)){
			if (node.nodeType !== 1) continue;
			push(node, tag, id, classes, attributes, pseudos);
		}
	},

	'!~': function(node, tag, id, classes, attributes, pseudos){ // previous siblings
		while ((node = node.previousSibling)){
			if (node.nodeType !== 1) continue;
			push(node, tag, id, classes, attributes, pseudos);
		}
	},
	
	'++': function(node, tag, id, classes, attributes, pseudos){ // next sibling and previous sibling
		this['+'](node, tag, id, classes, attributes, pseudos);
		this['!+'](node, tag, id, classes, attributes, pseudos);
	},

	'~~': function(node, tag, id, classes, attributes, pseudos){ // next siblings and previous siblings
		this['~'](node, tag, id, classes, attributes, pseudos);
		this['!~'](node, tag, id, classes, attributes, pseudos);
	}

};

var pseudos = {

	'empty': function(node){
		var child = node.firstChild;
		return !(child && child.nodeType == 1) && !(node.innerText || node.textContent || '').length;
	},

	'not': function(node, expression){
		return !matchNode(node, expression);
	},

	'contains': function(node, text){
		return (node.innerText || node.textContent || '').indexOf(text) > -1;
	},

	'first-child': function(node){
		while ((node = node.previousSibling)) if (node.nodeType === 1) return false;
		return true;
	},

	'last-child': function(node){
		while ((node = node.nextSibling)) if (node.nodeType === 1) return false;
		return true;
	},

	'only-child': function(node){
		var prev = node;
		while ((prev = prev.previousSibling)) if (prev.nodeType === 1) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeType === 1) return false;
		return true;
	},

	'nth-child': createNTHPseudo('firstChild', 'nextSibling', 'NTH'),
	
	'nth-last-child': createNTHPseudo('lastChild', 'previousSibling', 'NTHLast'),
	
	'nth-of-type': createNTHPseudo('firstChild', 'nextSibling', 'NTHType', true),
	
	'nth-last-of-type': createNTHPseudo('lastChild', 'previousSibling', 'NTHTypeLast', true),
	
	'first-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.previousSibling)) if (node.nodeName === nodeName) return false;
		return true;
	},
	
	'last-of-type': function(node){
		var nodeName = node.nodeName;
		while ((node = node.nextSibling)) if (node.nodeName === nodeName) return false;
		return true;
	},
	
	'only-of-type': function(node){
		var prev = node, nodeName = node.nodeName;
		while ((prev = prev.previousSibling)) if (prev.nodeName === nodeName) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeName === nodeName) return false;
		return true;
	},

	// custom pseudos

	'index': function(node, index){
		return this['nth-child'](node, '' + index + 1);
	},

	'even': function(node, argument){
		return this['nth-child'](node, '2n');
	},

	'odd': function(node, argument){
		return this['nth-child'](node, '2n+1');
	},

	'enabled': function(node){
		return (node.disabled === false);
	},
	
	'disabled': function(node){
		return (node.disabled === true);
	},

	'checked': function(node){
		return node.checked;
	},

	'selected': function(node){
		return node.selected;
	},
	
	'focus': function(node){
		return !isXMLDocument && doc.activeElement === node && (node.href || node.type || hasAttribute(node, 'tabindex'));
	}
};

// attributes methods

var attributeGetters = {

	'class': function(){
		return ('className' in this) ? this.className : this.getAttribute('class');
	},
	
	'for': function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	},
	
	'href': function(){
		return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
	},
	
	'style': function(){
		return (this.style) ? this.style.cssText : this.getAttribute('style');
	}

};

var getAttribute = function(node, name){
	// FIXME: check if getAttribute() will get input elements on a form on this browser
	// getAttribute is faster than getAttributeNode().nodeValue
	var method = attributeGetters[name];
	if (method) return method.call(node);
	var attributeNode = node.getAttributeNode(name);
	return attributeNode ? attributeNode.nodeValue : null;
};

// overrides

var overrides = [];

var override = function(regexp, method){
	overrides.push({regexp: regexp, method: method});
};

override(/./, function(expression, found, first){ //querySelectorAll override

	if (!this.querySelectorAll || this.nodeType != 9 || isXMLDocument || brokenMixedCaseQSA || Slick.disableQSA) return false;
	
	var nodes, node;
	try {
		if (first) return this.querySelector(expression) || null;
		else nodes = this.querySelectorAll(expression);
	} catch(error){
		return false;
	}

	var i, hasOthers = !!(found.length);

	if (starSelectsClosedQSA) for (i = 0; node = nodes[i++];){
		if (node.nodeName > '@' && (!hasOthers || !localUniques[getUIDHTML(node)])) found.push(node);
	} else for (i = 0; node = nodes[i++];){
		if (!hasOthers || !localUniques[getUIDHTML(node)]) found.push(node);
	}

	if (hasOthers) sort(found);

	return true;

});

override(/^[\w-]+$|^\*$/, function(expression, found, first){ // tag override
	var tag = expression;
	if (tag == '*' && brokenStarGEBTN) return false;
	
	var nodes = this.getElementsByTagName(tag);
	
	if (first) return nodes[0] || null;
	var i, node, hasOthers = !!(found.length);
	
	for (i = 0; node = nodes[i++];){
		if (!hasOthers || !localUniques[getUID(node)]) found.push(node);
	}
	
	if (hasOthers) sort(found);

	return true;
});

override(/^\.[\w-]+$/, function(expression, found, first){ // class override
	if (isXMLDocument || (!this.getElementsByClassName && this.querySelectorAll)) return false;
	
	var nodes, node, i, hasOthers = !!(found && found.length), className = expression.substring(1);
	if (this.getElementsByClassName && !brokenGEBCN){
		nodes = this.getElementsByClassName(className);
		if (first) return nodes[0] || null;
		for (i = 0; node = nodes[i++];){
			if (!hasOthers || !localUniques[getUIDHTML(node)]) found.push(node);
		}
	} else {
		var matchClass = new RegExp('(^|\\s)'+ Slick.escapeRegExp(className) +'(\\s|$)');
		nodes = this.getElementsByTagName('*');
		for (i = 0; node = nodes[i++];){
			className = node.className;
			if (!className || !matchClass.test(className)) continue;
			if (first) return node;
			if (!hasOthers || !localUniques[getUIDHTML(node)]) found.push(node);
		}
	}
	if (hasOthers) sort(found);
	return (first) ? null : true;
});

override(/^#[\w-]+$/, function(expression, found, first){ // ID override
	if (isXMLDocument || this.nodeType != 9) return false;
	
	var id = expression.substring(1), el = this.getElementById(id);
	if (!el) return found;
	if (idGetsName && el.getAttributeNode('id').nodeValue != id) return false;
	if (first) return el || null;
	var hasOthers = !!(found.length);
	if (!hasOthers || !localUniques[getUIDHTML(el)]) found.push(el);
	if (hasOthers) sort(found);
	return true;
});

if (typeof document != 'undefined') setDocument(document);

// Slick

var Slick = exports.Slick || {};

Slick.version = '0.9dev';

// Slick finder

Slick.search = search;

Slick.find = function(context, expression){
	return search(context, expression, null, true);
};

// Slick containment checker

Slick.contains = function(container, node){
	setDocument(container);
	return contains(container, node);
};

// Slick attribute getter

Slick.getAttribute = getAttribute;

// Slick matcher

Slick.match = function(node, selector){
	if (!(node && selector)) return false;
	if (!selector || selector === node) return true;
	if (typeof selector != 'string') return false;
	setDocument(node);
	return matchNode(node, selector);
};

// Slick attribute accessor

Slick.defineAttributeGetter = function(name, fn){
	attributeGetters[name] = fn;
	return this;
};

Slick.lookupAttributeGetter = function(name){
	return attributeGetters[name];
};

// Slick pseudo accessor

Slick.definePseudo = function(name, fn){
	pseudo[name] = function(node, argument){
		return fn.call(node, argument);
	};
	return this;
};

Slick.lookupPseudo = function(name){
	var pseudo = pseudo[name];
	if (pseudo) return function(argument){
		return pseudo.call(this, argument);
	};
	return null;
};

// Slick overrides accessor

Slick.override = function(regexp, fn){
	override(regexp, fn);
	return this;
};

// De-duplication of an array of HTML elements.

Slick.uniques = function(nodes, append){
	var uniques = {}, i, node, uid;
	if (!append) append = [];
	for (i = 0; node = append[i++];) uniques[getUIDHTML(node)] = true;
	
	for (i = 0; node = nodes[i++];){
		uid = getUIDHTML(node);
		if (!uniques[uid]){
			uniques[uid] = true;
			append.push(node);
		}
	}
	return append;
};

Slick.isXML = isXML;

// export Slick

if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);
