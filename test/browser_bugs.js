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
		
	});
	
	Describe('getElementsByClassName',function(){});
	
	Describe('querySelectorAll',function(){});
	
	Describe('xpath',function(){});
	
	Describe('matchesSelector',function(){});
	
};
