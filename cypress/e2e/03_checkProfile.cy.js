describe('Profile page is shown after clicking it from the top menu', () => {
  it('passes', () => {
    // Call login function within the commands.js file and log into application
    cy.userLogin();
    cy.get('[data-testid="nav-profile"]').click();
    cy.contains('Your recipes & saves', { timeout: 10000 }).should('be.visible');
  })
})