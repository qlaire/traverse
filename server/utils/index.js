var watson = require('watson-developer-cloud');
var Q = require('q');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});

var emotionAnalysis = Q.denodeify(alchemy_language.emotion.bind(alchemy_language));
var keywordAnalysis = Q.denodeify(alchemy_language.keywords.bind(alchemy_language));
var myDiary = "I\'m depressed. I\'ve been depressed for the last decade of my life. It is really hard some mornings just waking up. It is hard getting out of bed. I just want to stay in bed and not do anything. I don\'t want to go out and be social. I just don\'t have the energy. I\'m tired of people bothering me about telling me to get out there. It isn\'t that simple. I\'m tired of working around people that seem to always be so simple minded. When an Ad for Depression comes on the TV I just want to scream at them when they all start talking about it being an excuse to be lazy and not wanting to do anything. I\'m sick of my job. I\'m sick of the emotional abuse I deal with in my family. I\'m sick of the abuse that I give myself. I\'ve been hearing negative things about my life for so long that I\'m starting to believe them. I\'m sick of people telling me what I should do to be happy. I\'ll never be happy. It will never go away. I either draw or I role play to escape from reality for a little while. But it always comes back after I\'m done. At least I can find some enjoyment out of those two things. I just don\'t know what to do with myself anymore. I keep pushing people away that want to help me. I keep pushing them away, because I don\'t know why. I\'m sorry for those that are here that I have done that too.";

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

// this function returns a promise.
// Resolves to results, which will be either a single object of emotion numbers or an array of three
// objects of emotion numbers
function analyzeEmotion(entry) {
  let processedEntry = processEntry(entry);
  return Q.all([sendToWatsonForEmotions(processedEntry),
  sendToWatsonForKeywords(processedEntry)]);
}

analyzeEmotion(myDiary);

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
