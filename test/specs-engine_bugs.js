function specsSelectorEngineBugs(specs,context){
	
	var bodyElement;
	specs.before_each = function(){
		testNode = context.document.createElement('div');
		bodyElement = context.document.getElementsByTagName('body')[0];
		bodyElement = bodyElement || context.document.documentElement;
		bodyElement.appendChild(testNode);
	};
	specs.after_each = function(){
		testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
		testNode = null;
	};
	
	it['should not return not-nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_be_undefined();
		}
	};
	
	it['should not return close nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^\//);
		}
	};
	
	if (context.document.querySelectorAll)
	it['should not return closed nodes with QSA'] = function(){
		testNode.innerHTML = 'foo</foo>';
		var results = context.Slick(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	it['should not return closed nodes without QSA'] = function(){
		context.Slick.disableQSA = true;
		testNode.innerHTML = 'foo</foo>';
		var results = context.Slick(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
		context.Slick.disableQSA = false;
	};
	
	// it['should not return closed nodes2'] = function(){
	// 	testNode.innerHTML = '<foo>foo</foo> <bar>bar</bar> <baz>baz</baz>';
	// 	
	// 	var results = context.Slick(testNode, '*');
	// 	value_of( results.length ).should_be(3);
	// };
	
	it['should not return comment nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^#/);
		}
	};
	
	it['should return an element with the second class defined to it'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('span');tmpNode.className = 'class1 class2';testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '.class2');
		value_of( results.length ).should_be(1);
	};
	
	it['should return the elements with passed class'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('span');tmpNode.className = 'f';testNode.appendChild(tmpNode);
		tmpNode = context.document.createElement('span');tmpNode.className = 'b';testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '.b');
		value_of( results.length ).should_be(1);
		
		testNode.firstChild.className = 'b';
		var results = context.Slick(testNode, '.b');
		value_of( results.length ).should_be(2);
	};
	
	it['should return the element with passed id even if the context is not in the DOM'] = function(){
		testNode.parentNode.removeChild(testNode);
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('id', 'someuniqueid');tmpNode.setAttribute('type','text');testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '#someuniqueid');
		value_of( results.length ).should_be(1);
		value_of( results[0].tagName ).should_be('INPUT');
		value_of( results[0].type ).should_be('text');
	};
	
	it['should not return an element without the id equals to the passed id'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('name','f');tmpNode.setAttribute('type','text');testNode.appendChild(tmpNode);
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('id',  'f');tmpNode.setAttribute('type','password');testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '#f');
		value_of( results.length ).should_be( 1 );
		
		var results = context.Slick(context.document, '#f');
		value_of( results.length ).should_be( 1 );
		value_of( results[0].type ).should_be('password');
	};
	
};
