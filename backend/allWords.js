var fs = require("fs");
var text = fs.readFileSync("./word_lists/new_words_9.txt", "utf-8");
var wordList = text.split("\n")
var letterDistribution = {} // just for fun
var allConstonants = []
var allVowels = []
const VOWELS = "aeiou"

for (let i = 0; i < wordList.length; i++) {
  let word = wordList[i]
  for (let j = 0; j < word.length; j++) {
    let letter = word[j]
    if (VOWELS.indexOf(letter) > -1){
      allVowels.push(letter)
    }
    else {
      allConstonants.push(letter)
    }
    if (word[j] in letterDistribution) {
      letterDistribution[word[j]]++
    }
    else {
      letterDistribution[word[j]] = 0
    }
  }
}

function isInWordList(word) {
  return wordList.includes(word.toLowerCase())
}

console.log(letterDistribution)

module.exports = {
  "isInWordList" : isInWordList,
  "allConstonants": allConstonants,
  "allVowels": allVowels
}