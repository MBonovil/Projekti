async function crtajRevenue(){

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const filtr_Churn = data.filter(d =>d["Customer Status"] == "Churned");
    //console.log(filtr_Churn);

    const churn_group = d3.group(filtr_Churn, d=>d["Churn Category"])
    //console.log(churn_group);
    
    const formatirani_podaci = [];
    churn_group.forEach((value,key)=>{
        const total_revenue = d3.sum(value, d=>d["Total Revenue"]);
        formatirani_podaci.push({category:key, totalRevenue: total_revenue});
    });
    console.log(formatirani_podaci)

    const sirina = 600;
    let dimenzije = {
        sirina : sirina,
        visina : sirina - 200,
        margine : {
            top : 30,
            right : 10,
            bottom : 20,
            left : 80,
        },
    };
    dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;
    dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;

    const okvir = d3
        .select("#prihod")
        .append("svg")
        .attr("width",dimenzije.sirina)
        .attr("height",dimenzije.visina)

    const xSkala = d3
        .scaleBand()
        .domain(formatirani_podaci.map(d=>d.category))
        .range([dimenzije.grSirina, dimenzije.margine.left])
        .padding(0.5);

    const ySkala = d3
        .scaleLinear()
        .domain([0,d3.max(formatirani_podaci, d=>d.totalRevenue)])
        .nice()
        .range([dimenzije.grVisina,dimenzije.margine.top])

    okvir.append("g")
        .style("transform", `translateY(${dimenzije.grVisina}px)`)
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor","middle")
        .style("font-size","12px")

    okvir.append("g")
        .attr("transform", `translate(${dimenzije.margine.left}, 0)`)
        .call(d3.axisLeft(ySkala))
        .style("font-size","12px")

    const obavijest = d3
        .select("#okvir")
        .append("div")
        .attr("class","obavijest")
        .style("background-color","white")
        .style("border","2px solid black")
        .style("border-radius","15px")
        .style("padding","15px")
        .style("position","absolute")
        .style("opacity",0)

    okvir.selectAll("rect")
        .data(formatirani_podaci)
        .enter()
        .append("rect")
        .attr("x", d => xSkala(d.category))
        .attr("y", d => ySkala(d.totalRevenue))
        .attr("width", xSkala.bandwidth())
        .attr("height", d => dimenzije.grVisina - ySkala(d.totalRevenue))
        .attr("fill", "#3bceac")
        .on("mouseover",function(event,d){

            var darkerColor = d3.color(d3.select(this).style("fill")).darker(0.6);
            d3.select(this)
                .transition()
                .duration(300)
                .attr("fill",darkerColor);

            let formatiraniBroj;

            if (d.totalRevenue >= 1000000) {
                const milijuni = d.totalRevenue / 1000000;
                formatiraniBroj = milijuni.toFixed(2);
            } else{
                const tisuće = d.totalRevenue / 1000000; 
                formatiraniBroj = tisuće.toFixed(2);
            }
                
            const tekst = `${d.category} : ${formatiraniBroj} mil`; 
            //console.log(tekst);
            
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;

            obavijest.html(tekst)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color","black")

            obavijest.transition()
                .duration(100)
                .style("opacity",1)
                
        })
        .on("mouseout",function(){
            
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill","#3bceac");

            obavijest.transition()
                .duration(100)
                .style("opacity",0);
            
        })

    okvir.append("text")
        .attr("transform",`translate(${dimenzije.grSirina/2},${dimenzije.grVisina+40})`)
        .style("text-anchor","middle")
        .text("Churn Category")

    okvir.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0)
        .attr("x",0-(dimenzije.grVisina/2))
        .attr("dy","0.8em")
        .style("text-anchor","middle")
        .text("Total Revenue")
        

};
crtajRevenue();