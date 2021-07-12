let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

let values = [];

let xScale;
let yScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select("#tooltip");

function drawCanvas() {
    svg.attr("width", width)
       .attr("height", height);
}

function generateScales() {
    xScale = d3.scaleLinear()
               .domain([d3.min(values, d => d["Year"] - 1), d3.max(values, d => d["Year"] + 1)])
               .range([padding, width - padding]);

    yScale = d3.scaleTime()
               .domain([d3.min(values, d => new Date(d["Seconds"] * 1000 - 10000)), d3.max(values, d => new Date(d["Seconds"] * 1000 + 10000))])
               .range([padding, height - padding]);
}

function drawPoint() {

    svg.selectAll("circle")
       .data(values)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("data-xvalue", d => d["Year"])
       .attr("data-yvalue", d => new Date(d["Seconds"] * 1000))
       .attr("cx", d => xScale(d["Year"]))
       .attr("cy", d => yScale(new Date(d["Seconds"] * 1000)))
       .attr("r", 5)
       .attr("fill", d => {
           if (d["Doping"]) {
               return "red";
           } else {
               return "blue";
           }
       })
       .on("mouseover", d => {
           tooltip.attr("data-year", d["Year"]).transition()
                  .style("visibility", "visible");
            if (d["Doping"]) {
                tooltip.text(`${d["Doping"]}`)
            } else {
                tooltip.text(`No doping allegations!`)
            }
       })
       .on("mouseout", d => tooltip.transition().style("visibility", "hidden"));

}

function generateAxes() {
    let xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format("d"));

    svg.append("g")
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height - padding})`);

    let yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform", `translate(${padding}, 0)`);

}


fetch(url)
    .then(response => response.json())
    .then(data => {
        values = data;
        console.log(values)
        drawCanvas();
        generateScales();
        drawPoint();
        generateAxes();
    });