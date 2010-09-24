var specsAssetsTemplateXML = function(context){
	
	describe('SELECT Selector Engine on XML file', function(){
		
		var makeSlickTestSearch = function(selector, count, disableQSA) {
			return function(){
				context.SELECT.disableQSA = !!disableQSA;
				expect( context.SELECT(context.document, selector).length ).toEqual( count );
				delete context.SELECT.disableQSA;
			};
		};
		
		var it_should_find = function(count, selector){
			if (global.document.querySelectorAll && !global.cannotDisableQSA)
				it('should find '+count+' `'+selector+'` with    QSA', makeSlickTestSearch(selector, count, false));
			it('should find '+count+' `'+selector + (!global.cannotDisableQSA ? '` without QSA' : ''), makeSlickTestSearch(selector, count, true));
		};
		
		it_should_find(1, 'HTML');
		it_should_find(1, '#id_idnode');
		it_should_find(1, '[id=id_idnode]');
		it_should_find(3, '.class_classNode');
		it_should_find(3, '[class=class_classNode]');
		it_should_find(0, '[className=class_classNode]');
		it_should_find(3, 'camelCasedTag');
		it_should_find(1, '#node[style=border]');
		it_should_find(1, '[href^=http://]');
		
		it_should_find(1  , ':root');
		it_should_find(0  , 'html:root');
		it_should_find(1  , 'HTML:root');
		it_should_find(1  , 'camelCasedTag ! :root');
		it_should_find(3  , ':root camelCasedTag');
		
		it_should_find(0  , '[attr^=]');
		it_should_find(0  , '[attr$=]');
		it_should_find(0  , '[attr*=]');
		
	});
	
};
