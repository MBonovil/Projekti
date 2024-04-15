async function plotAgePlot() {

  const sirina_age=1000;
    let dimenzije_age = {
        sirina_age : sirina_age,
        visina_age : sirina_age - 500,
        margine_age:{
            top:40,
            right:0,
            bottom:30,
            left:70,
        },
    };
    dimenzije_age.grSirina = dimenzije_age.sirina_age - dimenzije_age.margine_age.left - dimenzije_age.margine_age.right;
    dimenzije_age.grVisina = dimenzije_age.visina_age - dimenzije_age.margine_age.top - dimenzije_age.margine_age.bottom;

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const age_group = d3.group(data,d=>d.Age)
    //console.log(age_group);
    const ageArray = Array.from(age_group,([key,value])=>({age : key , count : value.length})).sort((a, b) => b.age - a.age);
    //console.log(ageArray);

    const okvir = d3
        .select("#okvir_2")
        .append("svg")
        .attr("class","agePlot")
        .attr("width",dimenzije_age.sirina_age)
        .attr("height",dimenzije_age.visina_age)

    const xSkala = d3
        .scaleBand()
        .domain(ageArray.map(d=>d.age))
        .range([dimenzije_age.grSirina, dimenzije_age.margine_age.left])
        .padding(0.2);

    const ySkala = d3
        .scaleLinear()
        .domain([0,d3.max(ageArray, d=>d.count)])
        .nice()
        .range([dimenzije_age.grVisina,dimenzije_age.margine_age.top])

    okvir.append("g")
        .style("transform", `translateY(${dimenzije_age.grVisina}px)`)
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor","middle")
        .style("font-size","12px")

    okvir.append("g")
        .attr("transform", `translate(${dimenzije_age.margine_age.left}, 0)`)
        .call(d3.axisLeft(ySkala))
        .style("font-size","14px")

    const obavijest = d3
        .select("#okvir_2")
        .append("div")
        .attr("class","obavijest")
        .style("opacity",0)
        .style("border","2px solid black")
        .style("position","absolute")
        .style("padding","15px")
        .style("border-radius","5px")
        .style("background-color","white");

    okvir.selectAll("rect")
        .data(ageArray)
        .enter()
        .append("rect")
        .attr("class", "stupci")
        .attr("x", d => xSkala(d.age))
        .attr("y", d => ySkala(d.count))
        .attr("width", xSkala.bandwidth())
        .attr("height", d => dimenzije_age.grVisina - ySkala(d.count))
        .attr("fill", "#3d348b")
        .on("mouseover",function(event,d){


            d3.select(this)
            .transition()
            .duration(50)
            .attr("fill","#e0aaff")

            const ageText = `Age [${d.age}] : ${d.count}`;
            //console.log(ageText);
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;
            
            obavijest.html(ageText)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color","Black");
            
            obavijest.transition()
                .duration(100)
                .style("opacity",0.9);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill","#3d348b")
            
            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });
        
    okvir.append("text")
        .attr("transform",`translate(${dimenzije_age.sirina_age /2.1},${dimenzije_age.visina_age - 20})`)
        .style("text-anchor","middle")
        .text("Age")

    okvir.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0)
        .attr("x",0-(dimenzije_age.grVisina/2))
        .attr("dy","1.2em")
        .attr("text-anchor","middle")
        .text("Count")

}
plotAgePlot();
