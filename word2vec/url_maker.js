function urlMaker(diary, words){
  var url = 'localhost:5000/word2vec/project?w1=' + words[0] + '&w2=' + words[1] + '&ws=' + diary.split('&ws=')

  return url;
}

module.exports = {
  urlMaker: urlMaker
}
