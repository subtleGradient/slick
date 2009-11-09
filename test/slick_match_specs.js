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
		
		it['should match all possible classes'] = TODO;
		
	});
	
	Describe('pseudos',function(){
		
		it['should match all standard pseudos'] = TODO;
		
		Describe('nth-child',function(){
			var parent = document.createElement('div');
			var html = '';
			for (var i = 1; i <= 10; i++) html += '<div>' + i + '</div>';
			parent.innerHTML = html;
			function should_select(selector, items){
				var result = Slick(parent, selector);
				value_of(result.length).should_be(items.length);
				for (var i = 0; i < result.length; i++){
					value_of(result[i].innerHTML).should_be('' + items[i]);
				}
			}
			it['should match by index'] = function(){
				should_select(':nth-child(-1)', []);
				should_select(':nth-child(0)', []);
				should_select(':nth-child(1)', [1]);
				should_select(':nth-child(10)', [10]);
				should_select(':nth-child(11)', []);
			};
			it['should match even'] = function(){
				should_select(':nth-child(even)', [2, 4, 6, 8, 10]);
			};
			it['should match odd'] = function(){
				should_select(':nth-child(odd)', [1, 3, 5, 7, 9]);
			};
			it['should select no elements'] = function(){
				should_select(':nth-child(-n)', []);
				should_select(':nth-child(4n+100)', []);
			};
			it['should select all elements'] = function(){
				should_select(':nth-child(n)', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
				should_select(':nth-child(-n+100)', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			};
			it['should skip a number of first elements'] = function(){
				should_select(':nth-child(2n+5)', [5, 7, 9]);
				should_select(':nth-child(n+8)', [8, 9, 10]);
			};
			it['should skip a number of last elements'] = function(){
				should_select(':nth-child(-2n+5)', [1, 3, 5]);
				should_select(':nth-child(-4n+2)', [2]);
				should_select(':nth-child(-n+2)', [1, 2]);
			};
			it['should work with multiple nth-child selectors'] = function(){
				should_select(':nth-child(2n):nth-child(3n+1)', [4, 10]);
				should_select(':nth-child(n+3):nth-child(-n+5)', [3, 4, 5]);
			};
		});
	});
	
	
});

Describe('Slick Deep Match',function(){
	
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
	
	it['should match a selector with combinators'] = function(){
		
		value_of( deepMatch(nodes.nested_a, '* *') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, '* > *') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, '* ~ *') ).should_be_false(); // has no previous siblings
		value_of( deepMatch(nodes.nested_a, '* + *') ).should_be_false(); // has no previous siblings
		
		value_of( deepMatch(nodes.nested_a, 'b a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'b > a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'div > b > a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'div > b + b > a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'div > b ~ b > a') ).should_be_true();
		value_of( deepMatch(nodes.nested_a, 'div a') ).should_be_true();
	};
	
	it['should match a node outside the DOM'] = TODO;
	
	it['should match a node on a different window/iframe'] = TODO;
	
});
