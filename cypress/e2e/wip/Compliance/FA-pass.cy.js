import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-5159 MF financial assessment (Appropriateness Test) - Pass scenario and successful account creation', () => {
  const size = ['small', 'desktop']
  let country = Cypress.env('countries').ES
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  size.forEach((size) => {
    it(`should check FA on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      const signUpEmail = `sanity${generateEpoch()}mf@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(country, signUpEmail, size)
      cy.c_generateRandomName().then((firstName) => {
        cy.c_personalDetails(
          firstName,
          'MF',
          country,
          nationalIDNum,
          taxIDNum,
          currency,
          { isMobile: isMobile }
        )
      })
      cy.c_addressDetails()
      //1st question
      cy.findByRole('heading', {
        name: 'Do you understand that you could potentially lose 100% of the money you use to trade?',
      }).should('be.visible')
      cy.findByText('Yes').click()
      cy.findByRole('button', { name: 'Next' }).click()
      //2nd question
      cy.findByRole('heading', {
        name: 'How much knowledge and experience do you have in relation to online trading?',
      }).should('be.visible')
      cy.findByText(
        'I have an academic degree, professional certification, and/or work experience related to financial services.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()

      if (isMobile) {
        cy.get(`select[name='cfd_experience']`).select('1 - 2 years')
        cy.get(`select[name='cfd_frequency']`).select('1 - 5')
        cy.get(
          `select[name='trading_experience_financial_instruments']`
        ).select('1 - 2 years')
        cy.get(`select[name='trading_frequency_financial_instruments']`).select(
          '1 - 5'
        )
      } else {
        let count = 1
        while (count < 5) {
          cy.findAllByTestId('dt_dropdown_display').eq(count).click()
          cy.findAllByTestId('dti_list_item').eq(0).click()
          count++
        }
      }
      cy.findByRole('button', { name: 'Next' }).click()
      //4th question
      cy.findByRole('heading', {
        name: 'In your understanding, CFD trading allows you to',
      }).should('be.visible')
      cy.findByText(
        'Speculate on the price movement of an asset without actually owning it.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //5th question
      cy.findByRole('heading', {
        name: 'How does leverage affect CFD trading?',
      }).should('be.visible')
      cy.findByText(
        'Leverage lets you open large positions for a fraction of trade value, which may result in increased profit or loss.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //6th question
      cy.findByRole('heading', {
        name: "Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to",
      }).should('be.visible')
      cy.findByText(
        'Close your trade automatically when the loss is equal to or more than a specified amount, as long as there is adequate market liquidity.'
      ).click()
      cy.findByRole('button', { name: 'Next' }).click()
      //7th question
      cy.findByRole('heading', {
        name: 'When are you required to pay an initial margin?',
      }).should('be.visible')
      cy.findByText('When opening a leveraged CFD trade.').click()
      cy.findByRole('button', { name: 'Next' }).click()

      if (isMobile) {
        cy.c_completeFinancialAssessment({ isMobile: true })
      } else {
        cy.c_completeFinancialAssessment()
      }
      cy.c_completeFatcaDeclarationAgreement()
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.get('.dc-checkbox__box').eq(0).click()
      cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
      cy.get('.dc-checkbox__box').eq(1).click()
      cy.get('.dc-checkbox__box').eq(2).click()
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    })
  })
})
