/// <reference types="@testing-library/cypress" />
/// <reference types="cypress" />
import "cypress-localstorage-commands";
context("Mongo", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("can save the form locally", () => {
    cy.findByRole("textbox", { name: /your name/i }).type("Bob Dole");
    cy.findByRole("textbox", { name: /your address/i }).type("5353 samson ave");
    cy.findByRole("textbox", { name: /phone number/i }).type("1234567890");
    cy.findByRole("textbox", { name: /destination name/i }).type("jim jimson");
    cy.findByRole("textbox", { name: /destination address/i }).type("1234 bobson ave");
    cy.findByRole("textbox", { name: /invoice number/i }).type("244");
    cy.findByText(/add new item/i).click();
    cy.findByRole("textbox", { name: /item name/i }).type("lots of stuff");
    cy.findByRole("textbox", { name: /price/i }).type("45.99");
    cy.findByText(/save info/i)
      .click()
      .should(() => {
        expect(JSON.parse(localStorage.getItem("itemRows") || "")[0].name).to.eq("lots of stuff");
        expect(JSON.parse(localStorage.getItem("fields") || "").destName).to.eq(`jim jimson`);
        expect(JSON.parse(localStorage.getItem("fields") || "").date).to.eq(today);
      });
  });
  const today = new Date().toLocaleDateString("en-ca");
  it("can load the form from localstorage", () => {
    cy.setLocalStorage("fields", JSON.stringify({ date: today, name: "Bob Dole", destName: "jim jimson", userAddress: "5353 samson ave", phone: "123-456-7890", destAddress: "1234 bobson ave", number: "244" }));
    cy.setLocalStorage("itemRows", JSON.stringify([{ id: 388, name: "lots of stuff", price: "45.99" }]));
    cy.findByRole("textbox", { name: /your name/i }).should("have.value", "Bob Dole");
    cy.findByRole("textbox", { name: /your address/i }).should("have.value", "5353 samson ave");
    cy.findByRole("textbox", { name: /phone number/i }).should("have.value", "123-456-7890");
    cy.findByRole("textbox", { name: /destination name/i }).should("have.value", "jim jimson");
    cy.findByRole("textbox", { name: /destination address/i }).should("have.value", "1234 bobson ave");
    cy.findByRole("textbox", { name: /invoice number/i }).should("have.value", "244");
    cy.findByRole("textbox", { name: /item name/i }).should("have.value", "lots of stuff");
    cy.findByRole("textbox", { name: /price/i }).should("have.value", "45.99");
  });
  it("can save to mongodb", () => {
    cy.setLocalStorage("fields", JSON.stringify({ date: today, name: "Bob Dole", destName: "jim jimson", userAddress: "5353 samson ave", phone: "123-456-7890", destAddress: "1234 bobson ave", number: "244" }));
    cy.setLocalStorage("itemRows", JSON.stringify([{ id: 388, name: "lots of stuff", price: "45.99" }]));
    cy.findByRole("textbox", { name: /invoice name/i }).type("testing invoice");
    cy.findByLabelText(/password/i).type("password1");
    cy.findByText(/save to cloud/i).click();
    cy.findByText(/successfully saved!/i).should("exist");
  });
  it("can load from mongodb", () => {
    cy.findByRole("textbox", { name: /invoice name/i }).type("testing invoice");
    cy.findByLabelText(/password/i).type("password1");
    cy.findByText(/load from cloud/i).click();
    cy.findByRole("textbox", { name: /your name/i }).should("have.value", "Bob Dole");
    cy.findByRole("textbox", { name: /your address/i }).should("have.value", "5353 samson ave");
    cy.findByRole("textbox", { name: /phone number/i }).should("have.value", "123-456-7890");
    cy.findByRole("textbox", { name: /destination name/i }).should("have.value", "jim jimson");
    cy.findByRole("textbox", { name: /destination address/i }).should("have.value", "1234 bobson ave");
    cy.findByRole("textbox", { name: /invoice number/i }).should("have.value", "244");
    cy.findByRole("textbox", { name: /item name/i }).should("have.value", "lots of stuff");
    cy.findByRole("textbox", { name: /price/i }).should("have.value", "45.99");
  });
});
