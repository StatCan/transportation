d3.sankey = function() {
  var sankey = {},
      nodeWidth = 32,  // 24
      nodePadding = 45, // 8
      size = [1, 1],
      nodes = [],
      links = [];

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeNodeValues();
    if (nodes.filter(function (item) {
      return item.name === "intl";
    })[0].value !== 0) {
      computeNodeBreadths();
      computeNodeDepths(iterations);
      // computeAbsolutePositions();
      computeLinkDepths();
      return sankey;
   }
    // return sankey;
  };

  function computeAbsolutePositions() {

    // Level 0
    var intl1node = nodes.filter(function (item) {
          return item.name === "intl";
    })[0];
    var y0Init = intl1node.y
    // if (y0Init < 1) y0Init = 0;
    y0Init = outerHeight / 2.9; // place in bottom third of page

    // Check if Level 2 children exist (Air, Marine, Land) for each Level 2 node
    // (USres, nonUSres, cdnFromUS, cdnFromOther)
    var l1node = "USres";
    var children = [];
    children = findChildren(l1node);

    // -------------------------------------------------------------------------
    // Check level 2 - level 3 grouping are confined within reasonable y-distance
     // Group A Level 2 box top defined by L_A0
     var L_A0;
     var midL_A;
     if (nodes.filter(function (item) {
          return item.name === l1node;
    })[0].value !== 0) {
      var thisNode = nodes.filter(function (item) {
          return item.name === l1node;
      })[0];

      L_A0 = thisNode.y;
      midL_A = thisNode.y + thisNode.dy / 2;
    } else {
      console.log("l1node DOES NOT EXIST!");
    }

    // Group A Level 3 box top and bottom defined by Lhat_A0 and Lhat_A1, respectively
    // Top of l1node_air or l1node_marine or l1node_land, whichever exists, in that order
    var midLhat_A;
    midLhat_A = findGroupMidpt(l1node);

    // -------------------------------------------------------------------------
    // Check if midpoints are within reasonable y-distance (85%)
    if ([midL_A, midLhat_A].sort(function(a,b) { return a - b;})[0] /
        [midL_A, midLhat_A].sort(function(a,b) { return a - b;})[1] < 0.85) {

      intl1node.y = L_A0;
      if (L_A0 > midLhat_A) { // L_A node should be moved up
        var thisNode = nodes.filter(function (item) {
          return item.name === l1node;
        })[0];

        thisNode.y = midLhat_A - (thisNode.dy / 2);
      } else if (L_A0 < midLhat_A) { // Lhat child nodes should be moved down
        for (idx = 0; idx < children.length; idx++) {
          if (children[idx]) children[idx].y = children[idx].y - midL_A/1.5;
        }
      }
    }
  }

  function findChildren(l1node) {
    var modes = ["air", "marine", "land"];
    var children = [];

    for (idx = 0; idx < modes.length; idx ++) {
      if (nodes.filter(function (item) {
            return item.name === l1node + "_" + modes[idx];
      })[0].value !== 0) {
        var thisChild =  nodes.filter(function (item) {
            return item.name === l1node + "_" + modes[idx];
        })[0];
        children.push(thisChild);
      }
    }
    return children;
  }

  function findGroupMidpt(l1node) {
    var modes = ["air", "marine", "land"];
    var Lhat_A0;

    // Find top of group box (either air, marine, or land, in that order)
    for (idx = 0; idx < modes.length; idx++) {
      var thisNode = nodes.filter(function (item) {
          return item.name === l1node + "_" + modes[idx];
      })[0];
      if (thisNode.value !== 0) {
        Lhat_A0 =  thisNode.y;
        break;
      }
    }

    // Find bottom of group box (either land, marine, or air, in that order)
    var Lhat_A1;
    for (idx = 0; idx < modes.length; idx++) {
      var thisidx = (modes.length - 1) - idx;
      var thisNode = nodes.filter(function (item) {
          return item.name === l1node + "_" + modes[thisidx];
      })[0];
      if (thisNode.value !== 0) {
        Lhat_A1 =  thisNode.y + thisNode.dy;
        break;
      }
    }

    return midLhat_A = Lhat_A0 + ( Lhat_A1 - Lhat_A0 ) / 2;
  }

  //


    sankey.relayout = function() {
      computeLinkDepths();
      return sankey;
    };

    sankey.link = function() {
      var curvature = .5;

      function link(d) {
        var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
        return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
      }

      link.curvature = function(_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      var nodeIndex = {};
      nodes.forEach(function(node) {
        nodeIndex[node.node] = node;
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function(link) {
        var source = link.source,
          target = link.target;
        if (typeof source === "number") source = link.source = nodeIndex[link.source];
        if (typeof target === "number") target = link.target = nodeIndex[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function(node) {
        node.value = Math.max(
          d3.sum(node.sourceLinks, value),
          d3.sum(node.targetLinks, value)
        );
      });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      var remainingNodes = nodes,
        nextNodes,
        x = 0;

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function(node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(function(link) {
            if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
            }
          });
        });
        remainingNodes = nextNodes;
        ++x;
      }

      //
      // moveSinksRight(x); // forces all nodes to end at same x-coord of page
      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
      nodes.forEach(function(node) {
        if (!node.targetLinks.length) {
          node.x = d3.min(node.sourceLinks, function(d) {
            return d.target.x;
          }) - 1;
        }
      });
    }

    function moveSinksRight(x) {
      nodes.forEach(function(node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function scaleNodeBreadths(kx) {
      nodes.forEach(function(node) {
        node.x *= kx;
      });
    }

    function computeNodeDepths(iterations) {
      var nodesByBreadth = d3.nest()
        .key(function(d) {
          return d.x;
        })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) {
          return d.values;
        });

      //
      initializeNodeDepth();
      resolveCollisions();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
      }

      function initializeNodeDepth() {
        //console.log(nodesByBreadth)
        // console.log("min: ", d3.min(nodesByBreadth,11))
        var ky = d3.min(nodesByBreadth, function(nodes) {
          return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        });


        nodesByBreadth.forEach(function(nodes) {
          nodes.forEach(function(node, i) {
            node.y = i;
            node.dy = node.value * ky;
          });
        });

        links.forEach(function(link) {
          link.dy = link.value * ky;
        });
      }

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function(nodes, breadth) {
          nodes.forEach(function(node) {
            if (node.targetLinks.length) {
              var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return center(link.source) * link.value;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function(nodes) {
          nodes.forEach(function(node) {
            if (node.sourceLinks.length) {
              var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedTarget(link) {
          return center(link.target) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function(nodes) {
          var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

          // Push any overlapping nodes down.
          // nodes.sort(ascendingDepth); // CN: changes vertical order within a column
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = node.y + node.dy + nodePadding;
          }

          // If the bottommost node goes outside the bounds, push it back up.
          dy = y0 - nodePadding - size[1];
          if (dy > 0) {
            y0 = node.y -= dy;

            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.y + node.dy + nodePadding - y0;
              if (dy > 0) node.y -= dy;
              y0 = node.y;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        return a.y - b.y;
      }
    }

    function computeLinkDepths() {
      nodes.forEach(function(node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function(node) {
        var sy = 0,
          ty = 0;
        node.sourceLinks.forEach(function(link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function(link) {
          link.ty = ty;
          ty += link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }

    return sankey;
  };
