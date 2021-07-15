const scl = 16;

document.write(`<canvas id="C"/></canvas>`)
const C = document.getElementById("C") as HTMLCanvasElement;
C.width = 1e3;
C.height = 1e3;
const d = C.getContext("2d");
const tetris = [0x00001111, 0b11100111, 0b01111110, 0b11100010, 0b01100110];

const o:(n:number)=>number[] = (n) => new Array(n).fill(0);
let grid = o(4).map(_=>o(4))
//const mod = (a,b) => ((a%b)+b)%b;

const shapes: number[][][][] = []
for (let i in tetris) {
  shapes[i] = [];
  shapes[i][0] = o(4).map((v, y) => (o(4).map((w,x) => (1 << (x - 5 + 4 * y) & tetris[i] ? 1 : 0))))
  for (let r = 1; r < 4; r++) {    
    shapes[i][r] = o(4).map((v, y) => (o(4).map((w,x) => shapes[i][r - 1][x][3-y])))
  }
}

console.log(JSON.stringify(shapes));
console.log(JSON.stringify(grid));

let r = 0;

const render = () => {
  d.clearRect(0, 0, 1e3, 1e3);
  for (let x = 0; x < 12; x++) {
    for (let y = 0; y < 12; y++) {
    if (x>3 && y>3 && (grid[y-4]||[])[x-4])
      d.fillRect(x * scl, y * scl, scl, scl);
    }
  }
}


render();