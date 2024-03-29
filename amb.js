function interpret(node, cont) {
  switch (node.type) {
    case "NumberNode":
      cont(node.value);
      break;
    case "PlusNode": {
      interpret(node.arg1, (val1) => {
        interpret(node.arg2, (val2) => {
          const results = [];
          const values1 = Array.isArray(val1) ? val1 : [val1];
          const values2 = Array.isArray(val2) ? val2 : [val2];
          for (const v1 of values1) {
            for (const v2 of values2) {
              results.push(v1 + v2);
            }
          }
          cont(results);
        });
      });
      break;
    }
    case "TimesNode": {
      interpret(node.arg1, (val1) => {
        interpret(node.arg2, (val2) => {
          const results = [];
          const values1 = Array.isArray(val1) ? val1 : [val1];
          const values2 = Array.isArray(val2) ? val2 : [val2];
          for (const v1 of values1) {
            for (const v2 of values2) {
              results.push(v1 * v2);
            }
          }
          cont(results);
        });
      });
      break;
    }
    case "AmbNode": {
      const collectResults = (results) => (value) => {
        if (Array.isArray(value)) {
          results.push(...value);
        } else {
          results.push(value);
        }
      };
      const results = [];
      for (const value of node.values) {
        interpret(value, collectResults(results));
      }
      cont(results);
      break;
    }
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function evaluateAST(ast) {
  const results = [];
  interpret(ast, (value) => {
    if (Array.isArray(value)) {
      results.push(...value);
    } else {
      results.push(value);
    }
  });
  return results;
}

// Example programs
const program1 = {
  type: "PlusNode",
  arg1: {
    type: "TimesNode",
    arg1: { type: "NumberNode", value: 2 },
    arg2: { type: "NumberNode", value: 3 },
  },
  arg2: { type: "NumberNode", value: 5 },
};

const program2 = {
  type: "PlusNode",
  arg1: {
    type: "AmbNode",
    values: [
      { type: "NumberNode", value: 2 },
      { type: "NumberNode", value: 3 },
    ],
  },
  arg2: {
    type: "AmbNode",
    values: [
      { type: "NumberNode", value: 5 },
      { type: "NumberNode", value: 6 },
    ],
  },
};

// console.log("Program 1:", evaluateAST(program1));
console.log("Program 2:", evaluateAST(program2));
