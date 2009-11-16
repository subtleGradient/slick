function specsSelectorExhaustive(specs,context){
	
	var CLASSES = "normal escaped\\,character ǝpoɔıun 瀡 with-dash with_underscore 123number MiXeDcAsE".split(' ');
	Describe('CLASS',function(specs,context){
		
		specs.before_each = function(){
			testNodeOrphaned = context.document.createElement('div');
			testNode = context.document.createElement('div');
			bodyElement = context.document.getElementsByTagName('body')[0];
			bodyElement = bodyElement || context.document.documentElement;
			bodyElement.appendChild(testNode);
		};
		specs.after_each = function(){
			testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
			testNode = null;
			testNodeOrphaned = null;
		};
		
		var it_should_select_classes = function(CLASSES){
			
			var testName = 'Should select element with class "'+ CLASSES.join(' ') +'"';
			var className = CLASSES.join(' ');
			if (className.indexOf('\\')+1) className += ' ' + CLASSES.join(' ').replace('\\','');
			
			it[testName + ' from the document root'] = function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				
				value_of(context.SELECT || global.context.SELECT).should_not_be_undefined();
				var result = (context.SELECT || global.context.SELECT)(testNode.ownerDocument, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' from the parent'] = function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				
				value_of(context.SELECT || global.context.SELECT).should_not_be_undefined();
				var result = (context.SELECT || global.context.SELECT)(testNode, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' orphaned'] = function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNodeOrphaned.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNodeOrphaned.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNodeOrphaned.appendChild(tmpNode);
				
				value_of(context.SELECT || global.context.SELECT).should_not_be_undefined();
				var result = (context.SELECT || global.context.SELECT)(testNodeOrphaned, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).should_match( CLASSES.join(' ') );
			};
			
			// it should match this class as a second class
			if (CLASSES.length == 1) it_should_select_classes(['foo',CLASSES[0]]);
		};
		
		it_should_select_classes(CLASSES);
		for (var i=0; i < CLASSES.length; i++)
			it_should_select_classes([CLASSES[i]]);
		
	});
	
};
