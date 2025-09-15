describe('Profile page is shown after clicking it from the top menu', () => {
  it('passes', () => {
    cy.userLogin();
    cy.get('[data-testid="nav-profile"]').click();
    cy.contains('Your recipes & saves', { timeout: 10000 }).should('be.visible');
  })
})