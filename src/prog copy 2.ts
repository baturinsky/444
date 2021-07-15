{
  const scale = 16;

  document.write(`<canvas id="C"/></canvas><div id="S"/>`)
  C.width = 192;
  C.height = 192;
  const d:CanvasRenderingContext2D = C.getContext("2d");
  const tetris = [0b00001111, 0b01100011, 0b01101100, 0b11100010, 0b01110010, 0b01100110];

  const o = (n) => new Array(n).fill(0);
  const bw = (a, b, c) => (a < b && b < c);
  const c4 = (a) => bw(-1, a, 4) ? a : 1e6;

  const shapes: number[][][] = []
  for (let s in tetris) {
    shapes[s] = [o(16).map((v, j) => ((1 << (~~(j / 4) - 4 + j % 4 * 4)) & tetris[s]) ? 1 : 0)];
    for (let r = 1; r < 5; r++) {
      shapes[s][r] = o(16).map((v, j) => shapes[s][r - 1][(4 * (j % 4)) + 3 - ~~(j / 4)])
    }
  }

  let grid: number[] = o(144),
    s = [~~(Math.random()*6), ~~(Math.random()*6)], r = 0,
    mp = [], flippable, i:number,score=0;

  d.lineWidth = 2;

  const render = (click?) => {    

    d.clearRect(0, 0, 1e3, 1e3);
    let fail, foo = [], flip;
    for (let draw of [, 1]) {
      if (draw){
        flippable = !fail && !(foo[0] && foo[1]);
        flip = click && flippable;
      }
      for (i in grid) {
        let x = i % 12, y = ~~(i / 12);
        let inside = bw(3, x, 8) && bw(3, y, 8);
        let under = shapes[s[1]][r][c4(y - mp[1]) * 4 + c4(x - mp[0])];
        let g = grid[i];
        if (under) {
          if (!inside)
            fail = true;
          foo[g] = 1;
        }
        if (draw) {
          if (flip && under) {
            grid[i] = 1-grid[i];
          }
          d.fillStyle = `hsl(${flippable?100:0},${under?1:0}00%,${shapes[s[0]][1][c4(y) * 4 + c4(x - 4)]? 2 : inside ? (g ? 8 : 4) : 6}0%)`

          /*let clr = (inside ? (g ? '#aaa' : '#000') : '#666');
          if(shapes[s[0]][1][c4(y) * 4 + c4(x - 4)])
            clr = '#444';
          let clra = clr.split("");
          if (under) {
            clra[flippable?2:1] = 'f'
          }
          d.fillStyle = ``
          clra.join("");*/
          d.fillRect(i % 12 * scale, (~~(i / 12)) * scale, scale, scale);
        }
      }
    }
    if (flip){
      s.unshift(~~(Math.random()*6));
      render();
      let whites = grid.reduce((a,b)=>a+b);
      score += (whites == 0 || whites==16)?16:1;      
    }
    S.innerHTML = `<bigger>Score:${score}`;
  }

  C.onmousemove = e => {
    mp = [~~(e.clientX / scale) - 2, ~~(e.clientY / scale) - 2];
    render();
  }

  C.onclick = e => { render(true); }

  C.onwheel = e => { r = (r + (e.deltaY > 0 ? 1 : 3)) % 4; render() }

  render();
}


/*
          let clr = (inside ? (g ? '#fff' : '#000') : '#aaa');
          if(shapes[s[0]][1][c4(y) * 4 + c4(x - 4)])
            clr = '#444';
          d.fillStyle = clr;
*/