import ApiFunctionView from '@/views/Example_Files/ApiFunctionView.vue'
import { createTestingPinia } from '@pinia/testing'

describe('<ApiFunctionView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    // https://pinia.vuejs.org/cookbook/testing.html#unit-testing-components
    // https://github.com/vuejs/pinia/discussions/985
    cy.mount(ApiFunctionView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: cy.spy
          })
        ]
      }
    })
  })
})
