import ApiFunctionView from './ApiFunctionView.vue'

describe('<ApiFunctionView />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(ApiFunctionView)
  })
})
