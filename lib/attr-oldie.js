define(['./attr'], function(attr){
    
	// in IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input

    attr.get = function(node, attribute){
        var getter = this.getters[attribute];
        if (getter) return getter.call(node, attribute);
        var attributeNode = node.getAttributeNode(attribute);
        return attributeNode ? attributeNode.nodeValue : null;
    };
    
    attr.has = function(node, attribute){
		node = node.getAttributeNode(attribute);
		return !!(node && (node.specified || node.nodeValue));
	};
    
    return attr;
});
