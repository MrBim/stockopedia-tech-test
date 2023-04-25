import { DSL, Expression } from "../models/dslExample";
import securities from "../data/securities.json";
import attributes from "../data/attributes.json";
import facts from "../data/facts.json";

const getValue = (attribute: Expression, securityId: number): null | number => {
  try {
    let a, b;
    const operator = attribute.fn;

    if (typeof attribute.a === 'number') {
      const attId = attribute.a as number;
      a = facts.filter((it) => it.security_id === securityId && it.attribute_id === attId)[0].value;
    } else if (typeof attribute.a === 'string' || attribute.a instanceof String) {
      const attId = attributes.filter((it) => it.name === attribute.a)[0].id;
      a = facts.filter((it) => it.security_id === securityId && it.attribute_id === attId)[0].value;
    } else {
      const expression = getValue(attribute.a as Expression, securityId)
      a = expression;
    }

    if (typeof attribute.b === 'number') {
      const attId = attribute.b as number;
      b = facts.filter((it) => it.security_id === securityId && it.attribute_id === attId)[0].value;
    } else if (typeof attribute.b === 'string' || attribute.b instanceof String) {
      const attId = attributes.filter((it) => it.name === attribute.b)[0].id;
      b = facts.filter((it) => it.security_id === securityId && it.attribute_id === attId)[0].value;
    } else {
      const thing = getValue(attribute.b as Expression, securityId)
      b = thing;
    }

    if (a === null || b === null) return null;

    switch (operator) {
      case "+":
        return a + b;

      case "-":
        return a - b;

      case "*":
        return a * b;

      case "/":
        return a / b;

      default:
        return null;
    }
  } catch (e) {
    return null
  }
}


export const handleRecursiveExpression = (expression: string): string | number => {
  const parsedExpression = JSON.parse(expression) as DSL;

  const security = securities.filter((it) => it.symbol === parsedExpression.security)[0].id; 

  const sum = getValue(parsedExpression.expression, security);
  return sum ? sum : 'There has been a problem with your Expression or Security';
}
