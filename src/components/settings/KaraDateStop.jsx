import React, { Component } from 'react'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import { parseTime } from 'utils'
import SettingsTabList from './TabList'
import { FormBlock, InputField, CheckboxField } from 'components/generics/Form'
import { Status } from 'reducers/alterationsResponse'
import { IsPlaylistManager} from 'components/permissions/Playlist'

class SettingsKaraDateStop extends Component {

    render() {
        // render nothing if the karaoke is being fetched
        if (this.props.playlistDigestStatus === Status.pending ||
            this.props.playlistDigestStatus === null) return null

        const { authenticatedUser, karaoke } = this.props
        const { date_stop } = karaoke
        const isManager = IsPlaylistManager.hasPermission(authenticatedUser)


        let karaDateStopWidget
        if (isManager) {
            const formatDateTime = values => {
                if (!values.enable_stop) {
                    return {
                        date_stop: null
                    }
                }
                let date = parseTime(values.time_stop)
                if (date.isBefore()) {
                    date = date.add(1, 'days')
                }

                return {
                    date_stop: date.format()
                }
            }

            const validateTime = value => {
                if (/^\d{1,2}:\d{1,2}$/.test(value)) {
                    return []
                }

                return ["Invalid time, should be HH:mm."]
            }

            karaDateStopWidget = (
                <FormBlock
                    title="Edit kara stop time"
                    action="playlist/karaoke/"
                    method="PUT"
                    submitText="Set"
                    alterationName="editKaraDateStop"
                    successMessage="Kara stop time sucessfully updated!"
                    noClearOnSuccess
                    formatValues={formatDateTime}
                >
                    <CheckboxField
                        id="enable_stop"
                        defaultValue={!!date_stop}
                        label="Enable stop time"
                    />
                    <InputField
                        id="time_stop"
                        defaultValue={date_stop? dayjs(date_stop).format("HH:mm") : ""}
                        validate={validateTime}
                        type="time"
                        label="Set stop time"
                        disabledBy="enable_stop"
                    />
                </FormBlock>
            )
        } else {
            if (date_stop) {
                karaDateStopWidget = (
                    <p>Karaoke stop time: {dayjs(date_stop).format("HH:mm")}</p>
                )
            } else {
                karaDateStopWidget = (
                    <p>Karaoke stop time is not set.</p>
                )
            }
        }

        return (
            <div id="kara-date-stop" className="box">
                <SettingsTabList/>
                <div className="content">
                    {karaDateStopWidget}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigestStatus: state.playlist.digest.status,
    karaoke: state.playlist.digest.data.karaoke,
    authenticatedUser: state.authenticatedUser,
})

SettingsKaraDateStop = connect(
    mapStateToProps,
    {}
)(SettingsKaraDateStop)

export default SettingsKaraDateStop
