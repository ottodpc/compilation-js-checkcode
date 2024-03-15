/**
 * Fonction récursive pour parcourir l'AST.
 * @param {Object} node - Le nœud courant de l'AST.
 * @param {Function} callback - La fonction à exécuter pour chaque nœud.
 */
module.exports = function traverseAst(node, callback) {
  callback(node);

  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) {
          child.forEach((subNode) => traverseAst(subNode, callback));
        } else {
          traverseAst(child, callback);
        }
      }
    }
  }
};
