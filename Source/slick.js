module.exports = { Slick: (function () {
    var Parser = require("slick/Slick.Parser").Slick,
      Finder = require("slick/Slick.Finder").Slick;
    
    Object.keys(Parser).forEach(function (key) {
      Finder[key] = Parser[key];
    });
    return Finder;
  }())
};
