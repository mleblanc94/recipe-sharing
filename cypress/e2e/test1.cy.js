describe('Page loads when visitng the URL and the user can signin', () => {
  it('passes', () => {
    cy.visit('https://recipe-sharing-hub-97ef44b34b8f.herokuapp.com/');
    cy.contains('Login');
    cy.get('input[id="email"]').type('leblancmichael94@gmail.com');
    cy.get('input[id="password"]').type('Garfield20$');
    cy.contains('button', 'Login').click()
    cy.contains('Recipe Share', { timeout: 10000 }).should('be.visible')  })
})