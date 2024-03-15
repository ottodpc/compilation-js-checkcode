function numberLine(ast, code, useAst = false) {
  if (useAst) {
    // TODO: check if ast.lines
    return ast.lines <= 200 ? 1 : 0; //! ERROR : ast.lines is undefined
  } else return code.split("\n").length <= 200 ? 1 : 0;
}

module.exports = numberLine;
