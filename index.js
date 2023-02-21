const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
})
const { sanitize } = require("./app/sanitize")
const fs = require("fs")
const path = require("node:path")

console.log(
  "You got some wacky schema that need sanitizin? Give me the file name! \n"
)

readline.setPrompt("Sorry, can't find that file, please try again. \n")
readline.on("line", async (fileName) => {
  if (!fs.existsSync(fileName)) {
    readline.prompt()
  } else {
    await sanitize(fileName)
    console.log(`There you go! Got you a clean_application.json :)`)
    readline.close()
  }
})
