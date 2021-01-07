const levels = [
	{
		// This is not a real level, but for simplicity, I want the real levels to be numbered from 1
	},
	{
		width: 600,
		height: 800,
		maxScore: 20,
		startPosition: {
			x: 300,
			y: 500,
		},
		finishPosition: {
			x: 300,
			y: 300,
		},
		walls: [],
		wallsShorthand: [
			'200,1,1,RDDLUU'
		]
	},
	{
		width: 800,
		height: 600,
		maxScore: 50,
		startPosition: {
			x: 225,
			y: 375,
		},
		finishPosition: {
			x: 675,
			y: 375,
		},
		walls: [],
		wallsShorthand: [
			'150,1,2,DRURRDRUULLLLD'
		]
	},
	{
		width: 600,
		height: 800,
		maxScore: 100,
		startPosition: {
			x: 225,
			y: 375,
		},
		finishPosition: {
			x: 225,
			y: 550,
		},
		walls: [],
		wallsShorthand: [
			'150,2,2,DD',
			'150,2,3,LUURRDDDDLLUU'
		]
	}
];

function generateExteriorWalls(maze){
	addWall(maze, 0, 0, maze.width, 'x');
	addWall(maze, 0, 0, maze.height, 'y');
	addWall(maze, 0, maze.height, maze.width, 'x');
	addWall(maze, maze.width, 0, maze.height, 'y');
}

function generateWallsFromShorthand(maze){
	maze.wallsShorthand = maze.wallsShorthand || [];
	maze.wallsShorthand.forEach(shorthand=>{
		const parts = shorthand.split(',');
		const scale = parseInt(parts[0]);
		const startX = scale * parseInt(parts[1]);
		const startY = scale * parseInt(parts[2]);
		const path = parts[3].split('');
		
		let currentPosition = {x: startX, y: startY};
		
		path.forEach(direction=>{
			const orientation = ['L','R'].includes(direction)?'x':'y';
			const nextPosition = {...currentPosition}
			switch(direction){
				case 'U': nextPosition.y-=scale; break;
				case 'D': nextPosition.y+=scale; break;
				case 'L': nextPosition.x-=scale; break;
				case 'R': nextPosition.x+=scale; break;
			}
			
			if(['D','R'].includes(direction)){
				// If we're moving down or right, then the top-right corner of the wall is in the currentPosition
				addWall(maze, currentPosition.x, currentPosition.y, scale, orientation);
			} else{
				// If we're moving up or left, then the top-right corner of the wall is in the nextPosition
				addWall(maze, nextPosition.x, nextPosition.y, scale, orientation);
			}
			currentPosition = nextPosition;
		});
	});
}

function addWall(maze, x, y, length, orientation){
	maze.walls = maze.walls || [];
	maze.walls.push({
		position: {
			x,
			y
		},
		length,
		orientation
	});
}

function generateMazeWalls(){
	levels.forEach(level=>{
		// In the config we do not have to specify that the mazes have exterior walls, but we generate them here so the ship can't float out of the maze
		generateExteriorWalls(level);
		// Generate proper JSON wall elements from shorthand
		generateWallsFromShorthand(level);
	});
}
