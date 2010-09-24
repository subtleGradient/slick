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
			'syntax', 'specs_slick_docs', 'slick_xml_specs', 'specs-engine_bugs',
			'specs-select_nth-child', 'specs-select_exhaustive', 'specs-mock_template',
			'slick.api.specs', 'isxml.specs', 'slick_match_specs', 'slick_parser_specs',
			'specsGoogleClosure',
			'specsPrototype',
			'specsJQuery',
			'specsDojo',
			'specsYUI'
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
