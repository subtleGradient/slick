define(function(){
    var getters = {
        
        'class': function(){
            return this.getAttribute('class') || this.className;
        },
        
        'for': function(){
            return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
        },
        
        href: function(){
            return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
        },
        
        style: function(){
            return (this.style) ? this.style.cssText : this.getAttribute('style');
        },
        
        tabindex: function(){
            var attributeNode = this.getAttributeNode('tabindex');
            return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
        },
        
        type: function(){
            return this.getAttribute('type');
        },
        
        maxLength: function(){
            var attributeNode = this.getAttributeNode('maxLength');
            return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
        }
        
    };
    
    getters.MAXLENGTH = getters.maxlength = getters.maxLength;
    
    return getters;
});
