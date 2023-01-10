import React from "react";
import ItemRowField from "./itemRowField";

describe("<ItemRowField />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ItemRowField name={""} price={""} onChange={() => {}} />);
    cy.viewport(1200, 900);
    cy.mount(<ItemRowField name={""} price={""} onChange={() => {}} />);
  });
});
