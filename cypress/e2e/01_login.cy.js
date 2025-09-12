import '../support/commands';

describe('Page loads when visitng the URL and the user can signin', () => {
  it('passes', () => {
    // Reference login function within the commands.js file and log into application
    cy.userLogin();
  }
  )
})