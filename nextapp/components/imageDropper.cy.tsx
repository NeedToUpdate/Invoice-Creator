import React from "react";
import ImageDropper from "./imageDropper";

describe("<ImageDropper />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <div className="h-40 w-40 p-5">
        <ImageDropper onFileInput={() => {}} />
      </div>
    );
  });
});
