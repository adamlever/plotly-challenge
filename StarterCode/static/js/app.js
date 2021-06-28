// Define inital function to run on page load
function innit() {
    // Use D3 to read the samples.json file
    d3.json("data/samples.json").then((importedData) => {
        console.log(importedData);

        // Filter the imported data to extract sample names
        var sampleNames = importedData.names;
        console.log(sampleNames);

        // Set dropdown menu location
        dropdownMenu = d3.select("#selDataset");

        // Append sample name values to the dropdown menu
        sampleNames.forEach((name) => {
        dropdownMenu.append("option").text(name).property("value", name);
        })
        
        //  Run the initial metadata and chart function
        buildMetadata(sampleNames[0])
        buildChart(sampleNames[0])
    });
}


// Define function to build metadata for each sample from samples.json file
function buildMetadata(subject) {
    console.log(subject)
    // Use D3 to read the samples.json file
    d3.json("data/samples.json").then((importedData) => {
        
        // Filter the imported data to extract the metadata
        var metaData = importedData.metadata;
        console.log(metaData);

        // Filter the metadata for chosen subject
        var subjectMetadata = metaData.filter(object => object.id == subject);
        console.log(subjectMetadata[0])

        // Set location for the metadata
        var metadataPanel = d3.select("#sample-metadata");

        // Clear any previous metadata
        metadataPanel.html("")

        // Append metadata for sample into the selected panel
        Object.entries(subjectMetadata[0]).forEach(([key, value]) => { 
        metadataPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}


//  Define function to build charts from samples.json file data
function buildChart(subject) {
    console.log(subject)
    // Use D3 to read the samples.json file
    d3.json("data/samples.json").then((importedData) => {

        // Define samples array
        var samples = importedData.samples;
        console.log(samples)

        // Filter the samples array for results of the selected sample
        filterResult = samples.filter(sampleObject => sampleObject.id == subject)[0]
        console.log(filterResult)

        //  Define otu ids
        var otu_ids = filterResult.otu_ids
        console.log(otu_ids)
        
        // Define otu sample values
        var sample_values = filterResult.sample_values
        console.log(sample_values)
        
        // Define  otu labels
        var otu_labels = filterResult.otu_labels
        console.log(otu_labels)
    
       
        // BAR CHART //
        // Slice the first 10 sample values for plotting and reverse their order
        barchartValues = sample_values.slice(0, 10).reverse();
        console.log(barchartValues);

        // Slice the first 10 otu ids for plotting and reverse their order
        barchartLabels = otu_ids.slice(0, 10);
        console.log(barchartLabels);
        
        // Format barchart labels
        barchartformatLabels = barchartLabels.map(label => "OTU " + label);
        console.log(barchartformatLabels);

        // Slice the first 10 otu labels for plotting and reverse their order
        barchartHovertext = otu_labels.slice(0, 10).reverse();
        console.log(barchartHovertext);

        // Create trace for bar chart
        var barTrace = {
            x: barchartValues,
            y: barchartformatLabels,
            text: barchartHovertext,
            type: "bar",
            orientation: "h",
            marker: {
                color: ["#f8f3ec",
                "#f4f1e4",
                "#e9e7c9",
                "#e5e8b0",
                "#d5e599",
                "#b7cd8f",
                "#8bc086",
                "#89bc8d",
                "#84b589",
                "#81b18d"]
            }
        };

        // Set data variable from trace for bar chart
        var horizontalchartData = [barTrace];

        // Set layout for bar chart
        var barLayout = {
            margin: {
            l: 130,
            r: 80,
            t: 5,
            b: 20
            }
        };

        // Render the bar chart plot to the div tag with id "bar"
        Plotly.newPlot("bar", horizontalchartData, barLayout);

        
        // BUBBLE CHART //
        // Create trace for bubble chart
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'YlGnBu',
                size: sample_values
            }
        };

        // Set data variable from trace for bubble chart
        var bubblechartData = [bubbleTrace];

        // Set layout for bubble chart
        var bubbleLayout = {
            xaxis: {
                title:'OTU ID'
            },
            margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 80
            }
        };

        // Render the bar chart plot to the div tag with id "bubble"
        Plotly.newPlot("bubble", bubblechartData, bubbleLayout);


        // GUAGE CHART //
        // Filter the imported data to extract the metadata
        var metaData = importedData.metadata;
        console.log(metaData);

        // Filter the metadata for chosen subject
        var subjectMetadata = metaData.filter(object => object.id == subject);
        console.log(subjectMetadata[0])

        // Define washing frequency
        var washingFrequency = subjectMetadata[0].wfreq;
        console.log(washingFrequency)

        // Create trace for guage chart
        var guageTrace = {
            domain: { x: [0, 1], y: [0, 1] },
            type: "indicator",
            mode: "gauge",
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            value: washingFrequency,
            gauge: {
                axis: {
                    range: [0, 9],
                    ticktext: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                    tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]                  
                },            
                steps: [
                    { range: [0, 1], color: "#f8f3ec"},
                    { range: [1, 2], color: "#f4f1e4"},
                    { range: [2, 3], color: "#e9e7c9"},
                    { range: [3, 4], color: "#e5e8b0"},
                    { range: [4, 5], color: "#d5e599"},
                    { range: [5, 6], color: "#b7cd8f"},
                    { range: [6, 7], color: "#8bc086"},
                    { range: [7, 8], color: "#89bc8d"},
                    { range: [8, 9], color: "#84b589" },
                ],
                bar: {thickness: 0}
            },                    
        };
            
        // Create needle
        // Angle of each washing frequency segment on chart
        var angle = (washingFrequency / 9) * 180;

        // Set the end point of needle
        var degrees = 180 - angle;
            radius = .75;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath + pathX + " " + pathY + pathEnd;

        // Create trace for guage chart needle
        var needleTrace = {
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { 
                size: 20, 
                color: '#913831' 
            },
            name: washingFrequency,
            hoverinfo: 'name'
        };

        // Set data variable from trace for guage and needle for guage chart
        var guagechartData = [guageTrace, needleTrace];

        // Set layout for bar chart
        var guageLayout = {
            margin: {
                l: 30,
                r: 30,
                t: 10,
                b: 40
            },
            xaxis: {
                range: [-1, 1],
                zeroline: false,
                showticklabels: false,
                showgrid: false
            },
            yaxis: {
                range: [-0.5, 1.5],
                zeroline: false,
                showticklabels: false,
                showgrid: false
            },
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '#913831',
                line: {
                    color: '#913831'
                }
            }],
        };
        
    // Render the gauge chart plot to the div tag with id "gauge"
    Plotly.newPlot("gauge", guagechartData, guageLayout);

    })
}


//  Define function to change metadata and charts on change of the dropdown menu
function optionChanged(newsubject) {
    buildMetadata(newsubject);
    buildChart(newsubject);
    console.log(newsubject)
};


// Run initial function on start up
innit()