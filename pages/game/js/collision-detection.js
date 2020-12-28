function getRocketCollisions(rocket, edges){
	return getCollisions(getRocketEdges(rocket), edges);
}

function getCollisions(edges1, edges2){
	return edges1.map(edge1=>edges2.reduce((allCollisions, edge2)=>concatIfDefined(allCollisions, getIntersection(edge1, edge2)), [])).flat();
}

function getIntersection([start1, end1], [start2, end2]){
	// If the lines are not in the same area, we do an early exit
	if(!rangesOverlap(start1.x, end1.x, start2.x, end2.x) || !rangesOverlap(start1.y, end1.y, start2.y, end2.y)){
		return undefined;
	}
	
	const dx1 = end1.x-start1.x;
	const dy1 = end1.y-start1.y;
	const dx2 = end2.x-start2.x;
	const dy2 = end2.y-start2.y;
	
	if(dx1===0 && dx2===0){ // Both lines are vertical
		if(start1.x === start2.x){ // Lines are colinear
			return {x: start1.x, y: median([start1.y, end1.y, start2.y, end2.y])}
		} else { // Lines are parralel
			return undefined;
		}
	}
	
	const k1 = dy1/dx1;
	const k2 = dy2/dx2;
	const n1 = start1.y - k1 * start1.x;
	const n2 = start2.y - k2 * start2.x;
	
	let intersectionX;
	if(dx1===0){ // Line 1 is vertical
		intersectionX = start1.x;
	} else if(dx2===0){ // Line 2 is vertical
		intersectionX = start2.x;
	} else if(k1===k2){
		if(n1===n2){ // Lines are colinear
			return {x: median([start1.x, end1.x, start2.x, end2.x]), y: median([start1.y, end1.y, start2.y, end2.y])}
		} else{ // Lines are parralel
			return undefined;
		}
	} else{ // General case: Random lines in random directions
		intersectionX = (n2-n1)/(k1-k2);
	}
	
	const intersectionY = k1 * intersectionX + n1;
	
	if(isBetween(intersectionX, start1.x, end1.x) &&
		isBetween(intersectionX, start2.x, end2.x) &&
		isBetween(intersectionY, start1.y, end1.y) &&
		isBetween(intersectionY, start2.y, end2.y)){
			// Lines actually do intersect
		return [intersectionX, intersectionY];
	}
	
	// Lines don't reach each other
	return undefined;
}

function getRocketEdges(rocket){
	// Relative positions of rocket shape vertices from the center
	const rocketVertexOffsets=[
		{
			x: 0,
			y: -30
		},
		{
			x: 20,
			y: 30
		},
		{
			x: 0,
			y: 20
		},
		{
			x: -20,
			y: 30
		},
	];
	
	// Figure out their relative positions given the rocket's rotation
	const rotatedOffsets = rocketVertexOffsets.map(x=>rotateVector(x, rocket.rotation));
	// Get actual vertex positions by adding offsets to position of rocket's centre
	const positionedVertices = rotatedOffsets.map(x=>addVectors(x, rocket.position));
	
	return getClosedPathEdges(positionedVertices);
}

function getMazeWallEdges(maze, wallThickness){
	return maze.walls.map(wall=>getWallEdges(wall, wallThickness)).flat();
}

function getMazeFinishEdges(maze){
	return getClosedPathEdges(getRectangleVertices(getFinishRectangle(maze)));
}

function getFinishRectangle(maze){
	const finishSize = 50;
	return {
		x: maze.finishPosition.x - finishSize/2,
		y: maze.finishPosition.y - finishSize/2,
		width: finishSize,
		height: finishSize
	};
}

function getWallRectangle(wall, wallThickness){
	const rectangle = {
		x: wall.position.x-(wallThickness/2),
		y: wall.position.y-(wallThickness/2)
	};
	
	if(wall.orientation==='x'){
		rectangle.width = wall.length+wallThickness;
		rectangle.height = wallThickness;
	} else{
		rectangle.width = wallThickness;
		rectangle.height = wall.length+wallThickness;
	}
	
	return rectangle;
}

function getWallEdges(wall, wallThickness){
	const wallRectangle = getWallRectangle(wall, wallThickness);
	const wallVertices = getRectangleVertices(wallRectangle);
	
	return getClosedPathEdges(wallVertices);
}

function getClosedPathEdges(vertices){
	const edges=[];
	for(let i=0;i<vertices.length;i++){
		const previousVertex = (i>0) ? vertices[i-1] : vertices[vertices.length-1];
		const thisVertex = vertices[i];
		
		edges.push([previousVertex, thisVertex]);
	}
	
	return edges;
}

function getRectangleVertices(rectangle){
	return [
		{
			x: rectangle.x,
			y: rectangle.y,
		},
		{
			x: rectangle.x+rectangle.width,
			y: rectangle.y,
		},
		{
			x: rectangle.x+rectangle.width,
			y: rectangle.y+rectangle.height,
		},
		{
			x: rectangle.x,
			y: rectangle.y+rectangle.height,
		},
	];
}
