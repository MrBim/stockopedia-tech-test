import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Home from "../pages";

describe("Index page", () => {
  beforeEach(() => {
    render(<Home />);
  });

  it("should set the initial value of the expression", () => {
    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`);
  });

  it("should set the expression when an example button is clicked", () => {
    fireEvent.click(screen.getByTestId("button-divide"));

    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`);
  });

  it('should evaluate the expression when the "run" button is clicked', () => {
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("expression-output")).toHaveValue(`8`);
  });

  it('should evaluate the simple division expression when the "run" button is clicked', () => {
    fireEvent.click(screen.getByTestId("button-divide"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("expression-output")).toHaveValue(`0.5`);
    expect(screen.getByTestId("expression-success")).toBeVisible();
  });

  it('should evaluate the nested expression when the "run" button is clicked', () => {
    fireEvent.click(screen.getByTestId("button-nested"));
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("expression-output")).toHaveValue(`-21`);
    expect(screen.getByTestId("expression-success")).toBeVisible();
  });

  it('should fail gracefuly when invalid JSON is entered in to the expression input', () => {
    fireEvent.click(screen.getByTestId("button-invalid-json"));

    expect(screen.getByTestId("run-button")).toHaveProperty('disabled');
    expect(screen.getByTestId("expression-invalid")).toBeVisible();
  });

  it('should fail gracefuly when invalid DSL is entered in to the expression input', () => {
    fireEvent.click(screen.getByTestId("button-invalid-dsl"));

    expect(screen.getByTestId("run-button")).toHaveProperty('disabled');
    expect(screen.getByTestId("expression-invalid")).toBeVisible();
  });

  it('should fail gracefuly when missing security is entered in to the expression input', () => {
    fireEvent.click(screen.getByTestId("button-missing-security"));

    expect(screen.getByTestId("run-button")).toHaveProperty('disabled');
    expect(screen.getByTestId("expression-invalid")).toBeVisible();
  });
  it('should fail gracefuly when malformed expressions entered in to the expression input', () => {
    fireEvent.change(screen.getByTestId("expression-input"),{
      target: { value: `{
        "expression": {"fn": "/", "a": "pruce", "b": "epss"},
        "security": "BCD"
      }` },
    } );
    fireEvent.click(screen.getByTestId("run-button"));

    expect(screen.getByTestId("expression-output")).toHaveValue(`There has been a problem with your Expression or Security`);
  });
});
