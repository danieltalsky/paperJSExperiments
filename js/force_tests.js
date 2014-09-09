var TGStrokeColor = '#98c8eb';
var TGOpacity = 0.5;
var TGStrokeWidth = 3;
var depthDistance = 40;
var dampness = 0.9; // For dampening, of course.

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
    childNodes: [
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
        }, 
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
		console.log(current.childNodes[i].id);        
        current.childNodes[i].path = new Path.Circle({
            center: new Point(Math.random() * view.size.width,
                              Math.random() * view.size.height),
            radius: 10,
            strokeColor: TGStrokeColor,
            strokeWidth: TGStrokeWidth,
            opacity: TGOpacity
        });
        // console.log(current.childNodes[i].id)
        current.childNodes[i].branch = new Path.Line(
            current.path.position,
            current.childNodes[i].path.position
        );
        current.childNodes[i].branch.strokeColor = TGStrokeColor;
        current.childNodes[i].branch.strokeWidth = TGStrokeWidth;
        current.childNodes[i].branch.opacity = TGOpacity;
        current.childNodes[i].parent = current;
        current.childNodes[i].velocity = new Point(0, 0);
        generationsArray[depth].push(current.childNodes[i]);
		traverse(current.childNodes[i], depth + 1);
    }
}
traverse(nodeTree, 0);
console.log(generationsArray);
/*
function rootForce(node, depth) {
    var vec = centerNode.position - node.position;
    var desiredDistance = depthDistance * (1 + depth);
    if (node.position.getDistance(centerNode.position) < desiredDistance) {
    	vec = -vec;
    }
    //console.log(node.velocity);
    node.velocity += vec * 1/1000;

}

function cousinForce(node, depth) {}

function parentForce(node) {
    //var vec = node.parent.position - node.position;
    // var normVec = vec.normalize();
    // var dist = node.position.getDistance(centerNode.position);
    //node.velocity += vec * 1/1000;
}

function moveNode(node) {
    //console.log(node.position);
    // console.log(node.velocity);
    node.velocity *= dampness;
    node.position += node.velocity;
    console.log(node.position);
}

/*
function onFrame(event) {
    // Only run every third of a second
    //console.log('hm');
    // if (event.time > lastTime + 0.3) {
    for (var i = 0; i < generationsArray.length; i++) {
        for (var j = 0; j <  generationsArray[i].length; j++) {
            var node = generationsArray[i][j];
            rootForce(generationsArray[i][j], i);
//            cousinForce(generationsArray[i][j], i);
//            parentForce(generationsArray[i][j]);
            moveNode(generationsArray[i][j]);
        };
    };
}
*/