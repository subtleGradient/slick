
var SubtleSlickParse = (function(){
	function SubtleSlickParse(CSS3_Selectors){
		var selector = ''+CSS3_Selectors;
		if(!SubtleSlickParse.debug && cache[selector]) return cache[selector];
		parsedSelectors = [];
		parsedSelectors.type=[];
		
		while (selector != (selector = selector.replace(parseregexp, parser)));
		
		parsedSelectors.type=parsedSelectors.type.join('');
		return cache[''+CSS3_Selectors] = parsedSelectors;
	};
	var parseregexp = new RegExp("\
		(?x)\
		^(?:\
		\\s+$\
		|(?: \\s* (,)           \\s* ) # Combinator\n\
		|(?: \\s* (\\s|\\>|\\+|\\~) \\s* ) # Combinator\n\
		|(?:      ( \\* | \\w+ \\b   )     ) # Tag Name\n\
		|(?: \\#  ( [a-z][a-z0-9_-]* ) \\b ) # ID\n\
		|(?: \\.  ( [a-z][a-z0-9_-]* ) \\b ) # ClassName\n\
		|(?: \\[  ( ([-_:a-z0-9]+) (?: ([*^$!~|]?=) (?: \"([^\"]*)\" | '([^']*)' | ([^\\]]*) ) )?     ) \\] ) # attribute\n\
		|(?:   :+ ( [a-z][a-z0-9_-]* ) \\b (?: \\([\"]? ([^\\)\\\"]+) [\"]?\\) )?     ) # PseudoClassPseudoClassValue\n\
		)".replace(/\(\?x\)|\s+#.*$|\s+/gim,''),'i'
	);
	var map = {
		// Natural replace function argument position
		rawMatch      : 0,
		offset        : -2,
		string        : -1,
		
		// Replace function argument position
		separator       : 1,
		combinator      : 2,
		combinatorChild : 2,
		
		tagName   : 3,
		id        : 4,
		className : 5,
		
		attribute            : 6,
		attributeKey         : 7,
		attributeOperator    : 8,
		attributeValueDouble : 9,
		attributeValueSingle : 10,
		attributeValue       : 11,
		
		pseudoClass      : 12,
		pseudoClassValue : 13
	};
	var cache = {};
	SubtleSlickParse.cache = cache;
	var parsedSelectors;
	var these_selectors;
	var this_selector;
	function parser(){
		var a = arguments;
		SubtleSlickParse.debug && console.log({
			argumentsLength : a.length,
			rawMatch        : a[map.rawMatch],
			offset          : a[arguments.length-2],
			string          : a[arguments.length-1],
			
			separator       : a[map.separator],
			combinator      : a[map.combinator],
			combinatorChild : a[map.combinatorChild],
			
			tagName   : a[map.tagName],
			id        : a[map.id],
			className : a[map.className],
			
			attribute         : a[map.attribute],
			attributeKey      : a[map.attributeKey],
			attributeOperator : a[map.attributeOperator],
			attributeValue    : a[map.attributeValue] || a[map.attributeValueDouble] || a[map.attributeValueSingle],
			
			pseudoClass      : a[map.pseudoClass],
			pseudoClassValue : a[map.pseudoClassValue]
		});
		
		if (!parsedSelectors.length || a[map.separator]) {
			// Make a new selector!
			parsedSelectors.push([]);
			these_selectors = parsedSelectors[parsedSelectors.length-1];
			if (parsedSelectors.length-1) return '';
		}
		if (!these_selectors.length || a[map.combinatorChild] || a[map.combinator]) {
			// Make a new simple selector!
			these_selectors.push({
				bits:0,
				combinator: a[map.combinatorChild] || a[map.combinator],
				tag : null,
				id  : null,
				parsed:{
					pseudos    :[],
					classes    :[],
					attributes :[]
				}
			});
			this_selector = these_selectors[these_selectors.length-1];
			parsedSelectors.type.push(this_selector.combinator);
			if (these_selectors.length-1) return '';
		}
		this_selector.bits ++;
		if (a[map.tagName    ]) return parsedSelectors.type.push('tag')    && (this_selector.tag = a[map.tagName])&&'';
		if (a[map.id         ]) return parsedSelectors.type.push('id')     && (this_selector.id  = a[map.id     ])&&'';
		if (a[map.className  ]) return parsedSelectors.type.push('class')  && this_selector.parsed.classes.push(a[map.className])&&'';
		if (a[map.attribute  ]) return parsedSelectors.type.push('attrib'+a[map.attributeOperator]) && this_selector.parsed.attributes.push({
			name     : a[map.attributeKey],
			operator : a[map.attributeOperator],
			value    : a[map.attributeValue] || a[map.attributeValueDouble] || a[map.attributeValueSingle]
		})&&'';
		if (a[map.pseudoClass]) return parsedSelectors.type.push('pseudo') && this_selector.parsed.pseudos.push({
			name     : a[map.pseudoClass],
			argument : a[map.pseudoClassValue]
		})&&'';
		
		return '';
	};
	
	return SubtleSlickParse;
})();

var slick = (function(){
	
	// MAIN Method: searches a context for an expression.
	function slick(context, expression){
		slick.buffer = {};
		var parsedSelectors = SubtleSlickParse(expression);
		var items = [];
		for (var SN=0, parsedSelector; parsedSelector = parsedSelectors[SN]; SN++){
			for (var i = parsedSelector.length - 1; i >= 0; i--){
				var this_simpleSelector = parsedSelector[i];
				
				these_items = (searchers[parsedSelectors.type] || searchers['default'])(context, this_simpleSelector);
				
			}
			if (!items.length) items = these_items;
			else for (var i=0, this_item; this_item = these_items[i++];) items.push(this_item);
		}
		return items;
	};
	
	// pseudoselectors accessors
	slick.addPseudoSelector = function(name, fn){
		pseudos[name] = fn;
	};
	slick.getPseudoSelector = function(name){
		return pseudos[name];
	};
	
	// searchers accessors
	slick.addSearcher = function(name, fn){
		searchers[name] = fn;
	};
	slick.getSearcher = function(name){
		return searchers[name];
	};
	
	// default getAttribute
	slick.getAttribute = function(node, name){
		return node.getAttribute(name);
	};
	
	// does this node match a selector
	slick.match = function(node, selector){
		if (!selector || (selector == node)) return true;
		slick.buffer = {};
		var parseSimpleSelector = SubtleSlickParse(selector)[0][0];
		return matchNodeBySelector(node, parseSimpleSelector.id, parseSimpleSelector.tag||'*', parseSimpleSelector.parsed, null, {});
	};
	
	// PRIVATE STUFF! Cant touch! AHAHA
	
	// cache
	var cache = {selectors: {}, nth: {}};
	
	// commonly used regexps.
	var regExps = {
		id: (/#([\w-]+)/),
		tag: (/^(\w+|\*)/),
		quick: (/^(\w+|\*)$/),
		splitter: (/\s*([+>~\s])\s*([a-zA-Z#.*:\[])/g),
		combined: (/\.([\w-]+)|\[(\w+)(?:([!*^$~|]?=)(["']?)([^\4]*?)\4)?\]|:([\w-]+)(?:\(["']?(.*?)?["']?\)|$)/g)
	};
	
	// generates and returns, or simply returns if existing, an unique id for a Node.
	var uidOf = (function(){
		var index = 1;
		if (window.ActiveXObject) return function uidOf(item){
			return (item.uid || (item.uid = [index++]))[0];
		};
		return function uidOf(item){
			return (item.uid || (item.uid = index++));
		};
	})();
	
	// What can this browser do?
	getElementsByClassName = (document.getElementsByClassName && document.getElementsByClassName.toString().indexOf('[native code]')+1);
	
	// searchers
	var searchers = {
		'default': function(context, parsedSelectors){
			
			var items = [];
			for (var SN=0, parsedSelector; parsedSelector = parsedSelectors[SN]; SN++){
				
				var these_items;
				for (var i=0, this_simpleSelector; this_simpleSelector = parsedSelector[i]; i++){
					if (!i) {
						these_items = getNodesBySelector(context, this_simpleSelector.tag||'*', this_simpleSelector.id, this_simpleSelector.parsed, null);
						continue;
					}
					var uniques = {}, found = [];
					for (var itemN=0, this_item; this_item = these_items[itemN++];) {
						found = splitters[this_simpleSelector.combinator](found, this_item, this_simpleSelector.tag||'*', this_simpleSelector.id, this_simpleSelector.parsed);
					}
					these_items = found;
				}
				if (!items.length) items = these_items;
				else for (var i=0, this_item; this_item = these_items[i++];) items.push(this_item);
				
			}
			return items;
		}
	};
	
	slick.addSearcher('default', function(context, parsedSelectors){
	});
	
	/*
	slick.addSearcher('tag', function(context, parsedSelectors){
		return context.getElementsByTagName(parsedSelectors[0][0].tag);
	});
	slick.addSearcher('id', function(context, parsedSelectors){
		return [context.getElementById(parsedSelectors[0][0].id)];
	});
	slick.addSearcher('tagid', function(context, parsedSelectors){
		var selector = parsedSelectors[0][0];
		var node = context.getElementById(selector.id);
		if (selector.tag && selector.tag != '*' && matchNodeByTag(node, selector.tag)) return [node];
		return [];
	});
	slick.addSearcher('attrib', function(context, parsedSelectors){
		var selector = parsedSelectors[0][0];
		var items = [];
		var nodes = context.getElementsByTagName(selector.tag||'*');
		
		for (var i=0, node; node = nodes[i++];) {
			matchNodeByAttribute(node, selector.name, selector.operator, selector.value) && items.push(node);
		}
		
		return items;
	});
	*/
	
	// pass in a bunch of nodes and the rules for chucking them
	function filterNodes(nodes, parsedSimpleSelector, funks){
		var items = [];
		for (var i=0, node; node = nodes[i++];) {
			items.push(node);
			for (var i=0, funk; funk = funks[i]; i++){
				if (!funk(node, parsedSimpleSelector)){
					items.pop();
					break;
				}
			}
		}
		return items;
	};
	
	function getElements(context, parsedSimpleSelector){
		parsedSimpleSelector
	};
	function getParent(context, parsedSimpleSelector){
		parsedSimpleSelector
	};
	
	/*
	slick.addSearcher('class', function(context, parsedSelectors){
		return getElements(context, parsedSelectors)
		// var selector = parsedSelectors[0][0];
		// var nodes;
		// if (getElementsByClassName && context.getElementsByClassName){
		// 	nodes = context.getElementsByClassName(selector.parsed.classes[0]);
		// 	if (!selector.tag || selector.tag == '*') return nodes;
		// }
		// var items = [];
		// var matchTag = selector.tag && selector.tag != '*';
		// nodes = nodes || context.getElementsByTagName(selector.tag||'*');
		// for (var i=0, node; node = nodes[i++];) {
		// 	if (matchTag && !matchNodeByTag(node, selector.tag)) continue;
		// 	matchNodeByClass(node, selector.parsed.classes[0]) && items.push(node);
		// }
		// return items;
	});
	
	slick.addSearcher('classclass', function(context, parsedSelectors){
		var selector = parsedSelectors[0][0];
		var items = [];
		var nodes;
		if (getElementsByClassName && context.getElementsByClassName)
			nodes = context.getElementsByClassName(selector.parsed.classes[0]);
		else
			nodes = context.getElementsByTagName(selector.tag||'*');
		
		var matchTag = !getElementsByClassName && selector.tag && selector.tag != '*';
		for (var i=0, node; node = nodes[i++];) {
			if (matchTag && !matchNodeByTag(node, selector.tag)) continue;
			matchNodeByClass(node, selector.parsed.classes[1]) && items.push(node);
		}
		return items;
	});
	searchers.tagattrib = searchers.attrib;
	searchers.tagclass = searchers['class'];
	searchers.tagclassclass = searchers['classclass'];
	*/
	
	//pseudos
	
	// utility function for the nth pseudo selector, parses the complex argument.
	
	function parseNTHArgument(argument){
		if (cache.nth[argument]) return cache.nth[argument];
		var parsed = argument.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
		if (!parsed) return false;
		var inta = parseInt(parsed[1], 10);
		var a = (inta || inta === 0) ? inta : 1;
		var special = parsed[2] || false;
		var b = parseInt(parsed[3], 10) || 0;
		if (a != 0){
			b--;
			while (b < 1) b += a;
			while (b >= a) b -= a;
		} else {
			a = b;
			special = 'index';
		}
		switch (special){
			case 'n': parsed = {a: a, b: b, special: 'n'}; break;
			case 'odd': parsed = {a: 2, b: 0, special: 'n'}; break;
			case 'even': parsed = {a: 2, b: 1, special: 'n'}; break;
			case 'first': parsed = {a: 0, special: 'index'}; break;
			case 'last': parsed = {special: 'last-child'}; break;
			case 'only': parsed = {special: 'only-child'}; break;
			default: parsed = {a: (a - 1), special: 'index'};
		}

		return cache.nth[argument] = parsed;
	};
	
	var pseudos = {

		// w3c pseudo selectors

		'checked': function(){
			return this.checked;
		},

		'empty': function(){
			return !(this.innerText || this.textContent || '').length;
		},

		'not': function(selector){
			return !slick.match(this, selector);
		},

		'contains': function(text){
			return ((this.innerText || this.textContent || '').indexOf(text) > -1);
		},

		'first-child': function(){
			return pseudos.index.call(this, 0);
		},

		'last-child': function(){
			var element = this;
			while ((element = element.nextSibling)){
				if (element.nodeType == 1) return false;
			}
			return true;
		},

		'only-child': function(){
			var prev = this;
			while ((prev = prev.previousSibling)){
				if (prev.nodeType == 1) return false;
			}
			var next = this;
			while ((next = next.nextSibling)){
				if (next.nodeType == 1) return false;
			}
			return true;
		},

		'nth-child': function(argument){
			argument = (argument == null) ? 'n' : argument;
			var parsed = parseNTHArgument(argument);
			if (parsed.special != 'n') return pseudos[parsed.special].call(this, parsed.a);
			var count = 0;
			var buffer = slick.buffer;
			if (!buffer.positions) buffer.positions = {};
			var uid = uidOf(this);
			if (!buffer.positions[uid]){
				var self = this;
				while ((self = self.previousSibling)){
					if (self.nodeType != 1) continue;
					count ++;
					var position = buffer.positions[uidOf(self)];
					if (position != null){
						count = position + count;
						break;
					}
				}
				buffer.positions[uid] = count;
			}
			return (buffer.positions[uid] % parsed.a == parsed.b);
		},

		// custom pseudo selectors

		index: function(index){
			var element = this, count = 0;
			while ((element = element.previousSibling)){
				if (element.nodeType == 1 && ++count > index) return false;
			}
			return (count == index);
		},

		even: function(argument){
			return pseudos['nth-child'].call(this, '2n+1');
		},

		odd: function(argument){
			return pseudos['nth-child'].call(this, '2n');
		}

	};
	
	// fast indexOf with a separator (' ') checking.
	
	function stringContains(source, string, separator){
		separator = separator || '';
		return (separator + source + separator).indexOf(separator + string + separator) > -1;
	};
	
	// checks if a Node is in the "uniques" object literal. If its not, returns true and sets its uid, otherwise returns false.
	// If an uniques object is not passed, the function returns true.
	
	function pushedNodeInUniques(node){
		var sbu = slick.buffer.uniques;
		if (!sbu) return true;
		var uid = uidOf(node);
		if (!sbu[uid]) return sbu[uid] = true;
		return false;
	};
	
	// parses tagName and ID from a selector, and returns an array [tag, id]
	
	function parseTagAndID(selector){
		var tag = selector.match(regExps.tag);
		var id = selector.match(regExps.id);
		return [(tag) ? tag[1] : '*', (id) ? id[1] : false];
	};
	
	// parses a selector (classNames, attributes, pseudos) into an object and saves it in the cache for faster re-parsing.
	
	function parseSelector(selector){
		if (cache.selectors[selector]) return cache.selectors[selector];
		var m, parsed = {classes: [], pseudos: [], attributes: []};
		while ((m = regExps.combined.exec(selector))){
			var cn = m[1], an = m[2], ao = m[3], av = m[5], pn = m[6], pa = m[7];
			if (cn){
				parsed.classes.push(cn);
			} else if (pn){
				var parser = pseudos[pn];
				if (parser) parsed.pseudos.push({parser: parser, argument: pa});
				else parsed.attributes.push({name: pn, operator: '=', value: pa});
			} else if (an){
				parsed.attributes.push({name: an, operator: ao, value: av});
			}
		}
		if (!parsed.classes.length) delete parsed.classes;
		if (!parsed.attributes.length) delete parsed.attributes;
		if (!parsed.pseudos.length) delete parsed.pseudos;
		if (!parsed.classes && !parsed.attributes && !parsed.pseudos) parsed = null;
		return cache.selectors[selector] = parsed;
	};
	
	// methods to match a node against tag, id, className, attribute and pseudo
	
	function matchNodeByTag(node, tag){
		return (tag == '*' || (node.tagName && node.tagName.toLowerCase() == tag));
	};
	
	function matchNodeByID(node, id){
		return (!id || (node.id && node.id == id));
	};
	
	function matchNodeByClass(node, className){
		return (node.className && stringContains(node.className, className, ' '));
	};
	
	function matchNodeByPseudo(node, parser, argument){
		return parser.call(node, argument);
	};
	
	function matchNodeByAttribute(node, name, operator, value){
		var result = slick.getAttribute(node, name);
		if (!result) return (operator == '!=');
		if (!operator || value == null) return true;
		switch (operator){
			case '=': return (result == value);
			case '*=': return (result.indexOf(value) > -1);
			case '^=': return (result.substr(0, value.length) == value);
			case '$=': return (result.substr(result.length - value.length) == value);
			case '!=': return (result != value);
			case '~=': return stringContains(result,value, ' ');
			case '|=': return stringContains(result, value, '-');
		}
		return false;
	};
	
	// matches a node against a parsed selector
	
	function matchNodeBySelector(node, tag, id, parsed){
		if (slick.buffer.uniques && !pushedNodeInUniques(node)) return false;
		if (tag && !matchNodeByTag(node, tag)) return false;
		if (id && !matchNodeByID(node, id)) return false;
		
		if (!parsed) return true; //no parsers
		
		var i;
		if (parsed.classes){
			for (i = parsed.classes.length; i--; i){
				var cn = parsed.classes[i];
				if (!matchNodeByClass(node, cn)) return false;
			}
		}
		if (parsed.attributes){
			for (i = parsed.attributes.length; i--; i){
				var att = parsed.attributes[i];
				if (!matchNodeByAttribute(node, att.name, att.operator, att.value)) return false;
			}
		}
		if (parsed.pseudos){
			for (i = parsed.pseudos.length; i--; i){
				var psd = parsed.pseudos[i];
				psd.parser || (psd.parser = pseudos[psd.name]);
				if (!psd.parser || !(psd.parser).call(node, psd.argument)) return false;
			}
		}
		return true;
	};
	
	// retrieves elements by tag and id, based on context.
	// In case an id is passed, an array containing one element will be returned (or empty, if no id was found).
	
	function getNodesBySelector(context, tag, id, parsed){
		if (id && context.getElementById){
			var node = context.getElementById(id);
			if (node && !matchNodeBySelector(node, tag, null, parsed)) node = null;
			return (node) ? [node] : [];
		}
		return splitters[' ']([], context, tag, id, parsed);
	};
	
	// splitters
	var splitters = {

		' ': function allChildren(found, node, tag, id, parsed){
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++){
				if (matchNodeBySelector(children[i], null, id, parsed)) found.push(children[i]);
			}
			return found;
		},

		'>': function allSiblings(found, node, tag, id, parsed){
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.parentNode == node && matchNodeBySelector(child, null, id, parsed)) found.push(child);
			}
			return found;
		},

		'+': function nextSibling(found, node, tag, id, parsed){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					if (matchNodeBySelector(node, tag, id, parsed)) found.push(node);
					break;
				}
			}
			return found;
		},

		'~': function nextSiblings(found, node, tag, id, parsed){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					if (!pushedNodeInUniques(node)) break;
					if (matchNodeBySelector(node, tag, id, parsed, null)) found.push(node);
				}
			}
			return found;
		}

	};
	
	return slick;
	
})();

document.search = function(expression){
	return slick(document, expression);
};

// console.log(document.search('*:not([flarm])'));

