async function crtajCountPlot() {

    const data = await d3.json("telecom_customer_churn.json");  // Asinkrono dohvaćanje podataka iz JSON datoteke
    var genderData = d3.group(data, d => d.Gender); // Grupiranje podataka prema spolu (gender)
    var genderArray = Array.from(genderData, ([key, value]) => ({ gender: key, count: value.length })); // Konverzija grupe u polje objekata s informacijama o spolu i broju pojavljivanja

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
        .domain(genderArray.map(d => d.gender))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    // Definicija skala za y os
    var y = d3.scaleLinear()
        .domain([0, d3.max(genderArray, d => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Dodavanje y osi na SVG
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
    
    // Dodavanje oznake ispod x osi
    svg.append("text")
        .attr("transform", "translate(" + (width / 1.8) + " ," + (height - margin.bottom/20) + ")")
        .style("text-anchor", "middle")
        .text("Gender")
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
        .data(genderArray)
        .enter()
        .append("text")
        .text(d => d.count)
        .attr("x", d => x(d.gender) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "18px");

    // Dodavanje stupaca na SVG
    svg.selectAll("#okvir")
        .data(genderArray)
        .enter()
        .append("rect")
        .attr("class", d => "bar " + d.gender)
        .attr("x", d => x(d.gender))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.count))
        .attr("fill", d => d.gender === "Male" ? "DodgerBlue" : "DeepPink");  
}
crtajCountPlot();
