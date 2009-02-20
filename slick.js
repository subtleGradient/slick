var slick = (function(){
	
	// MAIN Method: searches a context for an expression.
	
	function slick(context, expression){
		var buffer = {}, parsed = slick.parse(expression);
		var all, uid;
		
		for (var i = 0; i < parsed.length; i++){
			
			var cs = parsed[i], items;
			
			for (var j = 0; j < cs.length; j++){
				var cb = cs[j], combinator = combinators[cb.combinator || ' '], selector = parseBit(cb), found = {};
				
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
			classes: bit.parsed.classes,
			attributes: bit.parsed.attributes,
			pseudos: bit.parsed.pseudos
		};
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
	
	// generates and returns, or simply returns if existing, an unique id for a Node.
	
	var uidOf = (function(){
		var index = 1;
		return (window.ActiveXObject) ? function uidOf(item){
			return (item.uid = [index++])[0];
		} : function uidOf(item){
			return (item.uid = index++);
		};
	})();
	
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
			var count = 0;
			if (!buffer.positions) buffer.positions = {};
			var uid = this.uid || uidOf(this);
			if (!buffer.positions[uid]){
				var self = this;
				while ((self = self.previousSibling)){
					if (self.nodeType != 1) continue;
					count ++;
					var uis = self.uid || uidOf(self);
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
			var tag = selector.tag, id = selector.id;
			
			//id optimization
			
			if (id && node.getElementById){
				var item = node.getElementById(id);
				selector.id = null;
				var matches =  !!(item && matchNodeBySelector(item, selector, buffer));
				selector.id = id;
				if (matches) found[item.uid || uidOf(item)] = item;
				return;
			}
			
			//end id optimization
			
			var children = node.getElementsByTagName(tag);
			selector.tag = null;

			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				var uid = child.uid || uidOf(child);
				if (!found[uid] && matchNodeBySelector(child, selector, buffer)) found[uid] = child;
			}
			
			selector.tag = tag;
		},

		'>': function directChildren(found, node, selector, buffer){
			var children = node.childNodes;
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.nodeType == 1){
					var uid = child.uid || uidOf(child);
					if (!found[uid] && matchNodeBySelector(child, selector, buffer)) found[uid] = child;
				}
			}
		},

		'+': function nextSibling(found, node, selector, buffer){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					var uid = node.uid || uidOf(node);
					if (!found[uid] && matchNodeBySelector(node, selector, buffer)) found[uid] = node;
					break;
				}
			}
		},

		'~': function nextSiblings(found, node, selector, buffer){
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					var uid = node.uid || uidOf(node);
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

