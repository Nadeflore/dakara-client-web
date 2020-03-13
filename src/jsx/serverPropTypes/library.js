import PropTypes from 'prop-types'

export const artistPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    song_count: PropTypes.number,
})

export const workTypePropType = PropTypes.shape({
    query_name: PropTypes.string.isRequired,
    icon_name: PropTypes.string.isRequired,
    name_plural: PropTypes.string.isRequired,
})

export const workAltTitlePropType = PropTypes.shape({
    title: PropTypes.string.isRequired,
})

export const workPropType = PropTypes.shape({
    work_type: workTypePropType.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    alternative_titles: PropTypes.arrayOf(workAltTitlePropType),
    song_count: PropTypes.number,
})

export const workLinkPropType = PropTypes.shape({
    work: workPropType.isRequired,
    link_type_number: PropTypes.number,
    link_type: PropTypes.string.isRequired,
    episodes: PropTypes.string,
})

export const songTagPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    color_hue: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
})

export const songPropType = PropTypes.shape({
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    version: PropTypes.string,
    duration: PropTypes.number.isRequired,
    works: PropTypes.arrayOf(workLinkPropType).isRequired,
    artists: PropTypes.arrayOf(artistPropType).isRequired,
    detail: PropTypes.string,
    detail_video: PropTypes.string,
    lyrics: PropTypes.shape({
        truncated: PropTypes.bool,
        text: PropTypes.string.isRequired
    }),
    tags: PropTypes.arrayOf(songTagPropType).isRequired,
})
