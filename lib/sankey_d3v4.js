d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
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
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeAbsolutePositions(); // add this in sankey.js file
    computeLinkDepths();
    return sankey;
  };

  // https://stackoverflow.com/questions/21539265/d3-sankey-charts-manually-position-node-along-x-axis
  function computeAbsolutePositions() {
    const delta = 180;
    const x0 = 373;
    const btwGroups_l2 = 60;
    const btwGroups_l3 = 30;
    const ingroupDeltaY_l3 = 20; // y-spacing within groups, level 3

    // for (let idx = 0; idx < nodes.length; idx++) {
    for (let idx = 0; idx < 6; idx++) {
      nodes[idx].y = nodes[idx].y - delta;
    }

    // Group USres
    // nodes[2].y = nodes[2].y  + nodes[1].dy + btwGroups_l2;
    // nodes[3].y = nodes[3].y  + nodes[2].dy + btwGroups_l2;
    // nodes[4].y = nodes[4].y  + nodes[3].dy + btwGroups_l2;

    // Group USres
    // nodes[6].y = nodes[5].y + nodes[5].dy + ingroupDeltaY_l3;
    // nodes[7].y = nodes[6].y + nodes[6].dy + ingroupDeltaY_l3;

    // Group cdnFromUS
    // nodes[12].y = nodes[11].y + nodes[11].dy + ingroupDeltaY_l3;
    // nodes[13].y = nodes[12].y + nodes[12].dy + ingroupDeltaY_l3;

    // Group nonUS
    // nodes[8].y = nodes[13].y + nodes[13].dy + ingroupDeltaY_l3 + btwGroups_l3;
    // nodes[9].y = nodes[8].y + nodes[8].dy + ingroupDeltaY_l3;
    // nodes[10].y = nodes[9].y + nodes[9].dy + ingroupDeltaY_l3;

    // Group cdnFromOther
    // nodes[14].y = nodes[10].y + nodes[10].dy + ingroupDeltaY_l3 + btwGroups_l3;
    // nodes[15].y = nodes[14].y + nodes[14].dy + ingroupDeltaY_l3;
    // nodes[16].y = nodes[15].y + nodes[15].dy + ingroupDeltaY_l3;


    // nodes[0].x = 0;
    // nodes[0].y = 50;
    // nodes[1].x = nodes[2].x = nodes[3].x = nodes[4].x = x0;
    // nodes[1].y = 0;
    // nodes[2].y = 177;
    // nodes[3].y = 272;
    // nodes[4].y = 574;
    // nodes[5].x = nodes[6].x = nodes[7].x = nodes[8].x = x0*2;
    // nodes[9].x = nodes[10].x = nodes[11].x = nodes[12].x = x0*2;
    // nodes[13].x = nodes[14].x = nodes[15].x = nodes[16].x = x0*2;
    // nodes[5].y = 0;
    // nodes[6].y = 480;
    // nodes[7].y = 680;
    // nodes[8].y = 703;
    // nodes[9].y = 694;
    // nodes[10].y = 744;
    // nodes[11].y = 145;
    // nodes[12].y = 217;
    // nodes[13].y = 235;
    // nodes[14].y = 623;
    // nodes[15].y = 679;
    // nodes[16].y = 690;
    // nodes[17].x = nodes[18].x = nodes[19].x = x0*3 - 80;
    // nodes[20].x = nodes[21].x = nodes[22].x = nodes[23].x = nodes[24].x = x0*3 - 80;
    // nodes[17].y = 457;
    // nodes[18].y = 566;
    // nodes[19].y = 583;
    // nodes[20].y = 596;
    // nodes[21].y = 195;
    // nodes[22].y = 380;
    // nodes[23].y = 400;
    // nodes[24].y = 415;
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
      nodes.forEach(function(node) {
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function(link) {
        var source = link.source,
          target = link.target;
        if (typeof source === "number") source = link.source = nodes[link.source];
        if (typeof target === "number") target = link.target = nodes[link.target];
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
      moveSinksRight(x);
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
        var ky = d3.min(nodesByBreadth, function(nodes) {
          // CN scale factor 1.5 !!!!
          // return (1.5 * size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
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
          nodes.sort(ascendingDepth);
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
