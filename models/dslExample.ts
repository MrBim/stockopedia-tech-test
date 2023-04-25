export type Expression ={
  "fn": string, 
  "a": string | number | Expression, 
  "b": string | number | Expression, 
};

export interface DSL {
  "expression": Expression,
  "security": string
};