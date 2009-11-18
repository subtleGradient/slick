function specsSelectNthChild(){
	
	Describe('nth-child',function(specs,context){
		
		var parent;
		function should_select(selector, items){
			var result = context.SELECT(parent, selector);
			value_of(result.length).should_be(items.length);
			for (var i = 0; i < result.length; i++){
				value_of(result[i].innerHTML).should_be('' + items[i]);
			}
		}
		
		specs.before_all = function(){
			parent = context.document.createElement('div');
			for (var i = 1, el; i <= 10; i++){
				el = document.createElement('div');
				el.appendChild(document.createTextNode(i));
				parent.appendChild(el);
			};
		};
		specs.after_all = function(){
			parent = null;
		};
		
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
	
};
