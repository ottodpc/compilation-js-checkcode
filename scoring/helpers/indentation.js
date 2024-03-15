const traverseAst = require("../utils/traverseAst");

/**
 * Calcule l'indentation d'une ligne spécifique dans le code source.
 * @param {number} lineNumber - Le numéro de la ligne pour laquelle calculer l'indentation.
 * @param {string} sourceCode - Le code source complet.
 * @return {number} - Le nombre de caractères d'indentation pour la ligne donnée.
 */
function getIndentationForLine(lineNumber, sourceCode) {
  const lines = sourceCode.split("\n");
  const line = lines[lineNumber - 1]; // Les numéros de ligne dans l'AST sont basés sur 1.
  const indentationMatch = line.match(/^\s*/);
  return indentationMatch ? indentationMatch[0].length : 0;
}

/**
 * Vérifie si le nœud est correctement indenté par rapport à son parent dans l'AST.
 * @param {Object} node - Le nœud à vérifier.
 * @param {Object} parentNode - Le nœud parent du nœud actuel.
 * @param {string} sourceCode - Le code source complet.
 * @return {boolean} - Vrai si l'indentation est correcte, faux sinon.
 */
function isCorrectlyIndented(node, parentNode, sourceCode) {
  if (!node.loc || !parentNode.loc) {
    // Si les informations de localisation ne sont pas disponibles, on ne peut pas vérifier.
    return true;
  }

  const nodeLineStart = node.loc.start.line;
  const parentLineStart = parentNode.loc.start.line;

  // l'indentation du nœud et du parent en comptant les espaces/tabulations en début de ligne.
  const nodeIndentation = getIndentationForLine(nodeLineStart, sourceCode);
  const parentIndentation = getIndentationForLine(parentLineStart, sourceCode);

  // un nœud doit être indenté de 4 espaces de plus que son parent.
  const expectedIndentation = parentIndentation + 4;

  return nodeIndentation === expectedIndentation;
}

/**
 * Vérifie si les nœuds de l'AST sont bien indentés.
 * @param {Object} ast - L'AST du code source JavaScript.
 * @return {number} Le score d'indentation sur 1.
 */
function indentation(ast) {
  const nodeIndentationErrors = {};
  let totalNodeTypes = 0;

  traverseAst(ast, (node) => {
    if (node.type) {
      console.log("nodeIndentationErrors :>> ", nodeIndentationErrors);
      // Initialisez ou mettez à jour les données pour ce type de nœud
      if (!nodeIndentationErrors.hasOwnProperty(node.type)) {
        nodeIndentationErrors[node.type] = { errors: 0, occurrences: 0 };
        totalNodeTypes++;
      }
      const nodeData = nodeIndentationErrors[node.type];

      if (!isCorrectlyIndented(node)) {
        nodeData.errors++;
      }
      nodeData.occurrences++;
    }
  });

  // Calcul du score basé sur les types de nœuds correctement indentés
  let correctlyIndentedTypes = 0;
  for (const type in nodeIndentationErrors) {
    if (nodeIndentationErrors[type].errors === 0) {
      correctlyIndentedTypes++;
    }
  }

  return correctlyIndentedTypes / totalNodeTypes;
}

module.exports = indentation;
