const readline = require('readline');
const { pr_str } = require("./printer.js");
const { read_str } = require("./reader.js");
const { MalSymbol, MalList, MalVector, MalNil, MalFunction } = require('./types.js');
const { Env } = require('./env.js');
const { ns } = require('./core.js');

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

  return [ast.value[2], letEnv];
};

const evalIf = (ast, env) => {
  const [condition, firstStatement, secondStatement] = ast.value.slice(1);
  const predicateResult = EVAL(condition, env);

  if (predicateResult !== false && !(predicateResult instanceof MalNil)) {
    return new MalList([new MalSymbol('do'), firstStatement]);
  }

  return new MalList([new MalSymbol('do'), secondStatement]);;
};

const evalFn = (ast, env) => {
  const [binds, exprs] = ast.value.slice(1);
  return new MalFunction(exprs, binds.value, env);
};

const evalDo = (ast, env) => {
  const exprs = ast.value.slice(1);
  exprs.slice(0, -1).forEach(expr => EVAL(expr, env));
  return exprs[exprs.length - 1];
};

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList))
      return eval_ast(ast, env);

    if (ast.isEmpty())
      return ast;

    switch (ast.value[0].value) {
      case 'def!':
        env.set(ast.value[1], EVAL(ast.value[2], env));
        return env.get(ast.value[1]);

      case 'let*':
        [ast, env] = evalLet(env, ast);
        break;

      case 'do':
        ast = evalDo(ast, env);
        break;

      case 'if':
        ast = evalIf(ast, env);
        break;

      case 'fn*':
        ast = evalFn(ast, env);
        break;

      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          const olderEnv = fn.env;
          env = new Env(olderEnv, fn.binds, args);
          ast = fn.value;
        } else {
          return fn.apply(null, args);
        }
    };
  }
};

const PRINT = str => pr_str(str);

const initEnv = () => {
  const env = new Env();
  for (const symbol in ns) {
    env.set(new MalSymbol(symbol), ns[symbol]);
  }
  return env;
};

const env = initEnv();

const rep = str => PRINT(EVAL(READ(str), env));

const repl = () => rl.question('user> ', line => {
  try {
    console.log(rep(line));
  } catch (e) {
    console.log(e);
  }
  repl();
});

EVAL(READ("(def! not (fn* (a) (if a false true)))"), env);

repl();