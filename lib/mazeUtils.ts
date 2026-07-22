// src/lib/mazeUtils.ts

export type Cell = 0 | 1;
export type Position = { x: number; y: number };
export type MazeItem = { x: number; y: number; aksara: string; isCorrect: boolean };

// Algoritma Pengacakan Safari-Friendly
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateMaze(size: number) {
  // 1 = Tembok, 0 = Jalan
  const maze: Cell[][] = Array(size).fill(1).map(() => Array(size).fill(1));
  
  // ALGORITMA PRIM'S
  const walls: {x: number, y: number, px: number, py: number}[] = [];
  maze[1][1] = 0; // Titik Awal
  
  const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];
  for (let [dx, dy] of dirs) {
    if (1 + dy > 0 && 1 + dy < size - 1 && 1 + dx > 0 && 1 + dx < size - 1) {
      walls.push({ x: 1 + dx, y: 1 + dy, px: 1, py: 1 });
    }
  }
  
  while(walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length);
    const {x, y, px, py} = walls[randomIndex];
    walls.splice(randomIndex, 1);
    
    if (maze[y][x] === 1) {
      maze[y][x] = 0;
      maze[(y + py)/2][(x + px)/2] = 0; 
      
      for (let [dx, dy] of dirs) {
        const nx = x + dx, ny = y + dy;
        if (ny > 0 && ny < size - 1 && nx > 0 && nx < size - 1 && maze[ny][nx] === 1) {
          walls.push({x: nx, y: ny, px: x, py: y});
        }
      }
    }
  }
  
  maze[size - 2][size - 2] = 0; // Titik Keluar
  return maze;
}

function getDeepPosition(maze: Cell[][], startX: number, startY: number, prevX: number, prevY: number, maxDepth: number): Position {
  let currentX = startX;
  let currentY = startY;
  let pX = prevX;
  let pY = prevY;

  for (let step = 0; step < maxDepth - 1; step++) {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const nextSteps = [];
    
    for (const [dx, dy] of dirs) {
      const nx = currentX + dx, ny = currentY + dy;
      if (maze[ny][nx] === 0 && !(nx === pX && ny === pY)) {
        nextSteps.push({x: nx, y: ny});
      }
    }
    
    if (nextSteps.length === 0) break;
    
    const nextPos = nextSteps[Math.floor(Math.random() * nextSteps.length)];
    pX = currentX;
    pY = currentY;
    currentX = nextPos.x;
    currentY = nextPos.y;
  }
  return { x: currentX, y: currentY };
}

export function populateItems(
  maze: Cell[][], 
  size: number,
  correctSequence: string[],
  wrongWords: string[],
  // ========================================================
  // PERUBAHAN KRUSIAL: trapDepth diubah dari 3 menjadi 1
  // Agar kata-kata membentuk "gerbang" tepat di bibir persimpangan
  // ========================================================
  trapDepth: number = 1 
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

  // 2. PASANG GERBANG UJIAN
  const occupiedPositions = new Set<string>();
  let intersectionCount = 0; 

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
      forwardPaths.forEach(step1Pos => {
        let itemX = step1Pos.x;
        let itemY = step1Pos.y;

        if (step1Pos.x === next.x && step1Pos.y === next.y) {
          // LOGIKA JALUR BENAR
          const targetIndex = Math.min(i + trapDepth, solutionPath.length - 1);
          itemX = solutionPath[targetIndex].x;
          itemY = solutionPath[targetIndex].y;
          
          const posKey = `${itemX},${itemY}`;
          if (!occupiedPositions.has(posKey)) {
            occupiedPositions.add(posKey);
            
            const wordToUse = correctSequence[intersectionCount % correctSequence.length]; 
            items.push({ x: itemX, y: itemY, aksara: wordToUse, isCorrect: true });
          }
        } else {
          // LOGIKA JALUR SALAH
          const deepPos = getDeepPosition(maze, step1Pos.x, step1Pos.y, current.x, current.y, trapDepth);
          itemX = deepPos.x;
          itemY = deepPos.y;

          const posKey = `${itemX},${itemY}`;
          if (!occupiedPositions.has(posKey)) {
            occupiedPositions.add(posKey);
            const safeWrongWords = wrongWords.length > 0 ? wrongWords : ["ꦧꦥꦏ꧀"];
            items.push({ 
              x: itemX, 
              y: itemY, 
              aksara: safeWrongWords[Math.floor(Math.random() * safeWrongWords.length)], 
              isCorrect: false 
            });
          }
        }
      });
      intersectionCount++; 
    }
  }

  return items;
}