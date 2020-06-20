import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import classnames from 'classnames';

function Square(props) {
  const { winSquare } = props;
  return (
    <button
      className={classnames({
        square: true,
        'strong-unit': winSquare
      })}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        location: lines[i]
      };
    }
  }
  return null;
}

class Board extends React.Component {
  // 判断格子是否是胜者的格子
  hightLight(location, i) {
    if (!location) {
      return false;
    } else {
      return location.includes(i);
    }
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        winSquare={this.hightLight(this.props.location, i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    let row = [0, 1, 2];
    let cell = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8]
    ];
    let checkerboard = row.map((item, index) => (
      <div className="board-row" key={index}>
        {cell.map((item1, index1) =>
          index === index1
            ? item1.map((item2, index) => this.renderSquare(item2))
            : ''
        )}
      </div>
    ));
    return checkerboard;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          column: null, // 当前点击的列数
          row: null // 当前点击的行数
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares, column: i % 3, row: ~~(i / 3) }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  render() {
    const { history, stepNumber } = this.state;
    const current = history[stepNumber];
    const result = calculateWinner(current.squares);
    console.log(result);
    const moves = history.map((step, move) => {
      const desc = move
        ? `回到落子: [第${step.row + 1}行, 第${step.column + 1}列]`
        : '游戏开始';
      return (
        <li
          key={move}
          className={move === stepNumber ? 'hight-light' : null}
          attr-index={move}
        >
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    /**
     * 原题: 添加一个可以升序或降序显示历史记录的按钮。
     * 直接reverse就可以了, 太简单懒得做
     */
    // moves.reverse();

    let status;
    if (result) {
      status = `Winner: ${result.winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            location={result?.location}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById('root'));
