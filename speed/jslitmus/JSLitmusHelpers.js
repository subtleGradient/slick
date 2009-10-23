var describe = function(description, specs){
	for (var name in specs) {
		JSLitmus.test(description+': '+name, specs[name]);
	}
};

function runSpecs(){
	setTimeout(function(){
		JSLitmus.runAll();
	}, 1000);
};
