describe('登入登出測試', () => {
  it('登入 + 登出', () => {
    cy.visit('/Login')    
    cy.get("[data-test='login-btn']").click()
    cy.origin('https://accounts.spotify.com', () => {
      cy.get('#login-username').type(Cypress.env('spotifyAccount')).should('have.value', Cypress.env('spotifyAccount'))
      cy.get('#login-password').type(Cypress.env('spotifyPassword')).should('have.value', Cypress.env('spotifyPassword'))
      cy.get('#login-button').click()
      cy.get("[data-testid='auth-accept']").click()
    })

    cy.location().should((location) => {
      expect(location.hostname).to.eq('localhost')
      expect(location.pathname).to.eq('/Home')
    })
    // cy.wait(3000)
    
    cy.get("[data-test='logout-btn_1']").click()
    cy.get("[data-test='logout-btn_2']").click()
  
    cy.location().should((location) => {
      expect(location.hostname).to.eq('localhost')
      expect(location.pathname).to.eq('/')
    })
  })
})