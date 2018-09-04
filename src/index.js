import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
  return (
    <button className={`${props.winnerClass} square`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares){
    const waysToWin = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for(let i=0; i<waysToWin.length; i++){
        const [a,b,c] = waysToWin[i];
        if(squares[a]!= null && squares[a] === squares[b] && squares[a] === squares[c]){
            return {winner: squares[a], winnerRow: waysToWin[i]};
        }
    }
    return {winner: null, winnerRow: null};
}

class Board extends React.Component {
    renderSquare(i) {
      const winnerClass = this.props.winnerSquares && 
      (this.props.winnerSquares[0] === i ||
        this.props.winnerSquares[1] === i ||
        this.props.winnerSquares[2] === i)
      ? 'square-blue' : '';

    return (
      <Square
        winnerClass={winnerClass}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createboard(rows, cols){
    const board = []
    let counter = 0;
    for(let i =0; i< rows; i++){
      let boardrow = []
      for(let j=0; j< cols; j++){
        boardrow.push(this.renderSquare(counter++));  
      }
      board.push(<div key={i} className="board-row">{boardrow}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>{this.createboard(3,3)}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isHovered: false,
    }
    this.handleHover = this.handleHover.bind(this);
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xisNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if(calculateWinner(squares).winner || squares[i]){
        return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleHover(){
    this.setState({
      isHovered: !this.state.isHovered
    });
  }

  render() {
    let status; 
    const history = this.state.history;
    const latest = history[this.state.stepNumber];
    const {winner, winnerRow} =  calculateWinner(latest.squares);
    // const winningtiles = calculateWinner2(latest.squares);
    

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move:
        'Go to game start';
      const btnClass = (move === this.state.stepNumber) ? 'thomas' : ''; 

      return (
        <li key={move}>
          <button className={btnClass} onClick={() => this.jumpTo(move)} >{desc}</button>
        </li>
      );
    });

    if(winner){
      status = winner + " wins!";
    }
    else if(history.length===10){
      status = "Draw!"
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          winnerSquares={winnerRow}
          squares={latest.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
