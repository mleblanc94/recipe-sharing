describe('Profile page is shown after clicking it from the top menu', () => {
  it('passes', () => {
    cy.userLogin();
    // Click the first card's "Interested"
    cy.get('.card').first().within(() => {
      cy.contains('button', 'Interested').click();
    });
    cy.get('[data-testid="nav-profile"]').click();
    cy.contains('Juicy delicious cheeseburger', { timeout: 10000 }).should('be.visible');
  })
})