var fs = require('fs');
var jsonFile = require('jsonfile');

var file = fs.readFileSync('words.txt', 'utf8', function(err, data){
  if (err) return console.error(err);
  return data;
});


var wordsByLine = file.split('\n');

var words = {};

wordsByLine.forEach(function(line){
  line = line.split('\t');
  if (line[2] === '1'){
    if (!words[line[0]]){
      words[line[0]] = {};
    }
    words[line[0]][line[1]] = 1;
  }
})

jsonFile.writeFile('emoWords.json', words, function(err){
  if (err) console.error(err);
})

console.log(Object.keys(words).length);
