function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  
  var panel = d3.select("#sample-metadata").html("")

  d3.json('/metadata/' + sample).then((response) => {

    d3.entries(response).forEach(r => {
      console.log(r);
      panel.append('p').text(r.key + ": " + r.value);
    });

  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  var pie_panel = d3.select("#pie")

  d3.json('/samples/' + sample).then((response) => {

    var data = [{
      values: response.sample_values.slice(1, 10),
      labels: response.otu_ids.slice(1, 10),
      type: 'pie',
    }];

    var layout = {
      title: 'Belly Button Pie Chart',
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', data, layout)

    var data = [{
      x : response.otu_ids,
      y : response.sample_values,
      mode : 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      },
      text : response.otu_labels
    }];

    var layout = {
      title: 'Belly Button Bubble Chart',
      height: 600,
      width: 2000
    }
    
    Plotly.newPlot('bubble', data, layout)

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
