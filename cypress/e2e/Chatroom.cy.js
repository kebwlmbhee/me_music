describe('登入流程測試', () => {
  beforeEach(() => {
    cy.visit('/Login')
        cy.get("[data-test='login-btn']").click()
        // 用來解決 CORS 問題
        cy.origin('https://accounts.spotify.com', () => {
            // cypress.config.js 設定會去 .env.local 抓環境變數
            // 先在本地的 .env.local 設定帳號密碼，再進行測試 (.gitignore 需要設定 *.local，避免把帳密 commit 上去)
            cy.get('#login-username').type(Cypress.env('spotifyAccount'))
            cy.get('#login-username').should('have.value', Cypress.env('spotifyAccount'))
            cy.get('#login-password').type(Cypress.env('spotifyPassword'))
            cy.get('#login-password').should('have.value', Cypress.env('spotifyPassword'))

            cy.get('#login-button').click()
            cy.get("[data-testid='auth-accept']").click()
        })
        cy.location().should((location) => {
            expect(location.hostname).to.eq('localhost')
            expect(location.pathname).to.eq('/Home')
        })
  })

  it('聊天室流程', () => {
    cy.get("[data-test='聊天室']").click()
    cy.get("[data-test='chatroom-input']").type("E2E測試{enter}")
    cy.get('.v-list-item-title').contains('E2E測試')
  })
})

// describe('聊天室測試', () => {
//   it('should', () => {

//   })
// })