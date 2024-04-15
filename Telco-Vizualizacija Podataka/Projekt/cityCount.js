async function crtajCityCount(){
    const data = await d3.json('telecom_customer_churn.json');
    const cityGroup = d3.group(data, d=>d.City);
    const cityArray = Array.from(cityGroup,([key, value])=>({city : key , count: value.length }));
    cityArray.sort((a,b)=>b.count - a.count);
    const top10_gradovi = cityArray.slice(0,10);
    console.log(cityGroup);
    console.log(cityArray);
    console.log(top10_gradovi);

    var height=400;
    var width=700;
    var margin = { top: 20, right: 30, bottom: 50, left: 130 };

    var svg = d3
        .select("#gradovi")
        .append("svg")
        .attr("height",height)
        .attr("width",width);

    var y = d3.scaleBand()
        .domain(top10_gradovi.map(d=>d.city))
        .range([height-margin.bottom,margin.top])
        .padding(0.1)

    var x = d3.scaleLinear()
        .domain([0,d3.max(top10_gradovi, d=>d.count)])
        .nice()
        .range([margin.left, width-margin.right])

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "14px");

    // Dodavanje x osi na SVG
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-size", "18px");

    
    // Dodavanje stupaca na grafikon
    svg.selectAll("rect")
    .data(top10_gradovi)
    .enter()
    .append("rect")
    .attr("x", margin.left)
    .attr("y", d => y(d.city))
    .attr("width", d => x(d.count) - margin.left)
    .attr("height", y.bandwidth())
    .attr("fill", "darkblue")
    .on("mouseover", function(event, data) {
        d3.select(this).attr("fill", "DeepSkyBlue");
        const x_Pozicija = event.clientX + window.scrollX + 30;
        const y_Pozicija = event.clientY + window.scrollY;
        const obavijest = d3
            .select("#gradovi")
            .append("div")
            .attr("id", "obavijest")
            .style("background-color", "white")
            .style("border", "2px solid black")
            .style("position", "absolute")
            .style("padding", "15px")
            .style("border-radius", "5px")
            .style("opacity", 0.9)
            .html(`${data.city}: ${data.count}`)
            .style('left', x_Pozicija + 'px')
            .style('top', y_Pozicija + 'px'); 
    })
    .on("mouseout", function() {
        d3.select(this).attr("fill", "darkblue");
        d3.select("#obavijest").remove(); 
    });

    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0-margin.left/3)
        .attr("x",0-(height/2))
        .attr("dy","4em")
        .style("text-anchore","middle")
        .text("City")

    svg.append('text')
        .attr('transform', `translate(${width / 1.75},${height + margin.top -25})`)
        .style('text-anchor', 'middle')
        .text('Count');


};
crtajCityCount();