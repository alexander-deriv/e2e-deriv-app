import BotDashboard from '../../../support/pageobjects/dbot/bot_dashboard_page'
import RunPanel from '../../../support/pageobjects/dbot/run_panel'

describe('QATEST-99420: Import and run custom strategy', () => {
  const botDashboard = new BotDashboard()
  const runPanel = new RunPanel()
  let totalPL

  beforeEach(() => {
    cy.c_login({ user: 'dBot' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.c_openDbotThub()
    cy.c_loadingCheck()
    cy.c_skipTour()
    cy.c_switchToDemoBot()
  })

  it('Run Martingale Old Strategy', () => {
    botDashboard.importStrategy('MartingaleOld')
    cy.c_skipTour()

    //Enter Expected profit, expected Loss, and Trade Amount
    cy.window().then((win) => {
      const martingaleValues = ['5', '4', '1'] //Expected Profit, Expected Loss, Trade Amount
      let call = 0
      cy.stub(win, 'prompt').callsFake(() => {
        return martingaleValues[call++]
      })
      cy.c_runBot()
    })

    //Wait for bot to complete
    cy.findByRole('button', { name: 'Run' }, { timeout: 120000 }).should(
      'be.visible'
    )
    runPanel.profitLossValue.then(($value) => {
      totalPL = $value.text()
    })

    cy.findAllByTestId('dt_themed_scrollbars')
      .last({ timeout: 120000 })
      .then(($amt) => {
        if ($amt.hasClass('run-panel__stat-amount--positive')) {
          cy.on('window:alert', (str) => {
            expect(str).to.contain(
              `Expected Profit Made! Total Profit: ${totalPL}`
            )
          })
        } else {
          cy.on('window:alert', (str) => {
            expect(str).to.contain(
              `Maximum Loss Occurred! Total Loss: ${totalPL}`
            )
          })
        }
      })

    runPanel.transactionsTab.click() //Switch to transactions tab

    //Verify Stake doubles after a loss
    runPanel.runPanelScrollbar.scrollTo('bottom', { ensureScrollable: false })
    runPanel.transactionAfterFirstLoss()
    cy.c_checkRunPanel(true)
  })

  after(() => {
    botDashboard.deleteStrategy()
  })
})
