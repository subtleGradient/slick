var nodes = {};

Describe('Slick Match',function(){
	
	specs.before_all = function() {
		nodes.nodeWithoutParent = document.createElement('div');
		nodes.basic = nodes.nodeWithoutParent;
	};
	specs.after_all = function() {
		for (var name in nodes) {
			delete nodes[name];
		}
	};
	
	its['node should match another node'] = function(){
		
		value_of( Slick.match(nodes.basic, nodes.basic) ).should_be_true();
		value_of( Slick.match(nodes.basic, document.createElement('div')) ).should_be_false();
		
	};
	
	its['node should NOT match nothing'] = function(){
		
		value_of( Slick.match(nodes.basic) ).should_be_false();
		value_of( Slick.match(nodes.basic, null) ).should_be_false();
		value_of( Slick.match(nodes.basic, undefined) ).should_be_false();
		value_of( Slick.match(nodes.basic, '') ).should_be_false();
		
	};
	
	
	
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
			code.push("nodes.basic.setAttribute('attr', '"+ String.escapeSingle(matchAgainst) +"');");
			code.push("value_of( Slick.match(nodes.basic, \"[attr"+ operator +"'"+ String.escapeSingle(value) +"']\") ).should_be_"+ (shouldBeTrue ? 'true' : 'false') +"();");
			code.push("nodes.basic.removeAttribute('attr');");
			return Function(code.join("\n\t"));
		}
		for (var t=0,J; J=AttributeTests[t]; t++)
			its['"'+J.matchAgainst+'" should '+ (J.shouldBeTrue?'':'NOT') +" match \"[attr"+ J.operator +"'"+ String.escapeSingle(J.matchAgainst) +"']\""] =
				makeAttributeTest(J.operator, J.value, J.matchAgainst, J.shouldBeTrue);
	});
	
	
});


Describe('Slick Deep Match',function(){
	
	specs.before_all = function() {
		
		
		nodes.basic = document.createElement('div');
		nodes.basic.innerHTML = '\
			<b class="b">\
				<a id="nodes.basicID" class="a">\
					lorem\
				</a>\
			</b>\
		';
		document.body.appendChild(nodes.basic);
		
		
		nodes.nested_a = document.getElementById('nodes.basicID');
	};
	specs.after_all = function() {
		for (var name in nodes) {
			if (nodes[name] && nodes[name].parentNode) {
				nodes[name].parentNode.removeChild(nodes[name]);
			}
			delete nodes[name];
		}
	};
	
	
	
	it['should match a simple selector'] = function(){
		
		// tags
		value_of( deepMatch(nodes.nested_a, '*') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, ':not(a)') ).should_be_false();
		value_of( deepMatch(nodes.nested_a, 'del') ).should_be_false();
		value_of( deepMatch(nodes.nested_a, ':not(del)') ).should_be_true();
		
		// attributes
		value_of( deepMatch(nodes.nested_a, '[id]') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, ':not([id])') ).should_be_false();
		value_of( deepMatch(nodes.nested_a, '[class]') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, ':not([class])') ).should_be_false();
		
		// class
		value_of( deepMatch(nodes.nested_a, '.a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, ':not(.a)') ).should_be_false();
		
	};
	
	it['should match a selector with a combinator'] = function(){
		
		value_of( deepMatch(nodes.nested_a, '* > *') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, '* ~ *') ).should_be_false(); // has no previous siblings
		value_of( deepMatch(nodes.nested_a, '* + *') ).should_be_false(); // has no previous siblings
		
	};
	
});
