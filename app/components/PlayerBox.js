var $ = jQuery = require('jquery');
var React = require('react');
var Player = require('./Player');
var Playlist = require('./Playlist');
var Library = require('./Library');

var PlayerBox = React.createClass({
    getInitialState: function() {
        return {playerStatus: {playlist_entry: null,timing:0}, playlistEntries: {count: 0, results: []}, userCmd: {pause: false, skip: false}};
    },

    sendPlayerCommand : function(cmd, callback) {
        $.ajax({
        url: this.props.url + "playlist/player/manage/",
        dataType: 'json',
        type: 'PUT',
        data: cmd,
        success: function(data) {
            callback(true, cmd);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false, cmd);
            console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    removeEntry : function(entryId, callback) {
        $.ajax({
        url: this.props.url + "playlist/" + entryId + "/",
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
            callback(true);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false);
            console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },


    loadStatusFromServer: function() {
        $.ajax({
            url: this.props.url + "playlist/player/status/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({playerStatus: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
          url: this.props.url + "playlist/",
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({playlistEntries: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
        $.ajax({
            url: this.props.url + "playlist/player/manage/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({userCmd: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },

    componentDidMount: function() {
      this.loadStatusFromServer();
      setInterval(this.loadStatusFromServer, this.props.pollInterval);
    },

    render: function() {
        var playingId;
        if (this.state.playerStatus.playlist_entry){
            playingId = this.state.playerStatus.playlist_entry.id;
        }

        return (
            <div>
                <div id="playlist">
                    <Player playerStatus={this.state.playerStatus} sendPlayerCommand={this.sendPlayerCommand} userCmd={this.state.userCmd}/>
                    <Playlist entries={this.state.playlistEntries} playingId={playingId} removeEntry={this.removeEntry}/>
                </div>
                <div id="library">
                    <Library url={this.props.url} pollInterval={this.props.pollInterval} loadStatusFromServer={this.loadStatusFromServer}/>
                </div>
            </div>
        );
    }

}); 

module.exports = PlayerBox;