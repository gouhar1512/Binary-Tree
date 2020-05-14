import Draw from "./Draw.js";

let nextNodeNumber = 1;

let stack = [];

function undo() {
  let n = stack.length;
  if (n == 0) return;
  stack.pop();

  n = stack.length;
  if (n == 0) {
    $("#svgContainer").html("");
    AddEventListeners();

    firstNodeSelected = false;
    secondNodeSelected = false;
    return;
  }

  let prevState = stack[n - 1];

  $("#svgContainer").html(prevState.htmlContent);
  firstNode = prevState.firstNode;
  secondNode = prevState.secondNode;
  firstNodeSelected = prevState.firstNodeSelected;
  secondNodeSelected = prevState.secondNodeSelected;

  AddEventListeners();
  // console.log(firstNode, firstNodeSelected, secondNode, secondNodeSelected);
}

function updateStack() {
  let currContent = {
    htmlContent: $("#svgContainer").html(),
    firstNode: firstNode,
    secondNode: secondNode,
    firstNodeSelected: firstNodeSelected,
    secondNodeSelected: secondNodeSelected
  };
  stack.push(currContent);
}

function intersect(x, y, xx, yy, r) {
  //these are coordinates of center of circle
  let distanceSq = (x - xx) * (x - xx) + (y - yy) * (y - yy);
  let extraDistance = 10;
  r += extraDistance;
  if (distanceSq < 4 * r * r) {
    return true;
  }

  return false;
}
function validatePosition(x, y) {
  let nodes = $(".node");
  for (let i = 0; i < nodes.length; i++) {
    let xx = nodes[i].getAttribute("cx");
    let yy = nodes[i].getAttribute("cy");
    let r = nodes[i].getAttribute("r");

    xx = parseInt(xx);
    yy = parseInt(yy);
    r = parseInt(r);
    if (intersect(x, y, xx, yy, r)) {
      return false;
    }
  }
  return true;
}
function addNodes() {
  let xPosition = event.pageX;
  let yPosition = event.pageY;
  let svgAreaPosition = $("#svgArea").position();
  xPosition -= svgAreaPosition.left;
  yPosition -= svgAreaPosition.top;

  let validPosition = validatePosition(xPosition, yPosition);

  if (!validPosition) {
    return;
  }

  Draw.drawNode(xPosition, yPosition, nextNodeNumber);

  nextNodeNumber++;

  updateStack();
}

let firstNodeSelected = false,
  secondNodeSelected = false;
let firstNode, secondNode;

function connectNodes() {
  if (!firstNodeSelected || !secondNodeSelected) return false;
  Draw.drawLine(firstNode, secondNode);
  updateStack();
}

function unselectNodes() {
  firstNodeSelected = false;
  secondNodeSelected = false;
  document.getElementById(firstNode).setAttribute("fill", "green");
  document.getElementById(secondNode).setAttribute("fill", "green");
}
function addEdges() {
  let node = event.target;
  if (event.target.classList.contains("node")) {
    node.setAttribute("fill", "lightgreen");
    if (!firstNodeSelected) {
      firstNodeSelected = true;
      firstNode = node.id;
    } else if (!secondNodeSelected) {
      secondNodeSelected = true;
      secondNode = node.id;

      connectNodes();
      unselectNodes();
    }
  }
}

function AddEventListeners() {
  $("#svgArea").click(function() {
    if (event.target.id == "svgArea") addNodes();
    else addEdges();
  });

  $("#undo-btn").click(function() {
    undo();
  });
}

AddEventListeners();

/**
 * undo function not working properly
 */
