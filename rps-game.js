class RpsGame {

    constructor(p1, p2) {
        this._players = [p1, p2];
        this._turns = [null, null];
        this._sP1 = 0;
        this._sP2 = 0;

        this._sendToPlayers('Game Starts!');

        this._players.forEach((player, idx) => {
            player.on('turn', (turn) => {
                this._onTurn(idx, turn);
            })
        });
    }

    _sendToSinglePlayer(playerIndex, msg) {
        this._players[playerIndex].emit('message', msg);
    }

    _sendToPlayers(msg) {
        this._players.forEach((player) => {
            player.emit('message', msg);
        })
    }

    _onTurn(playerIndex, turn) {
        this._turns[playerIndex] = turn;
        this._sendToSinglePlayer(playerIndex, 'You selected the ' + turn);

        this._checkGameOver();
    }

    _checkGameOver() {
        const turns = this._turns;

        if(turns[0] && turns[1]) {
            this._sendToPlayers(turns.join(' : '));
            this._gameResult();
            this._turns = [null, null];
            this._sendToPlayers('Next Round!');
        }
    }

    _gameResult() {
        const p0 = this._decodeTurn(this._turns[0]);
        const p1 = this._decodeTurn(this._turns[1]);

        const distance = ( p1 - p0 + 3 ) % 3;

        switch (distance) {
            case 0:
                //draw
                this._sendToPlayers('Draw');
                break;
            case 1:
                //p0 wins
                this._sP1 += 1;
                this._sendWinnerMessage(this._players[0], this._players[1], this._sP1, this._sP2);
                break;
            case 2:
                //p1 wins
                this._sP2 += 1;
                this._sendWinnerMessage(this._players[1], this._players[0], this._sP2, this._sP1);
                break;
        }

        if(this._sP1 === 5 || this._sP2 === 5) {

            this._sP1 = 0;
            this._sP2 = 0;
        }
    }

    _sendWinnerMessage(winner, loser, scoreOfWinner, scoreOfLoser) {
        winner.emit('message', 'You won! score : ' + scoreOfWinner);
        loser.emit('message', 'You lost. score : ' + scoreOfLoser);
    }

    _decodeTurn(turn) {
        switch (turn) {
            case 'rock':
                return 0;
            case 'scissors':
                return 1;
            case 'paper':
                return 2;
            default:
                throw new Error('Could not decode ' + turn);
        }   
    }
}

module.exports = RpsGame;