import PropTypes from 'prop-types'
import { songPropType } from './library'
import { userPropType } from './users'

export const playlistEntryPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    song: songPropType.isRequired,
    owner: userPropType.isRequired,
    date_play: PropTypes.string.isRequired,
})

export const playlistPlayedEntryPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    song: songPropType.isRequired,
    owner: userPropType.isRequired,
    date_played: PropTypes.string.isRequired,
})

export const playerStatusPropType = PropTypes.shape({
    playlist_entry: playlistPlayedEntryPropType,
    timing: PropTypes.number.isRequired,
    paused: PropTypes.bool.isRequired,
    in_transition: PropTypes.bool.isRequired,
    date: PropTypes.string.isRequired,
})

export const playerErrorPropType = PropTypes.shape({
    playlist_entry: playlistPlayedEntryPropType.isRequired,
    error_message: PropTypes.string.isRequired,
})

export const karaokePropType = PropTypes.shape({
    status: PropTypes.string,
})
