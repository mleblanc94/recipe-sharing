describe('After login, show first recipe details', () => {
  it('opens the first card modal and shows content', () => {
    cy.userLogin();

    // Click the first card's "More details"
    cy.get('.card').first().within(() => {
      cy.contains('button', 'More details').click();
    });

    // Wait for the modal to appear
    cy.get('[role="dialog"], .modal, .ReactModal__Content', { timeout: 10000 })
      .should('be.visible');

    // Look for what is in the details page
    cy.get('[role="dialog"], .modal, .ReactModal__Content')
      .within(() => {
        cy.contains(/instructions|ingredients|recipe details/i).should('exist');
      });
  });
});
