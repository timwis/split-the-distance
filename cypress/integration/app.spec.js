/* global cy, describe, context, it */
/// <reference types="cypress" />

describe('split the distance', () => {
  context('basic search', () => {
    it('searches', () => {
      cy.intercept('/geocoding/v5/mapbox.places/N1%20.json?*', { fixture: 'location-input.json' })
        .as('getLocations')

      cy.intercept('POST', '/traveltime/time-map', { fixture: 'time-map.json' })
        .as('getTimeMap')

      cy.intercept('/foursquare/places/search?*', { fixture: 'coffee-shops.json' })
        .as('getCoffeeShops')

      cy.visit('/search')

      cy.get('[data-testid=yourLocation')
        .find('input')
        .type('N1 ')

      cy.wait('@getLocations')

      cy.get('[data-testid=yourLocation]')
        .find('.dropdown-menu')
        .contains('N1 9AF, London')
        .click()

      cy.get('[data-testid=theirLocation]')
        .find('input')
        .type('N1 ')

      cy.wait('@getLocations')

      cy.get('[data-testid=theirLocation]')
        .find('.dropdown-menu')
        .contains('N1 8EQ, London')
        .click()

      cy.get('[data-testid=search-btn]')
        .click()

      cy.wait(['@getTimeMap', '@getCoffeeShops'])

      cy.url().should('include', '/results')
    })
  })
})
