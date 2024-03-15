const traverseAst = require("../utils/traverseAst");

/**
 * Vérifie si tous les identifiants utilisés sont déclarés dans l'AST.
 * @param {Object} ast - L'arbre de syntaxe abstraite du programme.
 * @return {number} - Retourne un score
 */
function allUsedIsDeclared(ast) {
  const stockedDeclaredIdentifiers = new Set();
  const stockedUsedIdentifiers = new Set();

  // On collecte les identifiants déclarés et utilisés
  function collectIdentifiers(node) {
    // Identifier les déclarations de variables
    if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
      stockedDeclaredIdentifiers.add(node.id.name);
    }

    // Identifier les déclarations de fonction
    if (node.type === "FunctionDeclaration" && node.id.type === "Identifier") {
      stockedDeclaredIdentifiers.add(node.id.name);
    }

    // Identifier les expressions de fonction (y compris les fonctions fléchées)
    if (
      (node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression") &&
      node.id &&
      node.id.type === "Identifier"
    ) {
      stockedDeclaredIdentifiers.add(node.id.name);
    }

    // Identifier les utilisations d'identifiants
    if (node.type === "Identifier" && node.name) {
      stockedUsedIdentifiers.add(node.name);
    }
  }

  // Parcourir l'AST pour collecter les identifiants
  traverseAst(ast, collectIdentifiers);

  let score = 0;

  for (const id of stockedUsedIdentifiers) {
    if (stockedDeclaredIdentifiers.has(id)) {
      score += 1;
    }
  }

  // NOTE : avec attention si stockedUsedIdentifiers est non vide et final comme une fraction du total d'identifiants utilisés
  return stockedUsedIdentifiers.size > 0
    ? score / stockedUsedIdentifiers.size
    : 1;
}

module.exports = allUsedIsDeclared;
