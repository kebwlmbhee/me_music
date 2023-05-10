/// <reference types="cypress" />

describe('探索頁面', () => {
    beforeEach(() => {
        cy.login('user') // 必要，參考 @/cypress/support/commands.js
        cy.get("[data-test='探索']").click()
    })
})

describe('我的音樂紀錄', () => {
    beforeEach(() => {
        cy.login('user') // 必要
        cy.get("[data-test='我的音樂記錄']").click()
    })

    it("按鈕", () => {
        cy.get("[data-test='select-type-btn']").within(() => {
            cy.get(".v-tab").click({ multiple: true, force: true })
        })
    })

    it("音樂卡片", () => {
        cy.get(".alltypemusicContainer").within(() => {
            // https://docs.cypress.io/api/commands/click
            cy.get(".v-card").click({ multiple: true, force: true })
        })
    })
})

describe('聊天室', () => {
    beforeEach(() => {
        cy.login('user') // 必要
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
        cy.login('user') // 必要
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
