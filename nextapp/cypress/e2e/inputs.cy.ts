/// <reference types="cypress" />
const path = require("path");
context("Inputs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("can fill out the form", () => {
    cy.findByRole("textbox", { name: /your name/i }).type("Bob Dole");
    cy.findByRole("textbox", { name: /your address/i }).type("5353 samson ave");
    cy.findByRole("textbox", { name: /phone number/i }).type("1234567890");
    cy.findByRole("textbox", { name: /destination name/i }).type("jim jimson");
    cy.findByRole("textbox", { name: /destination address/i }).type("1234 bobson ave");
    cy.findByRole("textbox", { name: /invoice number/i }).type("244");
    cy.findByText(/add new item/i).click();
    cy.findByRole("textbox", { name: /item name/i }).type("lots of stuff");
    cy.findByRole("textbox", { name: /price/i }).type("45.99");
  });
  it("doesnt allow submissions with no name", () => {
    cy.findByText(/create invoice/i).click();
    cy.findByText(/please write your name\./i).should("exist");
    cy.findByText(/please add at least one item to the invoice\./i).should("exist");
  });
  it("doesnt allow submission with no item name or price", () => {
    cy.findByRole("textbox", { name: /your name/i }).type("Bob Dole");
    cy.findByText(/add new item/i).click();
    cy.findByText(/create invoice/i).click();
    cy.findByText(/please write a name for this item\./i).should("exist");
    cy.findByText(/please add a price\./i).should("exist");
  });
});
