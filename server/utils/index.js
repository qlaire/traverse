var watson = require('watson-developer-cloud');
var Q = require('q');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});

var emotionAnalysis = Q.denodeify(alchemy_language.emotion.bind(alchemy_language));

var myDiary = "We started to talk and I realized that we really had a lot in common and had really good chemistry. Now during this whole thing she had a boyfriend. I had no problem being her friend despite liking her but it was painfully obvious that she wasn't happy with this guy. Eventually she broke up with him and then not too long after that she told me that much like myself she started having feelings for me pretty much the first day we met.";

function processEntry(entry) {
  let endOfSen = /\.\s|\!\s|\?\s/;
  let entrySentences = entry.split(endOfSen);
  let senPerChunk = Math.floor(entrySentences.length / 3);
  if (entrySentences.length < 3) {
    console.log('the entry to return', entry);
    return entry;
  } else {
    // split the entry into three parts
    let results = [];
    results.push(entrySentences.slice(0, senPerChunk).join('. '), 
    entrySentences.slice(senPerChunk, senPerChunk * 2).join('. '),
    entrySentences.slice(senPerChunk * 2).join('. '));
    console.log('the results of processing the entry', results);
    return results;
  }
}

function sendToWatson(text) {
  console.log('the text in the sendtowatson func', text);
  if (!Array.isArray(text)) {
    return emotionAnalysis({text: text})
    .then(response => response.docEmotions);
  } else {
    let promiseArr = text.map(chunk => {
      return emotionAnalysis({text: chunk});
    });
    return Q.all(promiseArr)
    .then(results => {
      console.log('the results from watson', results);
      results = results.map(result => result.docEmotions);
      console.log('the results after processing', results);
      return results;
    });
  }
}

function analyzeEmotion(entry) {
  return sendToWatson(processEntry(entry));
}

function convertToArr(results) {
  let resultArr = [[], [], []];
  results.forEach(result => {
    resultArr[0].push(Number(result.anger).toFixed(1));
    resultArr[1].push(Number(result.fear).toFixed(1));
    resultArr[2].push(Number(result.joy).toFixed(1));
  })
  return resultArr;
}

analyzeEmotion(myDiary)
.then(results => {
  console.log(convertToArr(results));
  return convertToArr(results);
})
.catch(err => console.log(err));



module.exports = {
  analyzeEmotion: analyzeEmotion
};