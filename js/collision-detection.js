// Generalized logic from https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
function onSegment(p, q, r) 
{ 
    return (q.x <= Math.max(p.x, r.x) &&
		q.x >= Math.min(p.x, r.x) && 
		q.y <= Math.max(p.y, r.y) &&
		q.y >= Math.min(p.y, r.y));
} 
  
// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orientation(p, q, r) 
{ 
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
    // for details of below formula. 
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y); 
  
    if (val == 0) return 0; // colinear 
  
    return (val > 0)? 1: 2; // clock or counterclock wise 
} 
  
// The main function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
function edgesIntersect([p1, q1], [p2, q2]){ 
    // Find the four orientations needed for general and 
    // special cases 
    const o1 = orientation(p1, q1, p2); 
    const o2 = orientation(p1, q1, q2); 
    const o3 = orientation(p2, q2, p1); 
    const o4 = orientation(p2, q2, q1); 
  
    // General case 
    if (o1 != o2 && o3 != o4) 
        return true; 
  
    // Special Cases 
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true; 
  
    // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true; 
  
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true; 
  
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true; 
  
    return false; // Doesn't fall in any of the above cases 
}

function median(arr){
  const mid = Math.floor(arr.length / 2);
  const nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function isBetween(num, start, end){
	return num>=Math.min(start, end) && num<=Math.max(start, end);
}

function rangesOverlap(start1, end1, start2, end2){
	return isBetween(start1, start2, end2) || 
			isBetween(end1, start2, end2) || 
			isBetween(start2, start1, end1) || 
			isBetween(end2, start1, end1);
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

// Logic specific to RocketMaze
function detectRocketMazeCollisions(rocket, mazeEdges){
	return detectCollisions(getRocketEdges(rocket), mazeEdges);
}

function getRocketMazeCollisions(rocket, mazeEdges){
	return getCollisions(getRocketEdges(rocket), mazeEdges);
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

function getMazeEdges(maze, wallThickness){
	return maze.walls.map(wall=>getWallEdges(wall, wallThickness)).flat();
}

function getWallRectangle(wall, wallThickness){
	const rectangle = {
		x: wall.position.x-(wallThickness/2),
		y: wall.position.y-(wallThickness/2)
	};
	
	if(wall.direction==='x'){
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
	const wallVertices = getRectangeVertices(wallRectangle);
	
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

function detectCollisions(edges1, edges2){
	return edges1.some(edge1=>edges2.some(edge2=>edgesIntersect(edge1, edge2)));
}

function concatIfDefined(items, newItem){
	if(newItem!==undefined){
		return items.concat([newItem]);
	} else{
		return items;
	}
}

function getCollisions(edges1, edges2){
	return edges1.map(edge1=>edges2.reduce((allCollisions, edge2)=>concatIfDefined(allCollisions, getIntersection(edge1, edge2)), []));
}


