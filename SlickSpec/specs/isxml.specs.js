new Mock(/\b(xml|svg|xhtml)\b/i, function(context){
	var SELECT = (context.SELECT || global.SELECT);
	describe('is XML',function(){
		it('should be XML', function(){
			expect( context.document.nodeType ).toEqual(9);
			expect( context.document ).not.toEqual( global.document );
			expect(context.isXML(context.document)).toEqual(true);
		});
	});
});

new Mock(/\b(html)\b/i, function(context){
	var SELECT = (context.SELECT || global.SELECT);
	describe('is not XML',function(){
		it('should not be XML', function(){
			expect( context.document.nodeType ).toEqual(9);
			expect( context.document ).not.toEqual( global.document );
			expect(context.isXML(context.document)).toEqual(false);
		});
	});
});
