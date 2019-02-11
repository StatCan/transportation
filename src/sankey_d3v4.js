d3.sankey = function() {
  const sankey = {};
  let nodeWidth = 24;
  let nodePadding = 8;
  let size = [1, 1];
  let nodes = [];
  let links = [];

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
    const withinGroups = 20;

    // Set all x-coords for col 2 (modes)
    const x2 = nodes.filter((item) => item.name === "USres_land")[0].x;

    // col2
    nodes.filter((item) => item.name === "USres_air")[0].x = x2;
    nodes.filter((item) => item.name === "USres_marine")[0].x = x2;

    nodes.filter((item) => item.name === "cdnFromUS_air")[0].x = x2;
    nodes.filter((item) => item.name === "cdnFromUS_marine")[0].x = x2;

    nodes.filter((item) => item.name === "nonUSres_air")[0].x = x2;
    nodes.filter((item) => item.name === "nonUSres_marine")[0].x = x2;
    nodes.filter((item) => item.name === "nonUSres_land")[0].x = x2;

    nodes.filter((item) => item.name === "cdnFromOther_air")[0].x = x2;
    nodes.filter((item) => item.name === "cdnFromOther_marine")[0].x = x2;
    nodes.filter((item) => item.name === "cdnFromOther_land")[0].x = x2;

    // Set y-coords
    // Level 0
    const y0Delta = outerHeight/5; // put in top 5th of page
    nodes.filter((item) => item.name === "intl")[0].y = y0Delta;

    // Level 1 (traveller type)
    const y1Delta = outerHeight/2.5;
    const btwGroups1 = 100;
    nodes.filter((item) => item.name === "nonUSres")[0].y = nodes.filter((item) => item.name === "nonUSres")[0].y -
          y1Delta;
    nodes.filter((item) => item.name === "cdnFromOther")[0].y = nodes.filter((item) => item.name === "nonUSres")[0].y
          + nodes.filter((item) => item.name === "nonUSres")[0].dy + btwGroups1;
    nodes.filter((item) => item.name === "USres")[0].y = nodes.filter((item) => item.name === "cdnFromOther")[0].y
          + nodes.filter((item) => item.name === "cdnFromOther")[0].dy + btwGroups1;
    nodes.filter((item) => item.name === "cdnFromUS")[0].y = nodes.filter((item) => item.name === "USres")[0].y
          + nodes.filter((item) => item.name === "USres")[0].dy + btwGroups1;

    // Level 2 (traveller modes, on order of air, marine, land)
    const btwGroups2 = 80;
    // Group nonUSres
    nodes.filter((item) => item.name === "nonUSres_marine")[0].y = nodes.filter((item) => item.name === "nonUSres_air")[0].y
          + nodes.filter((item) => item.name === "nonUSres_air")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "nonUSres_land")[0].y = nodes.filter((item) => item.name === "nonUSres_marine")[0].y
          + nodes.filter((item) => item.name === "nonUSres_marine")[0].dy + withinGroups;

    // Group cdnFromOther
    nodes.filter((item) => item.name === "cdnFromOther_air")[0].y = nodes.filter((item) => item.name === "nonUSres_land")[0].y
          + nodes.filter((item) => item.name === "nonUSres_land")[0].dy + btwGroups2;
    nodes.filter((item) => item.name === "cdnFromOther_marine")[0].y = nodes.filter((item) => item.name === "cdnFromOther_air")[0].y
          + nodes.filter((item) => item.name === "cdnFromOther_air")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "cdnFromOther_land")[0].y = nodes.filter((item) => item.name === "cdnFromOther_marine")[0].y
          + nodes.filter((item) => item.name === "cdnFromOther_marine")[0].dy + withinGroups;

    // Group USres
    nodes.filter((item) => item.name === "USres_air")[0].y = nodes.filter((item) => item.name === "cdnFromOther_marine")[0].y
          + nodes.filter((item) => item.name === "cdnFromOther_marine")[0].dy + btwGroups2;
    nodes.filter((item) => item.name === "USres_marine")[0].y = nodes.filter((item) => item.name === "USres_air")[0].y
          + nodes.filter((item) => item.name === "USres_air")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "USres_land")[0].y = nodes.filter((item) => item.name === "USres_marine")[0].y
          + nodes.filter((item) => item.name === "USres_marine")[0].dy + withinGroups;

    // Group cdnFromUS
    nodes.filter((item) => item.name === "cdnFromUS_air")[0].y = nodes.filter((item) => item.name === "USres_land")[0].y
          + nodes.filter((item) => item.name === "USres_land")[0].dy + btwGroups2;
    nodes.filter((item) => item.name === "cdnFromUS_marine")[0].y = nodes.filter((item) => item.name === "cdnFromUS_air")[0].y
          + nodes.filter((item) => item.name === "cdnFromOther_air")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "cdnFromUS_land")[0].y = nodes.filter((item) => item.name === "cdnFromUS_marine")[0].y
          + nodes.filter((item) => item.name === "cdnFromUS_marine")[0].dy + withinGroups;

    // Level 3 (traveller modes, on order of air, marine, land)
    const btwGroups3 = 80;
    // Group USres_land
    nodes.filter((item) => item.name === "USres_bus")[0].y = nodes.filter((item) => item.name === "USres_car")[0].y
          + nodes.filter((item) => item.name === "USres_car")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "USres_train")[0].y = nodes.filter((item) => item.name === "USres_bus")[0].y
          + nodes.filter((item) => item.name === "USres_bus")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "USres_other")[0].y = nodes.filter((item) => item.name === "USres_train")[0].y
          + nodes.filter((item) => item.name === "USres_train")[0].dy + withinGroups;

    // Group cdnFromUS_land
    nodes.filter((item) => item.name === "cdnFromUS_car")[0].y = nodes.filter((item) => item.name === "USres_other")[0].y
          + nodes.filter((item) => item.name === "USres_other")[0].dy + btwGroups3;
    nodes.filter((item) => item.name === "cdnFromUS_bus")[0].y = nodes.filter((item) => item.name === "cdnFromUS_car")[0].y
          + nodes.filter((item) => item.name === "cdnFromUS_car")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "cdnFromUS_train")[0].y = nodes.filter((item) => item.name === "cdnFromUS_bus")[0].y
          + nodes.filter((item) => item.name === "cdnFromUS_bus")[0].dy + withinGroups;
    nodes.filter((item) => item.name === "cdnFromUS_other")[0].y = nodes.filter((item) => item.name === "cdnFromUS_train")[0].y
          + nodes.filter((item) => item.name === "cdnFromUS_train")[0].dy + withinGroups;
  }
  //


  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = function() {
    let curvature = .5;

    function link(d) {
      const x0 = d.source.x + d.source.dx;
      const x1 = d.target.x;
      const xi = d3.interpolateNumber(x0, x1);
      const x2 = xi(curvature);
      const x3 = xi(1 - curvature);
      const y0 = d.source.y + d.sy + d.dy / 2;
      const y1 = d.target.y + d.ty + d.dy / 2;
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
      let source = link.source;
      let target = link.target;
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
    let remainingNodes = nodes;
    let nextNodes;
    let x = 0;

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

  // function moveSourcesRight() {
  //   nodes.forEach(function(node) {
  //     if (!node.targetLinks.length) {
  //       node.x = d3.min(node.sourceLinks, function(d) {
  //         return d.target.x;
  //       }) - 1;
  //     }
  //   });
  // }

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
    const nodesByBreadth = d3.nest()
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
    for (let alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
      const ky = d3.min(nodesByBreadth, function(nodes) {
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
            const y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
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
            const y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
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
        let node;
        let dy;
        let y0 = 0;
        const n = nodes.length;
        let i;

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
      let sy = 0;
      let ty = 0;
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
