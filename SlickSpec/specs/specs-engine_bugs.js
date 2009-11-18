function specsSelectorEngineBugs(specs,context){ Describe('Bugs',function(){
	
	var rootElement;
	var testNode;
	var isXML = context.isXML(context.document);
	var setup = 
	specs.before_each = function(){
		testNode = context.document.createElement('div');
		rootElement = context.document.getElementsByTagName('body')[0];
		rootElement = rootElement || context.document.documentElement;
		if (rootElement)
			rootElement.appendChild(testNode);
	};
	var teardown = 
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
		var results = context.SELECT(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i] ).should_not_be_undefined();
			value_of( results[i].nodeName ).should_not_be_undefined();
		}
	};
	
	it['should not return close nodes'] = function(){
		var results = context.SELECT(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^\//);
		}
	};
	
	var starIncludesClosedNodes = !!$try(function(){ return context.document.createElement('/foo').nodeName.substring(0,1)=='/'; });
	
	if (starIncludesClosedNodes && context.document && context.document.querySelectorAll)
	it['should not return closed nodes with QSA'] = function(){
		testNode.innerHTML = 'foo</foo>';
		var results = context.SELECT(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	if (starIncludesClosedNodes)
	it['should not return closed nodes without QSA'] = function(){
		var tmpNode;
		tmpNode = context.document.createElement('/foo');testNode.appendChild(tmpNode);
		value_of( tmpNode.nodeName ).should_be('/foo');
		
		context.SELECT.disableQSA = true;
		var results = context.SELECT(testNode,'*');
		context.SELECT.disableQSA = false;
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	// it['should not return closed nodes2'] = function(){
	// 	testNode.innerHTML = '<foo>foo</foo> <bar>bar</bar> <baz>baz</baz>';
	// 	
	// 	var results = context.SELECT(testNode, '*');
	// 	value_of( results.length ).should_be(3);
	// };
	
	it['should not return comment nodes'] = function(){
		var results = context.SELECT(context.document,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^#/);
		}
	};
	
	it['should return an element with the second class defined to it'] = function(){
		teardown();setup();
			
		var className = 'class1 class2';
		var tmpNode;
		tmpNode = context.document.createElement('span');
		tmpNode.setAttribute('class',className);
		tmpNode.setAttribute('className',className);
		testNode.appendChild(tmpNode);
		
		// value_of( tmpNode.getAttribute('class') ).should_be( className );
		// value_of( testNode.childNodes.length ).should_be( 1 );
		// value_of( testNode.firstChild ).should_be( tmpNode );
		// 
		// value_of( testNode.className || tmpNode.getAttribute('class') ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[0]) + '(\\s|$)') );
		// value_of( testNode.className || tmpNode.getAttribute('class') ).should_match( new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(className.split(' ')[1]) + '(\\s|$)') );
		
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
		
		var results = context.SELECT(testNode, '.class2');
		value_of( results[0] ).should_be(tmpNode);
	};
	
	it['should return the elements with passed class'] = function(){
		teardown();setup();
		var results;
		
		var tmpNode1; tmpNode1 = context.document.createElement('span'); tmpNode1.setAttribute('class','b'); tmpNode1.setAttribute('className','b'); testNode.appendChild(tmpNode1);
		var tmpNode2; tmpNode2 = context.document.createElement('span'); tmpNode2.setAttribute('class','b'); tmpNode2.setAttribute('className','b'); testNode.appendChild(tmpNode2);
		
		
		value_of( context.SELECT(testNode, '.b', []).length ).should_be(2);
		value_of( context.SELECT(testNode, '.f', []).length ).should_be(0);
		value_of( context.SELECT(testNode, '[class|=b]', []).length ).should_be(2);
		value_of( context.SELECT(testNode, '[class=b]', []).length ).should_be(2);
		
		value_of( context.SELECT(testNode, '.b', []).length ).should_not_be(0);
		value_of( context.SELECT(testNode, '.f', []).length ).should_be(0);
		
		results = context.SELECT(testNode, '.b');
		value_of( results.length ).should_be(2);
		
		value_of( tmpNode1.getAttribute('class') ).should_be('b');
		
		tmpNode1.removeAttribute('class');
		tmpNode1.removeAttribute('className');
		value_of( tmpNode1.getAttribute('class') ).should_be_null();
		
		tmpNode1.setAttribute('class','f');
		tmpNode1.setAttribute('className','f');
		
		value_of( tmpNode1.getAttribute('class') ).should_be('f');
		value_of( context.SELECT(tmpNode1, '.b', []).length ).should_be(0);
		value_of( context.SELECT(testNode, '.f', [])[0] ).should_be(tmpNode1);
		
		value_of( context.SELECT(testNode, '.b', []).length ).should_be(1);
		value_of( context.SELECT(testNode, '.f', []).length ).should_be(1);
		
		results = context.SELECT(testNode, '.b');
		value_of( results.length ).should_be(1);
		
		tmpNode1.removeAttribute('class');
		tmpNode1.removeAttribute('className');
		tmpNode1.setAttribute('class','b');
		tmpNode1.setAttribute('className','b');
		
		results = context.SELECT(testNode, '.b');
		value_of( results.length ).should_be(2);
	};
	
	it['should return the element with passed id even if the context is not in the DOM'] = function(){
		testNode.parentNode.removeChild(testNode);
		tmpNode = context.document.createElement('input');tmpNode.setAttribute('id', 'someuniqueid');tmpNode.setAttribute('type','text');testNode.appendChild(tmpNode);
		
		var results = context.SELECT(testNode, '#someuniqueid');
		value_of( results.length ).should_be(1);
		value_of( results[0].tagName ).should_match(/INPUT/i);
		value_of( results[0].getAttribute('type') ).should_be('text');
	};
	
});};


function specsBrowserBugsFixed(specs,context){ Describe('Bugs Fixed',function(specs,context){
	
	var rootElement;
	var testNode, tmpNode, tmpNode1, tmpNode2, tmpNode3, tmpNode4, tmpNode5, tmpNode6, tmpNode7, tmpNode8, tmpNode9;
	var isXML = context.isXML(context.document);
	var results, resultsArray;
	var setup = function(){
		testNode = context.document.createElement('div');
		rootElement = context.document.getElementsByTagName('body')[0];
		rootElement = rootElement || context.document.documentElement;
		rootElement.appendChild(testNode);
	};
	var teardown = function(){
		testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
		testNode = null;
	};
	
	Describe('SELECT [name]',function(){
		
		specs.before_each = setup;
		specs.after_each = teardown;
		
		it['Should match name attribute'] = function(){
			teardown();setup();
			
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = context.SELECT(testNode,'[name=getelementsbyname]',[]);
			value_of( results ).should_include(tmpNode1);
			
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = context.SELECT(testNode,'[name=getelementsbyname]',[]);
			value_of( results ).should_include(tmpNode1);
		};
		
		it['Should NOT match id attribute'] = function(){
			teardown();setup();
			
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = context.SELECT(testNode,'[name=getelementsbyname]');
			for (var i=0; i < results.length; i++) {
				// value_of( results[i] ).should_not_be( tmpNode2 );
				value_of( results[i] == tmpNode2 ).should_be_false();
			}
			
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = context.SELECT(testNode,'[name=getelementsbyname]');
			for (var i=0; i < results.length; i++) {
				// value_of( results[i] ).should_not_be( tmpNode2 );
				value_of( results[i] == tmpNode2 ).should_be_false();
			}
		};
		
	});
	
	Describe('SELECT #',function(){
		
		specs.before_each = setup;
		specs.after_each = teardown;
		
		it['Should NOT match name attribute'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementbyid');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementbyid');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			value_of( results[0] == tmpNode1).should_be_false();
			// value_of( results ).should_not_be([tmpNode1]);
			// value_of( results[0] ).should_not_be(tmpNode1);
		};
		
		if( !isXML )
		it['Should NOT match name attribute, using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input name="getelementbyid" type="text" /><input id="getelementbyid" type="password" />';
			tmpNode1 = testNode.firstChild;
			tmpNode2 = testNode.lastChild;
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			value_of( results[0] == tmpNode1).should_be_false();
		};
		
		it['Should match id attribute, even when another element has that [name]'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementbyid');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementbyid');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			tmpNode3 = context.document.createElement('input');tmpNode3.setAttribute('name','getelementbyid');tmpNode3.setAttribute('type','text');testNode.appendChild(tmpNode3);
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			// value_of( results ).should_be([tmpNode2]);
			// value_of( results[0] ).should_be(tmpNode2);
			value_of( results[0] == tmpNode2).should_be_true();
		};
		
		if( !isXML )
		it['Should match id attribute, even when another element has that [name], using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input name="getelementbyid" type="text" /><input id="getelementbyid" type="password" /><input name="getelementbyid" type="text" />';
			tmpNode1 = testNode.childNodes[0];
			tmpNode2 = testNode.childNodes[1];
			tmpNode3 = testNode.childNodes[2];
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			// value_of( results ).should_be([tmpNode2]);
			// value_of( results[0] ).should_be(tmpNode2);
			value_of( results[0] == tmpNode2).should_be_true();
		};

		if( !isXML )
		it['Should get just the first matched element with passed id, using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input name="getelementbyid" type="text" /><input id="getelementbyid" type="password" /><input name="getelementbyid" type="text" /><input id="getelementbyid" type="text" />';
			tmpNode1 = testNode.childNodes[0];
			tmpNode2 = testNode.childNodes[1];
			tmpNode3 = testNode.childNodes[2];
			tmpNode4 = testNode.childNodes[3];
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			// value_of( results ).should_be([tmpNode2]);
			// value_of( results[0] ).should_be(tmpNode2);
			value_of( results[0] == tmpNode2 ).should_be_true();
			value_of( results.length ).should_be(1);
		};
		
		if( !isXML )
		it['Should get just the first matched element with passed id, using innerHTML, changing nodes orders'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input id="getelementbyid" type="password" /><input name="getelementbyid" type="text" /><input name="getelementbyid" type="text" /><input id="getelementbyid" type="text" />';
			tmpNode1 = testNode.childNodes[0];
			tmpNode2 = testNode.childNodes[1];
			tmpNode3 = testNode.childNodes[2];
			tmpNode4 = testNode.childNodes[3];
			
			results = context.SELECT(testNode,'#getelementbyid',[]);
			// value_of( results ).should_be([tmpNode2]);
			// value_of( results[0] ).should_be(tmpNode2);
			value_of( results[0] == tmpNode1 ).should_be_true();
			value_of( results.length ).should_be(1);
		};

		
	});
	
	Describe('SELECT :selected', function(){
		
		specs.before_each = setup;
		specs.after_each = teardown;
		
		if( !isXML )
		it['Should match the selected option'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<select><option value="1">opt1</option><option value="2">opt2</option></select>';
			tmpNode1 = testNode.firstChild;
			tmpNode2 = tmpNode1.firstChild;
			tmpNode3 = tmpNode1.lastChild;
			
			results = context.SELECT(testNode, ':selected');
			value_of(results.length).should_be(1);
			value_of(results[0] === tmpNode2).should_be_true();
		};
		
		if( !isXML )
		it['Should not match the first element from a multiple select'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<select multiple="multiple"><option value="1">opt1</option><option value="2" selected="selected">opt2</option></select>';
			tmpNode1 = testNode.firstChild;
			tmpNode2 = tmpNode1.firstChild;
			tmpNode3 = tmpNode1.lastChild;
			
			results = context.SELECT(testNode, ':selected');
			value_of(results.length).should_be(1);
			value_of(results[0] === tmpNode3).should_be_true();
		};

	});
	
});};
