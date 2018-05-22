// This file describes routes stubs that are set before each test

beforeEach(function () {
        // Stub api routes
        cy.server()
        cy.route('/api/users/current/', 'fixture:users/current.json').as('getCurrentUser')
        cy.route('/api/library/work-types/', 'fixture:library/work-types.json')
        cy.route('/api/library/songs/?page=1', 'fixture:library/songs_page1.json')
        cy.route('/api/library/songs/?page=2', 'fixture:library/songs_page2.json')
        cy.route('/api/library/songs/?page=3', 'fixture:library/songs_page3.json')
        cy.route('/api/library/songs/?page=4', 'fixture:library/songs_page4.json')
        cy.route('/api/library/songs/?page=1&query=*', 'fixture:library/songs_query.json').as('songs_query')
        cy.route('/api/library/artists/?page=1', 'fixture:library/artists_page1.json')
        cy.route('/api/library/artists/?page=1&query=*', 'fixture:library/artists_query.json').as('artists_query')
        cy.route('/api/library/works/?page=1&type=anime', 'fixture:library/animes_page1.json')
        cy.route('/api/library/works/?page=1&query=*&type=anime', 'fixture:library/animes_query.json').as('animes_query')
        cy.route('/api/playlist/digest/', 'fixture:playlist/digest.json')
        cy.route('/api/playlist/entries/', 'fixture:playlist/entries.json')
        cy.route('/api/playlist/played-entries/', 'fixture:playlist/played-entries.json')
})
