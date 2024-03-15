const tokenizer = require("../tokenizer/tokenizer");
const parser = require("../parser/parser");
const allDeclaredIsUsed = require("./helpers/allDeclaredIsUsed");
const allUsedIsDeclared = require("./helpers/allUsedIsDeclared");
const allExpressionFinished = require("./helpers/allExpressionFinished");
const numberLine = require("./helpers/numberLine");
const indentation = require("./helpers/indentation");

exports.from = (code) => {
  console.log("--------", "Tokens", "--------");
  let tokens = tokenizer(code);
  console.log(tokens);

  try {
    console.log("--------", "AST", "--------");
    let ast = parser(tokens);
    console.log(ast);
    let result = {
      allDeclaredIsUsed: allDeclaredIsUsed(ast),
      allUsedIsDeclared: allUsedIsDeclared(ast),
      allExpressionFinished: allExpressionFinished(ast),
      numberLine: numberLine(ast, code, false),
      indentation: indentation(ast),
    };
    return {
      score:
        result.allDeclaredIsUsed +
        result.allUsedIsDeclared +
        result.allExpressionFinished +
        result.indentation +
        result.numberLine,
      details: result,
    };
  } catch (e) {
    throw e;
  }
};
