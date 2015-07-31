var word = /\w|-/

function getWordUnderCursor(cursor) {
  var line = cursor.getCurrentBufferLine()
  var pos = cursor.getBufferPosition()
  var start = pos.column
  var end = pos.column
  if (!word.test(line[start])) {
    if (!word.test(line[start-1])) return
    start = end = start - 1
  }
  var l = line.length
  while (start > 0 && word.test(line[start-1])) start--
  while (end < l && word.test(line[end+1])) end++
  while (line[end] == '-') end--
  if (start > end) return // all dots
  return {
    text: line.slice(start, end + 1),
    start: start,
    end: end + 1,
    column: pos.column,
    row: pos.row
  }
}

function isUpperCase(word) {
  for (var i = 0; i < word.length; i++) {
    if (word[i].toUpperCase() != word[i]) return false
  }
  return true
}

function inc(editor, increment) {
  editor.getCursors().forEach(function(cursor) {
    var match = getWordUnderCursor(cursor)
    if (!match) return
    var number = Number(match.text)
    if (isNaN(number)) {
      if (match.text == 'true') var word = 'false'
      else if (match.text == 'false') var word = 'true'
      else if (isUpperCase(match.text)) {
        var word = increment > 0
          ? match.text // already upper case
          : match.text[0] + match.text.slice(1).toLowerCase()
      } else if (isUpperCase(match.text[0])) {
        var word = increment > 0
          ? match.text.toUpperCase()
          : match.text[0].toLowerCase() + match.text.slice(1)
      } else {
        var word = increment > 0
          ? match.text[0].toUpperCase() + match.text.slice(1)
          : match.text.toLowerCase()
      }
    } else {
      var word = (number + increment).toString(10)
    }

    // change text
    word == match.text || editor.setTextInBufferRange([
      [match.row, match.start], // start position
      [match.row, match.end]    // end position
    ], word)
  })
}

var plugin = {
  activate: function(){
    atom.commands.add('atom-text-editor', {
      'inc:inc': function(){
        return inc(atom.workspace.getActiveTextEditor(), 1)
      },
      'inc:dec': function(){
        return inc(atom.workspace.getActiveTextEditor(), -1)
      }
    })
  }
}

module.exports = plugin
