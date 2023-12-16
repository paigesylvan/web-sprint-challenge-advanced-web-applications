import React from "react";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  // test that when on is false, Spinner renders null
  it("renders null when on is false", () => {
    const { container } = render(<Spinner on={false} />);
    expect(container.firstChild).toBeNull();
  });

  // test that when on is true, Spinner renders the correct elements
  it("renders the correct elements when on is true", () => {
    const { container } = render(<Spinner on={true} />);
    expect(container.firstChild).not.toBeNull();
  });
});