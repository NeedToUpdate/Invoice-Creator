import React from "react";
import SaveOnlineField from "./saveOnlineField";

describe("<SaveOnlineField />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SaveOnlineField />);
    cy.viewport(1200, 900);
    cy.mount(<SaveOnlineField />);
  });
});
