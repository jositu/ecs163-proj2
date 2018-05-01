// vis2.js

function Radar(container, data, initialLevel) {

	console.log("RadarChart");

	// set margins of the graph
	var margin = {top: 48, right: 50, bottom: 60, left: 50};
	var width = (window.innerWidth * 0.35) - margin.left - margin.right;
	var height = (window.innerHeight * 0.40) - margin.top - margin.bottom;

	// create the svg canvas
	var svg = container
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	var radius = Math.min(width, height);

	// 
	var g = svg.append("g")
			.attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

	this.update = function(data, targetLevel){
		svg.selectAll("*").remove();

		var selectedData = data.filter(function(d) {
			if (d.Likes_Music === targetLevel)
            return d;
        });
        // console.log("selectedData", selectedData);
        var total = Object.keys(selectedData).length; 

        // calculate the averages of each genre
		var selectedMap = {
			"Alternative": 0,
			"Classical": 0,
			"Country": 0,
			"Dance, Disco, & Funk": 0,
            "Folk": 0,
            "Musicals": 0,
            "Pop": 0,
            "Metal & Hardrock": 0,
            "Hiphop & Rap": 0,
            "Reggae & Ska": 0,
            "Swing & Jazz": 0,
            "Rock n' Roll": 0,
            "Rock": 0,
            "Punk": 0,
            "Latin": 0,
            "Techno & Trance": 0,
            "Opera": 0
		};
		selectedData.forEach(function(d) {
			selectedMap["Dance, Disco, & Funk"] += +d["Dance, Disco, & Funk"];
			selectedMap["Folk"] += +d["Folk"];
			selectedMap["Country"] += +d["Country"];
			selectedMap["Classical"] += +d["Classical"];
			selectedMap["Musicals"] += +d["Musicals"];
			selectedMap["Pop"] += +d["Pop"];
			selectedMap["Rock"] += +d["Rock"];
			selectedMap["Metal & Hardrock"] += +d["Metal & Hardrock"];
			selectedMap["Punk"] += +d["Punk"];
			selectedMap["Hiphop & Rap"] += +d["Hiphop & Rap"];
			selectedMap["Reggae & Ska"] += +d["Reggae & Ska"];
			selectedMap["Swing & Jazz"] += +d["Swing & Jazz"];
			selectedMap["Rock n' Roll"] += +d["Rock n' Roll"];
			selectedMap["Alternative"] += +d["Alternative"];
			selectedMap["Latin"] += +d["Latin"];
			selectedMap["Techno & Trance"] += +d["Techno & Trance"];
			selectedMap["Opera"] += +d["Opera"];
		});

		// format data
		var averageData = [];
		Object.keys(selectedMap).forEach(function(key) {
			averageData.push({
				axis: key,
				value: Math.round((+selectedMap[key]/total) * 100) / 100
			});
		});

		var struct = [{
			name: "Averages",
			axes: averageData
		}];

		console.log("averageData", struct);

		var radarChartOptions = { 
			w: radius,
			h: radius,
			margin: margin,
			maxValue: 5,
			levels: 5,
			roundStrokes: false,
			color: "#3498DB",
			format: "0.0%"
		};

		RadarChart("#vis2", struct, radarChartOptions);
	}

	this.update(data, initialLevel);
}