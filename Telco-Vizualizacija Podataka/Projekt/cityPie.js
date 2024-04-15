async function crtajCityPie() {
    const data = await d3.json("telecom_customer_churn.json");
    const cityGroup = d3.group(data, d => d.City);
    const cityArray = Array.from(cityGroup, ([key, value]) => ({ city: key, count: value.length }));
    cityArray.sort((a, b) => b.count - a.count);
    const top5_gradovi = cityArray.slice(0, 5);

    const ostaliCount = cityArray.slice(5).reduce((total, city) => total + city.count, 0);
    const ostaliGradovi = { city: 'Other', count: ostaliCount };
    const gradoviArray = [...top5_gradovi, ostaliGradovi];
    const ukupna_suma = gradoviArray.reduce((total, city) => total + city.count, 0);
    const gradovi_posto = gradoviArray.map(city => ({
        city: city.city,
        count: ((city.count / ukupna_suma) * 100).toFixed(2)
    }));

    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 90, bottom: 20, left: 30 };
    const graf_sirina = width - margin.left - margin.right;
    const graf_visina = height - margin.top - margin.bottom;
    const radius = Math.min(graf_sirina, graf_visina) / 2 - margin.left;
    
    const color = d3.scaleOrdinal()
        .domain(gradovi_posto.map(city => city.city))
        .range(["#800f2f","#a4133c","#c9184a","#ff4d6d","#ff758f","#590d22"]);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const svg = d3
        .select("#gradovi")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + graf_visina / 2 + "," + graf_visina / 2 + ")");

    const arcs = svg.selectAll("arc")
        .data(pie(gradovi_posto))
        .enter()
        .append("g")
        .attr("class", "arc");

        arcs.append("path")
        .attr("d", arc)
        .style("stroke","#cce0ff")
        .style("stroke-width",1.2)
        .attr("fill", d => color(d.data.city))
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", d3.arc().innerRadius(0).outerRadius(radius * 1.1));
    
            const tooltipText = `${d.data.city}: ${d.data.count}%`;
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
    
            tooltip.html(tooltipText)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px');
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc);
    
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });
    
    const tooltip = d3.select("#gradovi")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "2px solid black")
        .style("position", "absolute")
        .style("padding", "15px")
        .style("border-radius", "5px");
    
    const legend = svg.selectAll(".legend")
        .data(gradovi_posto.map(city => city.city))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width / 1.85 )
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d));

    legend.append("text")
        .attr("x", width / 1.9 )
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);
};

crtajCityPie();
