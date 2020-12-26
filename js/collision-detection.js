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

// Logic specific to RocketMaze
function detectRocketMazeCollisions(rocket, mazeEdges){
	return detectCollisions(getRocketEdges(rocket), mazeEdges);
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
