import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class LibraryTab extends Component {
    static propTypes = {
        name: PropTypes.string,
        extraClassName: PropTypes.string,
        iconName: PropTypes.string,
        queryName: PropTypes.string.isRequired,
    }

    render() {
        const { name, extraClassName, iconName, queryName } = this.props
        let tabName
        if (name) {
            tabName = (
                <span className="name">
                    {name}
                </span>
            )
        }

        // classes
        const linkClass = classNames(
            'tab',
            extraClassName
        )

        return (
                <NavLink
                    to={`/library/${queryName}`}
                    className={linkClass}
                    activeClassName="active"
                >
                    <span className="icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </span>
                    {tabName}
                </NavLink>
                )
    }
}
