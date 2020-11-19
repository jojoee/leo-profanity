import * as filter from 'leo-profanity'

const str = 'I have boob'
const filteredStr = filter.clean(str, '+', 2)
console.log(str, filteredStr)
