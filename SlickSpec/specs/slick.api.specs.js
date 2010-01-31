function specsSlickAPI(){
	
	Describe('Select Inputs',function(specs,context){
		var SELECT = (context.SELECT || global.SELECT);
		
		Describe('append',function(){
			
			it['should append results to an existing array if passed in'] = function(){
				var append = [];
				value_of( SELECT(context.document, '*', append) === append ).should_be_true();
			};
			
			it['should append results to an existing array-like-thing if passed in'] = function(){
				var append = {
					length: 0,
					push: function(item){
						this[this.length++] = item;
					}
				};
				value_of( SELECT(context.document, '*', append) ).should_be( append );
			};
			
			if (document.querySelectorAll)
			it['should not fail when using QSA is enabled'] = function(){
				context.Slick && (context.Slick.disableQSA = false);
				value_of( typeof SELECT(context.document, '*').length ).should_be('number');
				value_of( SELECT(context.document, '*').length ).should_not_be(0);
			};
			
		});
		
		
		Describe('context',function(specs,context){
			var SELECT = (context.SELECT || global.SELECT);
			
			it['must accept a document'] = function(){
				value_of( SELECT(context.document, '*', []) ).should_not_be( [] );
			};
			
			it['must accept a node'] = function(){
				value_of( SELECT(context.document.documentElement, '*', []).length ).should_not_be( 0 );
			};
			
			it['must accept any node'] = function(){
				value_of( SELECT(context.document.documentElement, '*', []).length ).should_not_be( 0 );
				var timedLog;
				var elements = context.document.getElementsByTagName('*');
				for (var i=0, l=elements.length; i < l; i++) {
					if (elements[i].nodeType != 1) continue;
					
					if (global.console && global.console.log)
					timedLog = setTimeout(function(){
						console.log(elements[i]);
					}, 100);
					
					if (elements[i].getElementsByTagName('*').length)
						value_of( SELECT(elements[i], '*', []).length ).should_not_be( 0 );
					else
						value_of( SELECT(elements[i], '*', []).length ).should_be( 0 );
					
					clearTimeout(timedLog);
				}
			};
			
			it['must accept a window'] = function(){
				value_of( SELECT(global.window, '*', []).length ).should_not_be( 0 );
				if (context.window && !context.window.fake)
					value_of( SELECT(context.window, '*', []).length ).should_not_be( 0 );
			};
			
			it['must reject null'] = function(){ value_of( SELECT(null, '*', []).length ).should_be( 0 ); };
			it['must reject Number'] = function(){ value_of( SELECT(1234567891011, '*', []).length ).should_be( 0 ); };
			it['must reject Array '] = function(){ value_of( SELECT([1,2,3,4,5,6], '*', []).length ).should_be( 0 ); };
			it['must reject String'] = function(){ value_of( SELECT("string here", '*', []).length ).should_be( 0 ); };
			it['must reject Object'] = function(){ value_of( SELECT({ foo:'bar' }, '*', []).length ).should_be( 0 ); };
			
		});
		
		
		
	});
	
	Describe('uniques',function(specs,context){
		var Slick = (context.Slick || global.Slick);
		
		it['should return uniques from `search` with append'] = function(){
			var append = [];
			var l1 = Slick.search(document, '*', append);
			value_of( l1.length ).should_be( append.length );
			value_of( l1.length ).should_be( Slick.uniques(append).length );
			
			// Should not add any more elements to append
			var l2 = Slick.search(document, '*', append);
			value_of( l2.length ).should_be( Slick.uniques(append).length );
			
			// value_of( l2 ).should_be( Slick.uniques(append).length );
			// value_of( l1 ).should_be( l2 );
		};
		
		it['should not recurse context with context == append'] = function(){
			var append = Slick.search(document, '*');
			
			var l1 = Slick.search(append, '*', Slick.search(document, ':root')).length;
			
			Slick.search(append, '*', append);
			var l2 = append.length;
			
			value_of( l1 ).should_be( l2 );
		};
		
		it['should support multiple contexts'] = function(){
			var l1 = Slick.search(document, '* *').length;
			
			var append = Slick.search(document, '*');
			var l2 = Slick.search(append, '*').length;
			
			value_of( l1 ).should_be( l2 );
		};
		
		it['should return uniques from `uniques` with append'] = function(){
			console.group('search');
			var append = Slick.search(document, '*');
			console.groupEnd('search');
			var append_length = append.length;
			var duplicates = append.concat(append);
			
			console.group('search with append');
			console.log(append.length);
			var results = Slick.search(document, 'a', append);
			console.log(results.length);
			console.groupEnd('search with append');
			
			
			value_of( results ).should_be( append );
			value_of( append.length ).should_be( append_length );
			
			value_of( Slick.uniques(results).length ).should_be( append_length );
			
			// value_of(Slick.uniques(duplicates).length).should_not_be(duplicates.length);
			// 
			// value_of(
			// 	Slick.uniques(duplicates, append).length
			// ).should_be(
			// 	append.length
			// );
			// 
			// value_of(
			// 	Slick.uniques(duplicates, append).length
			// ).should_be(
			// 	Slick.uniques(duplicates).length
			// );
			
		};
		
		it['should add results to append'] = function(){
			var append;
			
			append = [];
			Slick.search(document, '*', append);
			value_of( append.length ).should_be( Slick.search(document, '*').length );
			
			append = [];
			Slick.search(document, '*', append);
			value_of( append.length ).should_be( Slick.search(document, '*').length );
			
		};
		
	});
	
	
};
