function isUpperCase(word) {
  for (var i = 0; i < word.length; i++) {
    if (word[i].toUpperCase() != word[i]) return false
  }
  return true
}

function inc(editor, increment) {
  editor.getCursors().forEach(function(cursor) {
    var range = cursor.getCurrentWordBufferRange({
      wordRegex: /-?\d+|\w+/i
    })
    if (!range) return
    var oldword = editor.getTextInBufferRange(range)
    var number = Number(oldword)
    if (isNaN(number)) {
      if (oldword == 'true') var word = 'false'
      else if (oldword == 'false') var word = 'true'
      else if (isUpperCase(oldword)) {
        var word = increment > 0
          ? oldword // already upper case
          : oldword[0] + oldword.slice(1).toLowerCase()
      } else if (isUpperCase(oldword[0])) {
        var word = increment > 0
          ? oldword.toUpperCase()
          : oldword[0].toLowerCase() + oldword.slice(1)
      } else {
        var word = increment > 0
          ? oldword[0].toUpperCase() + oldword.slice(1)
          : oldword.toLowerCase()
      }
    } else {
      var word = (number + increment).toString(10)
    }

    // change oldword
    word == oldword || editor.setTextInBufferRange(range, word)
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
