/// <reference types="cypress" />
const path = require("path");
context("Files", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("creates an invoice", () => {
    const downloadsFolder = Cypress.config("downloadsFolder");
    const today = new Date().toLocaleDateString("en-ca");
    cy.findByRole("textbox", { name: /your name/i }).type("Bob Dole");
    cy.findByRole("textbox", { name: /your address/i }).type("5353 samson ave");
    cy.findByRole("textbox", { name: /phone number/i }).type("1234567890");
    cy.findByRole("textbox", { name: /destination name/i }).type("jim jimson");
    cy.findByRole("textbox", { name: /destination address/i }).type("1234 bobson ave");
    cy.findByRole("textbox", { name: /invoice number/i }).type("244");
    cy.findByText(/add new item/i).click();
    cy.findByRole("textbox", { name: /item name/i }).type("lots of stuff");
    cy.findByRole("textbox", { name: /price/i }).type("45.99");
    cy.findByText(/create invoice/i).click();
    cy.readFile(path.join(downloadsFolder, today + "-jim-jimson-invoice.pdf")).should("exist");
  });
});
