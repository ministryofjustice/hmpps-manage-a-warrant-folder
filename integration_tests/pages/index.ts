import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Manage a digital warrant folder')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  courtRegisterLink = (): PageElement => cy.get('[href="/court-register"]')
}
