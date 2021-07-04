/*
Assignment 2: COVID-19 Tracker

AUTHOR: Sudesh Sunichura 
Email: sunichur@sheridancollege.ca
CREATED: June 30 2021
UPDATED: July 3 2021

DESCRIPTION:  This file contains the JavaScript functionality for the COVID-19 Tracker.
              This file utilizes jQuery and Chart.js
*/

let go = {};

$(document).ready(() => {

    let prev = document.getElementById("prev");
    let next = document.getElementById("next");
    //grabbing JSON from web server
    let option = {url:"http://ejd.songho.ca/ios/covid19.json", 
                    type:"GET",
                    dataType: "JSON"};
    
    $.ajax(option).then(json => {

        //setting global variable equal to JSON
        go.json = json;
        
        //loading function with current selected value 'Canada'
        loadData($('#provinceSelect').val());
        displayData();
        //draw chart for 'Canada'
        drawChart(datesArray(), valuesArray());
        
        //index for incrementing through array
        var index = go.provData.length - 1;
        //event listener for previous and next buttons

        prev.addEventListener("click", ()=>{
            --index;
            dateChange(index);
        });

        next.addEventListener("click", ()=>{
                ++index;
                dateChange(index);
        });
        
        //When selection changes runs function to load new data
        ($('#provinceSelect')).change(function(){

            loadData((($('#provinceSelect')).val()));

            displayData();

            drawChart(datesArray(), valuesArray());
        
            var index = go.provData.length - 1;
                
            //click event handler
            prev.addEventListener("click", ()=>{
                --index;
                dateChange(index);
            });

            next.addEventListener("click", ()=>{
                    ++index;
                    dateChange(index);
            });
        })

    }).catch(() => log("error"));
});

//Load data according to dropdown selection
function loadData(choice){
    go.provData = go.json.filter(e => e.prname == choice);

    return go.provData.sort((a, b)=> {
        a.date.localeCompare(b.date);
    });
    }
    
//display data according to dropdown selection
function displayData(){
    let indexLast = go.provData.length - 1;
            
    document.getElementById("dailyNum").innerHTML = go.provData[indexLast]['numtoday']; 
    document.getElementById("totalNum").innerHTML = go.provData[indexLast]['numtotal']; 
    document.getElementById("dateDisp").innerHTML = go.provData[indexLast]['date']; 

}

//displaying data based on new index from button press
function dateChange(index){        
    document.getElementById("dailyNum").innerHTML = go.provData[index]['numtoday']; 
    document.getElementById("totalNum").innerHTML = go.provData[index]['numtotal']; 
    document.getElementById("dateDisp").innerHTML = go.provData[index]['date']; 

}

function valuesArray(){
    let lastIndex = go.provData.length - 1;
    const MS_PER_DAY = 24 *60 * 60 * 1000; 
    let start = new Date(go.provData[0].date).getTime();
    let end = new Date(go.provData[lastIndex].date).getTime();

    let dateCount = (end - start) / MS_PER_DAY + 1;

    let values = new Array(dateCount).fill(0);
    
    for(let e of go.provData){
        let currTime = new Date(e.date).getTime();
        let index = (currTime - start) / MS_PER_DAY;
        values[index] = e.numtoday;
    }

    return values;
}


function datesArray(){
    let lastIndex = go.provData.length - 1;
    const MS_PER_DAY = 24 *60 * 60 * 1000; 
    let start = new Date(go.provData[0].date).getTime();
    let end = new Date(go.provData[lastIndex].date).getTime();

    let dateCount = (end - start) / MS_PER_DAY + 1;

    let dates = new Array(dateCount).fill(0);
    
    for(let e of go.provData){
        let currTime = new Date(e.date).getTime();
        let index = (currTime - start) / MS_PER_DAY;
        dates[index] = e.date;
    }
    return dates;
}

function drawChart(dates, values){

    if(go.chart)
        go.chart.destroy();
    
    let context = document.getElementById("graph").getContext("2d");

    go.chart = new Chart(context, 
        {
            type: "line", 
            data:
                {
                    labels: dates, 
                    datasets:
                    [{
                        data: values,
                        lineTension: 0,
                        borderColor: "blue",
                        backgroundColor: "rgba(170, 209, 248, 0.3)"
                    }]
                },
                options:
                {
                    maintainAspectRatio: false,
                    title:
                    {
                        display: true,
                        text: "Daily Confirmed Cases",
                        fontSize: 16
                    },
                    legend:
                    {
                        display:false
                    }
                }
        });

}