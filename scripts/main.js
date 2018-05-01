// main.js
console.log("main.js");

// read in our CSV file
d3.csv("./data/music_no_blanks.csv", function(datum){ 
        return {
            "Likes_Music": +datum["Music"],
            "Dance, Disco, & Funk": +datum["Dance"],
            "Folk": +datum["Folk"],
            "Country": +datum["Country"],
            "Classical": +datum["Classical music"],
            "Musicals": +datum["Musical"],
            "Pop": +datum["Pop"],
            "Rock": +datum["Rock"],
            "Metal & Hardrock": +datum["Metal or Hardrock"],
            "Punk": +datum["Punk"],
            "Hiphop & Rap": +datum["Hiphop, Rap"],
            "Reggae & Ska": +datum["Reggae, Ska"],
            "Swing & Jazz": +datum["Swing, Jazz"],
            "Rock n' Roll": +datum["Rock n roll"],
            "Alternative": +datum["Alternative"],
            "Latin": +datum["Latino"],
            "Techno & Trance": +datum["Techno, Trance"],
            "Opera": +datum["Opera"]
        };
    }, function(data) {
        var donutchart = new DonutChart(d3.select("#vis1"), data,
            function() {
                radarchart.update(data, donutchart.selectedLevel);
                parallelsets.update(data, donutchart.selectedLevel);
            });

        var radarchart = new Radar(d3.select("#vis2"), data, 5);
        var parallelsets = new ParallelSets(d3.select("#vis3"), data, 5);
    });