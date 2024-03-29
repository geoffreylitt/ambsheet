function interpretBinaryOp(node, cont, op) {
  interpret(node.arg1, (val1) => {
    interpret(node.arg2, (val2) => {
      cont(op(val1, val2));
    });
  });
}

function interpret(node, cont) {
  switch (node.type) {
    case "NumberNode":
      cont(node.value);
      break;
    case "PlusNode":
      interpretBinaryOp(node, cont, (a, b) => a + b);
      break;
    case "TimesNode":
      interpretBinaryOp(node, cont, (a, b) => a * b);
      break;
    case "MinusNode":
      interpretBinaryOp(node, cont, (a, b) => a - b);
      break;
    case "DivideNode":
      interpretBinaryOp(node, cont, (a, b) => a / b);
      break;
    // Run the continuation for each value in the AmbNode.
    case "AmbNode":
      for (const value of node.values) {
        interpret(value, cont);
      }
      break;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

// The outermost continuation just collects up all results
// from the sub-paths of execution
function evaluateAST(ast) {
  const results = [];
  interpret(ast, (value) => {
    results.push(value);
  });
  return results;
}

// Example programs
const program1 = {
  type: "PlusNode",
  arg1: {
    type: "TimesNode",
    arg1: { type: "NumberNode", value: 1 },
    arg2: { type: "NumberNode", value: 3 },
  },
  arg2: { type: "NumberNode", value: 5 },
};

const program2 = {
  type: "TimesNode",
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

const program3 = {
  type: "PlusNode",
  arg1: {
    type: "TimesNode",
    arg1: {
      type: "AmbNode",
      values: [
        { type: "NumberNode", value: 1 },
        { type: "NumberNode", value: 2 },
      ],
    },
    arg2: {
      type: "AmbNode",
      values: [
        { type: "NumberNode", value: 3 },
        { type: "NumberNode", value: 4 },
      ],
    },
  },
  arg2: {
    type: "AmbNode",
    values: [
      { type: "NumberNode", value: 5 },
      { type: "NumberNode", value: 6 },
    ],
  },
};

console.log("Program 1:", evaluateAST(program1));
console.log("Program 2:", evaluateAST(program2));
console.log("Program 3:", evaluateAST(program3));
