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
   return "(" + this.value.map(this.pr_str).join(' ') + ")";
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

const pr_str = malValue => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str();
  }

  return malValue.toString();
};

class MalVector extends MalValue{
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "[" + this.value.map(x=> pr_str(x)).join(' ') + "]";
  }
}

class MalNil extends MalValue{
  constructor(value) {
    super(null);
  }

  pr_str() {
   return 'nil';
  }
}

class MalHashmap extends MalValue{
  constructor(value) {
    super(value);
  }

  pr_str() {
   return "{" + this.value.map(x=>x.pr_str).join(' ') + "}";
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalHashmap };