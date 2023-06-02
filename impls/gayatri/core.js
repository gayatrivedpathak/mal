const { MalList, MalNil, deepEqual } = require("./types");

const ns = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '=': (a, b) => deepEqual(a, b),
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,

  'count': (list) => list.value.length,
  'list?': (list) => list instanceof MalList,
  'list': (...elements) => new MalList(elements),
  'empty?': (seq) => seq.value.length === 0,
  'str': (value) => value.toString(),

  'not': (value) => !value,

  'prn': (value) => {
    console.log(value);
    return new MalNil().value;
  },

  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => Math.round(a / b)),
};

module.exports = { ns };