async function crtajChurnReason(){
    const data = await d3.json("telecom_customer_churn.json");
    const reason_group = d3.map(data, d => d["Churn Category"]);
    const categories = ["Attitude", "Competitor", "Dissatisfaction", "Other", "Price"];
    const reason_count = categories.map(category => {
        return { category, count: reason_group.filter(value => value === category).length };
    });

    const sirina = 500;
    let dimenzije = {
        sirina: sirina,
        visina: sirina,
        margine: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 150,
        },
    };
    dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;
    dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;

    var okvir = d3
        .select("#otkazivanje")
        .append("svg")
        .attr("height", dimenzije.visina)
        .attr("width", dimenzije.sirina);

    var ySkala = d3.scaleBand()
        .domain(reason_count.map(d => d.category))
        .range([dimenzije.grVisina, 0])
        .padding(0.1);

    var xSkala = d3.scaleLinear()
        .domain([0, d3.max(reason_count, d => d.count)])
        .nice()
        .range([0, dimenzije.grSirina]);

    okvir.append("g")
        .attr("transform", "translate(" + dimenzije.margine.left + "," + dimenzije.margine.top + ")")
        .call(d3.axisLeft(ySkala))
        .selectAll("text")
        .style("font-size", "14px");

    var maxCount = d3.max(reason_count, d => d.count);

    var stupci = okvir.selectAll(".stupci")
        .data(reason_count)
        .enter()
        .append("g")
        .attr("class", "stupci")
        .attr("transform", d => "translate(" + dimenzije.margine.left + "," + (ySkala(d.category) + dimenzije.margine.top) + ")");

    stupci.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", d => xSkala(d.count))
        .attr("height", ySkala.bandwidth())
        .attr("fill", d => d.count == maxCount ? "#DF9758" : "#888BE6");

    stupci.append("text")
        .attr("x", d => xSkala(d.count))
        .attr("y", ySkala.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -40)
        .style("font-size", "20px")
        .style("fill", "white")
        .text(d => d.count);

    okvir.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0-dimenzije.margine.left/4)
        .attr("x",0-(dimenzije.visina/1.7))
        .attr("dy","4em")
        .style("text-anchore","middle")
        .style('font-size', '18px')
        .text("Churn Category");

    okvir.append('text')
        .attr('transform', `translate(${dimenzije.sirina / 1.6},${dimenzije.visina + dimenzije.margine.top-70})`)
        .style('text-anchor', 'middle')
        .style('font-size', '18px')
        .text('Count');

};
crtajChurnReason();
