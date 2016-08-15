var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: '7f8fdd07f30d9d2fd5ebf11f12c339408abf8555'
});

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
    alchemy_language.emotion({text: text}, function (err, response) {
      if (err) {
        console.err(err);
      }
      else {
        console.log('the response in the sendToWatson func is', response.docEmotions);
        return response.docEmotions;
      }
    });
  } else {
    let results = [];
    text.forEach(chunk => {
      alchemy_language.emotion({text: chunk}, function (err, response) {
        if (err)
          console.log('error:', err);
        else
          results.push(response.docEmotions);
      });
    });
    return results;
  }
}

function analyzeEmotion(entry) {
  sendToWatson(entry)
  .then(response => {
    console.log('the response in analyzeEmotion', response);
    return response;
  })
}

module.exports = {
  analyzeEmotion: analyzeEmotion
};