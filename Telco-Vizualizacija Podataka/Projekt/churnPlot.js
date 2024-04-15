async function crtajScatterPlot(){

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const churn_reason = d3.group(data,d =>d['Customer Status']);
    const churn_array = Array.from(churn_reason,([key, value]) =>({status: key , count: value.length }));
    //console.log(churn_array);
    const total_sum = churn_array.reduce((total,status) => total + status.count, 0);
    const churn_percent = churn_array.map(status=>({
        status: status.status,
        count: ((status.count / total_sum)*100).toFixed(2)
    }));
    //console.log(churn_percent);

    const sirina=500;
    let dimenzije={
        sirina: sirina,
        visina : sirina,
        margin:{
            top:50,
            right:50,
            bottom:50,
            left:50,
        },
    };
    dimenzije.grVisina = dimenzije.visina - dimenzije.margin.top - dimenzije.margin.bottom;
    dimenzije.grSirina = dimenzije.sirina - dimenzije.margin.left - dimenzije.margin.right;
    const radius = Math.min(dimenzije.grSirina, dimenzije.grVisina) / 2 - dimenzije.margin.left;

    const color = d3.scaleOrdinal()
        .domain(churn_percent.map(status => status.status))
        .range(["MediumAquaMarine","LightSalmon","MediumSpringGreen"]);

    const churn_pie = d3.pie()
        .value(d=>d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const okvir = d3.select("#otkazivanje")
        .append("svg")
        .attr("width",dimenzije.sirina)
        .attr("height",dimenzije.visina)
        .append("g")
        .attr("transform","translate(" + dimenzije.grSirina / 2 + "," + dimenzije.grVisina / 2 + ")");

    const kut = okvir.selectAll("arc")
        .data(churn_pie(churn_percent))
        .enter()
        .append("g")
        .attr("class", "arc");

    //console.log(kut);

    kut.append("path")
        .attr("d",arc)
        .attr("fill", d=>color(d.data.status))
        .on("mouseover", function(event, d) {
            var darkerColor = d3.color(d3.select(this).style("fill")).darker(0.8);
            d3.select(this)
                .transition()
                .duration(300)
                .attr("d", d3.arc().innerRadius(0).outerRadius(radius * 1.1))
                .style("stroke",darkerColor)
                .style("stroke-width",10);
        
            const selectedStatus = churn_array.find(status => status.status == d.data.status);
            const churn_text = `${d.data.status} : ${d.data.count}% (${selectedStatus.count})`;
            
            const X_pozicija = event.clientX + window.scrollX + 30;
            const Y_pozicija = event.clientY + window.scrollY + 30;
            
            obavijest.style("opacity", .9)
                .text(churn_text)
                .style("left", X_pozicija + "px")
                .style("top", Y_pozicija + "px")
                .transition()
                .duration(100);

        })
        
        .on("mouseout",function(){
            d3.select(this)
                .transition()
                .duration(300)
                .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
                .style("stroke",d => color(d.status))
                .style("stroke-width",0);

            obavijest.style("opacity",0)
                .transition()
                .duration(100);
        })

        const obavijest =d3.select("#otkazivanje")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "2px solid black")
            .style("position", "absolute")
            .style("padding", "15px")
            .style("border-radius", "5px");

        const legenda = okvir.append("g")
            .attr("class", "legenda")
            .attr("transform", "translate(" + (dimenzije.sirina / 2) + ", 0)");
        
        const legenda_elementi = legenda.selectAll("g")
            .data(churn_percent)
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });
        
        legenda_elementi.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => color(d.status));
        
        legenda_elementi.append("text")
            .attr("x", -5)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d.status);   
};
crtajScatterPlot();