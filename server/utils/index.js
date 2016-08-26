var watson = require('watson-developer-cloud');
var Q = require('q');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});

var emotionAnalysis = Q.denodeify(alchemy_language.emotion.bind(alchemy_language));
var keywordAnalysis = Q.denodeify(alchemy_language.keywords.bind(alchemy_language));

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

function sendToWatsonForEmotions(text) {
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

function sendToWatsonForKeywords(text) {
  if (!Array.isArray(text)) {
    return keywordAnalysis({text: text, maxRetrieve: 10})
    .then(response => {
      let resultObj = {};
      response.keywords.forEach(keywordObj => {
        resultObj[keywordObj.text] = Number(keywordObj.relevance).toFixed(1);
      });
      return resultObj;
    });
  } else {
    let promiseArr = text.map(chunk => {
      return keywordAnalysis({text: chunk, maxRetrieve: 10});
    });
    return Q.all(promiseArr)
    .then(results => {
      let resultArr = [];
      results.forEach(response => {
        let resultObj = {};
        response.keywords.forEach(keywordObj => {
          resultObj[keywordObj.text] = Number(keywordObj.relevance).toFixed(1);
        });
        resultArr.push(resultObj);
      });
      return resultArr;
    });
  }
}

function analyzeEmotion(entry) {
  let processedEntry = processEntry(entry);
  return Q.all([sendToWatsonForEmotions(processedEntry),
  sendToWatsonForKeywords(processedEntry)]);
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

module.exports = {
  analyzeEmotion: analyzeEmotion,
  convertWatsonDataToArr: convertWatsonDataToArr
};
