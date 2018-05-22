describe('Artist library tests', function() {
    beforeEach(function() {
        // visits artist library page
        // with token set, to appear logged in
        cy.visit('/library/artist', {
            onBeforeLoad: win => {
                win.localStorage.setItem("redux", JSON.stringify({token: "tokenString"}))
            }
        })
    })

    it('displays artists', function() {
        cy.get('.library-list').children().should('have.length', 5)
        cy.get('.library-entry-artist').first().should('contain', 'Artist7')
    })

    it('can search artists and highlight result', function() {
        // Search for 'tist"
        cy.get("#library-searchbox-fake input").type('tist{enter}')

        // url changes to include search
        cy.url().should('include', 'query=tist')

        // check request is sent
        cy.wait('@artists_query')
            .its('url')
            .should('contains', 'query=tist')

        // check highlighting
        cy.get('.library-entry-artist:nth-child(1) mark').should('have.text', 'tist')
        cy.get('.library-entry-artist:nth-child(2) mark').should('have.text', 'tist')


    })

    it('can search artist songs', function() {
        // Click artist search button
        cy.get('.library-entry-artist .control').first().click()

        // redirected to song search 
        cy.url().should('include', 'query=' + encodeURIComponent('artist:""Artist7""'))

    })
})
