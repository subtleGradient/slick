(function(context){

var Configuration = context.Configuration = {};

Configuration.name = 'MooTools Slick';

Configuration.presets = {
	'slick-1.0': {
		sets: ['1.0'],
		source: ['helpers', '1.0']
	}
};

Configuration.defaultPresets = {
	browser: 'slick-1.0',
	jstd: 'slick-1.0'
};

Configuration.sets = {

	'1.0': {
		path: 'specs/',
		files: [
			'syntax', 'api', 'engine_bugs', 'html', 'html5', 
			'select_nth-child', 'select_exhaustive', 'mock_template', 
			'isxml', 'xml',
			'match', 'parser',
			'google_closure', 'prototype', 'jquery', 'dojo', 'yui'
		]
	}
	
};

Configuration.source = {
	
	'helpers': {
		path: '',
		files: [
			'assets/simple_request',
			'assets/JSSpecHelpers',
			'assets/setup',
			'bootstrap/slick.slickspec'
		]
	},

	'1.0': {
		path: '../Source/',
		files: [
			'Slick.Finder',
			'Slick.Parser'
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
