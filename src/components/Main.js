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
});

var Board = React.createClass({
  getInitialState: function () {
    var size = 3;
    var boardSize = 300;
    var tileSize = boardSize/size;
    var board = [];
    for (var i = 0; i < (size * size) - 1; i++) {
      var x = Math.floor(i % size) * tileSize;
      var y = Math.floor(i / size) * tileSize;
      var pos = {x: x, y: y};
      board.push({number: i + 1, pos: pos})
    }
    return {
      emptyPos: {
        x: (size - 1) * tileSize,
        y: (size - 1) * tileSize
      },
      board: board,
      size: size,
      tileSize: tileSize,
      boardSize: boardSize
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
    var tileSize = this.state.tileSize;
    var nextShuffleMove = null;
    var shuffleMoves = Math.floor(Math.random() * (900 - 100) + 100);

    for (var i = 0; i < shuffleMoves; i++) {
      var emptyPos = this.state.emptyPos;

      if ((emptyPos.x === (size - 1) * tileSize) && (emptyPos.y === (size - 1) * tileSize)) {
        nextShuffleMove = Math.floor(Math.random() * 2 + 3) % 4;
      } else if ((emptyPos.x === 0) && (emptyPos.y === 0)) {
        nextShuffleMove = Math.floor(Math.random() * 2 + 1);
      } else if (emptyPos.x === (size - 1) * tileSize) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 2) % 4;
      } else if (emptyPos.y === (size - 1) * tileSize) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 3) % 4;
      } else if (emptyPos.y === 0) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 1) % 4;
      } else if (emptyPos.x === 0) {
        nextShuffleMove = Math.floor(Math.random() * 3 + 1) % 3;
      } else {
        nextShuffleMove = Math.floor(Math.random() * 4);
      }

      if (nextShuffleMove != null) {
        if (nextShuffleMove === 0) {
          //console.log("sus");
          this.shuffleIt(emptyPos.x, emptyPos.y - tileSize);
        } else if (nextShuffleMove === 1) {
          //console.log("dreapta");
          this.shuffleIt(emptyPos.x + tileSize, emptyPos.y);
        } else if (nextShuffleMove === 2) {
          //console.log("jos");
          this.shuffleIt(emptyPos.x, emptyPos.y + tileSize);
        } else {
          //console.log("stanga");
          this.shuffleIt(emptyPos.x - tileSize, emptyPos.y);
        }
      }
    }
  },

  componentDidMount: function () {
    this.executeShuffle();
  },

  onClickShuffle: function () {
    this.executeShuffle();
  },

  render: function () {
    var size = this.state.size;
    var tiles = [];
    var style = {width: this.state.boardSize, height: this.state.boardSize};

    for (var i = 0; i < (size * size) - 1; i++) {
      var tile = <Tile
        index={i}
        key={i}
        number={i+1}
        size={size}
        boardSize={this.state.boardSize}
        position={this.state.board[i].pos}
        tileSize={this.state.tileSize}
        onClick={this.onTileClick}/>;
      tiles.push(tile)
    }

    return (
      <div>
        <div className="board" style={style}>
          {tiles}
        </div>
        <div className="example">

        </div>
        <div>
        <button className="shuffle-btn" onClick={this.onClickShuffle}>
          Shuffle
        </button>
          </div>
      </div>);
  },

  onTileClick: function (index) {
    var isValidMove = this.isValidMove(this.state.board[index].pos, this.state.emptyPos)
    if (!isValidMove) {
      return alert('No good!Go home!')
    }
    var obj = this.state.board[index].pos;
    this.state.board[index].pos = this.state.emptyPos;
    this.state.emptyPos = obj;
    this.forceUpdate(function () {
      if (this.isWin()) {
        alert('We got big succes');
        this.executeShuffle();
      }
    });
  },

  isWin: function () {
    for(var i = 0; i< this.state.board.length; i++) {
      var x = this.state.board[i].pos.x / this.state.tileSize;
      var y = this.state.board[i].pos.y / this.state.tileSize;
      var size = this.state.size;
      if ((x+ y*size)!==this.state.board[i].number -1) {
        return false;
      }
    }
    return true;
  },

  isValidMove: function (startPos, targetPos) {
    var tileSize = this.state.tileSize;
    var diffX = Math.abs(targetPos.x - startPos.x);
    var diffY = Math.abs(targetPos.y - startPos.y);
    var validX = diffX === tileSize && diffY === 0;
    var validY = diffY === tileSize && diffX === 0;

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
    var index = this.props.index;
    var size = this.props.size;
    var tileSize = this.props.tileSize;
    var boardSize = this.props.boardSize;
    var x = -tileSize*index%boardSize;
    var y = -(tileSize*Math.floor(index/size));
    var style = {left: pos.x, top: pos.y, width: tileSize, height: tileSize, backgroundPositionX: x, backgroundPositionY: y};
    return (
      <div className="tile" style={style} onClick={this.onClick}>

      </div>);
  }

})

export default App;
