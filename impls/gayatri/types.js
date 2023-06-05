const deepEqual = (element1, element2) => {
  if (element1 === element2) {
    return true;
  }

  if (element1 instanceof MalValue && element2 instanceof MalValue) {
    return element1.equals(element2);
  }

  return false;
};

const pr_str = malValue => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str();
  }

  return malValue.toString();
};

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue{
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue{
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

class MalVector extends MalValue{
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

class MalNil extends MalValue{
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

class MalHashmap extends MalValue{
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "{" + this.value.map(x => x.pr_str).join(' ') + "}";
  }
}

class MalFunction extends MalValue{
  constructor(ast, binds, env) {
    super(ast);
    this.binds = binds;
    this.env = env;
  }

  pr_str() {
    return '#Function';
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalHashmap,
  deepEqual,
  MalFunction
};