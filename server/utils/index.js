var watson = require('watson-developer-cloud');
var Q = require('q');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});

var emotionAnalysis = Q.denodeify(alchemy_language.emotion.bind(alchemy_language));

function processEntry(entry) {
  let endOfSen = /\.\s|\!\s|\?\s/;
  let entrySentences = entry.split(endOfSen);
  let senPerChunk = Math.floor(entrySentences.length / 3);
  if (entrySentences.length < 3) {
    return entry;
  } else {
    // split the entry into three parts
    let results = [];
    results.push(entrySentences.slice(0, senPerChunk).join('. '), 
    entrySentences.slice(senPerChunk, senPerChunk * 2).join('. '),
    entrySentences.slice(senPerChunk * 2).join('. '));
    return results;
  }
}

function sendToWatson(text) {
  if (!Array.isArray(text)) {
    return emotionAnalysis({text: text})
    .then(response => response.docEmotions);
  } else {
    let promiseArr = text.map(chunk => {
      return emotionAnalysis({text: chunk});
    });
    return Q.all(promiseArr)
    .then(results => {
      results = results.map(result => result.docEmotions);
      return results;
    });
  }
}

// this function returns a promise.
// Resolves to results, which will be either a single object of emotion numbers or an array of three
// objects of emotion numbers
function analyzeEmotion(entry) {
  return sendToWatson(processEntry(entry));
}

function convertWatsonDataToArr(results) {
  let resultArr = [[], [], []];
  if (!Array.isArray(results)) {
    results = [results];
  }
  results.forEach(result => {
    resultArr[0].push(Number(result.anger).toFixed(1));
    resultArr[1].push(Number(result.fear).toFixed(1));
    resultArr[2].push(Number(result.joy).toFixed(1));
  })
  return resultArr;
}
// analyzeEmotion(myDiary)
// .then(results => {
//   console.log(convertToArr(results));
//   return convertToArr(results);
// })
// .catch(err => console.log(err));

module.exports = {
  analyzeEmotion: analyzeEmotion,
  convertWatsonDataToArr: convertWatsonDataToArr
};