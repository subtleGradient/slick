var describe = function(description, specs){
	var test;
	for (var name in specs) {
		test = JSLitmus.test(description+': '+name, specs[name]);
		// JSLitmus._queueTest(test);
	}
};

function runSpecs(){
  // setTimeout(function(){
  //  JSLitmus.runAll();
  // }, 1000);
};
