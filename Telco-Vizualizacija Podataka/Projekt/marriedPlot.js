async function crtajMarriedPlot() {

    const data = await d3.json("telecom_customer_churn.json");  // Asinkrono dohvaćanje podataka iz JSON datoteke
    var marriedData = d3.group(data, d => d.Married); // Grupiranje podataka prema braku (married)
    var marriedArray = Array.from(marriedData, ([key, value]) => ({ married: key, count: value.length })); // Konverzija grupe u polje objekata s informacijama o braku i broju pojavljivanja

    // Definicija dimenzija i margina za SVG element
    var width = 400;
    var height = 400;
    var margin = { top: 20, right: 30, bottom: 40, left: 70 };

    // Kreiranje SVG elementa i postavljanje njegovih atributa
    var svg = d3.select("#okvir")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Definicija skala za x os
    var x = d3.scaleBand()
        .domain(marriedArray.map(d => d.married))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    // Definicija skala za y os
    var y = d3.scaleLinear()
        .domain([0, d3.max(marriedArray, d => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Dodavanje y osi na SVG
    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "15px");

    // Dodavanje x osi na SVG
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-size", "18px");
    
    // Dodavanje oznake ispod x osi
    svg.append("text")
        .attr("transform", "translate(" + (width / 1.8) + " ," + (height - margin.bottom/20) + ")")
        .style("text-anchor", "middle")
        .text("Married")
        .style("font-size", "18px");

    // Dodavanje oznake pokraj y osi
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left/4)
        .attr("x", 0 - (height / 2))
        .style("text-anchor", "middle")
        .text("Count")
        .style("font-size", "18px");


    // Dodavanje brojeva iznad stupaca na SVG
    svg.append("g")
        .attr("class", "count-labels")
        .selectAll("text")
        .data(marriedArray)
        .enter()
        .append("text")
        .text(d => d.count)
        .attr("x", d => x(d.married) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "18px");

    svg.selectAll("#okvir")
        .data(marriedArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.married))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.count))
        .attr("fill", d => d.married === "Yes" ? "DodgerBlue" : "Orange");
}
crtajMarriedPlot();
