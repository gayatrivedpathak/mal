const { MalSymbol, MalList, MalVector, MalNil, createString, MalString } = require("./types");

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = (str) => {
  const regex
    = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(regex)].map(x => x[1]).slice(0, -1);
};

const read_atom = reader => {
  const token = reader.next();

  if (token.match(/^-?[0-9]+$/))
    return parseInt(token);
  if (token.startsWith(':'))
    return token;
  if (token.startsWith("\"")) {
    const string = createString(token);
    return new MalString(string.slice(1, -1)).value;
  }
  if (token === 'true')
    return true;
  if (token === 'false')
    return false;
  if (token === 'nil')
    return new MalNil();

  return new MalSymbol(token);
};

const read_seq = (reader, closingSymbol) => {
  reader.next();
  const ast = [];

  while (reader.peek() !== closingSymbol) {
    if (reader.peek() === undefined)
      throw 'unbalanced';

    ast.push(read_form(reader));
  }

  reader.next();
  return ast;
}

const read_list = reader => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = reader => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};

const read_hashmap = reader => {
  const ast = read_hashmap(reader, '}');
  return new MalHashmap(ast)
}

const prependSymbol = (reader, symbol) => {
  reader.next();
  const malSymbol = new MalSymbol(symbol);
  const ast = read_form(reader);
  return new MalList([malSymbol, ast]);
};

const read_form = reader => {
  const token = reader.peek();

  switch (token[0]) {
    case '(':
      return read_list(reader);

    case '[':
      return read_vector(reader);

    case '{':
      return read_hashmap(reader);

    case ';':
      reader.next();
      return new MalNil();

    case '@':
      return prependSymbol(reader, 'deref');
    
    case "'":
      return prependSymbol(reader, 'quote');

    default:
      return read_atom(reader);
  }
};

const read_str = str => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };