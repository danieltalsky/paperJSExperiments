var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 80;

var dampness = 0.999; // For dampening, of course.
var stiffness = 6.0;

var nodes = [];
var parents = [
    -1, 0, 0, 0, 3, 4, 5, 4, 2, 2
];

for (var i = 0; i < parents.length; i++) {
    nodes.push({
        path: new Path.Circle({
            center: new Point(Math.random() * view.size.width,
                              Math.random() * view.size.height),
            radius: 10,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity}),
        m: 10,
        v: new Point(0.0, 0.0),
        a: new Point(0.0, 0.0),
    });
    if (parents[i] == -1) {
        nodes[i].generation = 0;
    }
    if (parents[i] != -1) {
        nodes[i].parent = nodes[parents[i]];
        nodes[i].generation = nodes[i].parent.generation + 1;
        nodes[i].parentBranch = new Path({
            segments: [nodes[i].path.position, nodes[i].parent.path.position],
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity
        });
    }
}
nodes[0].path.strokeColor = "#ff6666";
nodes[0].m = 1000;
console.log(nodes);

function getForce(n1, n2, k, d, b) {
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

function accel(node1, node2, k, d, b) {
    node1.a += getForce(node1, node2, k, d, b)/node1.m;
    node2.a += getForce(node2, node1, k, d, b)/node2.m;
}

function onFrame(event) {
    //console.log(nodes[0].path.position);
    //console.log(nodes[0].v);
    //console.log(nodes[0].a); 
    for (var i = 0; i < nodes.length; i++) {
        if ("parent" in nodes[i]) {
            accel(nodes[i], nodes[i].parent, 3, depthDistance, dampness); // parent
            accel(nodes[i], nodes[0], 6, depthDistance * nodes[i].generation, dampness);  // origin
            for (var k = i + 1; k < nodes.length; k++) {
                if (nodes[i].generation == nodes[k].generation) {                
                    accel(nodes[i], nodes[k], 0.1, 2 * depthDistance * nodes[i].generation, dampness);
                }
            }
        }
    }
    for (var j = 0; j < nodes.length; j++) {
        nodes[j].v += nodes[j].a;
        nodes[j].a *= 0;
        nodes[j].path.position += nodes[j].v;
        if ("parent" in nodes[j]) {
            nodes[j].parentBranch.segments = [nodes[j].path.position, nodes[j].parent.path.position];
        }
    }
}       






