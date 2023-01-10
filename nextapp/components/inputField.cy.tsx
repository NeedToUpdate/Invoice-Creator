import React from "react";
import GlobeIcon from "./icons/globe";
import PhoneIcon from "./icons/phone";
import InputField from "./inputField";

describe("<InputField />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<InputField label="testing" placeholder="testing"></InputField>);
    cy.mount(<InputField label="testing" placeholder="testing" type={"date"}></InputField>);
    cy.mount(<InputField label="testing" placeholder="testing" type={"password"}></InputField>);
    cy.mount(<InputField label="testing" placeholder="testing" type={"tel"}></InputField>);
    cy.mount(<InputField label="testing" placeholder="testing" withUnit="$" type={"number"}></InputField>);
    cy.mount(
      <InputField label="testing" placeholder="testing">
        <GlobeIcon className="w-5 h-5"></GlobeIcon>
      </InputField>
    );
  });
  it("displays phone numbers correctly", () => {
    cy.mount(
      <InputField label="testing" placeholder="testing" type={"tel"}>
        <PhoneIcon className="w-5 h-5"></PhoneIcon>
      </InputField>
    );
    cy.get("#input-group-testing").clear().type("1234567890").should("have.value", "123-456-7890");
    cy.get("#input-group-testing").clear().type("123456wvfa7890").should("have.value", "123-456-7890");
    cy.get("#input-group-testing").clear().type("123*&%(*&4567890").should("have.value", "123-456-7890");
    cy.get("#input-group-testing").clear().type("1234567890").should("have.value", "123-456-7890");
    cy.get("#input-group-testing").clear().type("12345667890").should("have.value", "123-4566-7890");
    cy.get("#input-group-testing").clear().type("+1-1234567890").should("have.value", "+1-123-456-7890");
    cy.get("#input-group-testing").clear().type("+1-12345667890").should("have.value", "+1-123-4566-7890");
  });
});
