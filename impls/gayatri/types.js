const deepEqual = (element1, element2) => {
  if (element1 === element2) {
    return true;
  }

  if (element1 instanceof MalValue && element2 instanceof MalValue) {
    return element1.equals(element2);
  }

  return false;
};

const createString = (string) => {
  return string.replace(/\\(.)/g, (_, captured) => {
    return captured === "n" ? "\n" : captured;
  });
};

const pr_str = (malValue, readable = false) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str(readable);
  }

  // console.log(malValue);

  return malValue.toString();
};

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str(readable = false) {
    return this.value.toString(readable);
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "(" + this.value.map(pr_str).join(' ') + ")";
  }

  isEmpty() {
    return this.value.length === 0;
  }

  equals(otherList) {
    return this.value.every((element, index) => {
      const otherElement = otherList.value[index];
      return deepEqual(element, otherElement);
    });
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '"' +
      this.value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n") +
      '"'
  }
};

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "[" + this.value.map(x => pr_str(x)).join(' ') + "]";
  }

  equals(otherList) {
    return this.value.every((element, index) => {
      const otherElement = otherList.value[index];
      return deepEqual(element, otherElement);
    });
  }
}

class MalNil extends MalValue {
  constructor(value) {
    super(null);
  }

  pr_str() {
    return 'nil';
  }

  equals(other) {
    return other instanceof MalNil;
  }
}

class MalHashmap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "{" + this.value.map(x => x.pr_str).join(' ') + "}";
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env, fn) {
    super(ast);
    this.binds = binds;
    this.env = env;
    this.fn = fn;
  }

  pr_str() {
    return '#<Function>';
  }

  apply(args) {
    return this.fn.apply(null, args);
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '(atom ' + pr_str(this.value) + ')';
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return this.value;
  }

  swap(fn, args) {
    if (fn instanceof MalFunction) {
      this.value = fn.apply(null, [this.value, ...args]);
    }
    return this.value;
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalHashmap,
  pr_str,
  deepEqual,
  createString,
  MalFunction,
  MalAtom,
  MalString
};