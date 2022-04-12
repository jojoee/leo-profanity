const filter = require('leo-profanity')

// in this state,
// the "filter" only have add "english" dictionary by default
console.log(filter.list().length)

// remove all bad words from the filter
// now the filter can't filter anything cause there are no bad words
filter.clearList()
console.log(filter.list().length)

// adding word (from builtin dictionary) into the filter
filter.add(filter.getDictionary('en'))
filter.add(filter.getDictionary('fr'))
filter.add(filter.getDictionary('ru'))

// now in this state
// the filter includes all bad words (3 languages)
console.log(filter.list().length)
