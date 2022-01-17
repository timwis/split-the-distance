/* global cy, describe, context, it */
/// <reference types="cypress" />

describe('split the distance', () => {
  context('basic search', () => {
    it('searches', () => {
      cy.visit('/search')

      cy.get('[data-testid=yourLocation')
        .find('input')
        .type('N1 9AF')

      cy.get('[data-testid=yourLocation]')
        .find('.dropdown-menu')
        .contains('N1 9AF, London')
        .click()

      cy.get('[data-testid=theirLocation]')
        .find('input')
        .type('CR0 1LF')

      cy.get('[data-testid=theirLocation]')
        .find('.dropdown-menu')
        .contains('CR0 1LF, Croydon')
        .click()

      cy.get('[data-testid=search-btn]')
        .click()

      cy.url().should('include', '/results')
    })
  })
})
