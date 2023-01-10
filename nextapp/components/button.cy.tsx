import React from "react";
import Button from "./button";

describe("<Button />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button onClick={() => {}}>Click Me</Button>);
    cy.mount(
      <Button icon="check" onClick={() => {}}>
        Click Me
      </Button>
    );
    cy.mount(
      <Button icon="globe" onClick={() => {}}>
        Click Me
      </Button>
    );
    cy.mount(
      <Button icon="save" onClick={() => {}}>
        Click Me
      </Button>
    );
    cy.mount(
      <Button icon="trash" onClick={() => {}}>
        Click Me
      </Button>
    );
  });
});
