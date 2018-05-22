describe('Song library tests', function() {
    beforeEach(function() {
        // visits home page
        // with token set, to appear logged in
        cy.visit('/', {
            onBeforeLoad: win => {
                win.localStorage.setItem("redux", JSON.stringify({token: "tokenString"}))
            }
        })
    })

    it('displays songs details in compact and expanded form', function() {
        cy.url().should('include', '/library/song')

        // check the second song in list
        cy.get('.library-entry-song:nth-child(2)').as('song2')

        // check basic info about a song are displayed 
        cy.get('@song2').should('be.visible')
            .and('contain', 'BlackRunning') // title
            .and('contain', 'versultimate version') // version
            .and('contain', 'Super work') // work
            .and('contain', 'subsuper') // work subtitle
            .and('contain', 'OP2') // work link
            .and('contain', 'The artist') // artist
            .and('contain', 'Artist1') // artist
            .and('contain', 'PV') // tag
            .and('contain', 'INST') // tag

        // expand listing entry
        cy.get('@song2').find('.song').click()

        // check detailed info about a song are displayed 
        cy.get('@song2').find('.library-entry-song-expanded').should('be.visible')
            .and('contain', 'Super work') // work
            .and('contain', 'Opening2') // work link
            .and('contain', 'The artist') // artist
            .and('contain', 'Artist1') // artist
            .and('contain', 'PV') // tag
            .and('contain', 'INST') // tag
            .and('contain', 'super detail') // detail
            .and('contain', 'super video detai') // video detail
            .and('contain', 'Lalalalalalala') // Lyrics


    })

    it('can search songs and highlight result', function() {
        cy.get("#library-searchbox-fake input").type('black{enter}')

        // url changes to include search
        cy.url().should('include', 'query=black')

        // check request is sent
        cy.wait('@songs_query')
            .its('url')
            .should('contains', 'query=black')

        // 2 results
        cy.get('.library-list').children().should('have.length', 2)

        // check highlighting
        cy.get('.library-entry-song:nth-child(1) mark').should('have.text', 'Black')
        cy.get('.library-entry-song:nth-child(2) mark').should('have.text', 'Black')


    })

    it('can navigate through pages', function() {
        cy.get('.paginator .control').as('controls')

        // click next page button
        cy.get('.paginator a.control').first().should('have.attr', 'href', '/library/song?page=2').click()

        // now on second page
        cy.url().should('include', '/library/song?page=2')

        // check first song of page 2
        cy.get('.library-entry-song').first().should('contain', 'Song15') 

        // go to last page
        cy.get('.paginator a.control').last().should('have.attr', 'href', '/library/song?page=4').click()

        // now on page 4
        cy.url().should('include', '/library/song?page=4')

        // check first song of page 4
        cy.get('.library-entry-song').first().should('contain', 'Song9') 
    })

    it('can search artists works and tags from expanded view', function() {
        // second song in list
        cy.get('.library-entry-song:nth-child(2)').as('song2')

        // expand listing entry
        cy.get('@song2').find('.song').click()

        // Click search button for first artist
        cy.get('@song2').find('.artists .control').first().click()

        // url changes to include search
        cy.url().should('include', 'query=' + encodeURIComponent('artist:""The artist""'))

        // return to previous page
        cy.go('back')

        // Click search button for the work
        cy.get('@song2').find('.works .control').first().click()

        // url changes to include search
        cy.url().should('include', 'query=' + encodeURIComponent('anime:""Super work""'))

        // return to previous page
        cy.go('back')

        // Click search button for the first tag
        cy.get('@song2').find('.tags .tag.clickable').first().click()

        // url changes to include search
        cy.url().should('include', 'query=' + encodeURIComponent('#PV'))



    })
})
