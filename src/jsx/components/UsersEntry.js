import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { permissionLevels } from './User'
import { IsUserManager, IsNotSelf } from '../containers/UsersPermissions'
import ControlLink from './ControlLink'
import ConfirmationBar from './ConfirmationBar'

export default class UsersEntry extends Component {
    state = {
        confirmDisplayed: false
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    render() {
        const { notification, user, deleteUser } = this.props

        let message
        if (notification) {
            message = <div className="notified">
                        <div className={"notification message " + notification.type}>
                            {notification.message}
                        </div>
                      </div>
        }

        let confirmation
        if (this.state.confirmDisplayed) {
            confirmation = (
                <ConfirmationBar
                    onConfirm={() => {deleteUser(user.id)}}
                    onCancel={this.clearConfirm}
                />
            )
        }

        return (
            <tr className="listing-entry user-listing-entry hoverizable">
                <td className="username">{user.username}</td>
                <td className="permission superuser">{user.is_superuser ? "\u2705" : null}</td>
                <td className="permission">{permissionLevels[user.users_permission_level]}</td>
                <td className="permission">{permissionLevels[user.library_permission_level]}</td>
                <td className="permission">{permissionLevels[user.playlist_permission_level]}</td>
                <td className="controls-col">
                    <IsUserManager>
                        <div className="controls">
                            <IsNotSelf
                                object={user}
                                disable
                            >
                                <ControlLink
                                    to={"/users/" + user.id}
                                    className="control info"
                                >
                                    <i className="fa fa-pencil"></i>
                                </ControlLink>
                            </IsNotSelf>
                            <IsNotSelf
                                object={user}
                                disable
                            >
                                <button
                                    className="control danger"
                                    onClick={this.displayConfirm}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </IsNotSelf>
                        </div>
                    </IsUserManager>
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {confirmation}
                        {message}
                    </ReactCSSTransitionGroup>
                </td>
            </tr>
        )
    }
}
