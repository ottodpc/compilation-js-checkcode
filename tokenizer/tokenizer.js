
const helper = require("./helper");
const constTokens= require("./constants");

module.exports = function(code) {
    code= helper.replaceSpecialsChars(code);
    var _tokens = code.split(/[\t\f\v ]+/);
    var tokens = []
    for (var i = 0; i < _tokens.length; i++) {
      var t = _tokens[i]
      //si le token n'est pas un nombre
      if(t.length <= 0 || isNaN(t)) {
        //on check si c'est un caractère spéciale
        let typeChars= helper.checkChars(t);
        if (typeChars){
            tokens.push({type: typeChars})
        //sinon c'est un mot
        }else{
            tokens.push({type: constTokens.typeWord, value: t})
        }
      //sinon c'est un nombre
      } else {
        tokens.push({type: constTokens.typeNumber, value: t})
      }
    }
    if (tokens.length < 1) {
        throw constTokens.errorNoTokenFound;
    }
    return tokens
}