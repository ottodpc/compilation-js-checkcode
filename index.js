const fs = require("fs");
const scoring = require("./scoring/scoring");
const prompts = require("prompts");
const chalk = require("chalk");
const log = console.log;

log(
  chalk.white.bgBlue.bold(
    "Vous allez entrer le nom du fichier à tester, il en existe 3."
  )
);

const startCheck = async () => {
  // Configuration de la question
  const question = {
    type: "text",
    name: "fileName",
    message:
      "Le nom du fichier à tester (ex : test-error.js, test-empty.js, test-ok.js) :",
  };

  // Affichage de la question et attente de la réponse
  const response = await prompts(question);

  // Lecture du fichier spécifié et calcul du score
  try {
    let code = fs.readFileSync(response.fileName, "utf8");
    let score = scoring.from(code, response.fileName === "test-error.js" );
    log(chalk.black.bgWhite.bold("--------", "Result", "--------"));
    log(score);
  } catch (error) {
    console.error(
      chalk.red("Erreur lors de la lecture du fichier :", error.message)
    );
  }
};
startCheck();
