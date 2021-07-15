{
  const scale = 32;
  C.width = 12 * scale;
  C.height = 12 * scale;
  const zeroes = (n) => new Array(n).fill(0);
  const between = (a, b, c) => a < b && b < c;
  const c4 = (a) => between(-1, a, 4) ? a : 1e6;
  const d = C.getContext("2d");
  const binaryTetris = [15, 99, 108, 226, 114, 102];
  const tetrisShapes = [];
  for (let s in binaryTetris) {
    tetrisShapes[s] = [zeroes(16).map((v, j) => 1 << ~~(j / 4) - 4 + j % 4 * 4 & binaryTetris[s] ? 1 : 0)];
    for (let r = 1; r < 5; r++) {
      tetrisShapes[s][r] = zeroes(16).map((v, j) => tetrisShapes[s][r - 1][4 * (j % 4) + 3 - ~~(j / 4)]);
    }
  }
  let turn = 0, positions = [zeroes(144)], shapesOrder = zeroes(1e3).map((_) => ~~(Math.random() * 6)), mousePosition = [], rotation = 0, flippable, undos = 0;
  const update = (click) => {
    let grid = positions[turn];
    positions[turn + 1] = grid.slice();
    d.clearRect(0, 0, 1e3, 1e3);
    let unflippable, foo = [], flip;
    for (let secondPass of [, 1]) {
      if (secondPass) {
        flippable = !unflippable && !(foo[0] && foo[1]) && turn < 100;
        flip = click && flippable;
        positions[0] = zeroes(144);
      }
      for (let i in grid) {
        let x = i % 12, y = ~~(i / 12);
        let inside = between(3, x, 8) && between(3, y, 8);
        let under = tetrisShapes[shapesOrder[turn]][rotation][c4(y - mousePosition[1]) * 4 + c4(x - mousePosition[0])];
        let g = grid[i];
        if (under) {
          if (!inside)
            unflippable = true;
          foo[g] = 1;
        }
        if (secondPass) {
          if (flip && under)
            positions[turn + 1][i] = 1 - grid[i];
          d.fillStyle = `hsl(${flippable ? 100 : 0},${under && turn < 100 ? 1 : 0}00%,${inside ? g ? 8 : 4 : 6}0%)`;
          d.fillRect(i % 12 * scale, ~~(i / 12) * scale, scale, scale);
        }
      }
    }
    if (flip) {
      turn++;
      update();
    }
    S.innerHTML = `${turn}/100 $${positions.slice(1, turn + 1).map((grid2) => grid2.reduce((a, b) => a + b) % 16 ? 1 : 16).reduce((a, b) => a + b, 0) - undos}`;
  };
  C.onmousemove = (e) => {
    mousePosition = [~~(e.offsetX / scale - 1.5), ~~(e.offsetY / scale - 1.5)];
    update();
  };
  C.onmousedown = (e) => e.button ? turn && (undos++, turn--, update()) : update(true);
  C.onwheel = (e) => {
    rotation = (rotation + (e.deltaY > 0 ? 1 : 3)) % 4;
    update();
  };
  update();
}
