function specsPrototype(specs, context){

	function reduce(arr) {
		return arr.length > 1 ? arr : arr[0];
	};

	function compareArrays(array1, array2){
		for(var i = 0; i < array1.length; i++){
			value_of(array2[i]).should_be(array1[i]);
		}
	};

	function slick_find(expression, root, append){
		root = root || context.document;
		return context.SELECT(root, expression, append)[0];
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
		return context.SELECT(root, expression, append);
	};
	var $$ = slick_search;


	Describe('Select',function(){
		it['should SelectorWithTagName'] = function(){
			compareArrays([$('strong')], $$('strong'));
			compareArrays([], $$('nonexistent'));
			var allNodesArray = [], i;
			var allNodes = context.document.getElementsByTagName('*');
			for(i = 0; i < allNodes.length; i++){
				if(allNodes[i].tagName !== '!') allNodesArray.push(allNodes[i]);
			}
			compareArrays(allNodesArray, $$('*'));
		};

		it['should SelectorWithId'] = function(){
			compareArrays([$('fixtures')], $$('#fixtures'));
			compareArrays([], $$('nonexistent'));
			compareArrays([$('troubleForm')], $$('#troubleForm'));
		};

		it['should SelectorWithClassName'] = function(){
			compareArrays($('p', 'link_1', 'item_1'), $$('.first'));
			compareArrays([], $$('.second'));
		};

		it['should SelectorWithTagNameAndId'] = function(){
			compareArrays([$('strong')], $$('strong#strong'));
			compareArrays([], $$('p#strong'));
		};

		it['should SelectorWithTagNameAndClassName'] = function(){
			compareArrays($('link_1', 'link_2'), $$('a.internal'));
			compareArrays([$('link_2')], $$('a.internal.highlight'));
			compareArrays([$('link_2')], $$('a.highlight.internal'));
			compareArrays([], $$('a.highlight.internal.nonexistent'));
		};

		it['testSelectorWithIdAndClassName'] = function(){
			compareArrays([$('link_2')], $$('#link_2.internal'));
			compareArrays([$('link_2')], $$('.internal#link_2'));
			compareArrays([$('link_2')], $$('#link_2.internal.highlight'));
			compareArrays([], $$('#link_2.internal.nonexistent'));
		};

		it['should SelectorWithTagNameAndIdAndClassName'] = function(){
			compareArrays([$('link_2')], $$('a#link_2.internal'));
			compareArrays([$('link_2')], $$('a.internal#link_2'));
			compareArrays([$('item_1')], $$('li#item_1.first'));
			compareArrays([], $$('li#item_1.nonexistent'));
			compareArrays([], $$('li#item_1.first.nonexistent'));
		};

		it['should $$MatchesAncestryWithTokensSeparatedByWhitespace'] = function(){
			compareArrays($('em2', 'em', 'span'), $$('#fixtures a *'));
			compareArrays([$('p')], $$('div#fixtures p'));
		};

		// they are returning the same values but with different orders
/*
		it['should $$CombinesResultsWhenMultipleExpressionsArePassed'] = function(){
			compareArrays($('link_1', 'link_2', 'item_1', 'item_2', 'item_3'), $$('#p a', null, $$(' ul#list li ')));
		};
*/

		it['should SelectorWithTagNameAndAttributeExistence'] = function(){
			compareArrays($$('#fixtures h1'), $$('h1[class]'), 'h1[class]');
			compareArrays($$('#fixtures h1'), $$('h1[CLASS]'), 'h1[CLASS]');
			
			// the element has class=""
			// this test assumes that you would want to return the element, even though the value is blank
			// value_of(context.document.querySelectorAll('li#item_3[class]')).should_be([$('item_3')]);
			value_of( context.SELECT(context.document, 'li#item_3[class]') ).should_be([$('item_3')]);
			// compareArrays([$('item_3')], $$('li#item_3[class]'), 'li#item_3[class]');
		};

		it['should SelectorWithTagNameAndSpecificAttributeValue'] = function(){
			compareArrays($('link_1', 'link_2', 'link_3'), $$('a[href="#"]'));
			compareArrays($('link_1', 'link_2', 'link_3'), $$('a[href=#]'));
		};

		it['should SelectorWithTagNameAndWhitespaceTokenizedAttributeValue'] = function(){
			compareArrays($('link_1', 'link_2'), $$('a[class~="internal"]'));
			compareArrays($('link_1', 'link_2'), $$('a[class~=internal]'));
		};

		it['should SelectorWithAttributeAndNoTagName'] = function(){
			compareArrays($$('a[href]', $(context.document.body)), $$('[href]', $(context.document.body)));
			compareArrays($$('a[class~="internal"]'), $$('[class~=internal]'));
			compareArrays($$('*[id]'), $$('[id]'));
			compareArrays($$('#checked_radio, #unchecked_radio'), $$('[type=radio]'));
			compareArrays($$('*[type=checkbox]'), $$('[type=checkbox]'));
			compareArrays($$('#with_title, #commaParent'), $$('[title]'));
			compareArrays($$('#troubleForm *[type=radio]'), $$('#troubleForm [type=radio]'));
			compareArrays($$('#troubleForm *[type]'), $$('#troubleForm [type]'));
		};

		it['should SelectorWithAttributeContainingDash'] = function(){
			compareArrays([$('attr_with_dash')], $$('[foo-bar]'));
		};

		it['should SelectorWithUniversalAndHyphenTokenizedAttributeValue'] = function(){
			compareArrays([$('item_3')], $$('*[xml:lang|="es"]'));
			compareArrays([$('item_3')], $$('*[xml:lang|="ES"]'));
		};

		it['should SelectorWithTagNameAndNegatedAttributeValue'] = function(){
			compareArrays([], $$('a[href!="#"]'));
		};

		it['should SelectorWithBracketAttributeValue'] = function(){
			compareArrays($('chk_1', 'chk_2'), $$('#troubleForm2 input[name="brackets[5][]"]'));
			compareArrays([$('chk_1')], $$('#troubleForm2 input[name="brackets[5][]"]:checked'));
			compareArrays([$('chk_2')], $$('#troubleForm2 input[name="brackets[5][]"][value=2]'));
			compareArrays([], $$('#troubleForm2 input[name=brackets[5][]]'));
		};

		it['should $$WithNestedAttributeSelectors'] = function(){
			compareArrays([$('strong')], $$('div[style] p[id] strong'));
		};

		it['should SelectorWithMultipleConditions'] = function(){
			compareArrays([$('link_3')], $$('a[class~=external][href="#"]'));
			compareArrays([], $$('a[class~=external][href!="#"]'));
		};

/*
		it['should SelectorMatchElements'] = function(){
			this.assertElementsMatch(context.MATCH($('list').descendants(), 'li'), '#item_1', '#item_2', '#item_3');
			this.assertElementsMatch(context.MATCH($('fixtures').descendants(), 'a.internal'), '#link_1', '#link_2');
			compareArrays([], context.MATCH($('fixtures').descendants(), 'p.last'));
			this.assertElementsMatch(context.MATCH($('fixtures').descendants(), '.inexistant, a.internal'), '#link_1', '#link_2');
		};
*/

/*
		it['should SelectorFindElement'] = function(){
			TODO('implement context.SELECT1');
			
			this.assertElementMatches(context.SELECT1($('list').descendants(), 'li'), 'li#item_1.first');
			this.assertElementMatches(context.SELECT1($('list').descendants(), 'li', 1), 'li#item_2');
			this.assertElementMatches(context.SELECT1($('list').descendants(), 'li#item_3'), 'li');
			this.assertEqual(undefined, context.SELECT1($('list').descendants(), 'em'));
		};
*/

		it['should ElementMatch'] = function(){
			var span = $('dupL1');
			// tests that should pass
			
			value_of(context.MATCH(span, 'span')).should_be_true();
			value_of(context.MATCH(span, 'span#dupL1')).should_be_true();
			value_of(context.MATCH(span, 'div > span'), 'child combinator').should_be_true();
			value_of(context.MATCH(span, '#dupContainer span'), 'descendant combinator').should_be_true();
			value_of(context.MATCH(span, '#dupL1'), 'ID only').should_be_true();
			value_of(context.MATCH(span, 'span.span_foo'), 'class name 1').should_be_true();
			value_of(context.MATCH(span, 'span.span_bar'), 'class name 2').should_be_true();
			value_of(context.MATCH(span, 'span:first-child'), 'first-child pseudoclass').should_be_true();
			
			value_of(!context.MATCH(span, 'span.span_wtf'), 'bogus class name').should_be_true();
			value_of(!context.MATCH(span, '#dupL2'), 'different ID').should_be_true();
			value_of(!context.MATCH(span, 'div'), 'different tag name').should_be_true();
			value_of(!context.MATCH(span, 'span span'), 'different ancestry').should_be_true();
			value_of(!context.MATCH(span, 'span > span'), 'different parent').should_be_true();
			value_of(!context.MATCH(span, 'span:nth-child(5)'), 'different pseudoclass').should_be_true();
			
			value_of(!context.MATCH($('link_2'), 'a[rel^=external]')).should_be_true();
			value_of(context.MATCH($('link_1'), 'a[rel^=external]')).should_be_true();
			value_of(context.MATCH($('link_1'), 'a[rel^="external"]')).should_be_true();
			value_of(context.MATCH($('link_1'), "a[rel^='external']")).should_be_true();
			
			value_of(context.MATCH(span, { match: function(element) { return true }}), 'custom selector').should_be_true();
			value_of(!context.MATCH(span, { match: function(element) { return false }}), 'custom selector').should_be_true();
		};

		it['should SelectorWithSpaceInAttributeValue'] = function(){
			compareArrays([$('with_title')], $$('cite[title="hello world!"]'));
		};

		// AND NOW COME THOSE NEW TESTS AFTER ANDREW'S REWRITE!
		
		it['should SelectorWithNamespacedAttributes'] = function(){
			// if (Prototype.BrowserFeatures.XPath) {
			// 	this.assertUndefined(new Selector('html[xml:lang]').xpath);
			// 	this.assertUndefined(new Selector('body p[xml:lang]').xpath);
			// } else
			// this.info("Could not test XPath bypass: no XPath to begin with!");
			// this.assertElementsMatch($$('[xml:lang]') , 'html', '#item_3');
			// this.assertElementsMatch($$('*[xml:lang]'), 'html', '#item_3');
			value_of( $$('[xml:lang]')  ).should_be([ context.document.documentElement, context.document.getElementById('item_3') ]);
			value_of( $$('*[xml:lang]') ).should_be([ context.document.documentElement, context.document.getElementById('item_3') ]);
		};

		it['should SelectorWithChild'] = function(){
			compareArrays($('link_1', 'link_2'), $$('p.first > a'));
			compareArrays($('father', 'uncle'), $$('div#grandfather > div'));
			compareArrays($('level2_1', 'level2_2'), $$('#level1>span'));
			compareArrays($('level2_1', 'level2_2'), $$('#level1 > span'));
			compareArrays($('level3_1', 'level3_2'), $$('#level2_1 > *'));
			compareArrays([], $$('div > #nonexistent'));
		};

		it['should SelectorWithAdjacence'] = function(){
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

		it['should SelectorWithLaterSibling'] = function(){
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

		it['should SelectorWithNewAttributeOperators'] = function(){
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

		it['should SelectorWithDuplicates'] = function(){
			//compareArrays($$('div div'), $$('div div').uniq());
			compareArrays($('dupL2', 'dupL3', 'dupL4', 'dupL5'), $$('#dupContainer span span'));
		};

		it['should SelectorWithFirstLastOnlyNthNthLastChild'] = function(){
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
		it['should SelectorWithFirstLastOnlyNthNthLastChild 2'] = function(){
			compareArrays([$('link_2')], $$('#p *:last-child(2)'), 'nth-last-child');
		};

		it['should SelectorWithFirstLastNthNthLastOfType'] = function(){
			compareArrays([$('link_2')], $$('#p a:nth-of-type(2)'), 'nth-of-type');
			compareArrays([$('link_1')], $$('#p a:nth-of-type(1)'), 'nth-of-type');
			compareArrays([$('link_2')], $$('#p a:nth-last-of-type(1)'), 'nth-last-of-type');
			compareArrays([$('link_1')], $$('#p a:first-of-type'), 'first-of-type');
			compareArrays([$('link_2')], $$('#p a:last-of-type'), 'last-of-type');
		};

		it['should SelectorWithNot'] = function(){
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

		it['should SelectorWithEnabledDisabledChecked'] = function(){
			compareArrays([$('disabled_text_field')], $$('#troubleForm > *:disabled'));
			//compareArrays($('troubleForm').getInputs().without($('disabled_text_field'), $('hidden')), $$('#troubleForm > *:enabled'));
			compareArrays($('checked_box', 'checked_radio'), $$('#troubleForm *:checked'));
		};

		it['should SelectorWithEmpty'] = function(){
			$('level3_1').innerHTML = '';
			compareArrays($('level3_1', 'level3_2', 'level2_3'), $$('#level1 *:empty'), '#level1 *:empty');
			compareArrays([], $$('#level_only_child:empty'), 'newlines count as content!');
		};

		it['should IdenticalResultsFromEquivalentSelectors'] = function(){
			compareArrays($$('div.brothers'), $$('div[class~=brothers]'));
			compareArrays($$('div.brothers'), $$('div[class~=brothers].brothers'));
			compareArrays($$('div:not(.brothers)'), $$('div:not([class~=brothers])'));
			compareArrays($$('li ~ li'), $$('li:not(:first-child)'));
			compareArrays($$('ul > li'), $$('ul > li:nth-child(n)'));
			compareArrays($$('ul > li:nth-child(even)'), $$('ul > li:nth-child(2n)'));
			compareArrays($$('ul > li:nth-child(odd)'), $$('ul > li:nth-child(2n+1)'));
			compareArrays($$('ul > li:first-child'), $$('ul > li:nth-child(1)'));
			compareArrays($$('ul > li:last-child'), $$('ul > li:nth-last-child(1)'));
			compareArrays($$('ul > li:nth-child(n-999)'), $$('ul > li'));
			compareArrays($$('ul>li'), $$('ul > li'));
			compareArrays($$('#p a:not(a[rel$="nofollow"])>em'), $$('#p a:not(a[rel$="nofollow"]) > em'));
		};

		it['should SelectorsThatShouldReturnNothing'] = function(){
			compareArrays([], $$('span:empty > *'));
			compareArrays([], $$('div.brothers:not(.brothers)'));
			compareArrays([], $$('#level2_2 :only-child:not(:last-child)'));
			compareArrays([], $$('#level2_2 :only-child:not(:first-child)'));
		};

		it['should CommasFor$$'] = function(){
			// fails for lack of namespaced attribute selector support
			compareArrays($('list', 'p', 'link_1', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first,*[xml:lang="es-us"] , #troubleForm'));
			compareArrays($('list', 'p', 'link_1', 'item_1', 'item_3', 'troubleForm'), $$('#list, .first,', '*[xml:lang="es-us"] , #troubleForm'));
			compareArrays($('commaParent', 'commaChild'), $$('form[title*="commas,"], input[value="#commaOne,#commaTwo"]'));
			compareArrays($('commaParent', 'commaChild'), $$('form[title*="commas,"]', 'input[value="#commaOne,#commaTwo"]'));
		};

		it['should SelectorExtendsAllNodes'] = function(){
			var element = document.createElement('div');
			element.appendChild(document.createElement('div'));
			element.appendChild(document.createElement('div'));
			element.appendChild(document.createElement('div'));
			element.setAttribute('id','scratch_element');
			$$('body')[0].appendChild(element);
			var results = $$('#scratch_element div');
			value_of(typeof results[0].show == 'function');
			value_of(typeof results[1].show == 'function');
			value_of(typeof results[2].show == 'function');
		};

/*
		replace descendants functionality
		it['should CountedIsNotAnAttribute'] = function(){
			var el = $('list');
			Selector.handlers.mark([el]);
			value_of(!el.innerHTML.include("_counted"));
			Selector.handlers.unmark([el]);
			value_of(!el.innerHTML.include("_counted"));      
		};
*/

/*
		replace descendants functionality
		it['should CopiedNodesGetIncluded'] = function(){
			this.assertElementsMatch(
				context.MATCH($('counted_container').descendants(), 'div'),
				'div.is_counted'
			);
			$('counted_container').innerHTML += $('counted_container').innerHTML;
			this.assertElementsMatch(
				context.MATCH($('counted_container').descendants(), 'div'), 'div.is_counted', 
				'div.is_counted'
			);
		};
*/

		it['should SelectorNotInsertedNodes'] = function(){
			window.debug = true;
			var wrapper = context.document.createElement('div');
			wrapper.innerHTML = ("<table><tr><td id='myTD'></td></tr></table>");
			value_of(context.SELECT(wrapper, '[id=myTD]') [0]).should_not_be_undefined();
			value_of(context.SELECT(wrapper, '#myTD')     [0]).should_not_be_undefined();
			value_of(context.SELECT(wrapper, 'td')        [0]).should_not_be_undefined();
			value_of($$('#myTD').length == 0, 'should not turn up in document-rooted search');
			window.debug = false;
		};

/*
		Prototype-specific test
		it['should ElementDown'] = function(){
			var a = $('dupL4'); 
			var b = $('dupContainer').down('#dupL4');
			this.assertEqual(a, b);
		};
*/

/*
		Prototype-specific test
		it['should ElementDownWithDotAndColon'] = function(){
			var a = $('dupL4_dotcolon'); 
			var b = $('dupContainer.withdot:active').down('#dupL4_dotcolon');    
			var c = $('dupContainer.withdot:active').select('#dupL4_dotcolon');
			
			this.assertEqual(a, b);
			compareArrays([a], c);
		};
*/

		it['should DescendantSelectorBuggy'] = function(){
			var el = document.createElement('div');
			el.innerHTML = '<ul><li></li></ul><div><ul><li></li></ul></div>';
			document.body.appendChild(el);
			value_of( context.SELECT(el, 'ul li').length ).should_be( 2 );
			document.body.removeChild(el);
		};

	});
};
