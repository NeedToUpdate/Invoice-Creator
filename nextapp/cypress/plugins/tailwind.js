before(() => {
  cy.exec("npx tailwindcss -i ./styles/globals.css -m").then(({ stdout }) => {
    if (!document.head.querySelector("#tailwind-style")) {
      const link = document.createElement("style");
      link.id = "tailwind-style";
      link.innerHTML = stdout;

      document.head.appendChild(link);
    }
  });
});
