import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { FormInline, CheckboxField, HueField } from 'components/generics/Form'
import Notification, { NotifiableForTable } from 'components/generics/Notification'
import { Status } from 'reducers/alterationsStatus'
import { songTagPropType } from 'serverPropTypes/library'
import { alterationStatusPropType } from 'reducers/alterationsStatus'
import { formPropType } from 'reducers/forms'

export default class SettingsSongTagsEntry extends Component {
    static propTypes = {
        tag: songTagPropType.isRequired,
        statusEdit: alterationStatusPropType,
        editSongTag: PropTypes.func.isRequired,
        formResponse: formPropType, // should be isRequired
    }

    state = {
        colorFormDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearTagListEntryNotification(this.props.tag.id)
    }

    displayColorForm = () => {
        this.setState({colorFormDisplayed: true})
    }

    clearColorForm = () => {
        this.setState({colorFormDisplayed: false})
    }

    render() {
        const { statusEdit, formResponse, tag, editSongTag } = this.props

        /**
         * form to change color
         */

        const submitText = (
            <span className="icon">
                <i className="fa fa-check"></i>
            </span>
        )

        const colorForm = (
            <div className="notified color-form-notified">
                <FormInline
                    action={`library/song-tags/${tag.id}/`}
                    method="PATCH"
                    submitText={submitText}
                    submitClass="success"
                    formName={`tagColorEdit${tag.id}`}
                    noClearOnSuccess
                    onSuccess={this.clearColorForm}
                >
                    <HueField
                        id="color_hue"
                        defaultValue={tag.color_hue}
                    />
                </FormInline>
                <div className="controls">
                    <button
                        onClick={this.clearColorForm}
                        className="control danger"
                    >
                        <span className="icon">
                            <i className="fa fa-times"></i>
                        </span>
                    </button>
                </div>
            </div>
        )

        /**
         * handle disabled state
         */

        const disabled = statusEdit && statusEdit.status == Status.pending
        const setValue = (id, value) => {
            if (!disabled)
                editSongTag(tag.id, !value)
        }

        // TODO It would be nice to set the checkbox to disabled if
        // the request (fetching) takes too much time.

        return (
            <tr className="listing-entry hoverizable">
                <td className="notification-col color">
                    <NotifiableForTable>
                        <Notification
                            alterationStatus={statusEdit}
                            failedMessage="Error attempting to edit tag"
                            pendingMessage={false}
                            successfulMessage={false}
                        />
                        <Notification
                            alterationStatus={formResponse}
                            successfulMessage={false}
                            pendingMessage={false}
                            failedMessage="Error attempting to edit tag color"
                        />
                        <CSSTransitionLazy
                            in={this.state.colorFormDisplayed}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            {colorForm}
                        </CSSTransitionLazy>
                    </NotifiableForTable>
                </td>
                <td className="name">{tag.name}</td>
                <td className="enabled">
                    <div className="form inline">
                        <CheckboxField
                            id={`enabled-state${tag.id}`}
                            value={!tag.disabled}
                            setValue={setValue}
                            inline
                            toggle
                        />
                    </div>
                </td>
                <td className="controls-col">
                    <div className="controls">
                        <button
                            className="control display-color-form"
                            onClick={this.displayColorForm}
                            style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                        >
                            <i className="fa fa-paint-brush"></i>
                        </button>
                    </div>
                </td>
            </tr>
        )
    }
}
