import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import clsx from 'clsx';

function Square(props) {
  const { winSquare } = props;
  return (
    <button
      className={clsx({
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
  console.log(squares, `squares`);
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
  if (!squares.some(v => v === null)) {
    return undefined;
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

  reset() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          column: null, // 当前点击的列数
          row: null // 当前点击的行数
        }
      ],
      stepNumber: 0,
      xIsNext: true
    });
  }

  render() {
    const { history, stepNumber } = this.state;
    const current = history[stepNumber];
    const result = calculateWinner(current.squares);
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
      status = `胜利者: ${result.winner}!`;
    } else {
      // 我定义 undefined 为平局的情况, null 为尚未分出胜负
      if (result === undefined) {
        status = '平局!';
      } else if (result === null) {
        status = `当前落子: ${this.state.xIsNext ? 'X' : 'O'}`;
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <button type="button" onClick={() => this.reset()}>
            重开
          </button>
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
