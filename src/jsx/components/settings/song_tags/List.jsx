import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { getSongTagList, editSongTag, clearTagListEntryNotification } from 'actions/songTags'
import Navigator from 'components/generics/Navigator'
import SettingsSongTagsEntry from './Entry'
import SettingsTabList from '../TabList'
import { songTagsSettingsPropType } from 'reducers/songTags'
import { alterationStatusPropType } from 'reducers/alterationsStatus'
import { formPropType } from 'reducers/forms'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'

class SettingsSongTagsList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        songTagsSettings: songTagsSettingsPropType.isRequired,
        editStatus: alterationStatusPropType,
        formsResponse: PropTypes.objectOf(formPropType),
        editSongTag: PropTypes.func.isRequired,
        getSongTagList: PropTypes.func.isRequired,
        clearTagListEntryNotification: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page != prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getSongTagList(pageNumber)
    }

    render() {
        const { editsStatus, editSongTag, location, formsResponse } = this.props
        const { songTags, pagination } = this.props.songTagsSettings.data

        const tagList = songTags.map((tag) => {
            let editStatus
            if (editsStatus) {
                editStatus = editsStatus[tag.id]
            }

            const formResponse = formsResponse[`tagColorEdit${tag.id}`]

            return (
                <SettingsSongTagsEntry
                    key={tag.id}
                    tag={tag}
                    editStatus={editStatus}
                    formResponse={formResponse}
                    editSongTag={editSongTag}
                    clearTagListEntryNotification={this.props.clearTagListEntryNotification}
                />
            )
        })

        return (
            <div className="box" id="song-tag-list">
                <SettingsTabList/>
                <div className="box-header">
                    <h1>Song tags management</h1>
                </div>
                <ListingFetchWrapper
                    status={this.props.songTagsSettings.status}
                >
                    <div className="listing-table-container">
                        <table className="listing song-tag-list-listing notifiable">
                            <thead>
                                <tr className="listing-header">
                                    <th className="name">Name</th>
                                    <th className="enabled">Enabled</th>
                                    <th className="color">Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tagList}
                            </tbody>
                        </table>
                    </div>
                </ListingFetchWrapper>
                <Navigator
                    pagination={pagination}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songTagsSettings: state.settings.songTags,
    editsStatus: state.alterationsStatus.editSongTag,
    formsResponse: state.forms
})

SettingsSongTagsList = withRouter(connect(
    mapStateToProps,
    {
        getSongTagList,
        editSongTag,
        clearTagListEntryNotification
    }
)(SettingsSongTagsList))

export default SettingsSongTagsList
