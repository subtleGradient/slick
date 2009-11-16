function specsPrototype(specs, context){
	
	function reduce(arr) {
		return arr.length > 1 ? arr : arr[0];
	};

	function compareArrays(array1, array2){
		for(var i = 0; i < array1.length; i++){
			value_of(array1[i]).should_be(array2[i]);
		}
	};

	function slick_find(expression, root, append){
		root = root || context.document;
		return context.Slick(root, expression, append)[0];
	};

	var $ = function(){
		var args = arguments;
		var expression;
		var ret = [];
		for(var i=0; i < args.length; i++){
			expression = args[i];
			if(typeof expression == 'string'){
				expression = slick_find('#' + expression);
			}
			ret.push(expression);
		}
		return reduce(ret);
	};
	
	function slick_search(expression, root, append){
		root = root || context.document;
		return context.Slick(root, expression, append);
	};
	var $$ = slick_search;

	Describe('testSelectorWithTagName', function(specs){
		it['should testSelectorWithTagName'] = function(){
			compareArrays([$('strong')], $$('strong'));
		    compareArrays([], $$('nonexistent'));
			var allNodesArray = [], i;
			var allNodes = context.document.getElementsByTagName('*');
			for(i = 0; i < allNodes.length; i++){
				if(allNodes[i].tagName !== '!') allNodesArray.push(allNodes[i]);
			}
			compareArrays(allNodesArray, $$('*'));
		};
	});
	
	Describe('testSelectorWithId', function(specs){
		it['should testSelectorWithId'] = function(){
			compareArrays([$('fixtures')], $$('#fixtures'));
			compareArrays([], $$('nonexistent'));
			compareArrays([$('troubleForm')], $$('#troubleForm'));
		};
	}); 

	Describe('testSelectorWithClassName', function(specs){
		it['should testSelectorWithClassName'] = function(){
			compareArrays($('p', 'link_1', 'item_1'), $$('.first'));
			compareArrays([], $$('.second'));
		};
	});

	Describe('testSelectorWithTagNameAndId', function(specs){
		it['should testSelectorWithTagNameAndId'] = function(){
			compareArrays([$('strong')], $$('strong#strong'));
		    compareArrays([], $$('p#strong'));
		};
	});
  
	Describe('testSelectorWithTagNameAndClassName', function(specs){
		it['should testSelectorWithTagNameAndClassName'] = function(){
			compareArrays($('link_1', 'link_2'), $$('a.internal'));
			compareArrays([$('link_2')], $$('a.internal.highlight'));
			compareArrays([$('link_2')], $$('a.highlight.internal'));
			compareArrays([], $$('a.highlight.internal.nonexistent'));
		};
	});
	
	Describe('testSelectorWithIdAndClassName', function(specs){
		it['testSelectorWithIdAndClassName'] = function(){
			compareArrays([$('link_2')], $$('#link_2.internal'));
			compareArrays([$('link_2')], $$('.internal#link_2'));
			compareArrays([$('link_2')], $$('#link_2.internal.highlight'));
			compareArrays([], $$('#link_2.internal.nonexistent'));
		};
	});

	Describe('testSelectorWithTagNameAndIdAndClassName', function(specs){
		it['should testSelectorWithTagNameAndIdAndClassName'] = function(){
			compareArrays([$('link_2')], $$('a#link_2.internal'));
			compareArrays([$('link_2')], $$('a.internal#link_2'));
			compareArrays([$('item_1')], $$('li#item_1.first'));
			compareArrays([], $$('li#item_1.nonexistent'));
			compareArrays([], $$('li#item_1.first.nonexistent'));
		};
	});

	Describe('test$$MatchesAncestryWithTokensSeparatedByWhitespace', function(specs){
		it['should test$$MatchesAncestryWithTokensSeparatedByWhitespace'] = function(){
			compareArrays($('em2', 'em', 'span'), $$('#fixtures a *'));
			compareArrays([$('p')], $$('div#fixtures p'));
		};
	});
	
	/*
	// they are returning the same values but with different orders
	Describe('test$$CombinesResultsWhenMultipleExpressionsArePassed', function(specs){
		it['should test$$CombinesResultsWhenMultipleExpressionsArePassed'] = function(){
			compareArrays($('link_1', 'link_2', 'item_1', 'item_2', 'item_3'), $$('#p a', null, $$(' ul#list li ')));
		};
	});
	*/
	
	Describe('testSelectorWithTagNameAndAttributeExistence', function(specs){
		it['should testSelectorWithTagNameAndAttributeExistence'] = function(){
			compareArrays($$('#fixtures h1'), $$('h1[class]'), 'h1[class]');
			compareArrays($$('#fixtures h1'), $$('h1[CLASS]'), 'h1[CLASS]');
			compareArrays([$('item_3')], $$('li#item_3[class]'), 'li#item_3[class]');
		};
	});
	
	Describe('testSelectorWithTagNameAndSpecificAttributeValue', function(specs){
		it['should testSelectorWithTagNameAndSpecificAttributeValue'] = function(){
			compareArrays($('link_1', 'link_2', 'link_3'), $$('a[href="#"]'));
			compareArrays($('link_1', 'link_2', 'link_3'), $$('a[href=#]'));
		};
	});

	Describe('testSelectorWithTagNameAndWhitespaceTokenizedAttributeValue', function(specs){
		it['should testSelectorWithTagNameAndWhitespaceTokenizedAttributeValue'] = function(){
			compareArrays($('link_1', 'link_2'), $$('a[class~="internal"]'));
			compareArrays($('link_1', 'link_2'), $$('a[class~=internal]'));
		};
	});
	
	Describe('testSelectorWithAttributeAndNoTagName', function(specs){
		it['should testSelectorWithAttributeAndNoTagName'] = function(){
			compareArrays($$('a[href]', $(context.document.body)), $$('[href]', $(context.document.body)));
			compareArrays($$('a[class~="internal"]'), $$('[class~=internal]'));
			compareArrays($$('*[id]'), $$('[id]'));
			compareArrays($$('#checked_radio, #unchecked_radio'), $$('[type=radio]'));
			compareArrays($$('*[type=checkbox]'), $$('[type=checkbox]'));
			compareArrays($$('#with_title, #commaParent'), $$('[title]'));
			compareArrays($$('#troubleForm *[type=radio]'), $$('#troubleForm [type=radio]'));
			compareArrays($$('#troubleForm *[type]'), $$('#troubleForm [type]'));
		};
	});

	Describe('testSelectorWithAttributeContainingDash', function(specs){
		it['should testSelectorWithAttributeContainingDash'] = function(){
			compareArrays([$('attr_with_dash')], $$('[foo-bar]'));
		};
	});
	
	Describe('testSelectorWithUniversalAndHyphenTokenizedAttributeValue', function(specs){
		it['should testSelectorWithUniversalAndHyphenTokenizedAttributeValue'] = function(){
			compareArrays([$('item_3')], $$('*[xml:lang|="es"]'));
			compareArrays([$('item_3')], $$('*[xml:lang|="ES"]'));
		};
	});
	
	Describe('testSelectorWithTagNameAndNegatedAttributeValue', function(specs){
		it['should testSelectorWithTagNameAndNegatedAttributeValue'] = function(){
			compareArrays([], $$('a[href!="#"]'));
		};
	});
	
	Describe('testSelectorWithBracketAttributeValue', function(specs){
		it['should testSelectorWithBracketAttributeValue'] = function(){
			compareArrays($('chk_1', 'chk_2'), $$('#troubleForm2 input[name="brackets[5][]"]'));
			compareArrays([$('chk_1')], $$('#troubleForm2 input[name="brackets[5][]"]:checked'));
			compareArrays([$('chk_2')], $$('#troubleForm2 input[name="brackets[5][]"][value=2]'));
			compareArrays([], $$('#troubleForm2 input[name=brackets[5][]]'));
		};
	});
	
	
	Describe('test$$WithNestedAttributeSelectors', function(specs){
		it['should test$$WithNestedAttributeSelectors'] = function(){
			compareArrays([$('strong')], $$('div[style] p[id] strong'));
		};
	});
	
	Describe('testSelectorWithMultipleConditions', function(specs){
		it['should testSelectorWithMultipleConditions'] = function(){
			compareArrays([$('link_3')], $$('a[class~=external][href="#"]'));
			compareArrays([], $$('a[class~=external][href!="#"]'));
		};
	});
	/*
	Describe('testSelectorMatchElements', function(specs){
		it['should testSelectorMatchElements'] = function(){
			this.assertElementsMatch(Selector.matchElements($('list').descendants(), 'li'), '#item_1', '#item_2', '#item_3');
			this.assertElementsMatch(Selector.matchElements($('fixtures').descendants(), 'a.internal'), '#link_1', '#link_2');
			compareArrays([], Selector.matchElements($('fixtures').descendants(), 'p.last'));
			this.assertElementsMatch(Selector.matchElements($('fixtures').descendants(), '.inexistant, a.internal'), '#link_1', '#link_2');
		};
	});
	
	Describe('testSelectorFindElement', function(specs){
		it['should testSelectorFindElement'] = function(){
			this.assertElementMatches(Selector.findElement($('list').descendants(), 'li'), 'li#item_1.first');
			this.assertElementMatches(Selector.findElement($('list').descendants(), 'li', 1), 'li#item_2');
			this.assertElementMatches(Selector.findElement($('list').descendants(), 'li#item_3'), 'li');
			this.assertEqual(undefined, Selector.findElement($('list').descendants(), 'em'));
		};
	});
	
	
	Describe('testElementMatch', function(specs){
		it['should testElementMatch'] = function(){
			var span = $('dupL1');
			// tests that should pass
			this.assert(span.match('span'));
			this.assert(span.match('span#dupL1'));
			this.assert(span.match('div > span'), 'child combinator');
			this.assert(span.match('#dupContainer span'), 'descendant combinator');      
			this.assert(span.match('#dupL1'), 'ID only');
			this.assert(span.match('span.span_foo'), 'class name 1');
			this.assert(span.match('span.span_bar'), 'class name 2');
			this.assert(span.match('span:first-child'), 'first-child pseudoclass');

			this.assert(!span.match('span.span_wtf'), 'bogus class name');
			this.assert(!span.match('#dupL2'), 'different ID');
			this.assert(!span.match('div'), 'different tag name');
			this.assert(!span.match('span span'), 'different ancestry');
			this.assert(!span.match('span > span'), 'different parent');
			this.assert(!span.match('span:nth-child(5)'), 'different pseudoclass');

			this.assert(!$('link_2').match('a[rel^=external]'));
			this.assert($('link_1').match('a[rel^=external]'));
			this.assert($('link_1').match('a[rel^="external"]'));
			this.assert($('link_1').match("a[rel^='external']"));

			this.assert(span.match({ match: function(element) { return true }}), 'custom selector');
			this.assert(!span.match({ match: function(element) { return false }}), 'custom selector');
		};
	});
	*/
	  
	Describe('testSelectorWithSpaceInAttributeValue', function(specs){
		it['should testSelectorWithSpaceInAttributeValue'] = function(){
			compareArrays([$('with_title')], $$('cite[title="hello world!"]'));
		};
	});

	// AND NOW COME THOSE NEW TESTS AFTER ANDREW'S REWRITE!
	/*
	Describe('testSelectorWithNamespacedAttributes', function(specs){
		it['should testSelectorWithNamespacedAttributes'] = function(){
			if (Prototype.BrowserFeatures.XPath) {
			  this.assertUndefined(new Selector('html[xml:lang]').xpath);
			  this.assertUndefined(new Selector('body p[xml:lang]').xpath);
			} else
			  this.info("Could not test XPath bypass: no XPath to begin with!");
			this.assertElementsMatch($$('[xml:lang]'), 'html', '#item_3');
			this.assertElementsMatch($$('*[xml:lang]'), 'html', '#item_3');
		};
	});
	*/
	
	Describe('testSelectorWithChild', function(specs){
		it['should testSelectorWithChild'] = function(){
			compareArrays($('link_1', 'link_2'), $$('p.first > a'));
			compareArrays($('father', 'uncle'), $$('div#grandfather > div'));
			compareArrays($('level2_1', 'level2_2'), $$('#level1>span'));
			compareArrays($('level2_1', 'level2_2'), $$('#level1 > span'));
			compareArrays($('level3_1', 'level3_2'), $$('#level2_1 > *'));
			compareArrays([], $$('div > #nonexistent'));
		};
	});
	
	Describe('testSelectorWithAdjacence', function(specs){
		it['should testSelectorWithAdjacence'] = function(){
			compareArrays([$('uncle')], $$('div.brothers + div.brothers'));
			compareArrays([$('uncle')], $$('div.brothers + div'));      
			value_of($('level2_2') === reduce($$('#level2_1+span'))).should_be_true();
			value_of($('level2_2') === reduce($$('#level2_1 + span'))).should_be_true();
			value_of($('level2_2') === reduce($$('#level2_1 + *'))).should_be_true();
			compareArrays([], $$('#level2_2 + span'));
			value_of($('level3_2') === reduce($$('#level3_1 + span'))).should_be_true();
			value_of($('level3_2') === reduce($$('#level3_1 + *'))).should_be_true();
			compareArrays([], $$('#level3_2 + *'));
			compareArrays([], $$('#level3_1 + em'));
		};
	});
	
	Describe('testSelectorWithLaterSibling', function(specs){
		it['should testSelectorWithLaterSibling'] = function(){
			compareArrays([$('list')], $$('h1 ~ ul'));
			value_of($('level2_2') === reduce($$('#level2_1 ~ span'))).should_be_true();
			compareArrays($('level2_2', 'level2_3'), reduce($$('#level2_1 ~ *')));
			compareArrays([], $$('#level2_2 ~ span'));
			compareArrays([], $$('#level3_2 ~ *'));
			compareArrays([], $$('#level3_1 ~ em'));
			compareArrays([$('level3_2')], $$('#level3_1 ~ #level3_2'));
			compareArrays([$('level3_2')], $$('span ~ #level3_2'));
			compareArrays([], $$('div ~ #level3_2'));
			compareArrays([], $$('div ~ #level2_3'));
		};
	});
	
	Describe('testSelectorWithNewAttributeOperators', function(specs){
		it['should testSelectorWithNewAttributeOperators'] = function(){
			compareArrays($('father', 'uncle'), $$('div[class^=bro]'));
			compareArrays($('father', 'uncle'), $$('div[class$=men]'));
			compareArrays($('father', 'uncle'), $$('div[class*="ers m"]'));
			compareArrays($('level2_1', 'level2_2', 'level2_3'), $$('#level1 *[id^="level2_"]'));
			compareArrays($('level2_1', 'level2_2', 'level2_3'), $$('#level1 *[id^=level2_]'));
			compareArrays($('level2_1', 'level3_1'), $$('#level1 *[id$="_1"]'));
			compareArrays($('level2_1', 'level3_1'), $$('#level1 *[id$=_1]'));
			compareArrays($('level2_1', 'level3_2', 'level2_2', 'level2_3'), $$('#level1 *[id*="2"]'));
			compareArrays($('level2_1', 'level3_2', 'level2_2', 'level2_3'), $$('#level1 *[id*=2]'));
		};
	});
	Describe('testSelectorWithDuplicates', function(specs){
		it['should testSelectorWithDuplicates'] = function(){
			//compareArrays($$('div div'), $$('div div').uniq());
			compareArrays($('dupL2', 'dupL3', 'dupL4', 'dupL5'), $$('#dupContainer span span'));
		};
	});
	Describe('testSelectorWithFirstLastOnlyNthNthLastChild', function(specs){
		it['should testSelectorWithFirstLastOnlyNthNthLastChild'] = function(){
			compareArrays([$('level2_1')], $$('#level1>*:first-child'));
			compareArrays($('level2_1', 'level3_1', 'level_only_child'), $$('#level1 *:first-child'));
			compareArrays([$('level2_3')], $$('#level1>*:last-child'));
			compareArrays($('level3_2', 'level_only_child', 'level2_3'), $$('#level1 *:last-child'));
			compareArrays([$('level2_3')], $$('#level1>div:last-child'));
			compareArrays([$('level2_3')], $$('#level1 div:last-child'));
			compareArrays([], $$('#level1>div:first-child'));
			compareArrays([], $$('#level1>span:last-child'));
			compareArrays($('level2_1', 'level3_1'), $$('#level1 span:first-child'));
			compareArrays([], $$('#level1:first-child'));
			compareArrays([], $$('#level1>*:only-child'));
			compareArrays([$('level_only_child')], $$('#level1 *:only-child'));
			compareArrays([], $$('#level1:only-child'));
			//compareArrays([$('link_2')], $$('#p *:last-child(2)'), 'nth-last-child');
			compareArrays([$('link_2')], $$('#p *:nth-child(3)'), 'nth-child');
			compareArrays([$('link_2')], $$('#p a:nth-child(3)'), 'nth-child');
			compareArrays($('item_2', 'item_3'), $$('#list > li:nth-child(n+2)'));
			compareArrays($('item_1', 'item_2'), $$('#list > li:nth-child(-n+2)'));
		};
	});
	
	Describe('testSelectorWithFirstLastNthNthLastOfType', function(specs){
		it['should testSelectorWithFirstLastNthNthLastOfType'] = function(){
			//compareArrays([$('link_2')], $$('#p a:nth-of-type(2)'), 'nth-of-type');
			//compareArrays([$('link_1')], $$('#p a:nth-of-type(1)'), 'nth-of-type');
			//compareArrays([$('link_2')], $$('#p a:nth-last-of-type(1)'), 'nth-last-of-type');
			//compareArrays([$('link_1')], $$('#p a:first-of-type'), 'first-of-type');
			//compareArrays([$('link_2')], $$('#p a:last-of-type'), 'last-of-type');
		};
	});
	
	Describe('testSelectorWithNot', function(specs){
		it['should testSelectorWithNot'] = function(){
			//compareArrays([$('link_2')], $$('#p a:not(a:first-of-type)'), 'first-of-type');
			//compareArrays([$('link_1')], $$('#p a:not(a:last-of-type)'), 'last-of-type');
			//compareArrays([$('link_2')], $$('#p a:not(a:nth-of-type(1))'), 'nth-of-type');
			//compareArrays([$('link_1')], $$('#p a:not(a:nth-last-of-type(1))'), 'nth-last-of-type');
			compareArrays([$('link_2')], $$('#p a:not([rel~=nofollow])'), 'attribute 1');
			compareArrays([$('link_2')], $$('#p a:not(a[rel^=external])'), 'attribute 2');
			compareArrays([$('link_2')], $$('#p a:not(a[rel$=nofollow])'), 'attribute 3');
			compareArrays([$('em')], $$('#p a:not(a[rel$="nofollow"]) > em'), 'attribute 4');
			compareArrays([$('item_2')], $$('#list li:not(#item_1):not(#item_3)'), 'adjacent :not clauses');
			compareArrays([$('son')], $$('#grandfather > div:not(#uncle) #son'));
			compareArrays([$('em')], $$('#p a:not(a[rel$="nofollow"]) em'), 'attribute 4 + all descendants');
			compareArrays([$('em')], $$('#p a:not(a[rel$="nofollow"])>em'), 'attribute 4 (without whitespace)');
		};
	});
	
	Describe('testSelectorWithEnabledDisabledChecked', function(specs){
		it['should testSelectorWithEnabledDisabledChecked'] = function(){
			compareArrays([$('disabled_text_field')], $$('#troubleForm > *:disabled'));
			//compareArrays($('troubleForm').getInputs().without($('disabled_text_field'), $('hidden')), $$('#troubleForm > *:enabled'));
			compareArrays($('checked_box', 'checked_radio'), $$('#troubleForm *:checked'));
		};
	});
	
	Describe('testSelectorWithEmpty', function(specs){
		it['should testSelectorWithEmpty'] = function(){
			$('level3_1').innerHTML = '';
			compareArrays($('level3_1', 'level3_2', 'level2_3'), $$('#level1 *:empty'), '#level1 *:empty');
			compareArrays([], $$('#level_only_child:empty'), 'newlines count as content!');
		};
	});
	
	Describe('testIdenticalResultsFromEquivalentSelectors', function(specs){
		it['should testIdenticalResultsFromEquivalentSelectors'] = function(){
			compareArrays($$('div.brothers'), $$('div[class~=brothers]'));
			compareArrays($$('div.brothers'), $$('div[class~=brothers].brothers'));
			compareArrays($$('div:not(.brothers)'), $$('div:not([class~=brothers])'));
			compareArrays($$('li ~ li'), $$('li:not(:first-child)'));
			compareArrays($$('ul > li'), $$('ul > li:nth-child(n)'));
			compareArrays($$('ul > li:nth-child(even)'), $$('ul > li:nth-child(2n)'));
			compareArrays($$('ul > li:nth-child(odd)'), $$('ul > li:nth-child(2n+1)'));
			compareArrays($$('ul > li:first-child'), $$('ul > li:nth-child(1)'));
			//compareArrays($$('ul > li:last-child'), $$('ul > li:nth-last-child(1)'));
			compareArrays($$('ul > li:nth-child(n-999)'), $$('ul > li'));
			compareArrays($$('ul>li'), $$('ul > li'));
			compareArrays($$('#p a:not(a[rel$="nofollow"])>em'), $$('#p a:not(a[rel$="nofollow"]) > em'));
		};
	});
	
	Describe('testSelectorsThatShouldReturnNothing', function(specs){
		it['should testSelectorsThatShouldReturnNothing'] = function(){
			compareArrays([], $$('span:empty > *'));
			compareArrays([], $$('div.brothers:not(.brothers)'));
			compareArrays([], $$('#level2_2 :only-child:not(:last-child)'));
			compareArrays([], $$('#level2_2 :only-child:not(:first-child)'));
		};
	});
	
	Describe('testCommasFor$$', function(specs){
		it['should testCommasFor$$'] = function(){
			compareArrays($('list', 'p', 'link_1', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first,*[xml:lang="es-us"] , #troubleForm'));
			compareArrays($('list', 'p', 'link_1', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first,', '*[xml:lang="es-us"] , #troubleForm'));
			compareArrays($('commaParent', 'commaChild'), $$('form[title*="commas,"], input[value="#commaOne,#commaTwo"]'));
			compareArrays($('commaParent', 'commaChild'), $$('form[title*="commas,"]', 'input[value="#commaOne,#commaTwo"]'));
		};
	});

/*	Describe('testSelectorExtendsAllNodes', function(specs){
		it['should testSelectorExtendsAllNodes'] = function(){
			var element = document.createElement('div');
			(3).times(function(){
			  element.appendChild(document.createElement('div'));
			});
			element.setAttribute('id','scratch_element');
			$$('body')[0].appendChild(element);
			var results = $$('#scratch_element div');
			this.assert(typeof results[0].show == 'function');
			this.assert(typeof results[1].show == 'function');
			this.assert(typeof results[2].show == 'function');
		};
	});
	
	Describe('testCountedIsNotAnAttribute', function(specs){
		it['should testCountedIsNotAnAttribute'] = function(){
			var el = $('list');
			Selector.handlers.mark([el]);
			this.assert(!el.innerHTML.include("_counted"));
			Selector.handlers.unmark([el]);
			this.assert(!el.innerHTML.include("_counted"));      
		};
	});
	
	Describe('testCopiedNodesGetIncluded', function(specs){
		it['should testCopiedNodesGetIncluded'] = function(){
			this.assertElementsMatch(
			Selector.matchElements($('counted_container').descendants(), 'div'),
				'div.is_counted'
			);
			$('counted_container').innerHTML += $('counted_container').innerHTML;
			this.assertElementsMatch(
			Selector.matchElements($('counted_container').descendants(), 'div'), 'div.is_counted', 
				'div.is_counted'
			);
		};
	});
	
	Describe('testSelectorNotInsertedNodes', function(specs){
		it['should testSelectorNotInsertedNodes'] = function(){
			window.debug = true;
			var wrapper = new Element("div");
			wrapper.update("<table><tr><td id='myTD'></td></tr></table>");
			this.assertNotNullOrUndefined(wrapper.select('[id=myTD]')[0], 'selecting: [id=myTD]');
			this.assertNotNullOrUndefined(wrapper.select('#myTD')[0], 'selecting: #myTD');
			this.assertNotNullOrUndefined(wrapper.select('td')[0],  'selecting: td');      
			this.assert($$('#myTD').length == 0, 'should not turn up in document-rooted search');
			window.debug = false;
		};
	});
	
	Describe('testElementDown', function(specs){
		it['should testElementDown'] = function(){
			var a = $('dupL4'); 
			var b = $('dupContainer').down('#dupL4');
			this.assertEqual(a, b);
		};
	});
	
	Describe('testElementDownWithDotAndColon', function(specs){
		it['should testElementDownWithDotAndColon'] = function(){
			var a = $('dupL4_dotcolon'); 
			var b = $('dupContainer.withdot:active').down('#dupL4_dotcolon');    
			var c = $('dupContainer.withdot:active').select('#dupL4_dotcolon');

			this.assertEqual(a, b);
			compareArrays([a], c);
		};
	});

	testDescendantSelectorBuggy: function() {
	  var el = document.createElement('div');
	  el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';
	  document.body.appendChild(el);
	  this.assertEqual(2, $(el).select('ul li').length);
	  document.body.removeChild(el);
	}
*/
};
