// src/lib/mazeUtils.ts

export type Cell = 0 | 1;
export type Position = { x: number; y: number };
export type MazeItem = { x: number; y: number; aksara: string; isCorrect: boolean };

// Algoritma Pengacakan Super Aman untuk Safari
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateMaze(size: number) {
  const maze: Cell[][] = Array(size).fill(1).map(() => Array(size).fill(1));
  
  const carve = (x: number, y: number) => {
    maze[y][x] = 0;
    
    const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    shuffleArray(dirs);

    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (ny > 0 && ny < size - 1 && nx > 0 && nx < size - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  };

  carve(1, 1);
  maze[size - 2][size - 2] = 0; 
  return maze;
}

// PERUBAHAN DINAMIS: Menerima kata yang benar dan daftar kata jebakan
export function populateItems(
  maze: Cell[][], 
  size: number,
  correctWord: string,
  wrongWords: string[]
): MazeItem[] {
  const items: MazeItem[] = [];

  // 1. CARI JALUR UTAMA (BFS)
  const queue: { x: number; y: number; path: string[] }[] = [{ x: 1, y: 1, path: ["1,1"] }];
  const visited = new Set<string>(["1,1"]);
  let solutionPath: {x: number, y: number}[] = [];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift()!;
    if (x === size - 2 && y === size - 2) {
      solutionPath = path.map(p => {
        const [px, py] = p.split(',').map(Number);
        return {x: px, y: py};
      });
      break;
    }

    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (ny >= 0 && ny < size && nx >= 0 && nx < size) {
        if (maze[ny][nx] === 0 && !visited.has(`${nx},${ny}`)) {
          visited.add(`${nx},${ny}`);
          queue.push({ x: nx, y: ny, path: [...path, `${nx},${ny}`] });
        }
      }
    }
  }

  // 2. PASANG GERBANG UJIAN DI PERSIMPANGAN
  const occupiedPositions = new Set<string>();

  for (let i = 0; i < solutionPath.length - 1; i++) {
    const current = solutionPath[i];
    const next = solutionPath[i + 1];
    const prev = i > 0 ? solutionPath[i - 1] : null;

    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const openPaths = [];
    
    for (const [dx, dy] of dirs) {
      const nx = current.x + dx, ny = current.y + dy;
      if (maze[ny][nx] === 0) {
        openPaths.push({x: nx, y: ny});
      }
    }

    const forwardPaths = openPaths.filter(p => !(prev && p.x === prev.x && p.y === prev.y));

    if (forwardPaths.length > 1) {
      forwardPaths.forEach(path => {
        const posKey = `${path.x},${path.y}`;
        
        if (!occupiedPositions.has(posKey)) {
          occupiedPositions.add(posKey);
          
          if (path.x === next.x && path.y === next.y) {
            // Pasang kata yang benar di jalur keluar
            items.push({ x: path.x, y: path.y, aksara: correctWord, isCorrect: true });
          } else {
            // Pasang kata jebakan di jalur buntu
            items.push({ 
              x: path.x, 
              y: path.y, 
              aksara: wrongWords[Math.floor(Math.random() * wrongWords.length)], 
              isCorrect: false 
            });
          }
        }
      });
    }
  }

  return items;
}