/* Subtle Parser */

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
			if (a[aN]) {
				SubtleSlickParse.debug && console.log(a[aN]);
				selectorBitMap = aN;
				selectorBitName = MAP[selectorBitMap];
				break;
			}
		}
		
		SubtleSlickParse.debug && console.log((function(){
			var o = {};
			o[selectorBitName] = a[selectorBitMap];
			return o;
		})());
		
		if (!parsedSelectors.length || a[map.separator]) {
			// Make a new selector!
			parsedSelectors.push([]);
			these_simpleSelectors = parsedSelectors[parsedSelectors.length-1];
			if (parsedSelectors.length-1) return '';
		}
		
		if (!these_simpleSelectors.length || a[map.combinator]) {
			this_simpleSelector && (this_simpleSelector.reverseCombinator = a[map.combinator]);
			// Make a new simple selector!
			these_simpleSelectors.push({
				// bits:0,
				combinator: a[map.combinator]
				// tag : '*'
				// id  : null,
				// pseudos    :[],
				// classes    :[],
				// attributes :[]
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
			if(!this_simpleSelector.classes)
				this_simpleSelector.classes = []
			;
			this_simpleSelector.classes.push(a[map.className]);
			break;
			
		case map.attribute:
			if(!this_simpleSelector.attributes)
				this_simpleSelector.attributes = []
			;
			this_simpleSelector.attributes.push({
				name     : a[map.attributeKey],
				operator : a[map.attributeOperator],
				value    : a[map.attributeValue] || a[map.attributeValueDouble] || a[map.attributeValueSingle]
			});
			break;
			
		case map.pseudoClass:
			if(!this_simpleSelector.pseudos)
				this_simpleSelector.pseudos = []
			;
			var pseudoClassValue = a[map.pseudoClassValue];
			if (pseudoClassValue == 'odd') pseudoClassValue = '2n+1';
			if (pseudoClassValue == 'even') pseudoClassValue = '2n';
			
			this_simpleSelector.pseudos.push({
				name     : a[map.pseudoClass],
				argument : pseudoClassValue
			});
			break;
		}
		
		parsedSelectors.type.push(selectorBitName + (a[map.attributeOperator]||''));
		return '';
	};
	
	return SubtleSlickParse;
})();

/* Slick */

var slick = (function(){
	
	// slick function
	
	function slick(context, expression){
		var buff = buffer.reset();
		
		var parsed = slick.parse(expression);
		var all, uid, buffPushArray = buff['push(array)'], buffPushObject = buff['push(object)'];
		var parseBit = buff['util(parse-bit)'];
		
		for (var i = 0; i < parsed.length; i++){
			
			var currentSelector = parsed[i], items;
			
			for (var j = 0; j < currentSelector.length; j++){
				var currentBit = currentSelector[j], combinator = 'combinator(' + (currentBit.combinator || ' ') + ')';
				var selector = parseBit(currentBit);
				var tag = selector[0], id = selector[1], params = selector[2];
				
				buff.state.found = [];
				buff.state.uniques = {};
				buff.state.idx = 0;
				
				if (j == 0){
					buff.push = buffPushArray;
					buff[combinator](context, tag, id, params);
				} else {
					buff.push = buffPushObject;
					for (var m = 0, n = items.length; m < n; m++) buff[combinator](items[m], tag, id, params);
				}
				
				items = buffer.state.found;
			}
			
			if (i == 0){
				all = items;
			} else {
				all = all.concat(items);
			}
		}
		
		if (parsed.length > 1){
			var nodes = [], uniques = {}, idx = 0;
			for (var k = 0; k < all.length; k++){
				var node = all[k];
				uid = buff['util(uid)'](node);
				if (!uniques[uid]){
					nodes[idx++] = node;
					uniques[uid] = true;
				}
			}
			return nodes;
		}
		return all;
	};
	
	// public pseudos
	
	var pseudos = {};
	
	slick.addPseudoSelector = function(name, fn){
		pseudos['pseudo(' + name + ')'] = fn;
		return slick;
	};
	
	slick.getPseudoSelector = function(name){
		return pseudos['pseudo(' + name + ')'];
	};
	
	// default getAttribute
	
	slick.getAttribute = function(node, name){
		if (name == 'class') return node.className;
		return node.getAttribute(name);
	};
	
	// default parser
	
	slick.parse = function(object){
		return object;
	};
	
	slick.match = function(node, selector, buff){
		if (!selector || selector === node) return true;
		if (!buff) buff = buffer.reset();
		var parsed = buff['util(parse-bit)'](slick.parse(selector)[0][0]);
		return buff['match(selector)'](node, parsed[0], parsed[1], parsed[2]);
	};
	
	var buffer = {
		
		// cache
		
		cache: {nth: {}},
		
		// uid index
		
		uidx: 1,
		
		// resets buffer state
		
		reset: function(){
			this.state = {positions: {}};
			return this;
		},
		
		// combinators
		
		'combinator( )': function(node, tag, id, selector){
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++) this.push(children[i], null, id, selector);
		},
		
		'combinator(>)': function(node, tag, id, selector){
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.parentNode === node) this.push(child, null, id, selector);
			}
		},
		
		'combinator(+)': function(node, tag, id, selector){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1){
					this.push(node, tag, id, selector);
					break;
				}
			}
		},
		
		'combinator(~)': function(node, tag, id, selector){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1){
					var uid = this['util(uid)'](node);
					if (this.state.uniques[uid]) break;
					if (this['match(selector)'](node, tag, id, selector)){
						this.state.uniques[uid] = true;
						this.state.found.push(node);
					}
				}
			}
		},
		
		// pseudo
		
		'pseudo(checked)': function(node){
			return node.checked;
		},

		'pseudo(empty)': function(node){
			return !(node.innerText || node.textContent || '').length;
		},

		'pseudo(not)': function(node, selector){
			return !slick.match(node, selector, this);
		},

		'pseudo(contains)': function(node, text){
			return ((node.innerText || node.textContent || '').indexOf(text) > -1);
		},

		'pseudo(first-child)': function(node){
			return this['pseudo(index)'](node, 0);
		},

		'pseudo(last-child)': function(node){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1) return false;
			}
			return true;
		},

		'pseudo(only-child)': function(node){
			var prev = node;
			while ((prev = prev.previousSibling)){
				if (prev.nodeType === 1) return false;
			}
			var next = node;
			while ((next = next.nextSibling)){
				if (next.nodeType === 1) return false;
			}
			return true;
		},

		'pseudo(nth-child)': function(node, argument){
			argument = (!argument) ? 'n' : argument;
			var parsed = this.cache.nth[argument] || this['util(parse-nth-argument)'](argument);
			if (parsed.special != 'n') return this['pseudo(' + parsed.special + ')'](node, argument);
			if (parsed.a === 1 && parsed.b === 0) return true;
			var count = 0, uid = this['util(uid)'](node);
			if (!this.state.positions[uid]){
				while ((node = node.previousSibling)){
					if (node.nodeType !== 1) continue;
					count ++;
					var uis = this['util(uid)'](node);
					var position = this.state.positions[uis];
					if (position != null){
						count = position + count;
						break;
					}
				}
				this.state.positions[uid] = count;
			}
			return (this.state.positions[uid] % parsed.a === parsed.b);
		},

		// custom pseudo selectors

		'pseudo(index)': function(node, index){
			var count = 0;
			while ((node = node.previousSibling)){
				if (node.nodeType === 1 && ++count > index) return false;
			}
			return (count === index);
		},

		'pseudo(even)': function(node, argument){
			return this['pseudo(nth-child)'](node, '2n+1');
		},

		'pseudo(odd)': function(node, argument){
			return this['pseudo(nth-child)'](node, '2n');
		},
		
		// util
		
		'util(uid)': (window.ActiveXObject) ? function(node){
			return (node.sLick_uid || (node.sLick_uid = [this.uidx++]))[0];
		} : function(node){
			return node.sLick_uid || (node.sLick_uid = this.uidx++);
		},
		
		'util(parse-nth-argument)': function(argument){
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

			return this.cache.nth[argument] = parsed;
		},
		
		'util(parse-bit)': function(bit){
			var selector = {
				classes: bit.classes || [],
				attributes: bit.attributes || [],
				pseudos: bit.pseudos || []
			};
			
			for (var i = 0; i < selector.pseudos.length; i++){
				var pseudo = selector.pseudos[i];
				if (!pseudo.newName){
					pseudo.name = 'pseudo(' + pseudo.name + ')';
					pseudo.newName = true;
				}
			};
			
			return [bit.tag || '*', bit.id, selector];
		},
		
		'util(string-contains)': function(source, string, separator){
			separator = separator || '';
			return (separator + source + separator).indexOf(separator + string + separator) > -1;
		},
		
		// match
		
		'match(tag)': function(node, tag){
			return (tag === '*' || (node.tagName && node.tagName.toLowerCase() === tag));
		},
		
		'match(id)': function(node, id){
			return ((node.id && node.id === id));
		},
		
		'match(class)': function(node, className){
			return (this['util(string-contains)'](node.className, className, ' '));
		},
		
		'match(attribute)': function(node, name, operator, value){
			var result = slick.getAttribute(node, name);
			if (!result) return (operator === '!=');
			if (!operator || value == null) return true;
			switch (operator){
				case '=': return (result === value);
				case '*=': return (result.indexOf(value) > -1);
				case '^=': return (result.substr(0, value.length) === value);
				case '$=': return (result.substr(result.length - value.length) === value);
				case '!=': return (result != value);
				case '~=': return this['util(string-contains)'](result,value, ' ');
				case '|=': return this['util(string-contains)'](result, value, '-');
			}
			return false;
		},
		
		'match(pseudo)': function(node, name, argument){
			if (this[name]){
				return this[name](node, argument);
			} else if (pseudos[name]){
				return pseudos[name].call(node, argument);
			} else {
				return this['match(attribute)'](node, name, '=', argument);
			}
		},
		
		'match(selector)': function(node, tag, id, selector){
			if (tag && !this['match(tag)'](node, tag)) return false;
			if (id && !this['match(id)'](node, id)) return false;

			var i;

			var classes = selector.classes;
			for (i = classes.length; i--; i){
				var className = classes[i];
				if (!node.className || !this['match(class)'](node, className)) return false;
			}

			var attributes = selector.attributes;
			for (i = attributes.length; i--; i){
				var attribute = attributes[i];
				if (!this['match(attribute)'](node, attribute.name, attribute.operator, attribute.value)) return false;
			}

			var pseudos = selector.pseudos;
			for (i = pseudos.length; i--; i){
				var pseudo = pseudos[i];
				if (!this['match(pseudo)'](node, pseudo.name, pseudo.argument)) return false;
			}

			return true;
		},
		
		// push
		
		'push(object)': function(node, tag, id, selector){
			var uid = this['util(uid)'](node);
			if (!this.state.uniques[uid] && this['match(selector)'](node, tag, id, selector)){
				this.state.uniques[uid] = true;
				this.state.found[this.state.idx++] = node;
			}
		},
		
		'push(array)': function(node, tag, id, selector){
			if (this['match(selector)'](node, tag, id, selector)) this.state.found[this.state.idx++] = node;
		}

	};
	
	return slick;

})();


slick.parse = SubtleSlickParse;

document.search = function(expression){
	return slick(document, expression);
};
