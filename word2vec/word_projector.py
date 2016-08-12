from gensim.models import word2vec
import numpy

model = word2vec.Word2Vec.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)

happy = model['happy']
sad = model['sad']
angry = model['angry']

# x_axis = sad - happy
# y_axis = angry - happy

# def project(y):
#   v = y - happy
#   s = x_axis
#   return numpy.dot(v, s) / numpy.dot(s, s)

# for word in ['cat', 'happy', 'sad', 'better', 'worse', 'okay', 'loving', 'honest', 'depressed']:
#   print(word)
#   print(project(model[word]))

def filter_words(words):
    if words is None:
        return
    return [word for word in words if word in model.vocab]

def project(words):
  line = happy - sad
  s_dot_s = numpy.dot(line, line)
  projections = []
  for word in filter_words(words):
      projections.append(scalar(dot(model[word] - sad, line) / s_dot_s))
  return projections

diary = "I hate feeling like I should want a baby just because society demands it. I dont dislike kids. I love other peoples kids. I just don't see myself as the mother type. Not just that be the thought of being pregnant and giving birth grosses me out so much that it makes me nauseous. I never think of it like a baby growing inside of a woman. I think of it more like an alien or a parasite. Babies are great and all. I just don't want one of my own. I wish society would stop shoving the norm of having children in my face.".split()

print project(diary)
