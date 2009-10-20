function specsSelectorEngineBugs(specs,context){
	
	var bodyElement;
	specs.before_each = function(){
		testNode = context.document.createElement('div');
		bodyElement = context.document.getElementsByTagName('body')[0];
		bodyElement = bodyElement || context.document.documentElement;
		if (bodyElement)
			bodyElement.appendChild(testNode);
	};
	specs.after_each = function(){
		testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
		testNode = null;
	};
	
	it['document should have a documentElement'] = function(){
		value_of( context.document.documentElement ).should_not_be_undefined();
		value_of( context.document.documentElement.childNodes.length ).should_not_be_undefined();
	};
	
	it['document should have nodes'] = function(){
		value_of( context.document.getElementsByTagName('*').length ).should_not_be( 0 );
	};
	
	it['should not return not-nodes'] = function(){
		var results = context.Slick(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i] ).should_not_be_undefined();
			value_of( results[i].nodeName ).should_not_be_undefined();
		}
	};
	
	it['should not return close nodes'] = function(){
		var results = context.Slick(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^\//);
		}
	};
	
	if (context.document && context.document.querySelectorAll)
	it['should not return closed nodes with QSA'] = function(){
		testNode.innerHTML = 'foo</foo>';
		var results = context.Slick(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	if ($try(function(){ return context.document.createElement('/foo').nodeName.substring(0,1)=='/'; }))
	it['should not return closed nodes without QSA'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('/foo');testNode.appendChild(tmpNode);
		value_of( tmpNode.nodeName ).should_be('/foo');
		
		context.Slick.disableQSA = true;
		var results = context.Slick(testNode,'*');
		context.Slick.disableQSA = false;
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	// it['should not return closed nodes2'] = function(){
	// 	testNode.innerHTML = '<foo>foo</foo> <bar>bar</bar> <baz>baz</baz>';
	// 	
	// 	var results = context.Slick(testNode, '*');
	// 	value_of( results.length ).should_be(3);
	// };
	
	it['should not return comment nodes'] = function(){
		var results = context.Slick(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^#/);
		}
	};
	
	it['should return an element with the second class defined to it'] = function(){
		var className = 'class1 class2';
		var tmpNode;
		tmpNode = context.document.createElement('span');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNode.appendChild(tmpNode);
		
		value_of( tmpNode.getAttribute('class') ).should_be( className );
		value_of( testNode.childNodes.length ).should_be( 1 );
		value_of( testNode.firstChild ).should_be( tmpNode );
		
		value_of( testNode.className || tmpNode.getAttribute('class') ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[0]) + '(\\s|$)') );
		value_of( testNode.className || tmpNode.getAttribute('class') ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[1]) + '(\\s|$)') );
		
		// if (!tmpNode.className){
		// 	for (var mockName in global.mocks) {
		// 		if (context == global.mocks[mockName]) alert(mockName);
		// 	}
		// }
		
		// value_of( tmpNode.className ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[0]) + '(\\s|$)') );
		// value_of( tmpNode.className ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[1]) + '(\\s|$)') );
		
		// if (!test) test = function(value){
		// 	return value && regexp.test(value);
		// };
		// new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className) + '(\\s|$)')
		
		var results = context.Slick(testNode, '.class2');
		value_of( results.length ).should_be(1);
	};
	
	it['should return the elements with passed class'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('span');tmpNode.setAttribute('class','f');tmpNode.setAttribute('className','f');testNode.appendChild(tmpNode);
		tmpNode = context.document.createElement('span');tmpNode.setAttribute('class','b');tmpNode.setAttribute('className','b');testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '.b');
		value_of( results.length ).should_be(1);
		
		testNode.firstChild.setAttribute('class','b');testNode.firstChild.setAttribute('className','b');
		var results = context.Slick(testNode, '.b');
		value_of( results.length ).should_be(2);
	};
	
	it['should return the element with passed id even if the context is not in the DOM'] = function(){
		testNode.parentNode.removeChild(testNode);
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('id', 'someuniqueid');tmpNode.setAttribute('type','text');testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '#someuniqueid');
		value_of( results.length ).should_be(1);
		value_of( results[0].tagName ).should_match(/INPUT/i);
		value_of( results[0].getAttribute('type') ).should_be('text');
	};
	
	it['should not return an element without the id equals to the passed id'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('name','f');tmpNode.setAttribute('type','text');testNode.appendChild(tmpNode);
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('id',  'f');tmpNode.setAttribute('type','password');testNode.appendChild(tmpNode);
		
		var results = context.Slick(testNode, '#f');
		value_of( results.length ).should_be( 1 );
		
		var results = context.Slick(context.document, '#f');
		value_of( results.length ).should_be( 1 );
		value_of( results[0].getAttribute('type') ).should_be('password');
	};
	
};
