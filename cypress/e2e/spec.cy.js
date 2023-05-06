/// <reference types="cypress" />

// https://docs.cypress.io/api/commands/session
// 這樣設定就只需要輸入帳密一次
const login = (name) => {
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
}

describe('探索頁面', () => {
    beforeEach(() => {
        login('user') // 必要
    })

    it('進入按鈕', () => {
        cy.get("[data-test='探索']").click()
    })
})

describe('我的音樂紀錄', () => {
    beforeEach(() => {
        login('user') // 必要
    })

    it('進入按鈕', () => {
        cy.get("[data-test='我的音樂記錄']").click()
        cy.get("[data-test='select-type-btn'] button")

    })
})

describe('聊天室', () => {
    beforeEach(() => {
        login('user') // 必要
    })

    it('進入按鈕', () => {
        cy.get("[data-test='聊天室']").click()
    })

    it('發送訊息', () => {
        cy.get("[data-test='聊天室']").click()
        cy.get("[data-test='chatroom-input']").type("E2E測試{enter}")
        cy.get('.v-list-item-title').contains('E2E測試')
    })
})


describe('登出測試', () => {
    beforeEach(() => {
        login('user') // 必要
    })

    it('登出', () => {
        cy.get("[data-test='logout-btn_1']").click()
        cy.get("[data-test='logout-btn_2']").click()

        cy.location().should((location) => {
            expect(location.hostname).to.eq('localhost')
            expect(location.pathname).to.eq('/')
        })
    })
})