/*
	Slick Parser Specs
*/

this.PARSE = this.PARSE || Slick.parse;
var s;
var it;
var its;
var specs = it = its = {};


it['should exist'] = function(){
	value_of(PARSE).should_not_be_undefined();
};



// expressions
it['should convert multiple comma-separated selector expressions into separate entries in the expressions array'] = function(){
	s = PARSE('a,b,c');
	value_of( s.expressions.length ).should_be( 3 );
};

it['should always have an expressions array property'] = function(){
	s = PARSE('a,b,c');
	value_of( s.expressions.length ).should_be( 3 );
	
	s = PARSE('a');
	value_of( s.expressions.length ).should_be( 1 );
	
	s = PARSE('');
	value_of( s.expressions.length ).should_be( 0 );
};


// parts
it['should always have a parts array'] = function(){
	s = PARSE('a');
	value_of( s.expressions[0][0].parts.length ).should_be( 0 );
	
	s = PARSE('a.class');
	value_of( s.expressions[0][0].parts.length ).should_be( 1 );
	
	s = PARSE('tag#id.class[attrib][attrib=attribvalue]:pseudo:pseudo(pseudovalue):not(pseudovalue)');
	value_of( s.expressions[0][0].parts.length ).should_be( 6 );
};


// tags
it['should always have a tag property'] = function(){
	s = PARSE('tag');
	value_of( s.expressions[0][0].tag ).should_be( 'tag' );
	
	for (var i=0, TAG; TAG = TAGS[i]; i++){
		
		s = PARSE(TAG);
		value_of( s.expressions[0][0].tag ).should_be( TAG );
		
	}
};


// ids
it['should always have an id property'] = function(){
	s = PARSE('#id');
	value_of( s.expressions[0][0].id ).should_be( 'id' );
	
};

it['should throw away all but the last id'] = function(){
	s = PARSE('#id1#id2');
	value_of( s.expressions[0][0].id ).should_be( 'id2' );
	
};


// classes
it['should parse classes into the parts array'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'class' );
	
	s = PARSE('.class1.class2.class3');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].value ).should_be( 'class1' );
	value_of( s.expressions[0][0].parts[1].value ).should_be( 'class2' );
	value_of( s.expressions[0][0].parts[2].value ).should_be( 'class3' );
	
};
it['should parse classes into a classes array'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].classes[0] ).should_be( 'class' );
	
	s = PARSE('.class1.class2.class3');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].classes ).should_be( '.class1.class2.class3'.split('.').slice(1) );
	
};
its['classes array items should have a regexp property'] = function(){
	s = PARSE('.class');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'class' );
	value_of( s.expressions[0][0].parts[0].regexp._type ).should_be( 'RegExp' );
	value_of( s.expressions[0][0].parts[0].regexp.source ).should_match( 'class' );
	
};


// attributes
it['should parse attributes into the attributes array'] = function(){
	s = PARSE('[attrib]');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'attribute' );
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib' );
	
	s = PARSE('[attrib1][attrib2][attrib3]');
	value_of( s.expressions[0][0].parts[0].type ).should_be( 'attribute' );
	value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib1' );
	value_of( s.expressions[0][0].parts[1].key ).should_be( 'attrib2' );
	value_of( s.expressions[0][0].parts[2].key ).should_be( 'attrib3' );
	
};

its['attributes array items should have a test method'] = function(){ };
its['attributes array items should have a key property'] = function(){ };
its['attributes array items should have a value property'] = function(){ };



// pseudos
// combinators
// reverse combinators



describe('Slick Parser', specs);


// Helpers

var COMBINATORS      = ' ,>,+,~,   , > , + , ~ '.split(',');
// var TAGS             = 'a abbr acronym address applet area b base basefont bdo big blockquote br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var'.split(' ');
var TAGS             = 'a abbr div A ABBR DIV'.split(' ');
var ATTRIB_OPERATORS = '= != *= ^= $= ~= |='.split(' ');
var ATTRS            = 'attr lang fred-rocks'.split(' ');
var VALS             = 'myValueOfDoom;"double";\'single\';"dou\\"ble";\'sin\\\'gle\';();{};\'thing[]\';"thing[]"'.split(';');


