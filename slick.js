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
		)".replace(/\(\?x\)|\s+#.*$|\s+/gim,''),'i');
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
		var buff = buffer;
		buff.positions = {};
		
		var parsed = slick.parse(expression);
		var all, uid;
		
		for (var i = 0; i < parsed.length; i++){
			
			var currentSelector = parsed[i], items;
			
			for (var j = 0; j < currentSelector.length; j++){
				var currentBit = currentSelector[j], combinator = currentBit.combinator || ' ';
				var selector = buff.parseBit(buff, currentBit), found = [];
				var tag = selector.tag, id = selector.id;
				var pseudos = selector.pseudos, attributes = selector.attributes, classes = selector.classes;
				buff.uniques = {};
				
				if (j == 0){
					buff.push = buff.pushArray;
					buff.combinators[combinator](buff, context, found, tag, id, selector);
				} else {
					buff.push = buff.pushObject;
					var combinatorFunc = buff.combinators[combinator];
					for (var m = 0, n = items.length; m < n; m++) combinatorFunc(buff, items[m], found, tag, id, selector);
				}
				
				items = found;
			}
			
			if (i == 0){
				all = items;
			} else {
				all = all.concat(items);
			}
		}
		
		if (parsed.length > 1){
			var nodes = [], uniques = {};
			for (var k = 0; k < all.length; k++){
				var node = all[k];
				uid = buff.uidOf(node);
				if (!uniques[uid]){
					nodes.push(node);
					uniques[uid] = true;
				}
			}
			return nodes;
		}
		return all;
	};
	
	// pseudoselectors accessors
	
	slick.addPseudoSelector = function(name, fn){
		pseudos[name] = fn;
	};
	
	slick.getPseudoSelector = function(name){
		return pseudos[name];
	};
	
	// default getAttribute
	
	slick.getAttribute = function(node, name){
		if (name == 'class') return node.className;
		return node.getAttribute(name);
	};
	
	// default parser
	
	slick.parse = function(){};
	
	slick.match = function(node, selector, buff){
		if (!selector || selector === node) return true;
		if (!buff){
			buff = buffer;
			buffer.positions = {};
		}
		var pb = buffer.parseBit(buff, slick.parse(selector)[0][0]);
		return buff.matchNodeBySelector(buff, node, pb.tag, pb.id, pb);
	};
	
	var slice = function(nodes){
		return Array.prototype.slice.call(nodes, 0);
	};
	
	slick.slice = (function(){
		try {
			slice(document.getElementsByTagName('head'));
			return slice;
		} catch(e){
			return function(nodes){
				var array = [];
				for (var i = 0, l = nodes.length; i < l; i++) array[i] = nodes[i];
				return array;
			};
		}
		
	})();
	
	// PRIVATE
	
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
				if (element.nodeType === 1) return false;
			}
			return true;
		},

		'only-child': function pseudoOnlyChild(){
			var prev = this;
			while ((prev = prev.previousSibling)){
				if (prev.nodeType === 1) return false;
			}
			var next = this;
			while ((next = next.nextSibling)){
				if (next.nodeType === 1) return false;
			}
			return true;
		},

		'nth-child': function pseudoNthChild(argument, buffer){
			argument = (argument == null) ? 'n' : argument;
			var parsed = buffer.cache.nth[argument] || buffer.parseNTHArgument(buffer, argument);
			if (parsed.special != 'n') return buffer.pseudos[parsed.special].call(this, parsed.a, buffer);
			var count = 0, uid = buffer.uidOf(this);
			
			if (!buffer.positions) buffer.positions = {};
			if (!buffer.positions[uid]){
				var self = this;		
				while ((self = self.previousSibling)){
					if (self.nodeType != 1) continue;
					count ++;
					var uis = buffer.uidOf(self);
					var position = buffer.positions[uis];
					if (position != null){
						count = position + count;
						break;
					}
				}
				buffer.positions[uid] = count;
			}
			return (buffer.positions[uid] % parsed.a === parsed.b);
		},

		// custom pseudo selectors

		'index': function pseudoIndex(index){
			var element = this, count = 0;
			while ((element = element.previousSibling)){
				if (element.nodeType === 1 && ++count > index) return false;
			}
			return (count === index);
		},

		'even': function pseudoEven(argument, buffer){
			return pseudos['nth-child'].call(this, '2n+1', buffer);
		},

		'odd': function pseudoOdd(argument, buffer){
			return pseudos['nth-child'].call(this, '2n', buffer);
		}

	};
	
	// combinators
	
	var combinators = {
	
		' ': function allChildren(buffer, node, found, tag, id, selector){
			var uid;
			
			if (id && node.getElementById){
				var item = node.getElementById(id);
				if (item) buffer.push(buffer, item, found, tag, null, selector);
				return;
			}
			
			var children = node.getElementsByTagName(tag);
	
			for (var i = 0, l = children.length; i < l; i++) buffer.push(buffer, children[i], found, null, id, selector);
		},
	
		'>': function directChildren(buffer, node, found, tag, id, selector){
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.parentNode === node) buffer.push(buffer, child, found, null, id, selector);
			}
		},
	
		'+': function nextSibling(buffer, node, found, tag, id, selector){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1){
					buffer.push(buffer, node, found, tag, id, selector);
					break;
				}
			}
		},
	
		'~': function nextSiblings(buffer, node, found, tag, id, selector){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1){
					var uid = buffer.uidOf(node);
					if (buffer.uniques[uid]) break;
					if (buffer.matchNodeBySelector(buffer, node, tag, id, selector)){
						buffer.uniques[uid] = true;
						found.push(node);
					}
				}
			}
		}
	
	};
	
	// Buffer
	
	var uidx = 1;
	
	var buffer = {
		
		pseudos: pseudos,
		
		combinators: combinators,
		
		cache: {nth: {}},
		
		uidOf: (window.ActiveXObject) ? function(node){
			return (node.uid || (node.uid = [uidx++]))[0];
		} : function(node){
			return node.uid || (node.uid = uidx++);
		},
		
		parseBit: function(buffer, bit){
			return {
				tag: bit.tag || '*',
				id: bit.id,
				classes: bit.parsed.classes,
				attributes: bit.parsed.attributes,
				pseudos: bit.parsed.pseudos
			};
		},
		
		parseNTHArgument: function(buffer, argument){
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

			return buffer.cache.nth[argument] = parsed;
		},
		
		stringContains: function(buffer, source, string, separator){
			separator = separator || '';
			return (separator + source + separator).indexOf(separator + string + separator) > -1;
		},
		
		matchNodeByTag: function(buffer, node, tag){
			return (tag === '*' || (node.tagName && node.tagName.toLowerCase() === tag));
		},
		
		matchNodeByID: function(buffer, node, id){
			return ((node.id && node.id === id));
		},

		matchNodeByClass: function(buffer, node, className){
			return (buffer.stringContains(buffer, node.className, className, ' '));
		},

		matchNodeByPseudo: function(buffer, node, name, argument){
			var parser = buffer.pseudos[name];
			if (parser) return parser.call(node, argument, buffer);
			return buffer.matchNodeByAttribute(node, name, '=', argument);
		},

		matchNodeByAttribute: function(buffer, node, name, operator, value){
			var result = slick.getAttribute(node, name);
			if (!result) return (operator === '!=');
			if (!operator || value == null) return true;
			switch (operator){
				case '=': return (result === value);
				case '*=': return (result.indexOf(value) > -1);
				case '^=': return (result.substr(0, value.length) === value);
				case '$=': return (result.substr(result.length - value.length) === value);
				case '!=': return (result != value);
				case '~=': return buffer.stringContains(buffer, result,value, ' ');
				case '|=': return buffer.stringContains(buffer, result, value, '-');
			}
			return false;
		},
		
		matchNodeBySelector: function(buffer, node, tag, id, selector){
			if (tag && !buffer.matchNodeByTag(buffer, node, tag)) return false;
			if (id && !buffer.matchNodeByID(buffer, node, id)) return false;

			var i;

			var sc = selector.classes;
			for (i = sc.length; i--; i){
				var cn = sc[i];
				if (!node.className || !buffer.matchNodeByClass(buffer, node, cn)) return false;
			}

			var sa = selector.attributes;				
			for (i = sa.length; i--; i){
				var attribute = sa[i];
				if (!buffer.matchNodeByAttribute(buffer, node, attribute.name, attribute.operator, attribute.value)) return false;
			}

			var sp = selector.pseudos;
			for (i = sp.length; i--; i){
				var pseudo = sp[i];
				if (!buffer.matchNodeByPseudo(buffer, node, pseudo.name, pseudo.argument)) return false;
			}

			return true;
		},
		
		pushObject: function(buffer, node, found, tag, id, selector){
			var uid = buffer.uidOf(node);
			if (!buffer.uniques[uid] && buffer.matchNodeBySelector(buffer, node, tag, id, selector)){
				buffer.uniques[uid] = true;
				found.push(node);
			}
		},

		pushArray: function(buffer, node, found, tag, id, selector){
			if (buffer.matchNodeBySelector(buffer, node, tag, id, selector)) found.push(node);
		}

	};
	
	return slick;
	
})();

slick.parse = SubtleSlickParse;

document.search = function(expression){
	return slick(document, expression);
};
