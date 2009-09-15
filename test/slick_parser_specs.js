String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};

Slick.parse.attribValueToFn = function(operator, attribute){
	var test, regexp;
	
	switch (operator){
		case '=': test = function(value){
			return attribute == value;
		}; break;
		case '!=': test = function(value){
			return attribute != value;
		}; break;
		case '*=': test = function(value){
			return value.indexOf(attribute) > -1;
		}; break;
		case '^=': regexp = new RegExp('^' + Slick.parse.escapeRegExp(attribute)); break;
		case '$=': regexp = new RegExp(Slick.parse.escapeRegExp(attribute) + '$'); break;
		case '~=': regexp = new RegExp('(^|\\s)' + Slick.parse.escapeRegExp(attribute) + '(\\s|$)'); break;
		case '|=': regexp = new RegExp('(^|\\|)' + Slick.parse.escapeRegExp(attribute) + '(\\||$)'); break;
		
		default: test = function(value){
			return !!value;
		};
	}
	
	if (!test) test = function(value){
		return regexp.test(value);
	};
	
	return regexp || { test:test, toString: function(){return String(test);} };
};

Slick.debug = function(message){
	try{console.log(Array.prototype.slice.call(arguments));}catch(e){};
	throw new Error(message);
};
// Slick.debug = false;

function makeSlickTestCombinator(tag, combinator, tag2) {
	if (combinator.split('').length===3) combinator = combinator.split('')[2];
	var functionString = '\n';
	functionString += "var s = Slick.parse('"+String.escapeSingle(tag + combinator + tag2)+"');\n";
	
	functionString+="value_of( s.expressions[0][0].tag ).should_be( '"+String.escapeSingle(tag)+"' );\n" +
					"value_of( s.expressions[0][1].tag ).should_be( '"+String.escapeSingle(tag2)+"' );\n" +
					"value_of( s.expressions[0][1].combinator ).should_be( '"+String.escapeSingle(combinator)+"' );\n";
	return new Function(functionString);
}

function makeSlickTestAttrib(attr, op, val) {
	var functionString = '\n';
	functionString += "var s = Slick.parse('["+String.escapeSingle(attr + op + (op&&val))+"]')[0][0];\n\
	value_of( s.attributes.length ).should_be( 1 );\n\
	value_of( s.attributes[0].name ).should_be( '"+String.escapeSingle(attr)+"' );\n\
	";
	if (!op) {
		functionString += "\
		value_of( s.attributes[0].operator ).should_be_null();\n\
		value_of( s.attributes[0].value ).should_be_null();\n\
		value_of( s.attributes[0].regexp ).should_be_null();\n\
		";
	} else {
		functionString += "\
		value_of( s.attributes[0].operator ).should_be( '"+String.escapeSingle( op )+"' );\n\
		value_of( s.attributes[0].value ).should_be( '"+String.escapeSingle( val.replace(/^[\"']|['\"]$/g,'') )+"' );\n\
		value_of( s.attributes[0].regexp.toString() ).should_be( '"+String.escapeSingle( Slick.parse.attribValueToFn(op, op&&val.replace(/^[\"']|['\"]$/g,'')).toString() )+"' );\n\
		";
	}
	return new Function(functionString);
}

function makeSlickTestSearch(selector, count, disableQSA) {
	// if (document.querySelectorAll)
	// return new Function(" var count; try{ count = document.querySelectorAll('"+String.escapeSingle(selector)+"').length; console.log('"+String.escapeSingle(selector)+"', count); }catch(e){ \ncount="+count+" }; value_of( Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( count );");
	return new Function("Slick.disableQSA = "+!!disableQSA+";\n value_of( Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( "+count+" ); delete Slick.disableQSA;");
}

// Slick.parse.debug = true;

var combinators = ' ,>,+,~,   , > , + , ~ '.split(',');
// var tags = 'a abbr acronym address applet area b base basefont bdo big blockquote br button caption center cite code col colgroup dd del dfn dir div dl dt em fieldset font form frame frameset h1 h2 h3 h4 h5 h6 head hr html i iframe img input ins isindex kbd label legend li link map menu meta noframes noscript object ol optgroup option p param pre q s samp script select small span strike strong style sub sup table tbody td textarea tfoot th thead title tr tt u ul var'.split(' ');
var tags = 'a abbr div A ABBR DIV'.split(' ');
var attribOperators = '= != *= ^= $= ~= |='.split(' ');
var attrs = 'attr lang fred-rocks'.split(' ');
var vals = 'myValueOfDoom;"double";\'single\';"dou\\"ble";\'sin\\\'gle\';();{};\'thing[]\';"thing[]"'.split(';');

// Custom combinators tests
(function(){
	var combinatorsSpecial = '! $ & + ++ +> / // < <+ << <~ > >> ? ^ ~> ~~ ≠ ¡ ± ¿'.split(/\s+/).sort();
	
	var combinatorsOld;
	
	var Slick_parse_Specs = {
		before_all: function(){
			combinatorsOld = Slick.parse.getCombinators(combinatorsSpecial);
			Slick.parse.setCombinators(combinatorsSpecial);
		},
		after_all: function(){
			Slick.parse.setCombinators(combinatorsOld);
		},
		
		'Should exist Slick.parse.setCombinators': function(){
			value_of( Slick.parse.setCombinators ).should_not_be_undefined();
			combinatorsOld = Slick.parse.getCombinators(combinatorsSpecial);
			Slick.parse.setCombinators(combinatorsSpecial);
			Slick.parse.setCombinators(combinatorsOld);
		}
	};
	
	
	for (var C=0; C < combinatorsSpecial.length; C++) {
		var combinator = combinatorsSpecial[C];
		tag = tag2 = tags[0];
		// for (var i=0; i < tags.length; i++) {var tag = tags[i];
			
			Slick_parse_Specs['should parse '+tag+' tags with "'+combinator+'" custom combinator' ] = makeSlickTestCombinator(tag, combinator, tag);
		// }
	}
	
	Slick_parse_Specs = {
		'Should exist Slick.parse.setCombinators':Slick_parse_Specs['Should exist Slick.parse.setCombinators'],
		'Should finalize object format': function(){
			throw new Error('uncomment all these tests once we finalize the object format');
		}
	};
	describe('Slick.parse Custom Combinators', Slick_parse_Specs);
})();

// Parsing
(function(){
	var Slick_parse_Specs = {
		
		'should exist': function(){
			value_of( Slick.parse ).should_not_be_undefined();
		}
		,
		'should parse multiple selectors': function(){
			var s = Slick.parse('a, b, c');
			value_of( s.expressions[0][0].tag ).should_be( 'a' );
			value_of( s.expressions[1][0].tag ).should_be( 'b' );
			value_of( s.expressions[2][0].tag ).should_be( 'c' );
		}
		,
		'should parse multiple selectors with class': function(){
			var s = Slick.parse('a.class, b.class, c.class');
			value_of( s.expressions[0][0].tag ).should_be( 'a' );
			value_of( s.expressions[1][0].tag ).should_be( 'b' );
			value_of( s.expressions[2][0].tag ).should_be( 'c' );
			value_of( s.expressions[0][0].classes[0] ).should_be( 'class' );
			value_of( s.expressions[1][0].classes[0] ).should_be( 'class' );
			value_of( s.expressions[2][0].classes[0] ).should_be( 'class' );
		}
		,
		'should parse tag names': function(){
			for (var i=0; i < tags.length; i++) {var tag = tags[i];
				value_of( Slick.parse(tag).expressions[0][0].tag ).should_be( tag );
			}
		}
		,
		'should transform odd to 2n+1 in pseudos nth arguments': function(){
			var nths = [
				{raw:        ":nth-child(odd)", name:       "nth-child", argument:"2n+1"},
				{raw:   ":nth-last-child(odd)", name:  "nth-last-child", argument:"2n+1"},
				{raw: ":nth-last-of-type(odd)", name:"nth-last-of-type", argument:"2n+1"},
				{raw:      ":nth-of-type(odd)", name:     "nth-of-type", argument:"2n+1"},
				
				{raw:        ":nth-child(odd)", name:'nth-child', argument:"2n+1"},
				{raw:       ":nth-child(2n+1)", name:'nth-child', argument:"2n+1"},
				{raw:          ":nth-child(n)", name:'nth-child', argument:"n"   }
			];
			for (var i=0,s, N; N = nths[i]; i++){
				s = Slick.parse(N.raw);
				value_of( s[0][0].pseudos[0].name ).should_be( N.name );
				value_of( s[0][0].pseudos[0].argument ).should_be( N.argument );
			}
		}
		,
		'should transform even to 2n in pseudo nth arguments': function(){
			var nths = [
				{raw:        ":nth-child(even)", name:       "nth-child", argument:"2n"},
				{raw:   ":nth-last-child(even)", name:  "nth-last-child", argument:"2n"},
				{raw: ":nth-last-of-type(even)", name:"nth-last-of-type", argument:"2n"},
				{raw:      ":nth-of-type(even)", name:     "nth-of-type", argument:"2n"},
				
				{raw:":nth-child(even)", name:'nth-child', argument:"2n" },
				{raw:":nth-child(2n)"  , name:'nth-child', argument:"2n" },
				{raw:":nth-child(n)"   , name:'nth-child', argument:"n"  }
			];
			for (var i=0,s, N; N = nths[i]; i++){
				s = Slick.parse(N.raw);
				value_of( s[0][0].pseudos[0].name ).should_be( N.name );
				value_of( s[0][0].pseudos[0].argument ).should_be( N.argument );
			}
		}
		,
		'should parse :not(with quoted innards)': function(){
			var s = Slick.parse(":not()")[0][0];
			value_of( s.pseudos.length ).should_be(1);
			value_of( s.pseudos[0].name ).should_be('not');
			value_of( s.pseudos[0].argument ).should_be("");
			
			s = Slick.parse(':not([attr])')[0][0];
			value_of( s.pseudos[0].argument ).should_be('[attr]');
			
			s = Slick.parse(':not([attr=])')[0][0];
			value_of( s.pseudos[0].argument ).should_be('[attr=]');
			
			s = Slick.parse(":not([attr=''])")[0][0];
			value_of( s.pseudos[0].argument ).should_be("[attr='']");
			
			s = Slick.parse(':not([attr=""])')[0][0];
			value_of( s.pseudos[0].argument ).should_be('[attr=""]');
		}
		,
		'should parse :pseudo arguments as null': function(){
			var s = Slick.parse(":pseudo")[0][0];
			value_of( s.pseudos.length ).should_be(1);
			value_of( s.pseudos[0].name ).should_be('pseudo');
			value_of( s.pseudos[0].argument ).should_be_null();
		}
		,
		'should parse :pseudo() arguments as ""': function(){
			var s = Slick.parse(":pseudo()")[0][0];
			value_of( s.pseudos.length ).should_be(1);
			value_of( s.pseudos[0].name ).should_be('pseudo');
			value_of( s.pseudos[0].argument ).should_not_be_null();
			value_of( s.pseudos[0].argument ).should_be("");
		}
	};
	
	// 'should parse tag names with combinators': function(){
	// };
	
	for (var C=0; C < combinators.length; C++) {var combinator = combinators[C];
		for (var i=0; i < tags.length; i++) {var tag = tags[i];
			
			Slick_parse_Specs['should parse '+tag+' tags with "'+combinator+'" combinator' ] = makeSlickTestCombinator(tag, combinator, tag);
		}
	}
	
	/*vals:*/ for (var vi=0; vi < vals.length; vi++) {
		var val = vals[vi];
		/*attrs:*/ for (var ai=0; ai < attrs.length; ai++) {
			var attr = attrs[ai];
			/*operators:*/ for (var oi=0; oi < attribOperators.length; oi++) {
				var op = attribOperators[oi];
				
				Slick_parse_Specs['should parse attributes: '+ '['+ attr + op + (op&&val) +']'] = makeSlickTestAttrib(attr, op, val);
			}
		}
	}
	
	describe('Slick.parse', Slick_parse_Specs);
	// describe('Slick.parse', {
	// 	'should finalize the Slick.parse object': function(){
	// 		throw new Error('fix these tests!');
	// 	}
	// });
})();

// Verify attribute selector regex
(function(){
	var Slick_parse_Specs = {
		before_all: function(){
			window.testNode = document.createElement('div');
		},
		after_all: function(){
			window.testNode = undefined;
		}
	};
	function makeAttributeTest(operator, value, matchAgainst, shouldBeTrue) {
		var code = [''];
		code.push("testNode.setAttribute('attr', '"+ String.escapeSingle(matchAgainst) +"');")
		code.push("value_of( Slick.match(testNode, \"[attr"+ operator +"'"+ String.escapeSingle(value) +"']\") ).should_be_"+ (shouldBeTrue ? 'true' : 'false') +"();");
		code.push("testNode.removeAttribute('attr');");
		return Function(code.join("\n\t"));
	}
	function makeAttributeRegexTest(operator, value, matchAgainst, shouldBeTrue) {
		var code = [''];
		code.push("value_of( Slick.parse.attribValueToFn('"+ String.escapeSingle(operator) +"', '"+ String.escapeSingle(value) +"').test('"+ String.escapeSingle(matchAgainst) +"') ).should_be_"+ (shouldBeTrue ? 'true' : 'false') +"();");
		return Function(code.join("\n\t"));
	}
	
	var junk = [
		{ operator:'=',  value:'test you!', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'=',  value:'test you!', matchAgainst:'test me!', shouldBeTrue:false },
		
		{ operator:'^=', value:'test', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'^=', value:'test', matchAgainst:' test you!', shouldBeTrue:false },
		
		{ operator:'$=', value:'you!', matchAgainst:'test you!', shouldBeTrue:true },
		{ operator:'$=', value:'you!', matchAgainst:'test you! ', shouldBeTrue:false },
		
		{ operator:'!=', value:'test you!', matchAgainst:'test you?', shouldBeTrue:true },
		{ operator:'!=', value:'test you!', matchAgainst:'test you!', shouldBeTrue:false },
	];
	
	for (var t=0,J; J=junk[t]; t++){
		Slick_parse_Specs['RegExp: "'+J.matchAgainst+'" should '+ (J.shouldBeTrue?'':'NOT') +' match '+ Slick.parse.attribValueToFn(J.operator, J.value)] =
			makeAttributeRegexTest(J.operator, J.value, J.matchAgainst, J.shouldBeTrue);
		Slick_parse_Specs['"'+J.matchAgainst+'" should '+ (J.shouldBeTrue?'':'NOT') +" match \"[attr"+ J.operator +"'"+ String.escapeSingle(J.matchAgainst) +"']\""] =
			makeAttributeTest(J.operator, J.value, J.matchAgainst, J.shouldBeTrue);
	}
	
	// console&&console.log&&console.log(Slick_parse_Specs);
	
	// Slick_parse_Specs['should convert attribute selector to regex'] = makeAttributeRegexTest('=', 'shmoo', 'shmoo', true);
	
	describe('Slick.parse attribute regex', Slick_parse_Specs);
})()

