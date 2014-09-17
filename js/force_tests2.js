var numNodes = 10;

var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 40;

var dampness = 0.9; // For dampening, of course.
var rootForceCoeff = 0.01;
var cousinForceCoeff = 0.0001;
var parentForceCoeff = 0.000;

var nodes = [];
var parents = [
    -1, 0, 0, 0, 3, 4, 5, 4, 2, 9
];

for (var i = 0; i < numNodes; i++) {
    nodes.push({
        path: new Path.Circle({
            center: new Point(Math.random() * view.size.width,
                              Math.random() * view.size.height),
            radius: 10,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity}),
        m: 100,
        v: new Point(6 * Math.random()-3,
                     6 * Math.random()-3),
        a: new Point(0.0, 0.0),
    });
    if (parents[i] != -1) {
        nodes[i].parent = nodes[parents[i]];
        nodes[i].parentBranch = new Path.Line({
            from: nodes[i].path.position, 
            to: nodes[i].parent.path.position,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity});
    }
}

function accelNode(node) {
    
}

function moveNode(node) {
    accelNode(node);
    node.path.position += node.v;
}

function onFrame(event) {
    for (var i = 0; i < nodes.length; i++) {
            //parentForce(generationsArray[i][j]);
            moveNode(nodes[i]);
    }
}

//    F = -k(|x|-d)(x/|x|) - bv
//    k: spring tightness coeff
//    d: desired distance of separation
//    x: distance
//    b: dampening coeff
//    Vector2 F1 = -k * (xAbs - d) * (Vector2.Normalize(node2.p - node1.p) / xAbs) - b * (node1.v - node2.v);
/*
function parentForce(node) {
    var k = 0.9;
    var d = depthDistance;
    var x = node.parent.path.position - node.path.position;
    var b = 0.9;
    node.velocity += -k * vec * parentForceCoeff;
}

function moveNode(node) {
    node.path.position += node.velocity;
    node.branch.to += node.velocity;  // WHY DOESN'T THIS WORK
}

function onFrame(event) {
    for (var i = 0; i < generationsArray.length; i++) {
        for (var j = 0; j <  generationsArray[i].length; j++) {
            rootForce(generationsArray[i][j], i);
            for (var k = j + 1; k < generationsArray[i].length; k++) {
                var vec = generationsArray[i][j].path.position - generationsArray[i][k].path.position;
                generationsArray[i][j].velocity += vec * cousinForceCoeff;
            };
            parentForce(generationsArray[i][j]);
            moveNode(generationsArray[i][j]);
        };
    };
}
*/