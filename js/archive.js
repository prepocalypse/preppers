sigma.utils.pkg("sigma.canvas.nodes");
sigma.utils.pkg("sigma.canvas.labels");
//Disable right click context menu in network-graph div
//Right click is used to make all nodes and edges visible
document.getElementById("network-graph").oncontextmenu = function (e) {
  e.preventDefault();
};

/**************************  ABOUT  **************************/

const about = document.getElementById("about");
const aboutPage = document.getElementById("aboutPage");
let showAbout = false;

about.addEventListener("click", function () {
  if (showAbout) {
    aboutPage.classList.add("hide");
    showAbout = false;
  } else {
    aboutPage.classList.remove("hide");
    showAbout = true;
  }
});

let hashList = [];
let step = 0;
let checkImages = false;

//URL parsing variable for the singlePage redirection
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page_type = urlParams.get("selection");

let checkClosed = false;

// if(document.cookie == "pWrD4jBo=%7Earchive%7E") animateGraph();
function resetSide() {
  //reset sidebar
  document.getElementById("nameLabels").textContent =
    "Select an item or event to\u00A0get more information";
  document.getElementById("wrapper-image").classList.add("hide");
  document.getElementById("hashtagsLabel").classList.add("hide");
  document.getElementById("videosNumber").classList.add("hide");
  document.getElementById("videosDate").classList.add("hide");
  document.getElementById("description").classList.add("hide");
}

resetSide();

lightBoxClose = function () {
  console.log(checkClosed);
  document.querySelector(".lightbox").classList.add("closed");
  if (!checkClosed) animateGraph();
  return (checkClosed = true);
};

function init() {
  if (firstTime(thisPage())) {
    // this code only runs for first visit
    document.querySelector(".lightbox").classList.remove("closed");
  } else animateGraph();
}

init();

function changeEdgeSize() {
  if (window.screen.width <= 425) return 0.1;
  else return 0.3;
}

//Create the function to build the network graph
function buildNetwork(s) {
  //Save the initial colors of the nodes and edges
  s.graph.nodes().forEach(function (n) {
    n.originalColor = n.color;
    if (n.attributes.Type == "event") {
      hashList.push(n.label);
      n.type = "square";
    }
  });

  s.graph.edges().forEach(function (e) {
    e.originalColor = e.color;
  });
  CustomShapes.init(s);
  s.refresh();
  //Override initial edge colors

  s.settings({
    edgeColor: "default",
    defaultEdgeColor: "#D8D8D8",
    labelThreshold: 12,
    minNodeSize: 1,
    maxNodeSize: 15,
    minEdgeSize: changeEdgeSize(),
    maxEdgeSize: changeEdgeSize(),
    font: "ibm",
    defaultLabelSize: 16,
    defaultLabelColor: "#DCDB35",
    defaultLabelBGColor: "rgba(0,0,0,0.7)", //opacità per visibiltà video piccoli
    defaultHoverLabelBGColor: "white",
    defaultLabelHoverColor: "black",
  });

  // Refresh the graph to see the changes:
  CustomShapes.init(s);
  s.refresh();

  let flagEvent = [false, 0];

  function createHashList() {
    document.getElementById("hashtagsLabel").childNodes.forEach(function (ent) {
      ent.addEventListener("click", function () {
        s.graph.nodes().forEach(function (n) {
          (n.color = n.originalColor), (n.hidden = false);
        });

        s.graph.edges().forEach(function (e) {
          (e.color = e.originalColor), (e.hidden = false);
        });

        flagEvent[0] = false;
        flagEvent[1] = null;
        console.log(ent.innerHTML);
        // moveToHash(ent.innerHTML);
      });

      ent.addEventListener("mouseover", function () {
        s.graph.nodes().forEach(function (n) {
          if (n.label === ent.innerHTML) {
            n.color = "#DCDB35";
          }
        });
        CustomShapes.init(s);
        s.refresh();
      });

      ent.addEventListener("mouseout", function () {
        s.graph.nodes().forEach(function (n) {
          if (n.label === ent.innerHTML) {
            n.color = n.originalColor;
          }
        });
        CustomShapes.init(s);
        s.refresh();
      });
    });
  }

  // function moveToHash(_selectedHash) {
  //   let selectedHash = _selectedHash;

  //   s.settings({
  //     labelThreshold: 12,
  //   });

  //   //15 dic h 22:15 li ho commentati tanto non cambia nulla —EG

  //   // s.graph.nodes().forEach(function (n) {
  //   //   (n.color = n.originalColor), (n.hidden = false);
  //   // });

  //   // s.graph.edges().forEach(function (e) {
  //   //   (e.color = e.originalColor), (e.hidden = false);
  //   // });

  //   s.graph.nodes().forEach(function (n) {
  //     if (n.attributes.Type == "event" && n.label == selectedHash) {
  //       e = n;
  //       var nodeId = e.id,
  //         toKeep = s.graph.neighbors(nodeId);
  //       (arrIdNeighs = []), (nofNeighs = {});

  //       toKeep[nodeId] = e;
  //       var keyNames = Object.keys(toKeep); //array degli id dei neighbors
  //       // console.log(keyNames);

  //       // for (k in keyNames) {
  //       //   var tempNeighs = s.graph.neighbors(keyNames[k]); //neighbors di nodeId del ciclo

  //       //   arrIdNeighs = Object.keys(tempNeighs);

  //       //   for (j in arrIdNeighs) {
  //       //     nofNeighs[arrIdNeighs[j]] = arrIdNeighs[j];
  //       //   }

  //       //   nofNeighs[nodeId] = e;
  //       //   toKeep = nofNeighs;
  //       // }

  //       document.getElementById("hashtagsLabel").innerHTML = null;

  //       if (e.attributes.Type == "material") {
  //         document.getElementById("nameLabels").textContent =
  //           e.attributes.title;
  //         document.getElementById("videoPlayer").src = e.attributes.link;
  //         document.getElementById("wrapper-image").classList.remove("hide");
  //         document.getElementById("videosNumber").textContent =
  //           "Number of events: " +
  //           Object.keys(s.graph.neighbors(nodeId)).length;
  //         document
  //           .getElementById("videoPlayer")
  //           .setAttribute("poster", e.attributes.thumburl);
  //         var dateSpan = document.createElement("li");
  //         dateSpan.innerHTML = s.graph.neighbors(nodeId).label;
  //         var li = document.getElementById("hashtagsLabel");
  //         li.appendChild(dateSpan);

  //         createHashList();

  //         document.getElementById("hashtagsLabel").classList.remove("hide");
  //       } else {
  //         document.getElementById("nameLabels").textContent =
  //           toKeep[nodeId].label;
  //         document.getElementById("videoPlayer").src = "";
  //         document.getElementById("wrapper-image").classList.add("hide");
  //         document.getElementById("videosNumber").textContent =
  //           "Number of objects: " +
  //           Object.keys(s.graph.neighbors(nodeId)).length;
  //           var dateSpan = document.createElement("li");
  //           dateSpan.innerHTML = s.graph.neighbors(nodeId).label;
  //           var li = document.getElementById("hashtagsLabel");
  //           li.appendChild(dateSpan);
  //       }
  //       s.graph.nodes().forEach(function (n) {
  //         if (toKeep[n.id]) {
  //           if (toKeep[n.id].id == nodeId) {
  //             n.color = "#DCDB35";
  //           } else n.color = n.originalColor;
  //         } else n.hidden = true;
  //       });

  //       s.graph.edges().forEach(function (e) {
  //         if (toKeep[e.source] && toKeep[e.target]) e.color = e.originalColor;
  //         else (e.color = "#eee"), (e.hidden = true);
  //       });

  //       flagEvent[0] = true;
  //       flagEvent[1] = nodeId;

  //       let aNode = e;
  //       let cam = s.camera;
  //       let pfx = cam.readPrefix;

  //       if (cam.ratio > 0.7) {
  //         sigma.utils.zoomTo(
  //           cam, // cam
  //           aNode[pfx + "x"] - cam.x, // x
  //           aNode[pfx + "y"] - cam.y, // y
  //           0.3, // ratio
  //           { duration: 1000 } // animation
  //         );

  //         s.settings({
  //           labelThreshold: 12,
  //         });
  //       } else {
  //         sigma.misc.animation.camera(
  //           cam,
  //           {
  //             x: aNode[cam.readPrefix + "x"],
  //             y: aNode[cam.readPrefix + "y"],
  //             ratio: 0.3,
  //           },
  //           { duration: 1000 }
  //         );
  //       }
  //       CustomShapes.init(s);
  //       s.refresh();
  //     }
  //   });

  //   createHashList();
  // }

  //When a node is hovered, check all nodes to see which are neighbors.
  //Set neighbor nodes to dark blue, else keep node as original color.
  //Do the same for the edges, coloring connections to neighbors blue.
  s.bind("overNode", function (e) {
    //reset label threshold
    s.settings({
      labelThreshold: 12,
    });

    var nodeId = e.data.node.id,
      toKeep = s.graph.neighbors(nodeId);
    toKeep[nodeId] = e.data.node;

    s.graph.nodes().forEach(function (n) {
      if (toKeep[n.id] || n.id == flagEvent[1]) n.color = "#DCDB35";
      else n.color = "#6D6D6D";
    });

    s.graph.edges().forEach(function (e) {
      if (toKeep[e.source] && toKeep[e.target]) e.color = "#DCDB35";
      else e.color = "rgba(158,158,158,0.1)";
    });

    //Refresh graph to update colors
    CustomShapes.init(s);
    s.refresh();
  });

  //Return nodes and edges to original color after mose moves off a node (stops hovering)
  s.bind("outNode", function (e) {
    s.graph.nodes().forEach(function (n) {
      if (flagEvent[0] == false || n.id != flagEvent[1])
        n.color = n.originalColor;
    });

    s.graph.edges().forEach(function (e) {
      e.color = e.originalColor;
    });

    //Refresh graph to update colors
    CustomShapes.init(s);
    s.refresh();
  });

  //When a node is clicked, check all nodes to see which are neighbors.
  //Set all non-neighbors to grey and hide them, else set node to original color.
  //Change the clicked node's original color to red.
  //Do the same for the edges, keeping the ones with both endpoints colored.
  //Clicking consecutive nodes will show the joint network all clicked nodes.

  document.getElementById("nameLabels").textContent =
    "Select an item or event to\u00A0get more information";
  document.getElementById("wrapper-image").classList.add("hide");

  s.bind("clickNode", function (e) {
    s.graph.nodes().forEach(function (n) {
      (n.color = n.originalColor), (n.hidden = false);
    });

    s.graph.edges().forEach(function (e) {
      (e.color = e.originalColor), (e.hidden = false);
    });

    flagEvent[0] = false;
    flagEvent[1] = null;

    var nodeId = e.data.node.id,
      toKeep = s.graph.neighbors(nodeId),
      arrIdNeighs = [],
      nofNeighs = {};

    toKeep[nodeId] = e.data.node;
    var keyNames = Object.keys(toKeep); //array degli id dei neighbors

    // for (k in keyNames) {
    //   var tempNeighs = s.graph.neighbors(keyNames[k]); //neighbors di nodeId del ciclo
    //   arrIdNeighs = Object.keys(tempNeighs);

    //   for (j in arrIdNeighs) {
    //     nofNeighs[arrIdNeighs[j]] = arrIdNeighs[j];
    //   }

    //   nofNeighs[nodeId] = e.data.node;
    //   toKeep = nofNeighs;
    // }

    s.camera.goTo(e.data.node.x, e.data.node.y);

    document.getElementById("hashtagsLabel").innerHTML = null;
    document.getElementById("hashtagsLabel").classList.remove("hide");
    document.getElementById("videosNumber").classList.remove("hide");

    if (e.data.node.attributes.Type == "material") {
      document.getElementById("nameLabels").textContent = e.data.node.label;
      // document.getElementById("videoPlayer").src = e.data.node.attributes.link;
      document.getElementById("wrapper-image").classList.remove("hide");
      document.getElementById("videosNumber").textContent =
        "Number of events: " + Object.keys(s.graph.neighbors(nodeId)).length;
      if (
        e.data.node.attributes.avgPrice != "n/a" &&
        e.data.node.attributes.avgPrice != "null"
      ) {
        document.getElementById("videosDate").classList.remove("hide");
        document.getElementById("videosDate").innerHTML =
          e.data.node.attributes.avgPrice;
      }
      if (
        e.data.node.attributes.description != "n/a" &&
        e.data.node.attributes.description != "null"
      ) {
        document.getElementById("description").classList.remove("hide");

        document.getElementById("description").innerHTML =
          e.data.node.attributes.description;
      }
      // document
      //   .getElementById("videoPlayer")
      //   .setAttribute("poster", e.data.node.attributes.thumburl);
      for (i in s.graph.neighbors(nodeId)) {
        var dateSpan = document.createElement("li");
        dateSpan.innerHTML = s.graph.neighbors(nodeId)[i].label;
        var li = document.getElementById("hashtagsLabel");
        li.appendChild(dateSpan);
      }
      document.getElementById("hashtagsLabel").classList.remove("hide");

      if (checkImages) {
        console.log("false");
        let imagesArray = document.querySelectorAll(".image");
        console.log(imagesArray);
        for (k = 1; k < 15; k++) {
          imagesArray[k - 1].src =
            "assets/data/images/" + e.data.node.label + "/" + k + ".jpg";
        }
      } else {
        for (j = 1; j < 15; j++) {
          console.log("true");

          var dateImage = document.createElement("img");
          dateImage.className = "image";
          dateImage.src =
            "assets/data/images/" + e.data.node.label + "/" + j + ".jpg";
          document.getElementById("wrapper-image").appendChild(dateImage);
        }
        checkImages = true;
      }
    } else {
      document.getElementById("nameLabels").textContent = toKeep[nodeId].label;
      // document.getElementById("videoPlayer").src = "";
      document.getElementById("wrapper-image").classList.add("hide");
      document.getElementById("description").classList.add("hide");
      document.getElementById("videosNumber").textContent =
        "Number of objects: " + Object.keys(s.graph.neighbors(nodeId)).length;

      for (i in s.graph.neighbors(nodeId)) {
        var dateSpan = document.createElement("li");
        dateSpan.innerHTML = s.graph.neighbors(nodeId)[i].label;
        var li = document.getElementById("hashtagsLabel");
        li.appendChild(dateSpan);
      }
    }

    //Interactive sidebar
    createHashList();

    s.graph.nodes().forEach(function (n) {
      if (toKeep[n.id]) {
        if (toKeep[n.id].id == nodeId) {
          n.color = "#DCDB35";
        } else n.color = n.originalColor;
      } else n.hidden = true;
    });

    flagEvent[0] = true;
    flagEvent[1] = nodeId;
    //Refresh graph to update colors

    let aNode = e.data.node;
    let cam = s.camera;
    let pfx = cam.readPrefix;

    if (cam.ratio > 0.7) {
      sigma.utils.zoomTo(
        cam, // cam
        aNode[pfx + "x"] - cam.x, // x
        aNode[pfx + "y"] - cam.y, // y
        0.3, // ratio
        { duration: 1000 } // animation
      );

      s.settings({
        labelThreshold: 12,
      });
    } else {
      sigma.misc.animation.camera(
        cam,
        {
          x: aNode[cam.readPrefix + "x"],
          y: aNode[cam.readPrefix + "y"],
          ratio: 0.3,
        },
        { duration: 1000 }
      );
    }

    CustomShapes.init(s);
    s.refresh();
  });

  //When the stage is right-clicked or just clicked, return nodes and edges to original colors
  s.bind("rightClickStage", function (e) {
    s.settings({
      labelThreshold: 12,
    });
    s.graph.nodes().forEach(function (n) {
      (n.color = n.originalColor), (n.hidden = false);
    });

    s.graph.edges().forEach(function (e) {
      (e.color = e.originalColor), (e.hidden = false);
    });

    let aNode = e.data.node;
    let cam = s.camera;
    let pfx = cam.readPrefix;
    sigma.misc.animation.camera(
      s.cameras[0],
      { ratio: 1, x: 0, y: 0, angle: 0 },
      { duration: 1000 }
    );
    flagEvent[0] = false;
    flagEvent[1] = null;

    resetSide();
  });

  // GUI EVENTS

  $("#zoomIn").bind("click", function () {
    // Zoom in - animation :
    sigma.misc.animation.camera(
      s.camera,
      {
        ratio: s.camera.ratio / 2,
      },
      {
        duration: 600,
      }
    );
  });

  $("#zoomOut").bind("click", function () {
    // Zoom out - animation :
    if (s.camera.ratio < 1) {
      sigma.misc.animation.camera(
        s.camera,
        {
          ratio: s.camera.ratio * 2,
        },
        {
          duration: 600,
        }
      );
    }
  });

  $("#resetView").bind("click", function () {
    var adjustZoom = 1;
    resetSide();

    if (document.body.clientWidth <= 425) {
      adjustZoom = document.body.clientWidth / 425 / 8;
    }

    s.settings({
      labelThreshold: 12,
    });
    // Reset view - animation :
    sigma.misc.animation.camera(
      s.cameras[0],
      { ratio: adjustZoom, x: 0, y: 0, angle: 0 },
      { duration: 600 }
    );
    s.graph.nodes().forEach(function (n) {
      (n.color = n.originalColor), (n.hidden = false);
    });

    s.graph.edges().forEach(function (e) {
      (e.color = e.originalColor), (e.hidden = false);
    });

    flagEvent[0] = false;
    flagEvent[1] = null;
  });

  CustomShapes.init(s);
  s.refresh();

  var checkInfo = false;
  const info = document.getElementById("info");
  const news = document.querySelector(".nav-available-wrap");

  //INFO BUTTON
  document.getElementById("info").addEventListener("click", function () {
    info.classList.toggle("buttonGui-active");
    if (checkInfo == false) {
      console.log("Aooo");
      news.classList.add("hide");
      checkInfo = true;
    } else {
      news.classList.remove("hide");
      checkInfo = false;
    }
  });
}

function animateGraph() {
  //Add a method to the graph that returns all neighbors of a node
  sigma.classes.graph.addMethod("neighbors", function (nodeId) {
    var k,
      neighbors = {},
      index = this.allNeighborsIndex[nodeId] || {};

    for (k in index) neighbors[k] = this.nodesIndex[k];

    return neighbors;
  });

  //Import JSON network as object and initiate a sigma network graph,
  //run other functions that require a sequential order
  var jnet, s;
  $.getJSON("assets/data/Phase32.json", function (response) {
    jnet = response;
    s = new sigma({
      graph: jnet,
      renderer: {
        container: document.getElementById("network-graph"),
        type: "canvas",
      },
      settings: {
        edgeColor: "default",
        defaultEdgeColor: "#D8D8D8",
        labelThreshold: 12,
        minNodeSize: 1,
        maxNodeSize: 15,
        minEdgeSize: changeEdgeSize(),
        maxEdgeSize: changeEdgeSize(),
        font: "GT America",
        defaultLabelSize: 16,
        defaultLabelColor: "#FFF",
        defaultLabelBGColor: "rgba(0,0,0,0.5)", //opacità per visibiltà video piccoli
        defaultHoverLabelBGColor: "white",
        defaultLabelHoverColor: "black",
        animationsTime: 300,
      },
    });

    s.addCamera("cam2");
    // s.camera.angle= Math.PI;
    s.camera.isAnimated = true;
    // s.camera.getRectangle(document.getElementById("network-graph").clientWidth, document.getElementById("network-graph").clientHeight);

    if (document.body.clientWidth <= 425) {
      s.camera.ratio = document.body.clientWidth / 425 / 8;
    }

    s.graph.nodes().forEach(function (n) {
      n.atlas_x = n.x;
      n.atlas_y = n.y;
      n.x = Math.random() * (3000 + 200) + 200;
      n.y = Math.random() * (2000 + 200) + 200;
    });

    let durata;
    if (page_type) durata = 1;
    else durata = 3000;

    sigma.plugins.animate(
      s,
      {
        x: "atlas_x",
        y: "atlas_y",
      },
      {
        easing: "quadraticOut",
        duration: durata,
        onComplete: function () {
          CustomShapes.init(s);
          buildNetwork(s);
        },
      }
    );
  });
}
