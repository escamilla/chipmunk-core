/* tslint:disable:object-literal-sort-keys */

import { assert } from "chai";
import "mocha";

import Environment from "../src/Environment";
import Evaluator from "../src/Evaluator";
import Lexer from "../src/Lexer";
import Parser from "../src/Parser";

import Token from "../src/tokens/Token";

import INode from "../src/nodes/INode";
import ListNode from "../src/nodes/ListNode";
import NumberNode from "../src/nodes/NumberNode";
import SymbolNode from "../src/nodes/SymbolNode";

function interpret(input: string): INode {
  const lexer: Lexer = new Lexer(input);
  const tokens: Token[] = lexer.lex();
  const parser: Parser = new Parser(tokens);
  const ast: INode = parser.parse();
  const evaluator: Evaluator = new Evaluator(ast);
  return evaluator.evaluate();
}

interface IPositiveTest {
  input: string;
  expected: INode;
}

interface INegativeTest {
  input: string;
  reason: string;
}

describe("interpret()", () => {
  const positiveTests: IPositiveTest[] = [
    { input: "1", expected: new NumberNode(1) },
    { input: "-1", expected: new NumberNode(-1) },
    { input: "0.1", expected: new NumberNode(0.1) },
    { input: "-0.1", expected: new NumberNode(-0.1) },
    { input: "(add 1 2)", expected: new NumberNode(3) },
    { input: "(sub 3 2)", expected: new NumberNode(1) },
    { input: "(mul 2 3)", expected: new NumberNode(6) },
    { input: "(div 6 3)", expected: new NumberNode(2) },
    { input: "(mod 9 6)", expected: new NumberNode(3) },
    { input: "(pow 2 3)", expected: new NumberNode(8) },
    { input: "(add (add 1 2) 3)", expected: new NumberNode(6) },
    { input: "foo", expected: new SymbolNode("foo") },
    { input: "foo-bar", expected: new SymbolNode("foo-bar") },
    { input: "fooBar", expected: new SymbolNode("fooBar") },
    { input: "'1", expected: new NumberNode(1) },
    { input: "'-1", expected: new NumberNode(-1) },
    { input: "'0.1", expected: new NumberNode(0.1) },
    { input: "'-0.1", expected: new NumberNode(-0.1) },
    { input: "'foo", expected: new SymbolNode("foo") },
    { input: "'foo-bar", expected: new SymbolNode("foo-bar") },
    { input: "'fooBar", expected: new SymbolNode("fooBar") },
    {
      input: "'(add 1 2)",
      expected:
        new ListNode([
          new SymbolNode("add"),
          new NumberNode(1),
          new NumberNode(2),
        ]),
    },
    {
      input: "'(add (add 1 2) 3)",
      expected:
        new ListNode([
          new SymbolNode("add"),
          new ListNode([
            new SymbolNode("add"),
            new NumberNode(1),
            new NumberNode(2),
          ]),
          new NumberNode(3),
        ]),
    },
    {
      input: "(list a b c)",
      expected:
        new ListNode([
          new SymbolNode("a"),
          new SymbolNode("b"),
          new SymbolNode("c"),
        ]),
    },
    { input: "(quote foo)", expected: new SymbolNode("foo") },
    {
      input: "(quote (add 1 2))",
      expected:
        new ListNode([
          new SymbolNode("add"),
          new NumberNode(1),
          new NumberNode(2),
        ]),
    },
    { input: "(unquote 'foo)", expected: new SymbolNode("foo") },
    {
      input: "(unquote '(add 1 2))",
      expected:
        new ListNode([
          new SymbolNode("add"),
          new NumberNode(1),
          new NumberNode(2),
        ]),
    },
    { input: "(sequence (add 1 2) (add 2 3))", expected: new NumberNode(5) },
    { input: "((sequence add) 1 2)", expected: new NumberNode(3) },
    { input: "(let pi 3.14)", expected: new NumberNode(3.14) },
    { input: "(sequence (let pi 3.14) pi)", expected: new NumberNode(3.14) },
    { input: "(sequence (let pi 3.14) (sequence pi))", expected: new NumberNode(3.14) },
    { input: "(sequence (let pi 3.14) (let pi 3.142) pi)", expected: new NumberNode(3.142) },
    { input: "(sequence (let pi 3.14) (sequence (let pi 3.142)) pi)", expected: new NumberNode(3.14) },
    { input: "((lambda (x y) (add x y)) 1 2)", expected: new NumberNode(3) },
    { input: "(sequence (let x 1) ((lambda (y) (add x y)) 2))", expected: new NumberNode(3) },
    { input: "(sequence (let x 1) (let y 2) ((lambda () (add x y))))", expected: new NumberNode(3) },
    { input: "(sequence (let x 1) ((lambda (x y) (add x y)) 2 2))", expected: new NumberNode(4) },
    { input: "(sequence (let square (lambda (x) (mul x x))) (square 3))", expected: new NumberNode(9) },
    { input: "(eq 0 1)", expected: new NumberNode(1) },
    { input: "(eq 1 1)", expected: new NumberNode(0) },
    { input: "(lt 0 1)", expected: new NumberNode(0) },
    { input: "(lt 1 0)", expected: new NumberNode(1) },
    { input: "(lt 1 1)", expected: new NumberNode(1) },
    { input: "(gt 0 1)", expected: new NumberNode(1) },
    { input: "(gt 1 0)", expected: new NumberNode(0) },
    { input: "(gt 1 1)", expected: new NumberNode(1) },
    { input: "(if (lt 0 1) true false)", expected: new SymbolNode("true") },
    { input: "(if (gt 0 1) true false)", expected: new SymbolNode("false") },
    { input: "(length '())", expected: new NumberNode(0) },
    { input: "(length '(a b c))", expected: new NumberNode(3) },
    { input: "(nth '(a b c) 2)", expected: new SymbolNode("b") },
    {
      input: "(concat '(a) '(b c))",
      expected:
        new ListNode([
          new SymbolNode("a"),
          new SymbolNode("b"),
          new SymbolNode("c"),
        ]),
    },
  ];

  positiveTests.forEach((test: IPositiveTest) => {
    it(`correctly evaluates ${test.input}`, () => {
      const actual: INode = interpret(test.input);
      assert.deepEqual(actual, test.expected);
    });
  });

  const negativeTests: INegativeTest[] = [
    { input: "(", reason: "unmatched parenthesis" },
    { input: ")", reason: "unmatched parenthesis" },
    { input: "()", reason: "empty symbolic expression" },
    { input: "(1)", reason: "symbolic expression must begin with a symbol" },
    { input: "(foo)", reason: "undefined symbol" },
    { input: "foo bar", reason: "must be single expression" },
    { input: "(add 1 2) foo", reason: "must be single expression" },
    { input: "foo (add 1 2)", reason: "must be single expression" },
    { input: "-foo", reason: "symbol cannot begin with a hyphen" },
    { input: "foo-", reason: "symbol cannot end with a hyphen" },
    { input: ".1", reason: "number cannot begin with a decimal point" },
    { input: "1.", reason: "number cannot end with a decimal point" },
  ];

  negativeTests.forEach((test: INegativeTest) => {
    it(`throws an error evaluating ${test.input} (${test.reason})`, () => {
      assert.throws(() => {
        interpret(test.input);
      });
    });
  });
});

describe("Environment", () => {
  describe("#lookUp", () => {
    it("returns value from the current scope", (done: MochaDone) => {
      const env: Environment = new Environment();
      env.set("pi", 3.14);
      assert.strictEqual(env.get("pi"), 3.14);
      done();
    });

    it("returns value from the outer scope", (done: MochaDone) => {
      const parent: Environment = new Environment();
      const child: Environment = new Environment(parent);
      parent.set("pi", 3.14);
      assert.strictEqual(child.get("pi"), 3.14);
      done();
    });

    it("returns value from the outermost scope", (done: MochaDone) => {
      const grandparent: Environment = new Environment();
      const parent: Environment = new Environment(grandparent);
      const child: Environment = new Environment(parent);
      grandparent.set("pi", 3.14);
      assert.strictEqual(child.get("pi"), 3.14);
      done();
    });

    it("cannot return value from inner scope", (done: MochaDone) => {
      const parent: Environment = new Environment();
      const child: Environment = new Environment(parent);
      child.set("pi", 3.14);
      assert.strictEqual(parent.get("pi"), null);
      done();
    });

    it("can shadow value from the outer scope", (done: MochaDone) => {
      const parent: Environment = new Environment();
      const child: Environment = new Environment(parent);
      parent.set("pi", 3.14);
      child.set("pi", 3.142);
      assert.strictEqual(parent.get("pi"), 3.14);
      assert.strictEqual(child.get("pi"), 3.142);
      done();
    });
  });
});