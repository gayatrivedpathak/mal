const { MalValue } = require("./types");

const pr_str = malValue => {
  if (malValue instanceof MalValue) {
    console.log(malValue);
    return malValue.pr_str();
  }

  return malValue.toString();
};

exports.pr_str = pr_str;
