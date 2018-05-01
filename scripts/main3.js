// vis3.js

function ParallelSets(container, data, initialLevel) {

	console.log("Parallel Coordinates");

	// set margins of the graph
	var margin = {top: 100, right: 60, bottom: 100, left: 60};
	var width = (window.innerWidth * 0.95) - margin.left - margin.right;
	var height = (window.innerHeight * 0.50) - margin.top - margin.bottom;

	// create the svg canvas
 	var svg = d3.select("#vis3")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
        .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create x and y variables
    var x = d3.scaleBand().range([0,width]).padding(.1);
    var y = {};
    var dragging = {};
    var line = d3.line().curve(d3.curveCardinal.tension(0.5));

    var total = Object.keys(data).length;

    // find position of an axis
    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
      return g.transition().duration(200);
    }

    // path of a given data point
    function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }
  
    this.update = function(data, targetLevel){
        svg.selectAll("*").remove();

        // filter data down to targetlevel
        var filteredData = data.filter(function(d) {
          if (d.Likes_Music === targetLevel)
                return d ;
            });
        var ftotal = Object.keys(filteredData).length;

        // find the dimensions (axes)
    	x.domain(dimensions = d3.keys(filteredData[0]).filter(function(d) {
            return d != "Likes_Music" && (y[d] = d3.scaleLinear()
                .domain([1,5])
                .range([height, 0]));
        }));

        // add grey background lines for context (all data)
        // var background = svg.append("g")
        //     .attr("class", "background")
        //     .selectAll("path")
        //     .data(data)
        //     .enter()
        //     .append("path")
        //     .attr("d", path);

        // add blue foreground lines for selection (filtered data)
        var foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(filteredData)
            .enter()
            .append("path")
            .attr("d", path)
            .style("opacity", function(d) {return d.selected ? 1 : +(total-ftotal)/total; });
      
        // add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter()
            .append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) {return "translate(" + x(d) + ")";})
            // ability to switch axes
            .call(d3.drag()
                .on("start", function(d) {
                  dragging[d] = x(d);
                  background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function(a, b) {return position(a) - position(b);});
                    x.domain(dimensions);
                g.attr("transform", function(d) {return "translate(" + position(d) + ")";})
                })
                .on("end", function(d) {
                    delete dragging[d];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                    transition(foreground).attr("d", path);
                    background.attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                }));

        // add ticks for axes
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(d3.axisLeft(y[d]).ticks(5)); });

        // add genre labels for each axis
        g.append("text")
            .style("text-anchor", "middle")
            .attr("y", -20)
            .attr("font-size", 12)
            .text(d => d);
        };

    this.update(data, initialLevel);
}