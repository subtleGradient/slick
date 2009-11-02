function specsBrowserBugs(specs,context){
	
	var rootElement;
	var testNode, tmpNode, tmpNode1, tmpNode2, tmpNode3, tmpNode4, tmpNode5, tmpNode6, tmpNode7, tmpNode8, tmpNode9;
	var results, resultsArray;
	var setup = 
	specs.before_each = function(){
		testNode = context.document.createElement('div');
		rootElement = context.document.getElementsByTagName('body')[0];
		rootElement = rootElement || context.document.documentElement;
		rootElement.appendChild(testNode);
	};
	var teardown = function(){
		testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
		testNode = null;
	};
	
	Describe('getElementsByName',function(){
		
		specs.before_each = setup;
		specs.after_each = teardown;
		
		it['getElementsByName Should match name attribute'] = function(){
			teardown();setup();
			
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			value_of( results ).should_include(tmpNode1);
			
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			value_of( results ).should_include(tmpNode1);
		};
		
		it['getElementsByName Should NOT match id attribute'] = function(){
			teardown();setup();
			
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			for (var i=0; i < results.length; i++) {
				value_of( results[i] ).should_not_be( tmpNode2 );
			}
			
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementsbyname');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementsbyname');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			for (var i=0; i < results.length; i++) {
				value_of( results[i] ).should_not_be( tmpNode2 );
			}
		};
		
		it['getElementsByName Should match name attribute, using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input id="getelementsbyname" type="password" /><input name="getelementsbyname" type="text" />';
			tmpNode2 = testNode.firstChild;
			tmpNode1 = testNode.lastChild;
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			value_of( results ).should_include(tmpNode1);
			
			teardown();setup();
			
			testNode.innerHTML = '<input name="getelementsbyname" type="password" /><input id="getelementsbyname" type="text" />';
			tmpNode1 = testNode.firstChild;
			tmpNode2 = testNode.lastChild;
			
			results = tmpNode1.ownerDocument.getElementsByName('getelementsbyname');
			value_of( results ).should_include(tmpNode1);
		};
		
	});
	
	Describe('getElementById',function(){
		
		specs.before_each = setup;
		specs.after_each = teardown;
		
		it['getElementById Should NOT match name attribute'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementbyid');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementbyid');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = tmpNode1.ownerDocument.getElementById('getelementbyid');
			value_of( results ).should_not_be(tmpNode1);
		};
		
		it['getElementById Should NOT mask element[id] with element[name]'] =
		it['getElementById Should match id attribute'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementbyid');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementbyid');tmpNode2.setAttribute('type','password');testNode.appendChild(tmpNode2);
			
			results = tmpNode1.ownerDocument.getElementById('getelementbyid');
			value_of( results ).should_be(tmpNode2);
		};
		
		it['getElementsById Should match id attribute, using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<input name="getelementbyid" type="password" /><input id="getelementbyid" type="text" />';
			tmpNode1 = testNode.firstChild;
			tmpNode2 = testNode.lastChild;
			
			results = tmpNode1.ownerDocument.getElementById('getelementbyid');
			value_of( results ).should_be(tmpNode2);
		};
		
	});
	
	if(context.document.getElementsByClassName && context.document.documentElement.getElementsByClassName)
	Describe('getElementsByClassName',function(){
		
		it['getElementsByClassName Should match second class name'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.className = 'getelementsbyclassname secondclass';tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = testNode.getElementsByClassName('secondclass');
			value_of( results ).should_include(tmpNode1);
		};
		
		it['getElementsByClassName Should match second class name, using innerHTML'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<a class="getelementsbyclassname secondclass"></a>';
			tmpNode1 = testNode.firstChild;
			
			results = testNode.getElementsByClassName('secondclass');
			value_of( results ).should_include(tmpNode1);
		};
		
		it['getElementsByClassName Should not cache results'] = function(){
			teardown();setup();
			
			testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
			testNode.getElementsByClassName('b').length; //accessing a property is important here
			testNode.firstChild.className = 'b';
			
			results = testNode.getElementsByClassName('b');
			value_of( results.length ).should_be(2);
		};
		
	});
	
	if(context.document.querySelectorAll)
	Describe('querySelectorAll',function(){
		
		it['querySelectorAll Should start finding nodes from the passed context'] = function(){
			teardown();setup();
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('id', 'queryselectorall');tmpNode1.setAttribute('type','text');testNode.appendChild(tmpNode1);
			
			results = testNode.querySelectorAll('div #queryselectorall');
			for (var i=0; i < results.length; i++) {
				value_of( results[i] ).should_not_be( tmpNode1 );
			}
		};
		
	});
	
	Describe('xpath',function(){
		
		it['should implement selectNodes'] = function(){
			teardown();setup();
			
			context.document.setProperty("SelectionLanguage","XPath");
			
			value_of( testNode.selectNodes('//*').length ).should_not_be(0);
			value_of( testNode.selectNodes('./*').length ).should_be(0);
			
			tmpNode1 = context.document.createElement('input');tmpNode1.setAttribute('name','getelementbyid');tmpNode1.setAttribute('type','text'    );tmpNode1.setAttribute('class','tmpNode1class bar');testNode.appendChild(tmpNode1);
			tmpNode2 = context.document.createElement('input');tmpNode2.setAttribute('id',  'getelementbyid');tmpNode2.setAttribute('type','password');tmpNode2.setAttribute('class','tmpNode2class foo bar');testNode.appendChild(tmpNode2);
			tmpNode3 = context.document.createElement('input');tmpNode3.setAttribute('id',  'getelementbyid');tmpNode3.setAttribute('type','password');tmpNode3.setAttribute('class','tmpNode3class foo baz');testNode.appendChild(tmpNode3);
			tmpNode4 = context.document.createElement('input');tmpNode4.setAttribute('id',  'getelementbyid');tmpNode4.setAttribute('type','password');tmpNode4.setAttribute('class','tmpNode4class baz');testNode.appendChild(tmpNode4);
			
			value_of( testNode.selectNodes('./*').length ).should_be(4);
			
			var classes,children;
			
			classes = ['foo'];
			children = testNode.selectNodes(['./','input','[@class]'].join(''));
			value_of( children.length ).should_be( 4 );
			
			classes = ['foo','bar'];
			children = testNode.selectNodes(['./','input','[contains(concat(" ", @class, " "), " ',classes.join(' ")]'+'[contains(concat(" ", @class, " "), " '),' ")]'].join(''));
			value_of( children.length ).should_be( 1 );
			
			classes = ['baz','bar'];
			children = testNode.selectNodes(['./','input','[contains(concat(" ", @class, " "), " ',classes.join(' ")]'+'[contains(concat(" ", @class, " "), " '),' ")]'].join(''));
			value_of( children.length ).should_be( 0 );
			
			classes = ['baz','tmpNode3class','foo'];
			children = testNode.selectNodes(['./','input','[contains(concat(" ", @class, " "), " ',classes.join(' ")]'+'[contains(concat(" ", @class, " "), " '),' ")]'].join(''));
			value_of( children.length ).should_be( 1 );
			
			value_of( context.document.documentElement.selectNodes('//*') ).should_not_be_undefined();
			value_of( context.document.selectNodes('//*') ).should_not_be_undefined();
		};
		
	});
	
	Describe('matchesSelector',function(){});
	
};
