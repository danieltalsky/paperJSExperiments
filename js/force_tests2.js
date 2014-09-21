var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
nodeSize = 10;
var depthDistance = 50;
var gravConst = 15.0;

var dampness = 0.999; // For dampening, of course.

var nodes = [];
var parents = [-1, 0, 0, 0, 1, 3, 3, 2, 2, 4, 4, 4, 9, 9, 10, 10, 
               10, 11, 12, 12, 12, 13, 13, 13, 13, 24, 24, 24, 14, 
               14, 14, 14, 15, 15, 15, 18, 18, 19, 19, 20, 20, 20, 
               21, 21, 22, 22, 23, 27, 27, 26, 26, 25, 29, 29, 33, 
               37, 37, 37, 43, 43, 43, 45, 45, 45, 22, 11, 55, 59, 
               59, 59, 60, 28, 28, 36, 36, 36, 55, 55, 67, 67, 67, 
               68, 69, 69, 61, 47, 47, 16, 31, 16, 68, 39, 31, 31, 
               39, 39, 7, 7, 7, 8, 8, 8, 97, 97, 97, 16, 32, 40,
               17, 17, 80, 80, 82, 17, 73, 51, 40, 58, 5, 91, 73, 
               95, 25, 94, 5, 44, 64, 46, 87, 98, 87, 94, 87, 118, 
               96, 98, 57, 74, 101, 118, 96, 90, 72, 105, 109, 101, 
               91, 58, 85, 38, 44, 108, 101, 100, 98, 103, 101, 
               118, 100, 99, 66, 30, 72, 129, 90, 109, 66, 30, 135, 
               129, 58, 42, 112, 96, 109, 122, 114, 90, 108, 106, 
               151, 126, 151, 99, 111, 129, 124, 102, 65, 142, 34, 
               157, 142, 102, 104, 125, 145, 48, 52, 156, 122, 114, 
               88, 103, 124, 92, 104, 33, 49, 49, 88, 163, 71, 177, 
               166, 71, 170, 137, 194, 111, 185, 112, 137, 188, 
               192, 114, 185, 174, 189, 192, 166, 162, 189, 89, 
               153, 174, 186, 125, 213, 76, 162, 52, 116, 116, 186, 
               176, 200, 180, 32, 194, 206, 197, 197, 54, 64, 200, 
               83, 51, 83, 201, 149, 41, 26, 23, 163, 86, 222, 201, 
               176, 113, 105, 178, 207, 252, 60, 170, 41, 140, 220, 
               49, 197, 23, 68, 32, 48, 216, 142, 196, 92, 91, 225, 
               146, 147, 128, 216, 204, 146, 161, 68, 213, 86, 216, 
               212, 256, 267, 126, 220, 136, 136, 232, 279, 279, 
               147, 261, 40, 172];


function addOriginNode() {
    var parentID = parents.shift();
    nodes.push({
        path: new Path.Circle({  
            center: view.size / 2,
            radius: nodeSize,
            strokeColor: "#330000",
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity}),
        m: 100,
        v: new Point(0,0),
        a: new Point(0.0, 0.0),
        generation: 0        
    }); 
}
    
function addNode() {
    var parentID = parents.shift();
    console.log('Parent: ' + parentID);
    var i = nodes.length;
    var spawnvec = nodes[parentID].path.position - nodes[parentID].parent.path.position + (Point.random() * 2 - 1);
    spawnvec.length = depthDistance / 2;
    nodes.push({
        parent: nodes[parentID],
        generation: nodes[parentID].generation + 1,
        path: new Path.Circle({  // Spawn near parent's position
            center: nodes[parentID].path.position + spawnvec,
            radius: nodeSize,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity}),
        m: 10,
        v: new Point(0,0),
        a: new Point(0.0, 0.0),
    }); 
    nodes[i].parentBranch = new Path({
        segments: [nodes[i].path.position, nodes[i].parent.path.position],
        strokeColor: TGStrokeColor,
        strokeWidth: TGStrokeWidth,
        opacity: TGOpacity
    });
    //console.log(nodes[i]);
}

function forceSpring(n1, n2, k, d, b) {
    // F = -k(|x|-d)(x/|x|) - bv
    // k: spring tightness coeff
    // d: desired distance of separation
    // x: distance
    // b: dampening coeff
    // |x|: distance between the two points connected to the spring
    // x/|x|: unit length direction vector between the two points: a to b, when applying the force to point a and vice versa.
    // v: relative velocity between the two points connected by the spring

    var x = n1.path.position - n2.path.position;
    var xAbs = n1.path.position.getDistance(n2.path.position);
    var v = n1.v - n2.v;
    return (x / xAbs) * (-k) * (xAbs - d) - (v * b);
}

    
function accelSpring(n1, n2, k, d, b) {
    n1.a += forceSpring(n1, n2, k, d, b)/n1.m;
    n2.a += forceSpring(n2, n1, k, d, b)/n2.m;
}

function forceGrav(n1, n2) {
    // F = m1 * m2 / d^2
    // var ang = n1.path.position.getDirectedAngle(n2.path.position);  // WTFFFFF
    var diff = (n1.path.position - n2.path.position).normalize();
    var force = n1.m * n2.m / n1.path.position.getDistance(n2.path.position, true);
    return diff * force; 
}

function accelGrav(n1, n2) {
    if (n1.path.position.isClose(n2.path.position, nodeSize * 4)) {
        // These are computationally expensive so only do it to nodes that are close
        n1.a += forceGrav(n1, n2) * gravConst / n1.m;
        n2.a += forceGrav(n2, n1) * gravConst / n2.m;
    }
}

function onMouseDown(event) {
    addNode();
}

addOriginNode(); // Start with origin

function onFrame(event) {
    //console.log(nodes[0].path.position);
    //console.log(nodes[0].v);
    //console.log(nodes[0].a);
    
    // Accelerate all the nodes
    for (var i = 0; i < nodes.length; i++) {
        if ("parent" in nodes[i]) {
            accelSpring(nodes[i], nodes[i].parent, 0.5, depthDistance, dampness); // parent
            accelSpring(nodes[i], nodes[0], 6, depthDistance * nodes[i].generation, dampness);  // origin
        }
        for (var k = i + 1; k < nodes.length; k++) {  // space 'em out
            accelGrav(nodes[i], nodes[k]);
        }
    }
    
    // Move all the nodes
    for (var j = 0; j < nodes.length; j++) {
        nodes[j].v += nodes[j].a;
        nodes[j].a *= 0;
        nodes[j].path.position += nodes[j].v;
        if ("parent" in nodes[j]) { // ...and the branches
            nodes[j].parentBranch.segments = [nodes[j].path.position, nodes[j].parent.path.position];
        }
    }
}       






