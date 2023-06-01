const { pr_str } = require("./printer");
const { MalList, MalNil } = require("./types");

const ns = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '=': (a, b) => a === b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,

  'count': (list) => list.value.length,
  'list?': (list) => list instanceof MalList,
  'list': (...list) => new MalList(list),
  'empty?': (list) => list.value.length !== 0,
  'str': (value) => value.toString(),


  'not': (value) => !value,

  'prn': (value) => {
    console.log(value);
    return new MalNil();
  },

  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => Math.round(a / b)),
}

module.exports = { ns };