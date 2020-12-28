const levels = [
	{
		width: 800,
		height: 600,
		startPosition: {
			x: 250,
			y: 350,
		},
		walls: [
			{
				position: {
					x: 200,
					y: 400,
				},
				length: 100,
				direction: 'x'
			},
			{
				position: {
					x: 200,
					y: 300,
				},
				length: 100,
				direction: 'y'
			},
			{
				position: {
					x: 300,
					y: 300,
				},
				length: 100,
				direction: 'y'
			},
		]
	}
];

function generateExteriorWalls(maze){
	maze.walls.push({
		position: {
			x: 0,
			y: 0,
		},
		length: maze.width,
		direction: 'x'
	});
	maze.walls.push({
		position: {
			x: 0,
			y: 0,
		},
		length: maze.height,
		direction: 'y'
	});
	maze.walls.push({
		position: {
			x: 0,
			y: maze.height,
		},
		length: maze.width,
		direction: 'x'
	});
	maze.walls.push({
		position: {
			x: maze.width,
			y: 0,
		},
		length: maze.height,
		direction: 'y'
	});
}

function generateMazeWalls(){
	// In the config we do not have to specify that the mazes have exterior walls, but we generate them here so the ship can't float out of the maze
	levels.forEach(generateExteriorWalls);
}
