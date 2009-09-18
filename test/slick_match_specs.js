Describe('Slick Match',function(){
	
	specs.before_all = function(){ window.testNode = document.createElement('div'); };
	specs.after_all = function(){ window.testNode = undefined; };
	
	
	
	
	
	Describe('attributes',function(){
		
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
		function makeAttributeTest(operator, value, matchAgainst, shouldBeTrue) {
			var code = [''];
			code.push("testNode.setAttribute('attr', '"+ String.escapeSingle(matchAgainst) +"');");
			code.push("value_of( Slick.match(testNode, \"[attr"+ operator +"'"+ String.escapeSingle(value) +"']\") ).should_be_"+ (shouldBeTrue ? 'true' : 'false') +"();");
			code.push("testNode.removeAttribute('attr');");
			return Function(code.join("\n\t"));
		}
		for (var t=0,J; J=AttributeTests[t]; t++)
			its['"'+J.matchAgainst+'" should '+ (J.shouldBeTrue?'':'NOT') +" match \"[attr"+ J.operator +"'"+ String.escapeSingle(J.matchAgainst) +"']\""] =
				makeAttributeTest(J.operator, J.value, J.matchAgainst, J.shouldBeTrue);
	});
	
	
});
