import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import PlayerPage from './PlayerPage'
import PlaylistPage from './PlaylistPage'

class LoggedinPage extends Component {
    componentWillMount() {
        if (!this.props.isLoggedIn) {
            browserHistory.push("/login")
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoggedIn) {
            browserHistory.push("/login")
        }
    }

    render() {
        if (!this.props.isLoggedIn) {
            return null
        }
        return (
            <div id="logged-in">
                <div className="box">
                    <PlayerPage/>
                    <PlaylistPage/>
                </div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

LoggedinPage = connect(
    mapStateToProps
)(LoggedinPage)

export default LoggedinPage

