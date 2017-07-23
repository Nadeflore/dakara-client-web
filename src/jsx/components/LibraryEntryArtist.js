import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { browserHistory } from 'react-router'

export default class LibraryEntryArtist extends Component {
    handleSearch = () => {
        const newSearch = "artist:\"\"" + this.props.artist.name + "\"\""
        browserHistory.push({
            pathname: "/library/song",
            query: { search: newSearch}
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
                        <button className="search control primary" onClick={this.handleSearch}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                </li>
        )
    }
}