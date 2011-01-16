var specsSlickHtml = function(context){

var makeSlickTestSearch = function(selector, count, disableQSA) {
	return function(){
		context.SELECTOR.disableQSA = !!disableQSA;
		var selectedArray = context.SELECT(context.document, selector);
		var selected = context.SELECT1(context.document, selector);
		expect( selectedArray.length ).toEqual( count );
		if (count){
			expect( selected ).not.toBeNull();
			expect( selected ).toEqual(selectedArray[0]);
			expect( context.MATCH(selectedArray[0], selector) ).toEqual( true );
		} else {
			expect( selected ).toBeNull();
		}
		delete context.SELECTOR.disableQSA;
	};
};

var itShouldFind = function(selector, count){
	if (global.document.querySelectorAll && !global.cannotDisableQSA)
		it('should find '+count+' `'+selector+'` with    QSA', makeSlickTestSearch(selector, count, false));
	it('should find '+count+' `'+selector + (!global.cannotDisableQSA ? '` without QSA' : ''), makeSlickTestSearch(selector, count, true));
};

describe('Slick', function(){

	itShouldFind('body a[tabindex="0"]',	1);
	itShouldFind('body a[tabindex="1"]',	1);
	itShouldFind('body a[tabindex]',		2);
	itShouldFind('body [tabindex="0"]',		2);
	itShouldFind('body [tabindex="1"]',		2);
	itShouldFind('body [tabindex]',			4);

});

};