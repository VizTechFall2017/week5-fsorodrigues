var svg = d3.select('svg').append('g').attr('transform','translate(100,100)');

//set up variables to hold two versions of the data, one for each year
var data2016;
var data2000;

//set up a tracker variable to watch the button click state
var clicked = true;

//set up scales to position circles using the data
var scaleX = d3.scalePoint().domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"]).range([0, 600]);
var scaleY = d3.scaleLinear().domain([0,1200]).range([400, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis


// Add the x Axis
svg.append("g")
    .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
    .call(d3.axisBottom(scaleX));

svg.append("g")
    .call(d3.axisLeft(scaleY));


//import the data from the .csv file
d3.csv('./incomeData.csv', function(dataIn){

    data2016 = dataIn.filter(function(d){
        return d.year == 2016;
    });

    data2000 = dataIn.filter(function(d){
        return d.year == 2000;
    });


    /*nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    console.log(nestedData.filter(function(d){return d.key == "2016"})[0].values);
    */


    svg.append('text')
        .text('Weekly income by age and gender')
        .attr('transform','translate(300, -20)')
        .style('text-anchor','middle');

    svg.append('text')
        .text('age group')
        .attr('transform','translate(260, 440)');

    svg.append('text')
        .text('weekly income')
        .attr('transform', 'translate(-50,250)rotate(270)');

    //bind the data to the d3 selection, but don't draw it yet
    svg.selectAll('circles')
        .data(data2016)
        .enter()
        .append('circle')
        .attr('class','w_dataPoints')
        .attr('r', 5)
        .attr('fill', "lime");

    svg.selectAll('circles')
        .data(data2016)
        .enter()
        .append('circle')
        .attr('class','m_dataPoints')
        .attr('r', 5)
        .attr('fill', "blue");

    //call the drawPoints function below, and hand it the data2016 variable with the 2016 object array in it
    drawPoints(data2016);

});

//this function draws the actual data points as circles. It's split from the enter() command because we want to run it many times
//without adding more circles each time.
function drawPoints(pointData){

    svg.selectAll('.w_dataPoints')  //select all of the circles with dataPoints class that we made using the enter() commmand above
        .data(pointData)          //re-attach them to data (necessary for when the data changes from 2016 to 2017)
        .attr('cx',function(d){   //look up values for all the attributes that might have changed, and draw the new circles
            return scaleX(d.age);
        })
        .attr('cy',function(d){
            return scaleY(d.women);
        });

    svg.selectAll('.m_dataPoints')  //do the same for the men's data series
        .data(pointData)
        .attr('cx',function(d){
            return scaleX(d.age);
        })
        .attr('cy',function(d){
            return scaleY(d.men);
        });
}

//this function runs when the HTML button is clicked.
function buttonClicked(){

    //check to see whether the tracker variable is true. If it is, use the 2017 data set
    if(clicked == true){
        drawPoints(data2000);  //call the draw function again, to redraw the circles
        clicked = false;       //reset the value of the tracker variable
    }
    else{   //if the tracker variable is not true, use the 2016 data set
        drawPoints(data2016);
        clicked = true;
    }



}
