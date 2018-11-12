

class App{

  constructor(){
    this.game = new Minesweeper(10, 10);

  }

  restart(){
    this.game.reset();
    DiffDom.shouldRender()
  }
  render(){
    return <div>
      <button id="start-btn" type="button" class="action-btn js-new-game" aria-label="New game" onClick={this.restart.bind(this)}>
          <span class="default-emoji">{this.game.stateEmoji()}</span>
          <span id="result" class="result-emoji"></span>
      </button>
      <div>
        {this.game.render()}
      </div>
    </div>
  }
}
