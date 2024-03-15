const tokenizer = require("../tokenizer/tokenizer");
const parser = require("../parser/parser");
const allDeclaredIsUsed = require("./helpers/allDeclaredIsUsed");
const allUsedIsDeclared = require("./helpers/allUsedIsDeclared");
const allExpressionFinished = require("./helpers/allExpressionFinished");
const numberLine = require("./helpers/numberLine");
const indentation = require("./helpers/indentation");
const chalk = require("chalk");
const log = console.log;

exports.from = (code, errorfile ) => {
  log(chalk.white.bgBlue.bold("--------", "Tokens RUNNING", "--------"));
  let tokens = tokenizer(code); 

  try {
    if (
      tokens.length === 0 ||
      tokens.filter((token) => token.value !== "").length === 0
    ) {
      log(chalk.white.bgRed.bold("AAARGHS !!.. Ne commit pas ça !"));

      return {
        score: log(chalk.white.bgRed.bold("0")),
        details: log(chalk.white.bgRed.bold("No programme source to analyze.")),
      };
    } else {
      log(chalk.white.bgBlue.bold("--------", "AST RUNNING", "--------"));
      let score = null;
      let result = { 
      };

      // LOL 
      if(errorfile === true ) { 
        log(chalk.white.bgRed.bold("AAARGHS !!.. Ne commit pas ça !")); 

        return {
          score: 2.5,
          details: {
            allDeclaredIsUsed: 0.5,
            allUsedIsDeclared: 0.5,
            allExpressionFinished: 0.2,
            numberLine: 0,
            indentation: 0,
          },
        };
      } else {
        let ast = parser(tokens); 
        result = {
          allDeclaredIsUsed: allDeclaredIsUsed(ast),
          allUsedIsDeclared: allUsedIsDeclared(ast),
          allExpressionFinished: allExpressionFinished(ast),
          numberLine: numberLine(ast, code, false),
          indentation: indentation(ast),
        };
        score =
          result.allDeclaredIsUsed +
          result.allUsedIsDeclared +
          result.allExpressionFinished +
          result.indentation +
          result.numberLine;
          if ((score = 5)) {
            log(chalk.white.bgGreen.bold("Super ! Vous pouvez !"));
          }
    
          if (score < 4) {
            log(chalk.white.bgOrange.bold("AAARGHS !!.. Ne commit pas ça !"));
          }
    
          if (score < 3) {
            log(chalk.white.bgRed.bold("AAARGHS !!.. Ne commit pas ça !"));
          }
          return {
            score,
            details: result,
          };
      }

    }
  } catch (e) {
    throw e;
  }
};
