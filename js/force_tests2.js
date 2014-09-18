var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 80;

var dampness = 0.999; // For dampening, of course.

var nodes = [];
var parents = [-1, 0, 0, 0, 1, 3, 3, 2, 2, 4, 4, 4, 
               11, 11, 12, 12, 12, 13, 14, 14, 14, 
               15, 15, 15, 15, 28, 28, 28, 17, 17, 
               17, 17, 18, 18, 18, 22, 22, 23, 23, 
               24, 24, 24, 25, 25, 26, 26, 27, 31, 
               31, 30, 30, 29, 33, 33, 37, 43, 43, 
               43, 49, 49, 49, 52, 52, 52, 26, 13, 
               70, 74, 74, 74, 75, 32, 32, 40, 40, 
               40, 70, 70, 82, 82, 82, 83, 84, 84, 
               76, 56, 56, 19, 35, 19, 83, 45, 35, 
               35, 45, 45, 8, 8, 8, 9, 9, 9, 130, 
               130, 130, 19, 36, 46, 20, 20, 99, 99, 
               101, 20, 92, 63, 46, 73, 5, 115, 92, 
               126, 29, 120, 5, 51, 79, 54, 111, 131, 
               111, 120, 111, 160, 129, 131, 72, 93, 
               135, 160, 129, 114, 90, 140, 146, 135, 
               115, 73, 108, 44, 51, 145, 135, 134, 
               131, 138, 135, 160, 134, 133, 81, 34, 
               90, 174, 114, 146, 81, 34, 181, 174, 
               73, 48, 151, 129, 146, 167, 154, 114, 
               145, 141, 201, 171, 201, 133, 148, 174, 
               169, 137, 80, 188, 38, 207, 188, 137, 
               139, 170, 194, 57, 65, 206, 167, 154, 
               112, 138, 169, 116, 139, 37, 58, 58, 
               112, 216, 89, 235, 219, 89, 225, 183, 
               259, 148, 246, 151, 183, 252, 257, 154, 
               246, 230, 253, 257, 219, 213, 253, 113, 
               203, 230, 247, 170, 286, 95, 213, 65, 
               158, 158, 247, 234, 267, 239, 36, 259, 
               274, 263, 263, 68, 79, 267, 102, 63, 
               102, 268, 198, 47, 30, 27, 216, 109, 
               296, 268, 234, 153, 140, 237, 276, 332, 
               75, 225, 47, 186, 294, 58, 263, 27, 83, 
               36, 57, 289, 188, 261, 116, 115, 299, 
               195, 196, 173, 289, 271, 195, 212, 83, 
               286, 109, 289, 284, 336, 351, 171, 294, 
               182, 182, 306, 371, 371, 196, 344, 46, 228];

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
        console.log(nodes[i]);
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






