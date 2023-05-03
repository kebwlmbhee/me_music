describe('登入流程測試', () => {
  it('登入流程', () => {
    cy.visit('/Login')    
    cy.get("[data-test='login-btn']").click()
    cy.origin('https://accounts.spotify.com', () => {
      cy.get('#login-username').type(Cypress.env('spotifyAccount')).should('have.value', Cypress.env('spotifyAccount'))
      cy.get('#login-password').type(Cypress.env('spotifyPassword')).should('have.value', Cypress.env('spotifyPassword'))
      cy.get('#login-button').click()
      cy.get("[data-testid='auth-accept']").click()
    })
  })
})