require('normalize.css');
require('styles/App.css');

import React from 'react';

var App = React.createClass({

  render: function () {
    return (
      <div>
        <Board />

      </div>);
  }

})

var Board = React.createClass({
  getInitialState: function () {
    var size = 5;
    var board = [];
    for (var i = 0; i < (size * size) - 1; i++) {
      var x = Math.floor(i % size) * 100;
      var y = Math.floor(i / size) * 100;
      var pos = {x: x, y: y};
      board.push({number: i + 1, pos: pos})
    }
    return {
      emptyPos: {
        x: (size - 1) * 100,
        y: (size - 1) * 100
      },
      board: board,
      size: size
    }
  },

  shuffleIt: function (x, y) {
    var size = this.state.size;

    for (var i = 0; i < (size * size) - 1; i++) {
      if ((this.state.board[i].pos.x === x) && (this.state.board[i].pos.y === y)) {
        this.onTileClick(this.state.board[i].number - 1);
        return;
      }
    }
  },

  executeShuffle: function () {
    var size = this.state.size;
    var nextShuffleMove = null;
    var shuffleMoves = Math.floor(Math.random() * (500 - 100) + 100);

    for (var i = 0; i < shuffleMoves; i++) {
      var emptyPos = this.state.emptyPos;
      if ((emptyPos.x === (size - 1) * 100) && (emptyPos.y === (size - 1) * 100)) {
        nextShuffleMove = Math.floor(Math.random() * 2 + 3) % 4;
      } else if ((emptyPos.x === 0) && (emptyPos.y === 0)) {
        nextShuffleMove = Math.floor(Math.random() * 2 + 1);
      } else if (emptyPos.x === (size - 1) * 100) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 2) % 4;
      } else if (emptyPos.y === (size - 1) * 100) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 3) % 4;
      } else if (emptyPos.x === 0) {
        nextShuffleMove = Math.floor(Math.random() * (4 - 1) + 1) % 4;
      } else if (emptyPos.y === 0) {
        nextShuffleMove = Math.floor(Math.random() * (4 - 1) + 1) % 3;
      } else {
        nextShuffleMove = Math.floor(Math.random() * 4);
      }

      if (nextShuffleMove != null) {
        if (nextShuffleMove === 0) {
          //console.log("sus");
          this.shuffleIt(emptyPos.x, emptyPos.y - 100);
        } else if (nextShuffleMove === 1) {
          //console.log("dreapta");
          this.shuffleIt(emptyPos.x + 100, emptyPos.y);
        } else if (nextShuffleMove === 2) {
          //console.log("jos");
          this.shuffleIt(emptyPos.x, emptyPos.y + 100);
        } else {
          //console.log("stanga");
          this.shuffleIt(emptyPos.x - 100, emptyPos.y);
        }
      }
    }
  },

  componentDidMount: function () {
    this.executeShuffle();
  },

  render: function () {
    var size = this.state.size;
    var tiles = [];
    for (var i = 0; i < (size * size) - 1; i++) {
      var tile = <Tile
        index={i}
        key={i}
        number={i+1}
        position={this.state.board[i].pos}
        onClick={this.onTileClick}
      />
      tiles.push(tile)
    }

    return (
      <div>
        <div className="board">
          {tiles}
        </div>
      </div>);
  },

  onTileClick: function (index) {
    var isValidMove = this.isValidMove(this.state.board[index].pos, this.state.emptyPos)
    if (!isValidMove) {
      return alert('No good!Go home!')
    }
    var obj = {};
    obj = this.state.board[index].pos;
    this.state.board[index].pos = this.state.emptyPos;
    this.state.emptyPos = obj;
    this.forceUpdate();
  },

  isValidMove: function (startPos, targetPos) {
    var diffX = Math.abs(targetPos.x - startPos.x);
    var diffY = Math.abs(targetPos.y - startPos.y);
    var validX = diffX === 100 && diffY === 0;
    var validY = diffY === 100 && diffX === 0;

    if (validX || validY) {
      return true;
    }

    return false
  }


});

var Tile = React.createClass({

  onClick: function () {
    this.props.onClick(this.props.index)
  },

  render: function () {
    var pos = this.props.position;
    var style = {left: pos.x, top: pos.y};
    var number = this.props.number;
    return (
      <div className="tile" style={style} onClick={this.onClick}>
        <span>{ number }</span>
      </div>);
  }

})

export default App;
