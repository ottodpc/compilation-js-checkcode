const traverseAst = require("../utils/traverseAst");

/**
 * Vérifie si toutes les fonctions et méthodes déclarées sont utilisées.
 * @param {Object} ast - L'AST du fichier JavaScript analysé.
 * @returns {boolean} - Retourne vrai si toutes les fonctions/méthodes sont utilisées, faux sinon.
 */
function allFunctionsAndMethodsUsed(ast) {
  // Un objet pour suivre les fonctions/méthodes et leur utilisation
  const declarations = {};

  // Parcourir l'AST pour collecter les déclarations de fonctions et de méthodes
  traverseAst(ast, (node) => {
    // Vérifier les déclarations de fonctions (y compris les expressions de fonction)
    if (
      node.type === "FunctionDeclaration" ||
      (node.type === "VariableDeclarator" &&
        node.init &&
        node.init.type === "FunctionExpression")
    ) {
      const functionName = node.id.name;
      declarations[functionName] = false;
    }
    // Vérifier les méthodes de classe
    if (node.type === "MethodDefinition") {
      const methodName = node.key.name;
      declarations[methodName] = false;
    }
  });

  // Parcourir à nouveau l'AST pour vérifier l'utilisation des fonctions/méthodes
  traverseAst(ast, (node) => {
    // Vérifier les appels de fonctions
    if (node.type === "CallExpression" && node.callee.type === "Identifier") {
      const calleeName = node.callee.name;
      if (declarations.hasOwnProperty(calleeName)) {
        declarations[calleeName] = true; // Marquer comme utilisé
      }
    }
  });

  // Vérifier si toutes les fonctions/méthodes ont été utilisées
  return Object.values(declarations).every((isUsed) => isUsed);
}

/**
 * Vérifie si tous les imports déclarés sont utilisés dans le code.
 * @param {Object} ast - L'AST du fichier JavaScript analysé.
 * @returns {boolean} - Retourne vrai si tous les imports sont utilisés, faux sinon.
 */
function allDeclaredImportsIsUsed(ast) {
  // Un objet pour suivre les imports et leur utilisation
  const imports = {};

  // Parcourir l'AST pour collecter les déclarations d'import
  traverseAst(ast, (node) => {
    if (node.type === "ImportDeclaration") {
      // Pour chaque spécificateur d'importation, enregistrer l'import comme non utilisé
      node.specifiers.forEach((specifier) => {
        const importName = specifier.local.name;
        imports[importName] = false;
      });
    }
  });

  // Parcourir à nouveau l'AST pour vérifier l'utilisation des imports
  traverseAst(ast, (node) => {
    // Vérifier différents types de nœuds où un import pourrait être utilisé
    if (node.type === "Identifier" && imports.hasOwnProperty(node.name)) {
      imports[node.name] = true; // Marquer l'import comme utilisé
    }
  });

  // Vérifier si tous les imports ont été utilisés
  return Object.values(imports).every((isUsed) => isUsed);
}

/**
 * Vérifie si toutes les variables déclarées sont utilisées dans le code.
 * @param {Object} ast - L'AST du fichier JavaScript analysé.
 * @returns {boolean} - Retourne vrai si toutes les variables sont utilisées, faux sinon.
 */
function allDeclaredVarsIsUsed(ast) {
  // Un objet pour suivre les déclarations de variables et leur utilisation
  const variables = {};

  // Parcourir l'AST pour collecter les déclarations de variables
  traverseAst(ast, (node) => {
    if (node.type === "VariableDeclarator") {
      const varName = node.id.name;
      variables[varName] = false; // Marquer la variable comme non utilisée initialement
    }
  });

  // Parcourir à nouveau l'AST pour vérifier l'utilisation des variables
  traverseAst(ast, (node) => {
    // Identifier les nœuds qui peuvent référencer une variable
    if (node.type === "Identifier" && variables.hasOwnProperty(node.name)) {
      variables[node.name] = true; // Marquer la variable comme utilisée
    }
  });

  // Vérifier si toutes les variables ont été utilisées
  return Object.values(variables).every((isUsed) => isUsed);
}

// NOTE: FUNCTIONS EXPORTED

/**
 * Vérifie si tous les declarations sont utilisés dans l'AST.
 * @param {Object} ast - L'arbre de syntaxe abstraite du programme.
 * @return {number} - Retourne un score
 */
const allDeclaredIsUsed = (ast) => {
  const importsUsed = allDeclaredImportsIsUsed(ast) ? 0.33 : 0; // NOTE: 0.5 point pour les imports et 0.5 point pour les variables
  const varsUsed = allDeclaredVarsIsUsed(ast) ? 0.33 : 0; // NOTE: 0.5 point pour les imports et 0.5 point pour les variables
  const functionsUsed = allFunctionsAndMethodsUsed(ast) ? 0.34 : 0; // NOTE: 0.5 point pour les fonctions et méthodes

  return importsUsed + varsUsed + functionsUsed;
};

module.exports = allDeclaredIsUsed;
