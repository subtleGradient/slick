var nodes = {};

Describe('Slick Match',function(specs, context){
	
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
		
		value_of( SELECT(nodes.basic, nodes.basic) ).should_be_true();
		value_of( SELECT(nodes.basic, document.createElement('div')) ).should_be_false();
		
	};
	
	its['node should NOT match nothing'] = function(){
		
		value_of( SELECT(nodes.basic) ).should_be_false();
		value_of( SELECT(nodes.basic, null) ).should_be_false();
		value_of( SELECT(nodes.basic, undefined) ).should_be_false();
		value_of( SELECT(nodes.basic, '') ).should_be_false();
		
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
			{ operator:'!=', value:'test you!', matchAgainst:'test you!', shouldBeTrue:false }
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
	
	Describe('classes',function(){
		
		// it['should match all possible classes'] = TODO;
		
	});
	
	Describe('pseudos',function(){
		
		// it['should match all standard pseudos'] = TODO;
		
	});
	
	
});

Describe('Slick Deep Match',function(specs, context){
	
	specs.before_all = function() {
		
		
		nodes.basic = document.createElement('div');
		nodes.basic.innerHTML = '\
			<b class="b b1" id="b2">\
				<a class="a"> lorem </a>\
			</b>\
			<b class="b b2" id="b2">\
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
	
	
	function it_should_match_selector(nodes, selector, should_be){
		it['should match selector "' + selector + '"'] = function(){
			
			value_of( global.MATCH(nodes, selector) ).should_be(should_be);
			
		};
	};
	
	it_should_match_selector(nodes.nested_a, '*'             ,true  );
	it_should_match_selector(nodes.nested_a, 'a'             ,true  );
	it_should_match_selector(nodes.nested_a, ':not(a)'       ,false );
	it_should_match_selector(nodes.nested_a, 'del'           ,false );
	it_should_match_selector(nodes.nested_a, ':not(del)'     ,true  );
	it_should_match_selector(nodes.nested_a, '[id]'          ,true  );
	it_should_match_selector(nodes.nested_a, ':not([id])'    ,false );
	it_should_match_selector(nodes.nested_a, '[class]'       ,true  );
	it_should_match_selector(nodes.nested_a, ':not([class])' ,false );
	it_should_match_selector(nodes.nested_a, '.a'            ,true  );
	it_should_match_selector(nodes.nested_a, ':not(.a)'      ,false );

	it_should_match_selector(nodes.nested_a, '* *'             ,true  );
	it_should_match_selector(nodes.nested_a, '* > *'           ,true  );
	it_should_match_selector(nodes.nested_a, '* ~ *'           ,false );
	it_should_match_selector(nodes.nested_a, '* + *'           ,false );
	it_should_match_selector(nodes.nested_a, 'b a'             ,true  );
	it_should_match_selector(nodes.nested_a, 'b > a'           ,true  );
	it_should_match_selector(nodes.nested_a, 'div > b > a'     ,true  );
	it_should_match_selector(nodes.nested_a, 'div > b + b > a' ,true  );
	it_should_match_selector(nodes.nested_a, 'div > b ~ b > a' ,true  );
	it_should_match_selector(nodes.nested_a, 'div a'           ,true  );
	
	// it['should match a node outside the DOM'] = TODO;
	
	// it['should match a node on a different window/iframe'] = TODO;
	
});
