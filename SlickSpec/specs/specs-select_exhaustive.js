var specsSelectorExhaustive = function(context){
	
	describe('CLASS', function(){
		
		beforeEach(function(){
			testNodeOrphaned = context.document.createElement('div');
			testNode = context.document.createElement('div');
			bodyElement = context.document.getElementsByTagName('body')[0];
			bodyElement = bodyElement || context.document.documentElement;
			bodyElement.appendChild(testNode);
		});
		
		afterEach(function(){
			testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
			testNode = null;
			testNodeOrphaned = null;
		});
		
		var it_should_select_classes = function(CLASSES){
			
			var testName = 'Should select element with class "'+ CLASSES.join(' ') +'"';
			var className = CLASSES.join(' ');
			if (className.indexOf('\\')+1) className += ' ' + CLASSES.join(' ').replace('\\','');
			
			it(testName + ' from the document root', function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				
				expect(context.SELECT || global.context.SELECT).toBeDefined();
				var result = (context.SELECT || global.context.SELECT)(testNode.ownerDocument, '.' + CLASSES.join('.'));
				expect( result.length ).toEqual( 1 );
				expect( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).toMatch( CLASSES.join(' ') );
			});
			
			it(testName + ' from the parent', function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNode.appendChild(tmpNode);
				
				expect(context.SELECT || global.context.SELECT).toBeDefined();
				var result = (context.SELECT || global.context.SELECT)(testNode, '.' + CLASSES.join('.'));
				expect( result.length ).toEqual( 1 );
				expect( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).toMatch( CLASSES.join(' ') );
			});
			
			it(testName + ' orphaned', function(){
				var tmpNode;
				tmpNode = context.document.createElement('div');tmpNode.setAttribute('class',className);tmpNode.setAttribute('className',className);testNodeOrphaned.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNodeOrphaned.appendChild(tmpNode);
				tmpNode = context.document.createElement('div');testNodeOrphaned.appendChild(tmpNode);
				
				expect(context.SELECT || global.context.SELECT).toBeDefined();
				var result = (context.SELECT || global.context.SELECT)(testNodeOrphaned, '.' + CLASSES.join('.'));
				expect( result.length ).toEqual( 1 );
				expect( ('className' in result[0]) ? result[0].className : result[0].getAttribute('class') ).toMatch( CLASSES.join(' ') );
			});
			
			// it should match this class as a second class
			if (CLASSES.length == 1) it_should_select_classes(['foo',CLASSES[0]]);
		};
		
		it_should_select_classes(CLASSES);
		
		for (var i=0; i < CLASSES.length; i++) it_should_select_classes([CLASSES[i]]);
		
	});
	
};
