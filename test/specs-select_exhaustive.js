function specsSelectorExhaustive(specs,context){
	
	var CLASSES = "normal escaped\\,character ǝpoɔıun 瀡 with-dash with_underscore 123number MiXeDcAsE".split(' ');
	Describe('CLASS',function(specs){
		
		specs.before_each = function(){
			testNodeOrphaned = context.document.createElement('div');
			testNode = context.document.createElement('div');
			context.document.body.appendChild(testNode);
		};
		specs.after_each = function(){
			testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
			testNode = null;
			testNodeOrphaned = null;
		};
		
		var it_should_select_classes = function(CLASSES){
			
			var testName = 'Should select "'+ CLASSES.join(' ') +'"';
			var className = CLASSES.join(' ');
			if (className.indexOf('\\')+1) className += ' ' + CLASSES.join(' ').replace('\\','');
			
			it[testName + ' from the document root'] = function(){
				testNode.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				result = context.Slick(testNode.ownerDocument, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' from the parent'] = function(){
				testNode.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				var result = context.Slick(testNode, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' orphaned'] = function(){
				testNodeOrphaned.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				result = context.Slick(testNodeOrphaned, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			// it should match this class as a second class
			if (CLASSES.length == 1) it_should_select_classes(['foo',CLASSES[0]]);
		};
		
		it_should_select_classes(CLASSES);
		for (var i=0; i < CLASSES.length; i++)
			it_should_select_classes([CLASSES[i]]);
		
	});
	
};
