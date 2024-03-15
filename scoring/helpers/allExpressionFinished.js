const traverseAst = require("../utils/traverseAst");

/**
 * Vérifie si toutes les expressions sont correctement terminées par des points-virgules.
 * @param {Object} ast - L'AST du code source à analyser.
 * @return {number} Le score de conformité des terminaisons d'expressions, sur 1.
 */
function allExpressionFinished(ast) {
  let totalExpressions = 0;
  let finishedExpressions = 0;

  const checkForSemiColon = (node) => {
    if (node.type === "ExpressionStatement") {
      totalExpressions++;

      if (
        node.endToken &&
        // Vérifier si l'expression se termine par un point-virgule
        node.endToken.type === "Punctuator" &&
        node.endToken.value === ";"
      ) {
        finishedExpressions++;
      }
    }
  };

  traverseAst(ast, checkForSemiColon);

  return totalExpressions > 0 ? finishedExpressions / totalExpressions : 1;
}

module.exports = allExpressionFinished;
