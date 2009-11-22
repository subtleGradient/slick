function specsMatch(){

var nodes = {};

Describe('Slick Match',function(specs, context){
	
	specs.before_each = function() {
		nodeWithoutParent = document.createElement('div');
		testNode = nodeWithoutParent;
	};
	specs.after_each = function() {
		for (var name in nodes) {
			delete nodes[name];
		}
	};
	
	its['node should match another node'] = function(){
		
		value_of( context.MATCH(testNode, testNode) ).should_be_true();
		value_of( context.MATCH(testNode, document.createElement('div')) ).should_be_false();
		
	};
	
	its['node should NOT match nothing'] = function(){
		
		value_of( context.MATCH(testNode) ).should_be_false();
		value_of( context.MATCH(testNode, null) ).should_be_false();
		value_of( context.MATCH(testNode, undefined) ).should_be_false();
		value_of( context.MATCH(testNode, '') ).should_be_false();
		
	};
	
	
	
	Describe('attributes',function(){
		
		var nodes;
		
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
			return function(){
				testNode.setAttribute('attr', matchAgainst);
				value_of( context.MATCH(testNode, "[attr"+ operator +"'"+ value +"']") )[shouldBeTrue ? 'should_be_true' : 'should_be_false']();
				testNode.removeAttribute('attr');
			};
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
	
	specs.before_each = function() {
		
		testNode = context.document.createElement('div');
		testNode.innerHTML = '\
			<b class="b b1" id="b2">\
				<a class="a"> lorem </a>\
			</b>\
			<b class="b b2" id="b2">\
				<a id="a_tag1" class="a">\
					lorem\
				</a>\
			</b>\
		';
		context.document.body.appendChild(testNode);
		
		nested_a = context.document.getElementById('a_tag1');
	};
	specs.after_each = function() {
		for (var name in nodes) {
			if (nodes[name] && nodes[name].parentNode) {
				nodes[name].parentNode.removeChild(nodes[name]);
			}
			delete nodes[name];
		}
	};
	
	
	function it_should_match_selector(node, selector, should_be){
		it['should match selector "' + selector + '"'] = function(){
			
			value_of( context.MATCH(global[node], selector) ).should_be(should_be);
			
		};
	};
	
	it_should_match_selector('nested_a', '*'             ,true  );
	it_should_match_selector('nested_a', 'a'             ,true  );
	it_should_match_selector('nested_a', ':not(a)'       ,false );
	it_should_match_selector('nested_a', 'del'           ,false );
	it_should_match_selector('nested_a', ':not(del)'     ,true  );
	it_should_match_selector('nested_a', '[id]'          ,true  );
	it_should_match_selector('nested_a', ':not([id])'    ,false );
	it_should_match_selector('nested_a', '[class]'       ,true  );
	it_should_match_selector('nested_a', ':not([class])' ,false );
	it_should_match_selector('nested_a', '.a'            ,true  );
	it_should_match_selector('nested_a', ':not(.a)'      ,false );

	it_should_match_selector('nested_a', '* *'             ,true  );
	it_should_match_selector('nested_a', '* > *'           ,true  );
	it_should_match_selector('nested_a', '* ~ *'           ,false );
	it_should_match_selector('nested_a', '* + *'           ,false );
	it_should_match_selector('nested_a', 'b a'             ,true  );
	it_should_match_selector('nested_a', 'b > a'           ,true  );
	it_should_match_selector('nested_a', 'div > b > a'     ,true  );
	it_should_match_selector('nested_a', 'div > b + b > a' ,true  );
	it_should_match_selector('nested_a', 'div > b ~ b > a' ,true  );
	it_should_match_selector('nested_a', 'div a'           ,true  );
	
	// it['should match a node outside the DOM'] = TODO;
	
	// it['should match a node on a different window/iframe'] = TODO;
	
});

};
