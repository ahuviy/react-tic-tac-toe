/*global _*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            key={props.key}
            className={props.highlight ? "square highlight" : "square"}
            onClick={() => props.onClick()}>
                {props.value}
        </button>
    );
}

class Board extends React.Component {
    render() {
        return (
            <div>
                {this.props.squares.map((row, i) => {
                    return (
                        <div key={i} className="board-row">
                            {row.map((col, j) => Square({
                                value: this.props.squares[i][j],
                                onClick: () => this.props.onClick(i, j),
                                key: j,
                                highlight: this.props.winnerSquares && this.props.winnerSquares.find(sq => sq[0] === i && sq[1] === j)
                            }))}
                        </div>
                    );
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [
                {
                    squares: [
                        Array(3).fill(null),
                        Array(3).fill(null),
                        Array(3).fill(null)
                    ]
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            ascending: false
        };
    }
    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = _.cloneDeep(current.squares);
        if (calculateWinner(squares) || squares[i][j]) {
            return;
        }
        squares[i][j] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                { squares: squares }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    toggleSort() {
        let newState = _.cloneDeep(this.state);
        newState.ascending = !newState.ascending;
        this.setState(newState);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;
        let winnerSquares;
        if (winner) {
            status = 'Winner: ' + winner.id;
            winnerSquares = winner.squares;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const desc = move ? `Move #${move}` : 'Game start';
            return (
                <li key={move} className={this.state.stepNumber === move ? 'bold' : ''}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });
        if (this.state.ascending) {
            moves.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnerSquares={winnerSquares}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.toggleSort()}>sort</button>
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

function calculateWinner(squares) {
    const lines = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
    ];
    for (let i = 0; i < lines.length; i++) {
        let [a, b, c] = lines[i];
        let s1 = squares[a[0]][a[1]];
        let s2 = squares[b[0]][b[1]];
        let s3 = squares[c[0]][c[1]];
        if (s1 && s1 === s2 && s1 === s3) {
            return {
                id: s1,
                squares: lines[i]
            };
        }
    }
    return null;
}
