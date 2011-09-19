define({

	getters: {},
	
	define: function(name, fn){
		this.getters[name] = fn;
		return this;
	},

	lookup: function(name){
		return this.getters[name];
	},

	has: function(node, attribute){
		return node.hasAttribute(attribute);
	},

	get: function(node, attribute){
		var getter = this.getters[attribute];
		if (getter) return getter.call(node, attribute);
		return node.getAttribute(name);
	}
});
