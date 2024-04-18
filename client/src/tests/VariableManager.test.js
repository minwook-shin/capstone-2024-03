import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VariableManager from "../components/VariableManager";

test("renders VariableManager component with form inputs", () => {
  render(<VariableManager />);

  const keyInput = screen.getByPlaceholderText("Key");
  const valueInput = screen.getByPlaceholderText("Value");

  expect(keyInput).toBeInTheDocument();
  expect(valueInput).toBeInTheDocument();
});

test("updates key input value when typing", () => {
  render(<VariableManager />);

  const keyInput = screen.getByPlaceholderText("Key");

  fireEvent.change(keyInput, { target: { value: "testKey" } });

  expect(keyInput.value).toBe("testKey");
});

test("updates value input value when typing", () => {
  render(<VariableManager />);

  const valueInput = screen.getByPlaceholderText("Value");

  fireEvent.change(valueInput, { target: { value: "testValue" } });

  expect(valueInput.value).toBe("testValue");
});
