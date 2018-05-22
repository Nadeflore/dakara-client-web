describe('Work library tests', function() {
    beforeEach(function() {
        // visits work anime library page
        // with token set, to appear logged in
        cy.visit('/library/anime', {
            onBeforeLoad: win => {
                win.localStorage.setItem("redux", JSON.stringify({token: "tokenString"}))
            }
        })
    })

    it('displays works', function() {
        cy.get('.library-list').children().should('have.length', 1)
        cy.get('.library-entry-work').first()
        .should('contain', 'Super work') // title
        .and('contain', 'subsuper') // subtitle
    })

    it('can search works and highlight result', function() {
        // Search for "ork"
        cy.get("#library-searchbox-fake input").type('ork{enter}')

        // url changes to include search
        cy.url().should('include', 'query=ork')

        // check request is sent
        cy.wait('@animes_query')
            .its('url')
            .should('contains', 'query=ork')

        // check highlighting
        cy.get('.library-entry-work:nth-child(1) mark').should('have.text', 'ork')


    })

    it('can search work songs', function() {
        // Click work search button
        cy.get('.library-entry-work .control').first().click()

        // redirected to song search 
        cy.url().should('include', 'query=' + encodeURIComponent('anime:""Super work""'))

    })
})
