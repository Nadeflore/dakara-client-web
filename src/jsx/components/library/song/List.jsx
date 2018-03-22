import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SongEntry from './Entry'
import ListWrapper from '../ListWrapper'
import Navigator from 'components/generics/Navigator'
import { songLibraryPropType } from 'reducers/library'
import { playlistPropType } from 'reducers/playlist'
import { playerDigestPropType } from 'reducers/player'

class SongList extends Component {
    static propTypes = {
        songLibrary: songLibraryPropType.isRequired,
        playlist: playlistPropType.isRequired,
        playerDigest: playerDigestPropType.isRequired,
        location: PropTypes.object.isRequired,
    }

    render() {
        const { songs, count, pagination } = this.props.songLibrary.data

        /**
         * Compute playlist info
         * time when each song is going to be played
         * and currently playing song
         */

        const currentTime = new Date().getTime()
        let remainingTime = 0
        const playerStatus = this.props.playerDigest.data.status
        const playlistInfo = {}

        // First, if a song is playing,
        // set remainingTime to the duration until end of the song

        if (playerStatus.playlist_entry) {
            // Player is playing a song
            // get playing id
            // and add remaining duration
            const playingId = playerStatus.playlist_entry.song.id
            playlistInfo[playingId] = {
                isPlaying: true,
                owner: playerStatus.playlist_entry.owner
            }

            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing
        }


        // Then for each song in playlist,
        // generate a map with song id as key
        // and time + owner as value

        for (let entry of this.props.playlist.data.playlistEntries) {
            if (!playlistInfo[entry.song.id]) {
                playlistInfo[entry.song.id] = {
                    timeOfPlay: currentTime + remainingTime * 1000,
                    owner: entry.owner
                }
            }

            remainingTime += +(entry.song.duration)
        }

        /**
         * Create SongEntry for each song
         */

         const libraryEntrySongList = songs.map( song => (
                <SongEntry
                        key={song.id}
                        song={song}
                        playlistInfo={playlistInfo[song.id]}
                        location={this.props.location}
                    />
            ))

        return (
            <div className="song-list">
                <ListWrapper
                    status={this.props.songLibrary.status}
                >
                    <ul className="library-list listing">
                        {libraryEntrySongList}
                    </ul>
                </ListWrapper>
                <Navigator
                    count={count}
                    pagination={pagination}
                    names={{
                        singular: 'song found',
                        plural: 'songs found'
                    }}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songLibrary: state.library.song,
    playlist: state.player.playlist,
    playerDigest: state.player.digest,
})

SongList = connect(
    mapStateToProps,
)(SongList)

export default SongList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getSongLibraryNameInfo = () => ({
    placeholder: "What will you sing?",
})
