// vis2.js

function DonutChart(container, data, onUpdate) {

	this.onUpdate = onUpdate;

	console.log("DonutChart");

	// set margins to the graph
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var width = (window.innerWidth * 0.35) - margin.left - margin.right;
	var height = (window.innerHeight * 0.40) - margin.top - margin.bottom;

	var radius = Math.min(width, height) / 2;

	// create the svg canvas
	var svg = d3.select("#vis1")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	var g = svg.append("g")
		.attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

	// total amount of entries
	var total = Object.keys(data).length;

	this.update = function(data) {

		// count total number of entries for each category
		var LikeMap = {};
		data.forEach(function(d) {
			if (LikeMap[d.Likes_Music] === undefined) {
				LikeMap[d.Likes_Music] = 0;
			}
			LikeMap[d.Likes_Music] += 1;
		});        

		// format data
		var LikesCount = [];
		Object.keys(LikeMap).forEach(function(key) {
			LikesCount.push({
				level: key,
				count: LikeMap[key]
			});
		});

		// console.log(LikesCount);

		var color = d3.scaleOrdinal(d3.schemeRdYlBu[5]);

		var arc = d3.arc()
			.outerRadius(radius)
			.innerRadius(radius - 60);

		var pie = d3.pie()
			.sort(null)
			.value(function(d) { return d.count;})

        this.updatePositions = function(selection) {

			var tooltip = d3.select("#vis1")
				.append("div")
				.attr("class", "tooltip");
				tooltip.append("div")
					.attr("class", "count");
				tooltip.append("div")
					.attr("class", "percent");

			// create a legend
			var legend = g.selectAll(".legend")
				.data(pie(LikesCount))
				.enter()
				.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) {return "translate(0," + i * 25 + ")"; });

			legend.append("rect")
				.attr("x", -radius/2 + 10)
				.attr("y", -radius/2 + 25)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", function(d) { return color(d.data.level); })
				.style("stroke", function(d) { return color(d.data.level); })

			// add text to the legend
			legend.append("text")
				.attr("x", -radius/2 + 35)
				.attr("y", -radius/2 + 38)
				.text(function(d) { 
					if (+d.data.level === 1) {return "Does Not Enjoy Music At All";}
					if (+d.data.level === 2) {return "Does Not Enjoy Music";} 
					if (+d.data.level === 3) {return "Neutral about Music";}
					if (+d.data.level === 4) {return "Enjoys Music";}
					if (+d.data.level === 5) {return "Enjoys Music A Lot";}
				});

			selection = g.selectAll("path")
				.data(pie(LikesCount))
				.enter()
				.append("path")
				.attr("d", arc)
	            .style("fill", function(d) { return color(d.data.level); })
	            .each(function(d) {this._current = d;})
	            .on("mouseover", function(d) {
	            	d3.select(this).style("filter" , "url(#glow)")
	        		.style("stroke", "black");
	            })
	            .on("mouseout", function(d) {
	            	d3.select(this).style("filter" , "none")
	            	.style("stroke", "none");
	            });

			// add color boxes to the legend
			selection.attr("count", function(d) {
					return margin.left + (-radius/2 + 25) + d.count;
				})
				.attr("level", function(d) {
					return margin.top + (-radius/2 + 25) + d.level;
				} )
				.on("mouseover", function(d) {					
					var percent = Math.round(100 * (d.data.count/total));
					tooltip.select(".count").html(d.data.count + " Answered");
					tooltip.select(".label").html(d.data.level.toUpperCase());
					tooltip.select(".percent").html(percent + "%");
					tooltip.style("display", "block");
					tooltip.style("opacity",2);
					d3.select(this)
						.style("stroke", "black");
				})
				// update the position if the user"s moved the mouse in the element
				.on("mousemove", function(d) {
					tooltip.style("top", (d3.event.layerY + 10) + "px");
					tooltip.style("left", (d3.event.layerX + 10) + "px");
				})				
				// hide tooltip if we leave the element we"ve been mousing over
				.on("mouseout", function(d) {
					tooltip.style("display", "none");
					d3.select(this)
					.style("stroke", "none");
				})
				.on("click", (function(d){
                    this.selectedLevel = +d.data.level;
                    this.onUpdate();
                }).bind(this));

            return selection;
        }

        this.updatePositions(g.selectAll(".legend"));
    }

	this.update(data);
}