// Helpers

Function.prototype._type = "Function";

String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};

Slick.debug = function(message){
	try{console.log(Array.prototype.slice.call(arguments));}catch(e){};
	throw new Error(message);
};




this.PARSE = this.PARSE || Slick.parse;
Describe('Slick Parser',function(){
	
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
	its['parts array items should have a type property'] = function(){
		s = PARSE('tag#id.class[attrib][attrib=attribvalue]:pseudo:pseudo(pseudovalue):not(pseudovalue)');
		
		for (var i=0, part; part = s.expressions[0][0].parts[i]; i++){
			
			value_of( part.type ).should_not_be_undefined();
		}
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
	
	// tag namespaces
	it['should parse the namespace'] = TODO;
	it['should parse the namespace from an escaped tagname'] = TODO;
	
	
	
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
		
		s = PARSE('[attrib1][attrib2][attrib3]');
		value_of( s.expressions[0][0].parts[0].type ).should_be( 'attribute' );
	};
	
	its['attributes array items should have a key property'] = function(){
		s = PARSE('[attrib]');
		value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib' );
		
		s = PARSE('[attrib1][attrib2][attrib3]');
		value_of( s.expressions[0][0].parts[0].key ).should_be( 'attrib1' );
		value_of( s.expressions[0][0].parts[1].key ).should_be( 'attrib2' );
		value_of( s.expressions[0][0].parts[2].key ).should_be( 'attrib3' );
		
	};
	its['attributes array items should have a value property'] = function(){
		s = PARSE('[attrib=attribvalue]');
		value_of( s.expressions[0][0].parts[0].value ).should_be( 'attribvalue' );
		
		s = PARSE('[attrib1=attribvalue1][attrib2=attribvalue2][attrib3=attribvalue3]');
		value_of( s.expressions[0][0].parts[0].value ).should_be( 'attribvalue1' );
		value_of( s.expressions[0][0].parts[1].value ).should_be( 'attribvalue2' );
		value_of( s.expressions[0][0].parts[2].value ).should_be( 'attribvalue3' );
		
	};
	its['attributes array items should have a operator property'] = function(){
		s = PARSE('[attrib=attribvalue]');
		value_of( s.expressions[0][0].parts[0].operator ).should_be( '=' );
		
	};
	its['attributes array items should have a test method'] = function(){
		s = PARSE('[attrib=attribvalue]');
		value_of( s.expressions[0][0].parts[0].test._type ).should_be( 'Function' );
		
	};
	
	// its attributes array item test method should match string
	var AttributeTests = [
		{ operator:'=',  value:'test you!', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'=',  value:'test you!', matchAgainst:'test me!', shouldBeTrue:false },
		
		{ operator:'^=', value:'test', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'^=', value:'test', matchAgainst:' test you!', shouldBeTrue:false },
		
		{ operator:'$=', value:'you!', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'$=', value:'you!', matchAgainst:'test you! ', shouldBeTrue:false },
		
		{ operator:'!=', value:'test you!', matchAgainst:'test you?', shouldBeTrue:true },
		{ operator:'!=', value:'test you!', matchAgainst:'test you!', shouldBeTrue:false },
	];
	function makeAttributeRegexTest(operator, value, matchAgainst, shouldBeTrue) {
		return function(){
			
			s = PARSE('[attrib'+ operator + value +']');
			var result = s.expressions[0][0].attributes[0].test(matchAgainst);
			value_of( result )[shouldBeTrue ? 'should_be_true' : 'should_be_false']();
			
		};
	}
	for (var t=0,J; J=AttributeTests[t]; t++){
		
		its['attributes array item test method should match string: `[attrib'+ J.operator + J.value +']` should '+ (J.shouldBeTrue?'':'NOT') +' match `'+J.matchAgainst+'`'] =
		makeAttributeRegexTest(J.operator, J.value, J.matchAgainst, J.shouldBeTrue);
	}
	
	
	
	// pseudos
	it['should parse pseudos into the pseudos array'] = function(){
		s = PARSE(':pseudo');
		value_of( s.expressions[0][0].parts[0].type ).should_be( 'pseudo' );
		
		s = PARSE(':pseudo1:pseudo2:pseudo3');
		value_of( s.expressions[0][0].parts[0].type ).should_be( 'pseudo' );
	};
	
	its['pseudos array items should have a key property'] = function(){
		s = PARSE(':pseudo');
		value_of( s.expressions[0][0].parts[0].key ).should_be( 'pseudo' );
		
		s = PARSE(':pseudo1:pseudo2:pseudo3');
		value_of( s.expressions[0][0].parts[0].key ).should_be( 'pseudo1' );
		value_of( s.expressions[0][0].parts[1].key ).should_be( 'pseudo2' );
		value_of( s.expressions[0][0].parts[2].key ).should_be( 'pseudo3' );
		
	};
	its['pseudos array items should have a value property'] = function(){
		s = PARSE(':pseudo(pseudoValue)');
		value_of( s.expressions[0][0].parts[0].value ).should_be( 'pseudoValue' );
		
	};
	
	its['pseudos nth value should transform odd to 2n+1'] = function(){
		var nths = [
			{raw:        ":nth-child(odd)", key:       "nth-child", value:"2n+1"},
			{raw:   ":nth-last-child(odd)", key:  "nth-last-child", value:"2n+1"},
			{raw: ":nth-last-of-type(odd)", key:"nth-last-of-type", value:"2n+1"},
			{raw:      ":nth-of-type(odd)", key:     "nth-of-type", value:"2n+1"},
			
			{raw:        ":nth-child(odd)", key:'nth-child', value:"2n+1"},
			{raw:       ":nth-child(2n+1)", key:'nth-child', value:"2n+1"},
			{raw:          ":nth-child(n)", key:'nth-child', value:"n"   }
		];
		for (var i=0,s, N; N = nths[i]; i++){
			
			s = PARSE(N.raw);
			
			value_of( s.expressions[0][0].pseudos[0].key ).should_be( N.key );
			value_of( s.expressions[0][0].pseudos[0].value ).should_be( N.value );
			
			value_of( s.expressions[0][0].parts[0].key ).should_be( N.key );
			value_of( s.expressions[0][0].parts[0].value ).should_be( N.value );
			
		}
	};
	its['pseudos nth value should transform even to 2n'] = function(){
		var nths = [
			{raw:        ":nth-child(even)", key:       "nth-child", value:"2n"},
			{raw:   ":nth-last-child(even)", key:  "nth-last-child", value:"2n"},
			{raw: ":nth-last-of-type(even)", key:"nth-last-of-type", value:"2n"},
			{raw:      ":nth-of-type(even)", key:     "nth-of-type", value:"2n"},
			
			{raw:":nth-child(even)", key:'nth-child', value:"2n" },
			{raw:":nth-child(2n)"  , key:'nth-child', value:"2n" },
			{raw:":nth-child(n)"   , key:'nth-child', value:"n"  }
		];
		for (var i=0,s, N; N = nths[i]; i++){
			
			s = PARSE(N.raw);
			
			value_of( s.expressions[0][0].pseudos[0].key ).should_be( N.key );
			value_of( s.expressions[0][0].pseudos[0].value ).should_be( N.value );
			
			value_of( s.expressions[0][0].parts[0].key ).should_be( N.key );
			value_of( s.expressions[0][0].parts[0].value ).should_be( N.value );
			
		}
	}
	
	
	
	
	
});



var TAGS = 'normal UPCASE'.split(' ');
Describe('Slick Parser Syntax: TAG',function(){
	
	
	// TAG
	var newTAG = function(TAG){
		return function(){
			
			s = PARSE(TAG);
			s = s.expressions[0][0];
			value_of( s.tag ).should_be( TAG );
			
		};
	};
	for (var TAG_I=0, TAG; TAG = TAGS[TAG_I]; TAG_I++){
		it['should support TAG: `'+TAG+'`'] = newTAG(TAG);
	}
	
	
});



var IDS = "normal with-dash with_underscore 123number".split(' ');
Describe('Slick Parser Syntax: ID',function(){
	
	// ID
	var newID = function(ID){
		return function(){
			
			s = PARSE('#' + ID);
			s = s.expressions[0][0];
			value_of( s.id ).should_be( ID );
			
		};
	};
	for (var ID_I=0, ID; ID = IDS[ID_I]; ID_I++){
		it['should support id: `#'+ID+'`'] = newID(ID);
	}
	
});



var CLASSES = "normal with-dash with_underscore 123number".split(' ');
Describe('Slick Parser Syntax: CLASS',function(){
	
	// CLASS
	var newCLASS = function(CLASS){
		return function(){
			
			s = PARSE('.' + CLASS);
			s = s.expressions[0][0];
			value_of( s.classes[0] ).should_be( CLASS );
			
		};
	};
	for (var CLASS_I=0, CLASS; CLASS = CLASSES[CLASS_I]; CLASS_I++){
		it['should support CLASS: `.'+CLASS+'`'] = newCLASS(CLASS);
	}
	it['should support all CLASSES: `.'+CLASSES.join('.')+'`'] = function(){
		s = PARSE('.' + CLASSES.join('.'));
		s = s.expressions[0][0];
		
		for (var CLASS_I=0, CLASS; CLASS = CLASSES[CLASS_I]; CLASS_I++){
			
			value_of( s.classes[CLASS_I] ).should_be( CLASS );
			
		}
	};
	
});



var ATTRIB_KEYS = 'normal with-dash with_underscore 123number'.split(' ');
var ATTRIB_OPERATORS = '= != *= ^= $= ~= |='.split(' ');
var ATTRIB_VALUES = 'normal,"double quote",\'single quote\',"double\\"escaped",\'single\\\'escaped\',parens(),curly{},square[],"quoted parens()","quoted curly{}","quoted square[]"'.split(',');
Describe('Slick Parser Syntax: ATTRIBUTE',function(){
	
	// ATTRIBUTE
	var newATTRIB = function(ATTRIB_KEY, ATTRIB_OPERATOR, ATTRIB_VALUE){
		return function(){
			
			s = PARSE('[' + ATTRIB_KEY + ']');
			value_of( s.expressions.length ).should_be( 1 );
			value_of( s.expressions[0].length ).should_be( 1 );
			s = s.expressions[0][0];
			value_of( s.attributes[0].key ).should_be( ATTRIB_KEY );
			
			s = PARSE('[' + ATTRIB_KEY + ATTRIB_OPERATOR + ATTRIB_VALUE + ']');
			value_of( s.expressions.length ).should_be( 1 );
			value_of( s.expressions[0].length ).should_be( 1 );
			s = s.expressions[0][0];
			value_of( s.attributes[0].key ).should_be( ATTRIB_KEY );
			value_of( s.attributes[0].operator ).should_be( ATTRIB_OPERATOR );
			value_of( s.attributes[0].value ).should_be( ATTRIB_VALUE.replace(/^["']/g,'').replace(/["']$/g,'') );
			
		};
	};
	for (var ATTRIB_VALUE_I=0, ATTRIB_VALUE; ATTRIB_VALUE = ATTRIB_VALUES[ATTRIB_VALUE_I]; ATTRIB_VALUE_I++){
		for (var ATTRIB_OPERATOR_I=0, ATTRIB_OPERATOR; ATTRIB_OPERATOR = ATTRIB_OPERATORS[ATTRIB_OPERATOR_I]; ATTRIB_OPERATOR_I++){
			for (var ATTRIB_KEY_I=0, ATTRIB_KEY; ATTRIB_KEY = ATTRIB_KEYS[ATTRIB_KEY_I]; ATTRIB_KEY_I++){
				
				it['should support ATTRIB: `'+ '[' + ATTRIB_KEY + ATTRIB_OPERATOR + ATTRIB_VALUE + ']' +'`'] = newATTRIB(ATTRIB_KEY, ATTRIB_OPERATOR, ATTRIB_VALUE);
				
			}
		}
	}
	
});



var PSEUDO_KEYS = 'normal with-dash with_underscore'.split(' ');
var PSEUDO_VALUES = ATTRIB_VALUES;
Describe('Slick Parser Syntax: PSEUDO',function(){
	
	// PSEUDO
	var newPSEUDO = function(PSEUDO_KEY, PSEUDO_VALUE){
		return function(){
			
			s = PARSE(':' + PSEUDO_KEY);
			value_of( s.expressions.length ).should_be( 1 );
			value_of( s.expressions[0].length ).should_be( 1 );
			s = s.expressions[0][0];
			value_of( s.pseudos[0].key ).should_be( PSEUDO_KEY );
			
			s = PARSE(':' + PSEUDO_KEY +'('+ PSEUDO_VALUE + ')');
			value_of( s.expressions.length ).should_be( 1 );
			value_of( s.expressions[0].length ).should_be( 1 );
			s = s.expressions[0][0];
			value_of( s.pseudos[0].key ).should_be( PSEUDO_KEY );
			value_of( s.pseudos[0].value ).should_be( PSEUDO_VALUE.replace(/^["']/g,'').replace(/["']$/g,'') );
			
		};
	};
	for (var PSEUDO_VALUE_I=0, PSEUDO_VALUE; PSEUDO_VALUE = PSEUDO_VALUES[PSEUDO_VALUE_I]; PSEUDO_VALUE_I++){
		for (var PSEUDO_KEY_I=0, PSEUDO_KEY; PSEUDO_KEY = PSEUDO_KEYS[PSEUDO_KEY_I]; PSEUDO_KEY_I++){
			
			it['should support PSEUDO: `'+ ':' + PSEUDO_KEY +'('+ PSEUDO_VALUE + ')' +'`'] = newPSEUDO(PSEUDO_KEY, PSEUDO_VALUE);
			
		}
	}
	
});



var COMBINATORS = " >+~" + "`!@$%^&={}\\;</".split('');
Describe('Slick Parser Syntax: COMBINATOR',function(){
	
	// combinators
	it['should parse all possible combinators'] = TODO;
	
	it['should fail when given a bad combinator'] = TODO;
	
	its['combinator property should be null when not in the selector'] = function(){
		
		s = PARSE('a');
		s = s.expressions[0][0];
		value_of( s.combinator ).should_be_null();
		
		s = PARSE('a b');
		value_of( s.expressions[0][0].combinator ).should_be(' ');
		value_of( s.expressions[0][1].combinator ).should_be_null();
		
	};
	
	// COMBINATOR
	var newCOMBINATOR = function(COMBINATOR){
		return function(){
			
			s = PARSE('a' + COMBINATOR + 'b');
			s = s.expressions[0];
			value_of( s[0].combinator ).should_be( COMBINATOR );
			// value_of( s[1].combinator ).should_be( COMBINATOR );
			
			s = PARSE('a ' + COMBINATOR + ' b');
			s = s.expressions[0];
			value_of( s[0].combinator ).should_be( COMBINATOR );
			// value_of( s[1].combinator ).should_be( COMBINATOR );
			
		};
	};
	
	for (var COMBINATOR_I=0, COMBINATOR; COMBINATOR = COMBINATORS[COMBINATOR_I]; COMBINATOR_I++){
		it['should support COMBINATOR: ‘'+COMBINATOR+'’'] = newCOMBINATOR(COMBINATOR);
	}
	
});
