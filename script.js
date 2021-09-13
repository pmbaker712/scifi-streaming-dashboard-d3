const url = "https://assets.codepen.io/1940996/sci_fi_movies_updated.csv";

// Scatterplot container dimensions
const w = 500;
const h = 450;
const xpad = 60;
const ypad = 60;
const size = 6;

// Color palette
const lightred = "#ff7777";
const lightgreen = "#55ff55";
const lightblue = "#9999ff";
const darkyellow = "#cccc00";
const lightcyan = "#99ffff"
const darkgray = "#222222";

// Initialize button values
let netflixBtn = true;
let huluBtn = true;
let primeBtn = true;
let disneyBtn = true;

d3.csv(url, function (data) {
  
  // Initialized filtered data as full data
  let filteredData = data;
  
  // Function to calculate platform average scores
  function getPlatformAvg (column, scoreType) {
    let avg = 0;
    let platformData = data.filter(function(d) {return d[column]==1});

    if (scoreType == "IMDb") {
      avg = d3.format(".2f")(d3.mean(platformData, d => d.IMDb));
    } else if (scoreType == "RT") {
      avg = d3.format(".2f")(d3.mean(platformData, d => d.RottenTomatoes));
    };
    return avg;
  };
  
  // Create IMDb and RT score KPIs in header
  
  const netflixIMDb = getPlatformAvg("Netflix", "IMDb");
  const netflixRT = getPlatformAvg("Netflix", "RT");
  const huluIMDb = getPlatformAvg("Hulu", "IMDb");
  const huluRT = getPlatformAvg("Hulu", "RT");
  const primeIMDb = getPlatformAvg("PrimeVideo", "IMDb");
  const primeRT = getPlatformAvg("PrimeVideo", "RT");
  const disneyIMDb = getPlatformAvg("DisneyPlus", "IMDb");
  const disneyRT = getPlatformAvg("DisneyPlus", "RT");
  
  document.getElementById("imdb-kpi").innerHTML = "IMDb Avg: Netflix - " + netflixIMDb 
    + " Hulu: " + huluIMDb + " Prime: " + primeIMDb + " Disney: " + disneyIMDb;
  document.getElementById("rt-kpi").innerHTML = "RT Avg: Netflix - " + netflixRT 
    + " Hulu: " + huluRT + " Prime: " + primeRT + " Disney: " + disneyRT;
 
   // Axis max and min
  const xmax = d3.max(data, d => d.IMDb);
  const xmin = d3.min(data, d => d.IMDb);
  const ymax = d3.max(data, d => d.RottenTomatoes);
  const ymin = d3.min(data, d => d.RottenTomatoes); 
 
  // Create scales
  const xScale = d3.scaleLinear()
                   .domain([xmin, xmax])
                   .range([xpad, w - xpad]);

  const yScale = d3.scaleLinear()
                   .domain([ymin, ymax])
                   .range([h - ypad, ypad]);
  
  // Create SVG
  const svg = d3.select(".container-left")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

  // Draw initial chart
  svg.selectAll("rect")
     .data(filteredData)
     .enter()
     .append("rect")
     .attr("class", "square")
     .attr("x", d => xScale(d.IMDb))
     .attr("y", d => yScale(d.RottenTomatoes))
     .attr("width", size)
     .attr("height", size)
     .attr("fill", function (d) {
     // Dark yellow color for multiple platforms
          if (parseInt(d.Netflix) 
            + parseInt(d.Hulu) 
            + parseInt(d.PrimeVideo) 
            + parseInt(d.DisneyPlus) > 1) {return darkyellow;} 
          else if (d.Netflix == 1) {return lightred;} 
          else if (d.Hulu == 1) {return lightgreen;}
          else if (d.PrimeVideo == 1) {return lightcyan;}
          else if (d.DisneyPlus == 1) {return lightblue;};
      })
    // Tooltip behavior
    .on("mouseover", function (d) {
        
      d3.select("#tooltip")
        .html("Title: " + d.Title + "<br>" +
              "Year: " + d.Year + "<br>" +
              "Director: " + d.Directors + "<br>" +
              "IMDb Score: " + d.IMDb + "<br>" +
              "Rotten Tomates Score: " + d.RottenTomatoes + "<br><br>" +
              "Platforms: " + d.Platforms + "<br>")
        .transition()
        .duration(200)
        .style("opacity", 1)
    })
    .on("mouseout", function () {
      d3.select("#tooltip")
        .style("opacity", 0);
    });
  
 // Function to update chart with filtered data 
 function updateChart(newData) {
    
   let squares = svg.selectAll("rect")
                    .data(newData, function(){});
  
   // Remove existing squares
   squares.exit()
          .transition()
          .duration(1000)
          .attr("height", 0)
          .remove();

   squares.enter()
          .append("rect")
          .attr("class", "square")
          .attr("height", 0)
          .attr("x", d => xScale(d.IMDb))
          .attr("y", d => yScale(d.RottenTomatoes))
          .attr("width", size)
          .on("mouseover", function (d) {
            d3.select("#tooltip")
              .html("Title: " + d.Title + "<br>" +
                  "Year: " + d.Year + "<br>" +
                  "Director: " + d.Directors + "<br>" +
                  "IMDb Score: " + d.IMDb + "<br>" +
                  "Rotten Tomates Score: " + d.RottenTomatoes + "<br><br>" +
                  "Platforms: " + d.Platforms + "<br>")
              .transition()
              .duration(200)
              .style("opacity", 1)
            })
         .on("mouseout", function () {
           d3.select("#tooltip")
             .style("opacity", 0);
         })
        .transition()
        .duration(1000)
        .attr("height", size)
        .attr("fill", function (d) {
           if (parseInt(d.Netflix) 
             + parseInt(d.Hulu) 
             + parseInt(d.PrimeVideo) 
             + parseInt(d.DisneyPlus) > 1) {return darkyellow;} 
           else if (d.Netflix == 1) {return lightred;} 
           else if (d.Hulu == 1) {return lightgreen;}
           else if (d.PrimeVideo == 1) {return lightcyan;}
           else if (d.DisneyPlus == 1) {return lightblue;}
           else {return "gray";};
        });  
    };
  
  // Function to set button behavior
  function button (buttonId, buttonVar, column, color) {
  
    d3.select(buttonId)
      .on("click", function() {
        if (buttonVar == true) {
          d3.select(buttonId)
            .style("background-color", "#202020")
            .style("color", color);
          buttonVar = false;
          filteredData = filteredData.filter(function(d) {
            return d[column]==0
          });
          updateChart(filteredData);
      } else if (buttonVar == false) {
          d3.select(buttonId)
            .style("background-color", color)
            .style("color", "black");
          buttonVar = true;
          filteredData = filteredData.concat(
            data.filter(function(d) {
              return (d[column]==1 && !filteredData.includes(d)) 
            })
          );
        updateChart(filteredData);
      };
    });    
  };
  
  // Set button behavior
  button("#netflix", netflixBtn, "Netflix", lightred);
  button("#hulu", huluBtn, "Hulu", lightgreen);
  button("#prime", primeBtn, "PrimeVideo", lightcyan);
  button("#disney", disneyBtn, "DisneyPlus", lightblue);
  
  // Create axes
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.format("d"));

  svg.append("g")
     .attr("transform", "translate(0," + (h - ypad) + ")")
     .attr("id", "x-axis")
     .attr("class", "axis")
     .call(xAxis);

  svg.append("g")
     .attr("transform", "translate(" + xpad + ",0)")
     .attr("id", "y-axis")
     .attr("class", "axis")
     .call(yAxis);

  svg.append("g")
     .attr("transform", "translate(15,225)")
     .append("text")
     .style("font-family", "Orbitron")
     .attr("fill", "white")
     .attr("text-anchor", "middle")
     .attr("transform", "rotate(-90)")
     .text("Rotten Tomatoes Score");
  
  svg.append("g")
     .attr("transform", "translate(255,435)")
     .append("text")
     .style("font-family", "Orbitron")
     .attr("fill", "white")
     .attr("text-anchor", "middle")
     .text("IMDb Score");
  
});
