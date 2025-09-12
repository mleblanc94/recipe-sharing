Cypress.Commands.add('userLogin', () => {
  cy.visit('https://recipe-sharing-hub-97ef44b34b8f.herokuapp.com/');
  cy.get('#email').type(Cypress.env('TEST_EMAIL'));
  cy.get('#password').type(Cypress.env('TEST_PASSWORD'), { log: false });
  cy.contains('button', 'Login').click();
  cy.contains('Recipe Share', { timeout: 10000 }).should('be.visible');
});
