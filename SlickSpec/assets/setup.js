
(function(global){

var runnerOnLoad = global.onload;

global.onload = function(){

	Mock.CreateTemplate('Generic HTML4 (standard)',				'../mocks/template-standard.html');
	Mock.CreateTemplate('Generic HTML4 (almost-standard)',		'../mocks/template-almost.html');
	Mock.CreateTemplate('Generic HTML4 (quirks)',				'../mocks/template-quirks.html');

	if (!Browser.ie || Browser.version > 8){
		Mock.CreateTemplate('Generic XHTML',					'../mocks/template.xhtml');
		Mock.CreateTemplate('Generic XML',						'../mocks/template.xml');
		Mock.CreateTemplate('SVG',								'../mocks/MooTools_Logo.svg');
	}

	if (Browser.ie && Browser.version >= 8){
		Mock.CreateTemplate('Generic HTML4 (IE8 as IE7)',		'../mocks/template-ie7.html');
	}

	Mock.CreateTemplate('Google Closure',						'../mocks/GoogleClosure-query_test.html');
	Mock.CreateTemplate('PrototypeJS',							'../mocks/Prototype-query_test.html');
	Mock.CreateTemplate('jQuery',								'../mocks/jQuery-query_test.html');
	Mock.CreateTemplate('Dojo',									'../mocks/dojo-query_test.html');
	Mock.CreateTemplate('YUI',									'../mocks/yui-query_test.html');
	Mock.CreateTemplate('Slick',								'../mocks/slick-query_test.html');
	Mock.CreateTemplate('HTML5 shim',							'../mocks/html5-shim.html');
	
	
	new Mock.Request('XML responseXML',							'../mocks/xmlmock1.xml');
	new Mock.Request('SVG responseXML',							'../mocks/MooTools_Logo.svg');

	// Setup
	
	setupMethods(this); new Mock('', setupMethods);
	verifySetupMethods(this); new Mock('', verifySetupMethods);
	if (verifySetupContext) new Mock('', verifySetupContext);
	specsSlickAPI(this);
	
	// Parser specs
	
	specsParser(this);
	
	// Match specs
	
	specsMatch(this);
	
	// Specific Mocks

	new Mock('Closure', specsGoogleClosure);
	new Mock('PrototypeJS', specsPrototype);
	new Mock('jQuery', specsJQuery);
	new Mock('Dojo', specsDojo);
	new Mock('YUI', specsYUI);
	new Mock(/Generic.*?\bHTML4/, specsMockTemplate);
	new Mock('XML responseXML', specsAssetsTemplateXML);
	new Mock('Slick', specsSlickHtml);

	// Specific Bugs

	new Mock(/\b(xml|svg|xhtml|html4)\b/i, specsSelectorEngineBugs);
	new Mock(/\b(xml|svg|xhtml|html4)\b/i, specsBrowserBugsFixed);
	
	// Selector Tests
	
	new Mock(/\b(xml|svg|xhtml|html4)\b/i, specsSlickDocs);
	new Mock(/\b(xml|svg|xhtml|html4)\b/i, specsSelectorExhaustive);
	new Mock(/\b(xml|svg|xhtml|html4)\b/i, specsSelectNthChild);
	
	// XML
	
	new Mock(/\b(xml|svg|xhtml)\b/i, function(context){
		describe('XML', function(){
			it('should be XML', function(){
				expect(global.isXML(context.document)).toEqual(true);
			});
		});
	});

	new Mock(/\b(html)\b/i, function(context){
		describe('HTML', function(){
			it('should not be XML', function(){
				expect(global.isXML(context.document)).toEqual(false);
			});
		});
	});
	
	// HTML5
	
	new Mock(/\b(html5)\b/i, specsHTML5);
	
};

global.runnerOnLoad = runnerOnLoad;

})(window);
