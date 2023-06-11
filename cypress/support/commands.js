// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// https://docs.cypress.io/api/commands/session
// 這樣設定就只需要輸入帳密一次
Cypress.Commands.add('login', (name) => {
    cy.session(name, () => {
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
    cy.visit('/home') // 必要
})