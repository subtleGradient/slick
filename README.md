MooTools Slick Selector Engine
==============================
A new standalone selector engine that is totally slick!
-------------------------------------------------------

### Create your own custom pseudo-classes!
Ever want to make your own `:my-widget(rocks)` pseudoclass? Now you can!

### Use your own custom getAttribute code!
EG: Use MooTool's Element.get method or jQuery's $.attr

### Use your own parser!
Want to support XPATH selectors? JSONPath selectors? Pre-cached JS Object selctors? Just swap out the default parser and make your own.

### Use the parser by itself!
Want to integrate a CSS3 Selector parser into your own app somehow? Use the slick selector CSS3 parser by itself and get a JS Object representation of your selector.



MooTools Slick CSS Selector Parser
==================================
Parse a CSS selector string into a JavaScript object
----------------------------------------------------

Object format

	{
		Slick: true,
		reverse: function(){},
		simple: false,
		length: 1,
		raw: "tag#id.class[attrib][attrib=attribvalue]:pseudo:pseudo(pseudovalue):not(pseudovalue)",
		expressions: [
			[
				{
					parts: [
						{ type: "class",                    value: "class", regexp: /regexp/ },
						{ type: "attribute", key: "attrib",                                      test: function(){} },
						{ type: "attribute", key: "attrib", value: "attribvalue", operator: "=", test: function(){} },
						{ type: "pseudo",    key: "pseudo" },
						{ type: "pseudo",    key: "pseudo", value: "pseudovalue" },
						{ type: "pseudo",    key: "not"   , value: "pseudovalue" }
					],
					tag: "tag",
					id: "id",
					classes: [
						"class"
					],
					attributes: [
						{ type: "attribute", key: "attrib", value: "",                           test: function(){} },
						{ type: "attribute", key: "attrib", value: "attribvalue", operator: "=", test: function(){} }
					],
					pseudos: [
						{ type: "pseudo", key: "pseudo" },
						{ type: "pseudo", key: "pseudo", value: "pseudovalue" },
						{ type: "pseudo", key: "not",    value: "pseudovalue" }
					],
					combinator: " "
				}
			]
		]
	}

