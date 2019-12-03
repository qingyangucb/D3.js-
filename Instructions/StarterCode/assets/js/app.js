// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

function xScale(demoData, chosenXAxis) {
	var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.8,
      d3.max(demoData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

      return xLinearScale;
}


function yScale(demoData, chosenYAxis) {
	var yLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenYAxis]) * 0.8,
      d3.max(demoData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

      return yLinearScale;
}


function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}


function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXaxis, newYscale, chosenYaxis) 
{

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYscale(d[chosenYaxis]));

  return circlesGroup;
}


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    // .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${chosenXAxis} ${d[chosenXAxis]}%<br>
      						 ${chosenYAxis} ${d[chosenYAxis]}%`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
      // show(data) means show the data you assigned in the html element in return.
    
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// this file path is relative to the html file.
d3.csv("assets/data/data.csv").then(function(demoData) {
  

  demoData.forEach(function(data) {
  	data.state = +data.state;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;   
  });


  var xLinearScale = xScale(demoData, chosenXAxis);
  var yLinearScale = yScale(demoData, chosenYAxis);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
	.classed("x-axis", true)
	.call(bottomAxis)
	.attr("transform", `translate(0, ${height})`);

  var yAxis = chartGroup.append("g")
	.classed("y-axis", true)
	.call(leftAxis)
	
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "rgb(3, 219, 252)")
    .attr("opacity", ".5")
    .attr("class", d => d.abbr);




  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");


  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")


  var obesityLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -65)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity (%)");

  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -45)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", -200)
    .attr("y", -25)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lack Healthcare (%)");

  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


  xLabelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        chosenXAxis = value;

        xLinearScale = xScale(demoData, chosenXAxis);

   
        xAxis = renderXAxes(xLinearScale, xAxis);

 
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
  });

  yLabelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        chosenYAxis = value;

        yLinearScale = yScale(demoData, chosenYAxis);

   
        yAxis = renderYAxes(yLinearScale, yAxis);

 
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        if (chosenYAxis === "healthcare") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
  });




});
