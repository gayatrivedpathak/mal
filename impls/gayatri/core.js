const { read_str } = require("./reader");
const { MalList, MalNil, deepEqual, MalAtom, MalString, pr_str, MalVector } = require("./types");

const fs = require('fs');

const ns = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
  '=': (a, b) => deepEqual(a, b),
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,

  'count': (list) => list.value.length,
  'list?': (list) => list instanceof MalList,
  'list': (...elements) => new MalList(elements),
  'vec': (...elements) => new MalVector(...elements),

  'empty?': (seq) => seq.value.length === 0,
  'str': (...value) => {
    return new MalString(value.map(pr_str).join(""))
  },

  'prn': (value) => {
    console.log(value);
    return new MalNil().value;
  },

  '+': (...args) => args.reduce((a, b) => a + b),
  '-': (...args) => args.reduce((a, b) => a - b),
  '*': (...args) => args.reduce((a, b) => a * b),
  '/': (...args) => args.reduce((a, b) => Math.round(a / b)),

  'read-string': (str) => read_str(str),

  'slurp': (fileName) => new MalString(fs.readFileSync(fileName, 'utf-8')),

  'atom': (a) => new MalAtom(a),
  'atom?': (a) => a instanceof MalAtom,
  'deref': (a) => a.deref(),
  'reset!': (a, value) => a.reset(value),
  'swap!': (atom, fn, ...args) => atom.swap(fn, args),

  'cons': (value, list) => new MalList([value, ...list.value]),
  'concat': (...lists) => new MalList(lists.flatMap(x => x.value)),
};

module.exports = { ns };