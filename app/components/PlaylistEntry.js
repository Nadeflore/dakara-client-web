var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var PlaylistEntry = React.createClass({
    getInitialState: function() {
        return {notification: null};
    },
    clearNotification: function() {
        this.setState({notification: null});
    },
    handleReponse: function(status){
        if (status) {
           this.setState({
                notification: {
                    message: "Successfuly removed!",
                    type: "success"
                }
            });
        } else {
            this.setState({
                notification: {
                    message: "Error attempting to remove song from playlist",
                    type: "danger"
                }
            });
            setTimeout(this.clearNotification, 5000);
        }
    },
    handleRemove: function(e){
       this.setState({
            notification: {
                message: "Removing...",
                type: "success"
            }
        });
        this.props.removeEntry(this.props.entry.id, this.handleReponse);
    },

    render: function(){
        var message;
        if(this.state.notification != null){
            message = <div className="notified"><div className={"notification " + this.state.notification.type}>{this.state.notification.message}</div></div>
        }
        return (
            <li className={this.state.notification ? "delayed":""}>
                <div className="data">
                    <div className="title">
                        {this.props.entry.song.title}
                    </div>
                    <div className="duration">
                        {utils.formatTime(this.props.entry.song.duration)}
                    </div>
                </div>
                <div className="playlist-info">
                    <div className="play-time">
                        <i className="fa fa-clock-o"></i>
                        {utils.formatHourTime(this.props.timeOfPlay)}
                    </div>
                </div>
                <div className="controls">
                    <div className="remove control warning" onClick={this.handleRemove}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                    {message}
                </ReactCSSTransitionGroup>
            </li>
        );
    }
});

module.exports = PlaylistEntry;
