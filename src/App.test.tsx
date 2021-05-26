import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders app", () => {
  const { getByText } = render(<App />);
  const appText = getByText(/Twilio Video Diagnostics App/);
  expect(appText).toBeInTheDocument();
});
