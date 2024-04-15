async function crtajContractPie()
{

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const contractGroup = d3.group(data,d=>d.Contract)
    //console.log(contractGroup);
    const contractArray = Array.from(contractGroup,([key,value])=>({type:key , count:value.length}));
    console.log(contractArray);

    const sirina = 600;
    let dimenzije = {
        sirina:sirina,
        visina:sirina,
        margine:{
            top:50,
            right:100,
            bottom:50,
            left:50,
        },
    };
    dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;
    dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;
    const radius = Math.min(dimenzije.grSirina,dimenzije.grVisina) / 2 - dimenzije.margine.left;

    const okvir = d3
        .select("#usluge")
        .attr("class","contract")
        .append("svg")
        .attr("width",dimenzije.sirina)
        .attr("height",dimenzije.visina)
        .append("g")
        .attr("transform","translate("+dimenzije.grSirina / 2 +","+dimenzije.grVisina / 2+")")

    const color = d3.scaleOrdinal()
        .domain(contractArray.map(d => d.type))
        .range(["#e09f3e","#fff3b0","#9e2a2b"]);
    
    const contract_pie = d3.pie()
        .value(d=>d.count);

    const arc = d3.arc()
        .innerRadius(100)
        .outerRadius(radius)
        .padAngle(0.009);

    const kut = okvir.selectAll("arc")
        .data(contract_pie(contractArray))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    const obavijest = d3
        .select("#okvir")
        .append("div")
        .attr("class","obavijest")
        .style("opacity",0)
        .style("border","2px solid black")
        .style("position","absolute")
        .style("padding","15px")
        .style("border-radius","5px")
        .style("background-color","white");

    kut.append("path")
        .attr("d",arc)
        .attr("fill", d=>color(d.data.type))
        .on("mouseover",function(event,d){

            var darkerColor = d3.color(d3.select(this).style("fill")).darker(0.4);

            d3.select(this)
            .transition()
            .duration(500)
            .attr("d",d3.arc().innerRadius(120).outerRadius(radius * 1.1).padAngle(0.03))
            .attr("fill",darkerColor)

            const contract_text = `${d.data.type} : ${d.data.count}`;
            //console.log(contract_text);
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;
            
            obavijest.html(contract_text)
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
                .duration(200)
                .attr("d", arc)
                .attr("fill",d=>color(d.data.type))
            
            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });
        const legend = okvir.selectAll(".legend")
        .data(contractArray.map(d => d.type))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", dimenzije.sirina / 1.8 )
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => color(d));

        legend.append("text")
            .attr("x", dimenzije.sirina / 1.85 )
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);

    

};
crtajContractPie();