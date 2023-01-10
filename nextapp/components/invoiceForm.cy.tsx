import React from "react";
import InvoiceForm from "./invoiceForm";

describe("<InvoiceForm />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<InvoiceForm />);
    cy.viewport(1200, 900);
    cy.mount(<InvoiceForm />);
  });
});
