import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const GreedySpiders = () => {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('playing');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bees, setBees] = useState([]);
  const [spiders, setSpiders] = useState([]);
  const [message, setMessage] = useState('');

  const initLevel = (lvl) => {
    if (lvl === 1) {
      // Simple web: hexagonal pattern
      const newNodes = [
        { id: 0, x: 300, y: 100 },  // top center
        { id: 1, x: 200, y: 180 },  // top left
        { id: 2, x: 400, y: 180 },  // top right
        { id: 3, x: 150, y: 280 },  // middle left
        { id: 4, x: 300, y: 280 },  // center
        { id: 5, x: 450, y: 280 },  // middle right
        { id: 6, x: 200, y: 380 },  // bottom left
        { id: 7, x: 400, y: 380 }   // bottom right
      ];

      const newEdges = [
        { id: 0, from: 0, to: 1, broken: false },
        { id: 1, from: 0, to: 2, broken: false },
        { id: 2, from: 1, to: 2, broken: false },
        { id: 3, from: 1, to: 3, broken: false },
        { id: 4, from: 1, to: 4, broken: false },
        { id: 5, from: 2, to: 4, broken: false },
        { id: 6, from: 2, to: 5, broken: false },
        { id: 7, from: 3, to: 4, broken: false },
        { id: 8, from: 4, to: 5, broken: false },
        { id: 9, from: 3, to: 6, broken: false },
        { id: 10, from: 4, to: 6, broken: false },
        { id: 11, from: 4, to: 7, broken: false },
        { id: 12, from: 5, to: 7, broken: false },
        { id: 13, from: 6, to: 7, broken: false }
      ];

      const newBees = [
        { id: 1, nodeId: 0 },
        { id: 2, nodeId: 5 }
      ];

      const newSpiders = [
        { id: 1, nodeId: 6 }
      ];

      setNodes(newNodes);
      setEdges(newEdges);
      setBees(newBees);
      setSpiders(newSpiders);
    } else if (lvl === 2) {
      // More complex web
      const newNodes = [
        { id: 0, x: 300, y: 80 },   // top
        { id: 1, x: 180, y: 150 },
        { id: 2, x: 300, y: 150 },
        { id: 3, x: 420, y: 150 },
        { id: 4, x: 120, y: 240 },
        { id: 5, x: 240, y: 240 },
        { id: 6, x: 360, y: 240 },
        { id: 7, x: 480, y: 240 },
        { id: 8, x: 180, y: 330 },
        { id: 9, x: 300, y: 330 },
        { id: 10, x: 420, y: 330 },
        { id: 11, x: 300, y: 410 }  // bottom
      ];

      const newEdges = [
        { id: 0, from: 0, to: 1, broken: false },
        { id: 1, from: 0, to: 2, broken: false },
        { id: 2, from: 0, to: 3, broken: false },
        { id: 3, from: 1, to: 2, broken: false },
        { id: 4, from: 2, to: 3, broken: false },
        { id: 5, from: 1, to: 4, broken: false },
        { id: 6, from: 1, to: 5, broken: false },
        { id: 7, from: 2, to: 5, broken: false },
        { id: 8, from: 2, to: 6, broken: false },
        { id: 9, from: 3, to: 6, broken: false },
        { id: 10, from: 3, to: 7, broken: false },
        { id: 11, from: 4, to: 5, broken: false },
        { id: 12, from: 5, to: 6, broken: false },
        { id: 13, from: 6, to: 7, broken: false },
        { id: 14, from: 4, to: 8, broken: false },
        { id: 15, from: 5, to: 8, broken: false },
        { id: 16, from: 5, to: 9, broken: false },
        { id: 17, from: 6, to: 9, broken: false },
        { id: 18, from: 6, to: 10, broken: false },
        { id: 19, from: 7, to: 10, broken: false },
        { id: 20, from: 8, to: 9, broken: false },
        { id: 21, from: 9, to: 10, broken: false },
        { id: 22, from: 8, to: 11, broken: false },
        { id: 23, from: 9, to: 11, broken: false },
        { id: 24, from: 10, to: 11, broken: false }
      ];

      const newBees = [
        { id: 1, nodeId: 0 },
        { id: 2, nodeId: 3 },
        { id: 3, nodeId: 7 }
      ];

      const newSpiders = [
        { id: 1, nodeId: 11 },
        { id: 2, nodeId: 4 }
      ];

      setNodes(newNodes);
      setEdges(newEdges);
      setBees(newBees);
      setSpiders(newSpiders);
    }
    setGameState('playing');
    setMessage('Break web strands to free the bees!');
  };

  useEffect(() => {
    initLevel(level);
  }, [level]);

  // BFS to find shortest path between nodes
  const findShortestPath = (fromNodeId, toNodeId, currentEdges) => {
    const queue = [[fromNodeId]];
    const visited = new Set([fromNodeId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === toNodeId) {
        return path;
      }

      // Find connected nodes through unbroken edges
      const neighbors = currentEdges
        .filter(e => !e.broken && (e.from === node || e.to === node))
        .map(e => e.from === node ? e.to : e.from);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null; // No path found
  };

  const breakStrand = (edgeId) => {
    if (gameState !== 'playing') return;

    // Break the edge
    const newEdges = edges.map(e => 
      e.id === edgeId ? { ...e, broken: true } : e
    );
    setEdges(newEdges);

    // Check if any bees are now isolated (freed)
    const freedBeeIds = [];
    const newBees = bees.map(bee => {
      const beeNode = bee.nodeId;
      // Check if bee has any unbroken edges connected
      const hasConnection = newEdges.some(e => 
        !e.broken && (e.from === beeNode || e.to === beeNode)
      );
      
      if (!hasConnection && !bee.freed) {
        freedBeeIds.push(bee.id);
        return { ...bee, freed: true };
      }
      return bee;
    });
    setBees(newBees);

    // Move each spider towards nearest non-freed bee
    const newSpiders = spiders.map(spider => {
      const trappedBees = newBees.filter(b => !b.freed);
      if (trappedBees.length === 0) return spider;

      // Find nearest bee (shortest path)
      let nearestBee = null;
      let shortestPath = null;

      for (const bee of trappedBees) {
        const path = findShortestPath(spider.nodeId, bee.nodeId, newEdges);
        if (path && (!shortestPath || path.length < shortestPath.length)) {
          shortestPath = path;
          nearestBee = bee;
        }
      }

      // Move one step towards nearest bee
      if (shortestPath && shortestPath.length > 1) {
        return { ...spider, nodeId: shortestPath[1] };
      }

      return spider;
    });
    setSpiders(newSpiders);

    // Check win condition
    if (newBees.every(b => b.freed)) {
      setGameState('won');
      setMessage('🎉 All bees are free!');
      return;
    }

    // Check loss condition (spider on same node as bee)
    const caught = newBees.some(bee => {
      if (bee.freed) return false;
      return newSpiders.some(spider => spider.nodeId === bee.nodeId);
    });

    if (caught) {
      setGameState('lost');
      setMessage('💀 A spider caught a bee!');
    }
  };

  const resetLevel = () => {
    initLevel(level);
  };

  const nextLevel = () => {
    if (level < 2) {
      setLevel(level + 1);
    } else {
      setMessage('🎊 You beat all levels! Restarting...');
      setTimeout(() => setLevel(1), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-amber-900">Greedy Spiders</h1>
          <button
            onClick={resetLevel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="mb-4 text-center">
          <p className="text-lg font-semibold text-amber-800">Level {level}</p>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <svg width="600" height="450" className="border-2 border-amber-300 rounded bg-gradient-to-br from-amber-50 to-yellow-50">
          {/* Draw edges */}
          {edges.map(edge => {
            if (edge.broken) return null;
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            return (
              <g key={edge.id}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#94a3b8"
                  strokeWidth="4"
                  className="cursor-pointer hover:stroke-red-500 transition-colors"
                  onClick={() => breakStrand(edge.id)}
                />
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map(node => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r="8"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="2"
            />
          ))}

          {/* Draw bees */}
          {bees.map(bee => {
            const node = nodes.find(n => n.id === bee.nodeId);
            return (
              <g key={bee.id}>
                {bee.freed ? (
                  <>
                    <circle cx={node.x} cy={node.y} r="18" fill="#fbbf24" opacity="0.2" />
                    <text x={node.x - 12} y={node.y + 8} fontSize="24">🐝</text>
                    <text x={node.x + 15} y={node.y - 10} fontSize="20">✨</text>
                  </>
                ) : (
                  <>
                    <circle cx={node.x} cy={node.y} r="18" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
                    <text x={node.x - 12} y={node.y + 8} fontSize="24">🐝</text>
                  </>
                )}
              </g>
            );
          })}

          {/* Draw spiders */}
          {spiders.map(spider => {
            const node = nodes.find(n => n.id === spider.nodeId);
            return (
              <g key={spider.id}>
                <circle cx={node.x} cy={node.y} r="22" fill="#1f2937" />
                <circle cx={node.x - 6} cy={node.y - 6} r="3" fill="#ef4444" />
                <circle cx={node.x + 6} cy={node.y - 6} r="3" fill="#ef4444" />
                {/* Spider legs */}
                <line x1={node.x - 22} y1={node.y - 10} x2={node.x - 35} y2={node.y - 20} stroke="#1f2937" strokeWidth="3" />
                <line x1={node.x - 22} y1={node.y} x2={node.x - 35} y2={node.y} stroke="#1f2937" strokeWidth="3" />
                <line x1={node.x - 22} y1={node.y + 10} x2={node.x - 35} y2={node.y + 20} stroke="#1f2937" strokeWidth="3" />
                <line x1={node.x + 22} y1={node.y - 10} x2={node.x + 35} y2={node.y - 20} stroke="#1f2937" strokeWidth="3" />
                <line x1={node.x + 22} y1={node.y} x2={node.x + 35} y2={node.y} stroke="#1f2937" strokeWidth="3" />
                <line x1={node.x + 22} y1={node.y + 10} x2={node.x + 35} y2={node.y + 20} stroke="#1f2937" strokeWidth="3" />
              </g>
            );
          })}
        </svg>

        {gameState === 'won' && (
          <div className="mt-4 text-center">
            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600"
            >
              {level < 2 ? 'Next Level →' : 'Play Again'}
            </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="mt-4 text-center">
            <button
              onClick={resetLevel}
              className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-amber-100 rounded-lg">
          <h3 className="font-bold text-amber-900 mb-2">How to Play:</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>🕸️ Click on web strands (lines) to break them</li>
            <li>🕷️ Spiders move along the web toward nearest bee after each break</li>
            <li>🐝 Free a bee by isolating it (break all strands connected to it)</li>
            <li>✨ Win by freeing all bees before spiders reach them!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GreedySpiders;