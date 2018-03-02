import React, { Component } from 'react'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import { artistPropType } from 'serverPropTypes/library'

class ArtistEntry extends Component {
    static propTypes = {
        artist: artistPropType.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    handleSearch = () => {
        const newQuery = `artist:""${this.props.artist.name}""`
        this.context.router.history.push({
            pathname: "/library/song",
            search: stringify({query: newQuery})
        })
    }

    render() {
        return (
                <li className="library-entry listing-entry library-entry-artist hoverizable">
                    <div className="library-entry-artist-display">
                        <div className="name">
                            {this.props.artist.name}
                        </div>
                        <div className="songs-amount">
                            {this.props.artist.song_count}
                        </div>
                    </div>
                    <div className="controls">
                        <button className="control primary" onClick={this.handleSearch}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                </li>
        )
    }
}

export default ArtistEntry
