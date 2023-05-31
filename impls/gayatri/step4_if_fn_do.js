const readline = require('readline');
const { pr_str } = require("./printer.js");
const { read_str } = require("./reader.js");
const { MalSymbol, MalList, MalVector, MalNil } = require('./types.js');
const { Env } = require('./env.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }
  return ast;
};

const evalLet = (env, ast) => {
  const letEnv = new Env(env);
  const newBindings = ast.value[1].value;

  for (let index = 0; index < newBindings.length; index += 2) {
    letEnv.set(newBindings[index], EVAL(newBindings[index + 1], letEnv));
  }

  return EVAL(ast.value[2], letEnv);
};

const evalIf = (ast, env) => {
  const [fn, condition, firstStatement, secondStatement] = ast.value;

  const predicateResult = EVAL(condition, env);
  if (predicateResult !== false && !(predicateResult instanceof MalNil)) {
    return EVAL(firstStatement, env);
  }

  return EVAL(secondStatement, env);
};

const evalFn = (ast, env) => {
  const [fnName, bindings, expressions ] = ast.value;

  return (...args) => {
    const innerEnv = new Env(env);

    bindings.value.forEach((binding, index) => {
      innerEnv.set(binding, args[index]);    
    });    

    return EVAL(expressions, innerEnv);
  };
};

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList))
    return eval_ast(ast, env);
  
  if (ast.isEmpty())
    return ast;
  
  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
    
    case 'let*':
      return evalLet(env, ast);
    
    case 'do':
      return eval_ast(ast, env);
    
    case 'if':
      return evalIf(ast, env);
    
    case 'fn*':
      return evalFn(ast, env);
  };

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = str => pr_str(str);

const env = new Env();

env.set(new MalSymbol('+'), (...args) => args.reduce((a, b) => a + b));
env.set(new MalSymbol('*'), (...args) => args.reduce((a, b) => a + b));
env.set(new MalSymbol('/'), (...args) => args.reduce((a, b) => Math.round(a / b)));
env.set(new MalSymbol('-'), (...args) => args.reduce((a, b) => a - b));

env.set(new MalSymbol('<'), (a, b) => a < b);
env.set(new MalSymbol('<='), (a, b) => a <= b);
env.set(new MalSymbol('>'), (a, b) => a > b);
env.set(new MalSymbol('>='), (a, b) => a >= b);
env.set(new MalSymbol('='), (a, b) => a === b);

const rep = str => PRINT(EVAL(READ(str),env));

const repl = () => rl.question('user> ', line => {
  try {
    console.log(rep(line));
  } catch (e) {
    console.log(e);
  }
  repl();
});

repl();