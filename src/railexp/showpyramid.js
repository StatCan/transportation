function showPyramid() {
  // https://bl.ocks.org/borgar/b952bb581923c9993d68

  var margin = { top: 10, right: 10, bottom: 10, left: 10 }
  , width = 960 - margin.left - margin.right
  , height = 500 - margin.top - margin.bottom
  , gutter = 30
  , pyramid_h = height - 105
  , dom_age = d3.extent( data, d => d.age )
  , dom_year = d3.extent( data, d => d.year )
  , dom_value = d3.extent( data, d => d.value )
  , formatter = d3.format( ',d' )
  , barheight = ( pyramid_h / ( dom_age[1] - dom_age[0] ) ) - 0.5
  , cx = width / 2
  ;



  }
