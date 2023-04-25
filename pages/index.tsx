import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import styles from "./index.module.css";
import { handleRecursiveExpression } from "../scripts/scripts";
import { Security } from "../models/security";
import securities from "../data/securities.json";


interface DSLExample {
  id: string;
  label: string;
  dsl: string;
}

const examples: readonly DSLExample[] = [
  {
    id: "multiply",
    label: "Simple multiplication",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`,
  },
  {
    id: "divide",
    label: "Simple division",
    dsl: `{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`,
  },
  {
    id: "nested",
    label: "Nested expression",
    dsl: `{
  "expression": {
    "fn": "-", 
    "a": {"fn": "-", "a": "eps", "b": "shares"}, 
    "b": {"fn": "-", "a": "assets", "b": "liabilities"}
  },
  "security": "CDE"
}`,
  },
  {
    id: "invalid-json",
    label: "Invalid JSON",
    dsl: `{
  "expression": {"fn": "+", "a": "price", "b": "eps"},
  "security": "BCD"
`,
  },
  {
    id: "invalid-dsl",
    label: "Invalid DSL",
    dsl: `{
  "wrong": 123,
  "security": "BCD"
}`,
  },
  {
    id: "missing-security",
    label: "Missing security",
    dsl: `{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ZZZ"
}`,
  },
];

const Home: NextPage = () => {
  const [expression, setExpression] = useState<string>(examples[0].dsl);
  const setDsl = (dsl: string) => () => setExpression(dsl);

  const [ExpressionIsValid, setExpressionIsValid] = useState(true);
  const [isSuccessfulExpression, setIsSuccessfulExpression] = useState(false);
  const [outputValue, setOutputValue] = useState<string | number>('');

  const handleRunClick = () => {
    const resolvedExpression = handleRecursiveExpression(expression);
    setOutputValue(resolvedExpression);
    if (typeof resolvedExpression === 'number') {
      setIsSuccessfulExpression(true);
    }
  };

  const checkIsValidJSON = (jsonString: string): boolean => {
    try {
      const parsedJSON = JSON.parse(jsonString);
      if (parsedJSON && typeof parsedJSON === "object") return true;
    }
    catch (e) { };
    return false;
  };

  const checkIsValidDSL = (expression: string): boolean => {
    if (!expression) return false;
    const parsed = JSON.parse(expression);
    const keys = Object.keys(parsed);
    if (keys.includes('security') && keys.includes('expression')) {
      return true;
    } else {
      return false;
    }
  };

  const validSecurities = useMemo(() => {
    return securities.map((it: Security) => it.symbol);
  }, []);

  const checkSecurityValidity = (expression: string): boolean => {
    if (!expression) return false;
    const parsed = JSON.parse(expression);
    if (validSecurities.includes(parsed.security)) return true;
    return false;
  };

  useEffect(() => {
    setOutputValue('');
    setIsSuccessfulExpression(false);

    const validJSON = checkIsValidJSON(expression);
    const validDSL = validJSON ? checkIsValidDSL(expression) : false;
    const hasSecurity = validJSON && validDSL ? checkSecurityValidity(expression) : false;

    if (validDSL && validJSON && hasSecurity) {
      setExpressionIsValid(true);
    } else {
      setExpressionIsValid(false);
    };

  }, [expression]);

  return (
    <>
      <Head>
        <title>Stockopedia facts challenge</title>
        <meta
          name="description"
          content="Coding challenge for Stockopedia Ltd"
        />
      </Head>

      <main className={styles.container}>
        <h1>Welcome to facts!</h1>
        <p>
          Enter the DSL query below and press the{" "}
          <strong>
            <q>run</q>
          </strong>{" "}
          button to evaluate it.
        </p>

        {/* Pre-canned Examples Section */}
        <div className={styles.section}>
          <p id="pre-canned-description">
            <strong>Pre-canned examples:</strong>
          </p>
          <nav
            className={styles.navigation}
            aria-describedby="pre-canned-description"
          >
            {examples.map(({ id, label, dsl }) => (
              <button
                type="button"
                onClick={setDsl(dsl)}
                key={id}
                data-testid={`button-${id}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* DSL Editor Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-expression">DSL Expression:</label>
          <textarea
            id="dsl-expression"
            className={styles.field}
            data-testid="expression-input"
            placeholder="Enter your DSL"
            value={expression}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setExpression(e.target.value)
            }
            rows={8}
          ></textarea>

          {isSuccessfulExpression ?
            <div data-testid="expression-success" className={[styles.message, styles.messageSuccess].join(" ")}>
              DSL query ran successfully!
            </div>
            : null
          }

          {!ExpressionIsValid ?
            <div data-testid="expression-invalid" className={[styles.message, styles.messageError].join(" ")}>
              There is a problem with your DSL query.
            </div> : null
          }

          {ExpressionIsValid
            ? <button data-testid="run-button" type="button" onClick={handleRunClick}>
              Run
            </button>
            : <button data-testid="run-button" type="button" disabled>
              Run
            </button>
          }
        </div>

        {/* DSL Output Section */}
        <div className={styles.section}>
          <label htmlFor="dsl-output">Output:</label>
          <textarea
            id="dsl-output"
            data-testid="expression-output"
            className={styles.field}
            readOnly
            rows={1}
            value={outputValue}
          ></textarea>
        </div>
      </main>
    </>
  );
};

export default Home;
