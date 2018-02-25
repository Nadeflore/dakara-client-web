import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getUser, clearUser } from 'actions'
import { FormBlock, InputField, SelectField, CheckboxField } from 'components/generics/Form'
import { PermissionBase } from 'components/permissions/Base'
import { IsUserManager, IsNotSelf } from 'components/permissions/Users'
import NotFound from 'components/navigation/NotFound'
import Forbidden from 'components/navigation/Forbidden'

class UsersEdit extends Component {
    static propTypes = {
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            is_superuser: PropTypes.bool.isRequired,
            users_permission_level: PropTypes.string,
            library_permission_level: PropTypes.string,
            playlist_permission_level: PropTypes.string,
        }),
        isFetching: PropTypes.bool.isRequired,
        authenticatedUser: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                userId: PropTypes.any.isRequired,
            }).isRequired,
        }).isRequired,
        getUser: PropTypes.func.isRequired,
        clearUser: PropTypes.func.isRequired,
    }

    componentWillMount() {
        const userId = this.props.match.params.userId
        this.props.getUser(userId)
    }

    componentWillUnmount() {
        this.props.clearUser()
    }

    render() {
        const { location, user, isFetching, authenticatedUser } = this.props

        // render nothing if the user is being fetched
        if (isFetching) {
            return null
        }

        // render an error page if the current user has no right to display the page
        const userId = this.props.match.params.userId
        const fakeUser = {id: userId}
        if (!(PermissionBase.hasPermission(authenticatedUser, fakeUser, IsUserManager) &&
                PermissionBase.hasPermission(authenticatedUser, fakeUser, IsNotSelf))) {

            return (
                <Forbidden location={location}/>
            )
        }

        // render an error page if the requested user does not exist
        if (!user) {
            return (
                <NotFound location={location}/>
            )
        }

        return (
                <div className="box" id="users-edit">
                    <div className="box-header">
                        <h1>Users management</h1>
                    </div>
                    <FormBlock
                        title={`Edit user “${user.username}”`}
                        action={`users/${user.id}/`}
                        method="PATCH"
                        submitText="Edit"
                        formName="updateUser"
                        successMessage="User sucessfully updated!"
                        noClearOnSuccess
                    >
                        <InputField
                            id="password"
                            type="password"
                            label="Password"
                            ignoreIfEmpty
                        />
                        <InputField
                            id="confirm_password"
                            type="password"
                            label="Confirm password"
                            validate={(value, values) => {
                                if (values.password != value) {
                                    return ["This field should match password field."]
                                }
                            }}
                            ignore
                        />
                        <CheckboxField
                            id="is_superuser"
                            label="Superuser"
                            defaultValue={user.is_superuser}
                            disabled
                        />
                        <SelectField
                            id="users_permission_level"
                            label="Users rights"
                            defaultValue={user.users_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="library_permission_level"
                            label="Library rights"
                            defaultValue={user.library_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="playlist_permission_level"
                            label="Playlist rights"
                            defaultValue={user.playlist_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                                {value: 'p', name: 'Player'}
                            ]}
                        />
                    </FormBlock>
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.settings.users.userEdit.user,
    isFetching: state.settings.users.userEdit.isFetching,
    authenticatedUser: state.authenticatedUser
})

UsersEdit = connect(
    mapStateToProps,
    {
        getUser,
        clearUser,
    }
)(UsersEdit)

export default UsersEdit
