MODULES = 'Source/Slick.Parser.js' \
	'Source/Slick.Finder.js'

FILE = 'slick.js'

build:
	@cat ${MODULES} > ${FILE}

