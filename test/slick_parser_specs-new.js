var slick_parser_object_format = {}

slick_parser_object_format['should exist'] = function(){ value_of( Slick.parse ).should_not_be_undefined(); };
slick_parser_object_format['should always have an expressions array property'] = function(){};
slick_parser_object_format['should convert multiple comma-separated selector expressions into separate entries in the expressions array'] = function(){};

describe('Slick Parser Object Format', slick_parser_object_format);
