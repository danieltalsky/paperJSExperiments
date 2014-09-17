var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 80;

var dampness = 0.95; // For dampening, of course.
var stiffness = 6.0;

var nodes = [];
var parents = [
    -1, 0, 0, 0, 3, 4, 5, 4, 2, 9
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
        nodes[i].parentBranch = new Path.Line({
            from: nodes[i].path.position, 
            to: nodes[i].parent.path.position,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity});
    }
}

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
    // Vector2 F1 = -k * (xAbs - d) * (Vector2.Normalize(node2.p - node1.p) / xAbs) - b * (node1.v - node2.v);

    var x = n1.path.position - n2.path.position;
    var xAbs = n1.path.position.getDistance(n2.path.position);
    var v = n1.v - n2.v;
    return (x / xAbs) * (-k) * (xAbs - d) - (v * b);
}

function branchAccel(node, k, d, b) {

    node.a += getForce(node, node.parent, k, d, b)/node.m;
    node.parent.a += getForce(node.parent, node, k, d, b)/node.parent.m;
}

function originAccel(node, k, d, b) {
    node.a += getForce(node, nodes[0], k, node.generation * d, b)/node.m;
    nodes[0].a += getForce(nodes[0], node, k, node.generation * d, b)/nodes[0].m;
}    

function onFrame(event) {
    //console.log(nodes[0].path.position);
    //console.log(nodes[0].v);
    //console.log(nodes[0].a); 
    for (var i = 0; i < nodes.length; i++) {
        if ("parent" in nodes[i]) {
            branchAccel(nodes[i], 1, depthDistance, dampness);
            // originAccel(nodes[i], 1, depthDistance, dampness);
        }
    }
    for (var j = 0; j < nodes.length; j++) {
        nodes[j].v += nodes[j].a;
        nodes[j].a *= 0;
        nodes[j].path.position += nodes[j].v;
    }
}       






