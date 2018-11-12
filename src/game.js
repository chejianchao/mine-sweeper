
//console.log(' Eg: `game = new Game(10, 10, 10, ["🌱", "💥", "🚩", "◻️"], false)`')
//console.log(' Or: `game = new Game(16, 16, 30, ["🐣", "💣", "🚧", "◻️"], true)`')

let CELL_ICON = ["◻️",'1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', "💥", "🚩", "💣", "🐣" ]
const FLIP_ICON = 12
const FLAG_ICON = 10
const MINE_ICON = 11
const EXPL_ICON = 9
const BOMB_ICON = 11
let GAME_STATE_START = 0
let GAME_STATE_GAMEOVER = 1
const GAME_STATE_WIN  = 2
class Minesweeper extends Component{

  constructor(n, m){
    super();
    this.reset(n, m)
  }

  mineHash(x, y ){
    return this.n *x+y
  }

  checkMine(x, y){
    return this.mine_pos[this.n * x + y] === 1
  }

  display(){
    this.panel.forEach((row)=>{
      console.log(row.map(n=>CELL_ICON[n]).join(" "))
    } )
  }
  render(){
    this.checkWin();
    /*return this.panel.map((row,ri)=>{
      //console.log(row.map(n=>CELL_ICON[n]).join(" "))
      return row.map((n,ci)=>`<div class="cell" data-id="${ri*1000+ci}">${CELL_ICON[n]}</div>`).join("")
    } ).join("")*/
    const dom= <div className="grid" style={`grid-template-columns: repeat(${this.m}, auto)`} oncontextmenu={this.onContextmenu.bind(this)}>
          {
            this.panel.map((row,ri)=>{
            //console.log(row.map(n=>CELL_ICON[n]).join(" "))
            return row.map((n,ci)=><div className="cell" data-id={ri*1000+ci} onClick={this.onSearch.bind(this)}>{CELL_ICON[n]}</div>)
          }
        )
      }</div>
    return dom
  }
  setCellStatus(x, y, flag, force){
      this.panel[x][y] = flag
  }

  onSearch(event){
    const id = parseInt(event.target.dataset.id);
    if( !id && id != 0 ) return;
    //console.log(id)
    const x = parseInt(id/1000);
    const y = id%1000;
    DiffDom.shouldRender();
    /*this.setState((prevState)=>{
      return {"setState":1}
    }, (s)=>{console.log("after set state :",s)})*/
    this.search(x,y);
  }
  search(x, y){
    if( this.state != GAME_STATE_START ){
      return console.log("GAME IS END", this.state)
    }
    if( x < 0 || y < 0 || x>= this.matrix.length || y >= this.matrix[0].length ){
      //console.log("input the wrong position, try again")
      return;
    }
    if( this.matrix[x][y] === 1){
      this.gameover(x, y);
      return;
    }
    let dx = [ 1,1,1,0,0,-1,-1,-1]
    let dy = [ 1,-1,0,1,-1,1,0,-1]

    let mine_pos = []
    let empty_slot = []
    for(let i =0; i<8; i++){
      let nx = x+dx[i]
      let ny = y+dy[i]
      if( nx < 0 || ny < 0 || nx>= this.matrix.length || ny >= this.matrix[0].length || (this.panel[nx][ny] != 0 && this.panel[nx][ny] != FLAG_ICON) ){
        continue;
      }
      if( this.checkMine(nx, ny) )
        mine_pos.push([nx,ny])
      else
        empty_slot.push([nx,ny])
    }
    if( mine_pos.length == 0 ){
      this.setCellStatus( x, y, FLIP_ICON, true )
      empty_slot.forEach(([x, y])=>{
        this.search(x, y)
      } )
    }else{
      this.setCellStatus( x, y, mine_pos.length, true )
    }

  }

  changeState(state){
    if( state == GAME_STATE_START){
      this.reset();
    }else{
      this.state = state
    }
  }
  showAllBomb(){
    this.matrix.forEach((row,r)=>row.forEach((col,c)=>this.matrix[r][c] === 1 ? (this.panel[r][c] = BOMB_ICON):""  ))
  }

  gameover(x, y){

    this.showAllBomb();
    this.setCellStatus(x, y, EXPL_ICON)
    this.changeState(GAME_STATE_GAMEOVER)
  }
  checkWin(){
    if( this.state != GAME_STATE_START ) return;
    let flag_num = 0, bomb_num = Object.keys(this.mine_pos).length, flag_bomb_num = 0;
    for( let i = 0; i<this.n; i++){
      for( let j = 0; j< this.m; j++){
        if( this.panel[i][j] == FLAG_ICON){
          if( this.matrix[i][j] == 1 )
            flag_bomb_num++;
          flag_num++;
        }
        if( this.panel[i][j] == 0 ){

          return;
        }
      }
    }
    let win = flag_num == bomb_num && bomb_num == flag_bomb_num;

    if( win ){
      this.changeState(GAME_STATE_WIN)
    }
  }
  onContextmenu(event){
    event.preventDefault();
    const id = parseInt(event.target.dataset.id);
    const x = parseInt(id/1000);
    const y = id%1000;
    //this.setState({})
    this.setFlag(x, y);
    DiffDom.shouldRender();
    return false;
  }
  setFlag(x, y){
    const val = this.panel[x][y];
    if( val == FLAG_ICON )
      this.panel[x][y] = 0;
    else if( val == 0 )
      this.panel[x][y] = FLAG_ICON;
  }
  reset(n, m){
    this.n = n || 10
    this.m = m || 10
    this.matrix = []
    this.mine_pos= {}
    this.panel = []
    this.state = GAME_STATE_START

    //this.
    let mine_rate = 0.3
    const x = parseInt(this.n/2)
    const y = parseInt(this.m/2)
    for(let i = 0; i<this.n; i++){
      let row = []
      let panel_row = []
      for( let j = 0; j<this.m; j++){

        if(  Math.random() > mine_rate ||(Math.abs(i-x) <= 1 && Math.abs(j-y) <= 1) )
          row.push(0)
        else{
          this.mine_pos[this.mineHash(i, j)] = 1
          row.push(1)
        }
        panel_row.push(0)
      }
      this.matrix.push(row)
      this.panel.push(panel_row)
    }
    this.search(x, y);
  }

  stateEmoji(){
    if( this.state === GAME_STATE_WIN )
      return '😎'
    else if( this.state === GAME_STATE_GAMEOVER)
      return '😵'
    else
      return '😀';
  }
}

/*
let app = new Minesweeper(10,10)

app.display()


const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

rl.on('line', _ => {
    console.log(_)
    rl.prompt()
})

rl.prompt()
*/
