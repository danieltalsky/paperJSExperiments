var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 40;

var MASS = 100;

/*
Simple tree
*/

var nodeTree = {
    id: 1,
    path: new Path.Circle({
        center: view.center,
        radius: 10,
        strokeColor: 'red',
        strokeWidth: TGStrokeWidth,
        opacity: TGOpacity
    }),
    a: new Point(0,0),
    v: new Point(0,0),
    m: 10000,
    childNodes: [ /*
        {
            id: 123,
            childNodes: [
                {
                    id: 223,
                    childNodes: []
                },
                {
                    id: 224,
                    childNodes: []
                },
                {
                    id: 225,
                    childNodes: []
                }
            ]
        },
        {
            id: 124,
            childNodes: [
                {
                    id: 226,
                    childNodes: []
                },
                {
                    id: 227,
                    childNodes: [
                        {
                            id: 333,
                            childNodes: []
                        },
                        {
                            id: 334,
                            childNodes: []
                        }
                    ]
                }
            ]
        }, */
        {
            id: 125,
            childNodes: []
        } 
    ] //end childNodes
};


var generationsArray = [];
function traverse(current, depth) {
    
    // if it doesn't exist but there are children
    if (typeof generationsArray[depth] == 'undefined' && current.childNodes.length !== 0) {
        generationsArray[depth] = [];
    }
    for (var i = 0; i < current.childNodes.length; i++) {

        current.childNodes[i].path = new Path.Circle({
            center: new Point(Math.random() * view.size.width,
                              Math.random() * view.size.height),
            radius: 10,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity
        });

        current.childNodes[i].branch = new Path.Line({
            from: current.path.position,
            to: current.childNodes[i].path.position, 
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity
        });

        current.childNodes[i].anchorStrings = new Path.Line({
            from: nodeTree.path.position,
            to: current.childNodes[i].path.position, 
            strokeColor: '#f0f0f0',
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity
        });        
        
        current.childNodes[i].parent = current;
        current.childNodes[i].a = new Point(0, 0);
        current.childNodes[i].v = new Point(0, 0);
        current.childNodes[i].m = MASS;
        generationsArray[depth].push(current.childNodes[i]);
		traverse(current.childNodes[i], depth + 1);
    }
}
traverse(nodeTree, 0);

function parentForce(node) {
/*
    F = -k(|x|-d)(x/|x|) - bv
    k: spring tightness coeff
    dd: desired distance of separation
    x: norm'd direction
    xAbs: distance
    b: dampening coeff

    Vector2 F1 = -k * (xAbs - d) * (Vector2.Normalize(node2.p - node1.p) / xAbs) - b * (node1.v - node2.v);
*/
    var k = 3;
    var dd = depthDistance;
    var x = (node.parent.path.position - node.path.position).normalize();
    var xAbs = node.path.position.getDistance(node.parent.path.position);
    var b = 0.03;
    var v = node.v - node.parent.v;
    var F1 =  k * (xAbs - dd) * (x / xAbs) + v * b;
    var F2 = -k * (xAbs - dd) * (x / xAbs) - v * b;
    node.a        += F1/node.m;
    node.parent.a += F2/node.parent.m;
    console.log('k', k, 'dd', dd, 'x', x, '|x|', xAbs, 'b', b, 'v', v, 'F', F1, 'a', node.a);
    // console.log(node.v, node.parent.v);
};

/*
function rootForce(node, depth) {
    var vec = nodeTree.path.position - node.path.position;
    var desiredDistance = depthDistance * (1 + depth);
    if (node.path.position.getDistance(nodeTree.path.position) < desiredDistance) {
    	vec = -vec;
    };
    node.velocity += vec * rootForceCoeff;
};
*/
function moveNode(node) {
    node.v += node.a;
    node.path.position += node.v;
    node.branch.to += node.v;  // WHY DOESN'T THIS WORK
    node.a *= 0;  // Reset acceleration
}

console.log(generationsArray);
console.log(nodeTree);

function onFrame(event) {
    for (var i = 0; i < generationsArray.length; i++) {
        for (var j = 0; j <  generationsArray[i].length; j++) {
/*            rootForce(generationsArray[i][j], i);
            for (var k = j + 1; k < generationsArray[i].length; k++) {
                var vec = generationsArray[i][j].path.position - generationsArray[i][k].path.position;
                generationsArray[i][j].velocity += vec * cousinForceCoeff;
            };
*/            parentForce(generationsArray[i][j]);
            moveNode(generationsArray[i][j]);
        };
    };
}
