import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelType from "./types/SquirrelType";

const namespace: Map<string, SquirrelFunction> = new Map();

namespace.set("add", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value + y.value);
  },
));

namespace.set("sub", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value - y.value);
  },
));

namespace.set("mul", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value * y.value);
  },
));

namespace.set("div", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value / y.value);
  },
));

namespace.set("mod", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value % y.value);
  },
));

namespace.set("pow", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(Math.pow(x.value, y.value));
  },
));

namespace.set("list", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    return new SquirrelList(args);
  },
));

namespace.set("sequence", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    return args[args.length - 1];
  },
));

namespace.set("eq", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value === y.value);
  },
));

namespace.set("lt", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value < y.value);
  },
));

namespace.set("gt", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value > y.value);
  },
));

namespace.set("length", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const list: SquirrelList = args[0] as SquirrelList;
    return new SquirrelNumber(list.elements.length);
  },
));

namespace.set("nth", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const list: SquirrelList = args[0] as SquirrelList;
    const n: SquirrelNumber = args[1] as SquirrelNumber;
    return list.elements[n.value - 1];
  },
));

namespace.set("slice", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    const list: SquirrelList = args[0] as SquirrelList;
    const start: SquirrelNumber = args[1] as SquirrelNumber;
    const end: SquirrelNumber = args[2] as SquirrelNumber;
    return new SquirrelList(list.elements.slice(start.value, end.value));
  },
));

namespace.set("concat", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    const list1: SquirrelList = args[0] as SquirrelList;
    const list2: SquirrelList = args[1] as SquirrelList;
    return new SquirrelList(list1.elements.concat(list2.elements));
  },
));

namespace.set("print", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    // tslint:disable-next-line:no-console
    console.log(args[0].toString());
    return args[0];
  },
));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  fn.name = name;
});

export default namespace;