async function crtajGeoPlot() {
    const width = 500;
    const height = 500;
  
    const svg = d3.select("#mapa")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
    const projection = d3.geoMercator();
  
    const path = d3.geoPath().projection(projection);
  
    try {
        // Fetch both datasets
        const [geojsonPromise, citiesPromise] = await Promise.all([
            fetch('california.json'),
            fetch('telecom_customer_churn.json')
        ]);
  
        const geojson = await geojsonPromise.json();
        const citiesData = await citiesPromise.json();
  
        projection.fitSize([width, height], geojson);
  
        // Visualize geojson data
        svg.append("path")
          .datum(geojson)
          .attr("d", path)
          .style("opacity",0.8)
          .style("stroke","DarkGoldenRod")
          .style("stroke-width",1.5)
          .attr("fill","BlanchedAlmond");
  
        // Group city coordinates data by coordinates
        const groupedCities = d3.group(citiesData, d => `${d.Longitude},${d.Latitude}`);
        
        // Calculate circle radius based on frequency of occurrence
        const frequencies = Array.from(groupedCities, ([, value]) => value.length);
        const minFrequency = Math.min(...frequencies);
        const maxFrequency = Math.max(...frequencies);
        const radiusScale = d3.scaleLinear()
                              .domain([minFrequency, maxFrequency])
                              .range([1, 10]); // Adjust range as needed
        
        // Define color scale
        var colorScale = d3.scaleLinear()
                            .domain([minFrequency, maxFrequency])
                            .range(["#988CDF", "#454566"]);
  
        // Visualize city coordinates data
        const g = svg.append("g");
        g.selectAll('circle')
            .data(groupedCities)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                const coords = d[0].split(',');
                return projection([+coords[0], +coords[1]])[0];
            })
            .attr('cy', function (d) {
                const coords = d[0].split(',');
                return projection([+coords[0], +coords[1]])[1];
            })
            .attr('r', function(d) {
                return radiusScale(d[1].length);
            })
            .style('fill', function (d) {
                return colorScale(d[1].length);
            })
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .style('fill', 'red')
                    .attr('r', function(d) {
                        return radiusScale(d[1].length) * 1.5; // Increase radius on hover
                    });
                
                const grad_tekst = d3.select('#legenda');
                const { left, top } = grad_tekst.node().getBoundingClientRect();
                const x = event.clientX - left + window.scrollX;
                const y = event.clientY - top + window.scrollY - 80;
                
                grad_tekst.style('left', `${x}px`)
                    .style('top', `${y}px`)
                    .style('display', 'block')
                    .style("border", "2px solid black")
                    .style("border-radius", "5px")
                    .style("padding", "15px")
                    .style('opacity', 0.8);
                
                d3.select("#grad").text(d[1][0].City);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .style('fill', function (d) {
                        return colorScale(d[1].length);
                    })
                    .attr('r', function(d) {
                        return radiusScale(d[1].length);
                    });
                
                d3.select('#legenda')
                    .style('display', 'none');
                
                d3.select("#grad").text('');
            });
  
    } catch (error) {
        console.error(error);
    }
  }
  
  crtajGeoPlot();
  