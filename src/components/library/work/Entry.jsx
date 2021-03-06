import React, { Component } from 'react'
import { stringify } from 'query-string'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import { workPropType } from 'serverPropTypes/library'

class WorkEntry extends Component {
    static propTypes = {
        workType: PropTypes.string.isRequired,
        work: workPropType.isRequired,
        query: PropTypes.object,
    }

    handleSearch = () => {
        const query = `${this.props.workType}:""${this.props.work.title}""`
        this.props.history.push({
            pathname: "/library/song",
            search: stringify({query})
        })
    }

    render() {
        const { title, subtitle, song_count } = this.props.work
        return (
                <li className="library-entry listing-entry library-entry-work hoverizable">
                    <div className="library-entry-work-artist-display">
                        <div className="header">
                            <HighlighterQuery
                                query={this.props.query}
                                className="title"
                                searchWords={(q) => (q.remaining)}
                                textToHighlight={title}
                            />
                            <span className="subtitle">
                                {subtitle}
                            </span>
                        </div>
                        <div className="songs-amount">
                            {song_count}
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

WorkEntry = withRouter(WorkEntry)

export default WorkEntry
