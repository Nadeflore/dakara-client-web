import React, { Component } from 'react'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import PropTypes from 'prop-types'
import { permissionLevels, IsUserManager, IsNotSelf } from 'components/permissions/Users'
import ControlLink from 'components/generics/ControlLink'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification, { NotifiableForTable } from 'components/generics/Notification'
import { userPropType } from 'serverPropTypes/users'

export default class SettingsUsersEntry extends Component {
    static propTypes = {
        user: userPropType.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        deleteUser: PropTypes.func.isRequired,
    }

    state = {
        confirmDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearAlteration("deleteUser", this.props.user.id)
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    render() {
        const { user, deleteUser } = this.props

        return (
            <tr className="listing-entry user-listing-entry hoverizable">
                <td className="notification-col">
                    <NotifiableForTable>
                        <CSSTransitionLazy
                            in={this.state.confirmDisplayed}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            <ConfirmationBar
                                onConfirm={() => {deleteUser(user.id)}}
                                onCancel={this.clearConfirm}
                            />
                        </CSSTransitionLazy>
                        <Notification
                            alterationResponse={this.props.responseOfDelete}
                            pendingMessage="Deleting…"
                            successfulMessage="Successfuly deleted!"
                            successfulDuration={null}
                            failedMessage="Error attempting to delete user"
                        />
                    </NotifiableForTable>
                </td>
                <td className="username">{user.username}</td>
                <IsUserManager>
                    <td className="validated">
                        <Marked marked={user.validated_by_email}/>
                    </td>
                    <td className="validated">
                        <Marked marked={user.validated_by_manager}/>
                    </td>
                </IsUserManager>
                <td className="superuser">
                    <Marked marked={user.is_superuser}/>
                </td>
                <td className="permission">
                    <PermissionText level={user.users_permission_level}/>
                </td>
                <td className="permission">
                    <PermissionText level={user.library_permission_level}/>
                </td>
                <td className="permission last">
                    <PermissionText level={user.playlist_permission_level}/>
                </td>
                <td className="controls-col">
                    <IsUserManager>
                        <div className="controls">
                            <IsNotSelf
                                object={user}
                                disable
                            >
                                <ControlLink
                                    to={`users/${user.id}`}
                                    className="control info"
                                >
                                    <i className="fa fa-pencil"></i>
                                </ControlLink>
                                <button
                                    className="control danger"
                                    onClick={this.displayConfirm}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </IsNotSelf>
                        </div>
                    </IsUserManager>
                </td>
            </tr>
        )
    }
}

const PermissionText = ({level}) => {
    if (!level) {
        return null
    }

    const permissionText = permissionLevels[level]

    return (
        <span className="permission-text">
            {permissionText.substring(0, 1)}
            <span className="hideable">
                {permissionText.substring(1)}
            </span>
        </span>
    )

}


const Marked = ({marked}) => {
    if (!marked) {
        return null
    }

    return (
        <i className="fa fa-check"></i>
    )
}

