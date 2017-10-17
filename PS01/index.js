var height = 600;
var width = 800;

var padding = { "top": 125,
                "right": 0,
                "bottom": 0,
                "left": 100 };

// creating global variable to access csv data
var nestedData;

var svg = d3.select(".svg-container")
              .append("svg")
              .attr("height", height)
              .attr("width", width)
              .append("g")
              .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var scaleX = d3.scaleLinear()
                 .domain([0,450000])
                 .range([0,600])
                 .nice(); // making scale end in round number

var scaleY = d3.scaleLinear()
                .domain([150000,0])
                .range([0,400])
                .nice(); // making scale end in round number

var selectedDepartment;

d3.csv("./data_original.csv", function(error, data) {
    if (error) { throw error };

    // allData = data; // passing data to global variable

    // parsing for number output
    data.forEach(function(d){
      d.regular = +d.regular;
      d.retro = +d.retro;
      d.other = +d.other;
      d.overtime = +d.overtime;
      d.injured = +d.injured;
      d.detail = +d.detail;
      d.quinn = +d.quinn;
      d.total = +d.total;
    });

    var dataIn = data.filter( function(d) {
                     return d.overtime >= 2000
    });

    nestedData = d3.nest()
        .key(function(d){ return d.department_name })
        // .sortKeys(d3.ascending) // sorting departments A-Z
        .entries(dataIn)
        .sort(function(a, b){ return d3.descending(a.values, b.values); }) // sorting departments by number of entries
        .filter(function(d) { return d.values.length >= 10 });

    console.log(nestedData);

    // calling option menu
    optionMenu();

    // grabbing first element from nested data set
    var firstElement = d3.select("option").property("value");

    selectedDepartment = updateData(firstElement);

    // calling title, subtitle and axis labels
    chartTitle();
    chartSubtitle();
    xLabel();
    yLabel();

    // calling axis
    xAxis(scaleX);
    yAxis(scaleY);

    // drawing circles
    drawPoints(selectedDepartment);

});


//defining function to append select menu
function optionMenu() {

  var menu = d3.select(".menu-container")
                 .append("select")
                 .attr("type", "dropdown-menu")
                 .on("change", option);

      menu.selectAll("option")
           .data(nestedData)
           .enter()
           .append("option")
           .text(function(d) { return d.key + " (" + d.values.length + ")" })
           .attr("value", function(d) { return d.key });
};

// defining function to return different colors according to criteria
function colorFill(d) { if (d.department_name == "Boston Fire Department") {
                                  return "#FF2819"

                      } else if (d.department_name == "Boston Police Department") {
                                  return "#123456"
                                }
                        else {
                                  return "#5d3d82"
                        }
                     };

//defining function to redraw circles on SVG canvas
function drawPoints(dataPoints) {

        // binding data to selection
        var selection = svg.selectAll("circle")
            .data(dataPoints)

       // UPDATE (updating attributes of existing circles)
       selection.transition()
                .duration(500)
                .ease(d3.easeSin)
                .attr("cx", function(d) { return scaleX(d.total) })
                .attr("cy", function(d) { return scaleY(d.overtime) })
                .attr("r", 5)
                .attr("fill", colorFill)
                .attr("opacity", .7);

       // ENTER (appends new circles)
        selection.enter().append("circle")
                  .attr("cx", function(d) { return scaleX(d.total) })
                  .attr("cy", function(d) { return scaleY(d.overtime) })
                  .attr("r", 0)
                    .transition()
                    .duration(500)
                    .ease(d3.easeSin)
                  .attr("r", 5)
                  .attr("fill", colorFill)
                  .attr("opacity", .7);

        // EXIT (removes circles not bound with data)
        selection.exit()
                    .transition()
                    .duration(200)
                    .ease(d3.easeSin)
                  .attr("r", 0)
                 .remove();

};

// defining functions to append title, subtitle and labels to axis
function chartTitle() {
          svg.append("text")
               .attr("x", 0)
               .attr("y", -50)
               .attr("font-size", 24)
               .text("City of Boston payroll, 2016");
};

function chartSubtitle() {
          svg.append("text")
               .attr("x", 0)
               .attr("y", -25)
               .attr("font-size", 16)
               .text("Minimum overtime of $2,000");
};

function xLabel() {
          svg.append("text")
              .attr("x", 300)
              .attr("y", 440)
              .attr("font-size", 13)
              .attr("text-anchor", "middle")
              .text("Total earnings, in USD");
};

function yLabel() {
          svg.append("text")
               .attr("transform", "rotate(270)")
               .attr("x", -200)
               .attr("y", -60)
               .attr("font-size", 13)
               .attr("text-anchor", "middle")
               .text("Overtime earnings, in USD");
};

// defining functions to append axis
function xAxis(scale) {
          svg.append("g")
              .attr("transform", "translate(0,400)")
              .call(d3.axisBottom(scale));
};

function yAxis(scale) {
          svg.append("g")
              .attr("transform", "translate(0,0)")
              .call(d3.axisLeft(scale));
};

// defining function to update data set
function updateData(newSelection) {

    return nestedData.filter(function(d){ return d.key == newSelection })[0].values
};

// defining event listener function
function option() {
  selectValue = d3.select(this).property("value")
  newData = updateData(selectValue);
  drawPoints(newData);

};
