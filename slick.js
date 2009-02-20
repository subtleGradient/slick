var SubtleSlickParse = (function(){
	function SubtleSlickParse(CSS3_Selectors){
		var selector = ''+CSS3_Selectors;
		if(!SubtleSlickParse.debug && cache[selector]) return cache[selector];
		parsedSelectors = [];
		parsedSelectors.type=[];
		
		while (selector != (selector = selector.replace(parseregexp, parser)));
		
		// parsedSelectors.type=parsedSelectors.type.join('');
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
		)".replace(/\(\?x\)|\s+#.*$|\s+/gim,''),'i');
	var map = {
		// Natural replace function argument position
		rawMatch      : 0,
		offset        : -2,
		string        : -1,
		
		// Replace function argument position
		separator       : 1,
		combinator      : 2,
		
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
	var MAP = (function(){
		var obj = {};
		for (var property in map) {
			var value = map[property];
			if (value<1) continue;
			obj[value] = property;
		}
		return obj;
	})();
	var cache = {};
	SubtleSlickParse.cache = cache;
	var parsedSelectors;
	var these_simpleSelectors;
	var this_simpleSelector;
	function parser(){
		var a = arguments;
		var selectorBitMap;
		var selectorBitName;
		
		for (var aN=1; aN < a.length; aN++) {
			if (a[aN]!==undefined) {
				console.log(a[aN]);
				selectorBitMap = aN;
				selectorBitName = MAP[selectorBitMap];
				// console.log(selectorBit);
				break;
			}
		}
		
		console.log((function(){
			var o = {};
			o[selectorBitName] = a[selectorBitMap]
			return o;
		})());
		
		if (!parsedSelectors.length || a[map.separator]) {
			// Make a new selector!
			parsedSelectors.push([]);
			these_simpleSelectors = parsedSelectors[parsedSelectors.length-1];
			if (parsedSelectors.length-1) return '';
		}
		
		if (!these_simpleSelectors.length || a[map.combinator]) {
			// Make a new simple selector!
			these_simpleSelectors.push({
				bits:0,
				combinator: a[map.combinator],
				tag : null,
				id  : null,
				pseudos    :[],
				classes    :[],
				attributes :[]
			});
			this_simpleSelector = these_simpleSelectors[these_simpleSelectors.length-1];
			parsedSelectors.type.push(this_simpleSelector.combinator);
			if (these_simpleSelectors.length-1) return '';
		}
		
		switch(selectorBitMap){
		case map.tagName:
			this_simpleSelector.tag = a[map.tagName];
			break;
		case map.id:
			this_simpleSelector.id  = a[map.id];
			break;
		case map.className:
			this_simpleSelector.classes.push(a[map.className]);
			break;
		case map.attribute:
			this_simpleSelector.attributes.push({
				name     : a[map.attributeKey],
				operator : a[map.attributeOperator],
				value    : a[map.attributeValue] || a[map.attributeValueDouble] || a[map.attributeValueSingle]
			});
			break;
		case map.pseudoClass:
			this_simpleSelector.pseudos.push({
				name     : a[map.pseudoClass],
				argument : a[map.pseudoClassValue]
			});
			break;
		default:
			
		}
		
		this_simpleSelector.bits ++;
		parsedSelectors.type.push(selectorBitName + (a[map.attributeOperator]||''))
		return '';
	};
	
	return SubtleSlickParse;
})();

// document.write(pp(SubtleSlickParse('a.class b.class[attr][attr=""] > c.class:pseudo ~ d.class:pseudo(arg) + e.class')));

var slick = (function(){
	
	// MAIN Method: searches a context for an expression.
	
	function slick(context, expression){
		var buffer = {}, parsed = slick.parse(expression);
		var all, uid;
		
		// WIP ATTEMPT TO SPEEDUP
		
		// if (parsed.length == 1 && parsed[0].length == 1){
		// 	var bit = parsed[0][0];
		// 	var comBit = combinators[bit.combinator || ' '];
		// 	var selBit = parseBit(bit);
		// 	var founBit = [];
		// 	comBit(founBit, context, selBit, buffer);
		// 	return founBit;
		// }
		
		for (var i = 0; i < parsed.length; i++){
			
			var currentSelector = parsed[i], items;
			
			for (var j = 0; j < currentSelector.length; j++){
				var currentBit = currentSelector[j], combinator = combinators[currentBit.combinator || ' '];
				var selector = parseBit(currentBit), found = {};
				
				if (j == 0){
					combinator(found, context, selector, buffer);
				} else {
					for (uid in items) combinator(found, items[uid], selector, buffer);
				}
				
				items = found;
			}
			
			if (i == 0){
				all = items;
			} else {
				for (uid in items) all[uid] = items[uid];
			}
		}
		
		var nodes = [], idx = 0;
		for (uid in all) nodes[idx++] = all[uid];
		return nodes;
	};
	
	function parseBit(bit){
		return {
			tag: bit.tag || '*',
			id: bit.id,
			classes: bit.classes,
			attributes: bit.attributes,
			pseudos: bit.pseudos
		};
	};
	
	// plan of attack
	// what is QSA good for?
	// when it's available
	// selector has attribute && when we're not using custom getters
	// selector has pseudoclass && when we're not using custom pseudoclasses
	
	var usingCustomGetter = function(){ return slick.getAttribute==getAttribute };
	var qsa = document.querySelectorAll;
	
	qsa && function canUseQSA(selector){
		return qsa
			&& !(selector.attribs.length && usingCustomGetter())
			&& !selector.pseudos.length; // FIXME: check for custom unstable or unsupported pseudos only!
	} || function canUseQSA(){return false;};
	
	var getByTagOrClass = (document.getElementsByClassName && document.getElementsByClassName.toString().indexOf('[native code]')+1 && document.getElementsByClassName);
	
	// Develop plan of attack
	function selectorToSearcher(context, parsedSelectors){
		if (canUseQSA(context, parsedSelectors)) return qsa(parsedSelectors);
	};
	
	
	// pseudoselectors accessors
	
	slick.addPseudoSelector = function(name, fn){
		pseudos[name] = fn;
	};
	
	slick.getPseudoSelector = function(name){
		return pseudos[name];
	};
	
	// default getAttribute
	
	slick.getAttribute = function getAttribute(node, name){
		if (name == 'class') return node.className;
		return node.getAttribute(name);
	};
	
	// default parser
	
	slick.parse = function(){};
	
	//default slicer
	
	slick.slice = function(nodes){
		return nodes;
	};
	
	slick.match = function(node, selector, buffer){
		if (!selector || selector === node) return true;
		return matchNodeBySelector(node, parseBit(slick.parse(selector)[0][0]), buffer || {});
	};
	
	// PRIVATE STUFF! Cant touch! AHAHA
	
	// uid index
	
	var index = 1;
	
	// nth argument parsed cache
	
	var cache = {nth: {}};
	
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

		'checked': function pseudoChecked(){
			return this.checked;
		},

		'empty': function pseudoEmpty(){
			return !(this.innerText || this.textContent || '').length;
		},

		'not': function pseudoNot(selector, buffer){
			return !slick.match(this, selector, buffer);
		},

		'contains': function pseudoContains(text){
			return ((this.innerText || this.textContent || '').indexOf(text) > -1);
		},

		'first-child': function pseudoFirstChild(){
			return pseudos.index.call(this, 0);
		},

		'last-child': function pseudoLastChild(){
			var element = this;
			while ((element = element.nextSibling)){
				if (element.nodeType == 1) return false;
			}
			return true;
		},

		'only-child': function pseudoOnlyChild(){
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

		'nth-child': function pseudoNthChild(argument, buffer){
			argument = (argument == null) ? 'n' : argument;
			var parsed = cache.nth[argument] || parseNTHArgument(argument);
			if (parsed.special != 'n') return pseudos[parsed.special].call(this, parsed.a, buffer);
			var count = 0, uid = this.uid || (this.uid = index++);
			
			if (!buffer.positions) buffer.positions = {};
			if (!buffer.positions[uid]){
				var self = this;				
				while ((self = self.previousSibling)){
					if (self.nodeType != 1) continue;
					count ++;
					var uis = self.uid || (self.uid = index++);
					var position = buffer.positions[uis];
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

		'index': function pseudoIndex(index){
			var element = this, count = 0;
			while ((element = element.previousSibling)){
				if (element.nodeType == 1 && ++count > index) return false;
			}
			return (count == index);
		},

		'even': function pseudoEven(argument, buffer){
			return pseudos['nth-child'].call(this, '2n+1', buffer);
		},

		'odd': function pseudoOdd(argument, buffer){
			return pseudos['nth-child'].call(this, '2n', buffer);
		}

	};
	
	// fast indexOf with a separator (' ') checking.
	
	function stringContains(source, string, separator){
		separator = separator || '';
		return (separator + source + separator).indexOf(separator + string + separator) > -1;
	};
	
	// methods to match a node against tag, id, className, attribute and pseudo
	
	function matchNodeByTag(node, tag){
		return (tag == '*' || (node.tagName && node.tagName.toLowerCase() == tag));
	};
	
	function matchNodeByID(node, id){
		return ((node.id && node.id == id));
	};
	
	function matchNodeByClass(node, className){
		return (stringContains(node.className, className, ' '));
	};
	
	function matchNodeByPseudo(node, name, argument, buffer){
		var parser = pseudos[name];
		if (parser) return parser.call(node, argument, buffer);
		return matchNodeByAttribute(node, name, '=', argument);
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
	
	function matchNodeBySelector(node, selector, buffer){
		
		if (selector.tag && !matchNodeByTag(node, selector.tag)) return false;
		if (selector.id && !matchNodeByID(node, selector.id)) return false;
		
		var i;
		
		for (i = selector.classes.length; i--; i){
			var cn = selector.classes[i];
			if (!node.className || !matchNodeByClass(node, cn)) return false;
		}
		
		for (i = selector.attributes.length; i--; i){
			var attribute = selector.attributes[i];
			if (!matchNodeByAttribute(node, attribute.name, attribute.operator, attribute.value)) return false;
		}
		
		for (i = selector.pseudos.length; i--; i){
			var pseudo = selector.pseudos[i];
			if (!matchNodeByPseudo(node, pseudo.name, pseudo.argument, buffer)) return false;
		}
		
		return true;
	};
	
	// combinators
	
	var combinators = {

		' ': function allChildren(found, node, selector, buffer){
			var tag = selector.tag, id = selector.id, uid;
			
			//id optimization
			
			if (id && node.getElementById){
				var item = node.getElementById(id);
				selector.id = null;
				if (!item) return;
				uid = item.uid || (item.uid = index++);
				if (found[uid]) return;
				var matches =  matchNodeBySelector(item, selector, buffer);
				selector.id = id;
				if (matches) found[uid] = item;
				return;
			}
			
			//end id optimization
			
			var children = node.getElementsByTagName(tag);
			selector.tag = null;

			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				uid = child.uid || (child.uid = index++);
				if (!found[uid] && matchNodeBySelector(child, selector, buffer)) found[uid] = child;
			}
			
			selector.tag = tag;
		},

		'>': function directChildren(found, node, selector, buffer){
			var children = node.childNodes;
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.nodeType == 1){
					var uid = child.uid || (child.uid = index++);
					if (!found[uid] && matchNodeBySelector(child, selector, buffer)) found[uid] = child;
				}
			}
		},

		'+': function nextSibling(found, node, selector, buffer){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					var uid = node.uid || (node.uid = index++);
					if (!found[uid] && matchNodeBySelector(node, selector, buffer)) found[uid] = node;
					break;
				}
			}
		},

		'~': function nextSiblings(found, node, selector, buffer){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					var uid = node.uid || (node.uid = index++);
					if (found[uid]) break;
					if (matchNodeBySelector(node, selector, buffer)) found[uid] = node;
				}
			}
		}

	};
	
	return slick;
	
})();

slick.parse = SubtleSlickParse;

document.search = function(expression){
	return slick(document, expression);
};

