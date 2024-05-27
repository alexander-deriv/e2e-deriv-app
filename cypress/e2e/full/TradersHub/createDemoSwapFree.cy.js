import '@testing-library/cypress/add-commands'

describe('QATEST-5704 - Create a new Swap free demo accounts ', () => {
  const size = ['small', 'desktop']

  beforeEach(() => {
    cy.c_createRealAccount()
    cy.c_login()
  })

  size.forEach((size) => {
    it(`Should validate the signup of swap free demo account on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_checkTradersHubHomePage(isMobile)
      cy.c_closeNotificationHeader()
      cy.c_switchToDemo()
      if (isMobile) cy.findByRole('button', { name: 'CFDs' }).click()
      cy.findByTestId('dt_trading-app-card_demo_swap-free')
        .findByRole('button', { name: 'Get' })
        .click()
      cy.findByText('Create a Deriv MT5 password').should('be.visible')
      cy.findByText(
        'You can use this password for all your Deriv MT5 accounts.'
      ).should('be.visible')

      cy.findByTestId('dt_mt5_password').type(Cypress.env('mt5Password'), {
        log: false,
      })
      cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click()
      cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
      cy.get('.dc-modal-body').should(
        'contain.text',
        'Your demo Swap-Free account is ready.'
      )
      cy.findByRole('button', { name: 'Continue' }).click()
      cy.findByText('10,000.00 USD').should('be.visible')
      cy.findByRole('button', { name: 'Top up' }).should('exist')
    })
  })
})