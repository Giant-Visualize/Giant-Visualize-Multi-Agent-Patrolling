function Position(x, y) {
    var position = {};
    position.x = x;
    position.y = y;
    return position;
}

function agent(id, x, y) {
    var agent = {};
    agent.id = id;
    agent.x = x;
    agent.y = y;
    return agent;
}

function move(agentInfo, array) {
    //agent id->path  key value mapping
    var matrix = [];//copy an array
    for (var m = 0; m < array.length; m++) {
        matrix[m] = array[m].slice();
    }
    //var matrix = array.copyWithin(array);
    var map = new Map();
    for (var i = 0; i < agentInfo.length; i++) {
        map.set(agentInfo[i].id, findAPath(agentInfo[i].x, agentInfo[i].y, array));
    }
    //stack is a map agent.id->path   path is an array
    return map;
}

function findAPath(x, y, array) {
    var matrix = [];
    //copy an array
    for (var m = 0; m < array.length; m++) {
        matrix[m] = array[m].slice();
    }

    var stackX = [];//Stack
    var stackY = [];//stack
    stackX.push(x);
    stackY.push(y);
    var path = [];//List
    path.push(Position(x, y));
    visited(x, y, matrix);

    while (stackX.length > 0) {
        var tempX = stackX[stackX.length - 1];
        var tempY = stackY[stackY.length - 1];

        for (var i = 0; i < 4; i++) {
            if (hasAnOutlet(tempX, tempY, i, matrix)) {
                switch (i) {
                    case 0: visited(tempX - 1, tempY, matrix);
                        stackX.push(tempX - 1);
                        stackY.push(tempY);
                        path.push(Position(tempX - 1, tempY));
                        break;
                    case 1: visited(tempX, tempY + 1, matrix);
                        stackX.push(tempX);
                        stackY.push(tempY + 1);
                        path.push(Position(tempX, tempY + 1));
                        break;
                    case 2: visited(tempX + 1, tempY, matrix);
                        stackX.push(tempX + 1);
                        stackY.push(tempY);
                        path.push(Position(tempX + 1, tempY));
                        break;
                    case 3: visited(tempX, tempY - 1, matrix);
                        stackX.push(tempX);
                        stackY.push(tempY - 1);
                        path.push(Position(tempX, tempY - 1));
                        break;

                }//end switch
                break;
            }//end if
        }//end for
        //no way out need to go back

        if (stackX[stackX.length - 1] == tempX && stackY[stackY.length - 1] == tempY) {
            stackX.pop();
            stackY.pop();

            if (stackX.length > 0)
                path.push(Position(stackX[stackX.length - 1], stackY[stackY.length - 1]));
        }
      
    }//end while
    return path;
}

//find if there is an outlet
function hasAnOutlet(x, y, direction, matrix) {
    //0 up 1 right 2 down 3 left
    if (direction === 0 && x - 1 >= 0 && matrix[x - 1][y] === 0)
        return true;
    if (direction === 1 && y + 1 < matrix[0].length && matrix[x][y + 1] === 0)
        return true;
    if (direction === 2 && x + 1 < matrix.length && matrix[x + 1][y] === 0)
        return true;
    if (direction === 3 && y - 1 >= 0 && matrix[x][y - 1] === 0)
        return true;
    return false;
}

function visited(x, y, array) {
    var matrix = array;
    if (x < matrix.length && x >= 0 && y < matrix[0].length && y >= 0)
        matrix[x][y] = 2;
}

//test the algorithm

// function test(){
//   var array = [[1, 1, 0, 0, 1, 0, 0],
//               [0, 1, 0, 0, 0, 0, 1],
//               [0, 0, 0, 0, 0, 0, 0],
//               [0, 1, 1, 1, 1, 1, 0],
//               [0, 0, 0, 1, 0, 0, 0]
// ];
  
//     var agentInfo = [{}];
//     agentInfo[0] = agent(2, 0, 3);
//     agentInfo[1] = agent(5, 4, 2);
//     var map = move(agentInfo, array);
//     for (var [key, value] of map) {
//       for(var i=0;i<value.length;i++)
//       console.log(key + ' => [' + value[i].x+","+value[i].y+"]");
//     }
// }
// test();




