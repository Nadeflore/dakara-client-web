describe('Login tests', function() {
    beforeEach(function() {
        cy.clearLocalStorage();
    })

    it('logs in successfuly, is redirected after login and sends token in requests', function() {
        // stub sucessful login
        cy.route('POST', '/api/token-auth/', {token: 'tokenstring'})
          .as('postLogin')

        // Start test
        cy.visit('/')
        cy.url().should('include', '/login')
        cy.get('#username').type('flore')
        cy.get('#password').type('supersecurepass')
        cy.get('.control').click()

        // Assert login request content
        cy.wait('@postLogin')
            .its('requestBody')
            .should('deep.eq', {
                      username: 'flore',
                      password: 'supersecurepass'
            })

        // Assert token header is sent
        cy.wait('@getCurrentUser')
            .its('requestHeaders')
            .should('deep.eq', {Authorization: 'Token tokenstring'})

        // Assert redirect after login
        cy.url().should('include', '/library/song')

        // Assert page shows logged in status
        cy.get('[href="/user"]').should('be.visible').and('contain', 'flore')
    })

    it('displays appropriate message when field are empty or login fails', function() {
        // stub login fail
        cy.route({
            method: 'POST',
            url: '/api/token-auth/',
            status: 400,
            response: {
                "non_field_errors": [
                    "Server error message"
                ]
            }
        }).as('postLogin')

        // Start test
        cy.visit('/login')

        // Only fill username field and submit
        cy.get('#username').type('flore{enter}')

        cy.get('.notification > .error').should('be.visible').and('contain', 'This field is required.')

        cy.get('#password').type('supersecurepass{enter}')

        cy.wait('@postLogin')

        cy.get('.controls .notification')
            .should('be.visible')
            .and('have.class', 'danger')
            .and('contain', "Server error message")

    })
})
