
var getEasinessFactor = function(iterations, grade, oldEasinessFactor) {
  console.log('sp iterations: ', iterations);
  console.log('sp grade: ', grade);

  var easinessFactor;

  if (iterations > 1) {
    easinessFactor = oldEasinessFactor + (0.1 - (5 - grade) * (0.08) + (5 - grade) * 0.02);
  } else {
    easinessFactor = 2.5;
  }

  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  console.log('easiness factor: ', easinessFactor);
  return easinessFactor;

}


exports.getNextRepetitionInterval = function(iterations, grade, lastRepetitionInterval, easinessFactor) {
  var nextRepetitionInterval;
  if (iterations === 1) {
    nextRepetitionInterval = 1;
  } else if (iterations === 2) {
    nextRepetitionInterval = 6;
  } else {
    nextRepetitionInterval = lastRepetitionInterval * getEasinessFactor(iterations, grade, easinessFactor);
  }
  return nextRepetitionInterval;
}

var makeCloze = exports.makeCloze = function(str, queryIndex, cb) {
  var originalString = str;
  var re = /\{\{([^{{}}]*)\}\}/,
    output = [],
    i, match, parts, last;

  while (match = re.exec(str)) {
      parts = match[0].split("\uFFFF");
      if (parts.length < 2) {
          last = output.push(match[0]) - 1;
      } else {
          output[last] = parts[0] + output[last] + parts[1];
      }
      str = str.replace(re, "\uFFFF");
  }
  var candidates = [];
  for (i=0; i < output.length; i++) {
    console.log('test');
    var val = output[i];
    var capture = val.match(/\{\{([^]*)\}\}/);
    resultObject = {text: capture[1]};
    if (i === queryIndex) {
      var newStr = originalString.replace(capture[0], '______');
      originalString = newStr;
      resultObject['result'] = true;
    } else {
      var newStr = originalString.replace(capture[0], capture[1]);
      originalString = newStr;
      resultObject['result'] = false;
    }
    candidates.push(resultObject);
  }
  return {
    question: originalString,
    candidates: candidates,
    answer: candidates[queryIndex]
  }
}

if (module === require.main) {
  var ret = makeCloze("abc {{d(e())f}} testing {{gh}} {{test}}", 0);
  console.log(ret);
}