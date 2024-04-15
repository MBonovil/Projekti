async function crtajChurnReason() {
    const data = await d3.json("telecom_customer_churn.json");

    // Filtriranje NaN vrijednosti
    const filteredData = data.filter(d => d['Churn Category'] && d['Churn Reason']);

    // Stvaranje objekta koji grupira Churn Reason prema Churn Category
    const groupedData = {};
    filteredData.forEach(d => {
        if (!groupedData[d['Churn Category']]) {
            groupedData[d['Churn Category']] = {};
        }
        if (!groupedData[d['Churn Category']][d['Churn Reason']]) {
            groupedData[d['Churn Category']][d['Churn Reason']] = 0;
        }
        groupedData[d['Churn Category']][d['Churn Reason']]++;
    });

    // Konvertiranje podataka u oblik prikladan za crtanje grafikona
    const chartData = [];
    for (const category in groupedData) {
        const reasons = groupedData[category];
        for (const reason in reasons) {
            chartData.push({ 'Churn Category': category, 'Churn Reason': reason, 'Count': reasons[reason] });
        }
    }

    const margin = { top: 20, right: 30, bottom: 150, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#otkazivanje_razlog").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class","churn_reason")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .domain(chartData.map(d => d['Churn Reason']))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d['Count'])])
        .nice()
        .range([height, 0]);

    // Funkcija za generiranje boja
    const color = d3.scaleOrdinal()
        .domain(Object.keys(groupedData))
        .range(["#46A8DA", "#6AC482", "#EE6D85", "#EEE390", "#D0A2CF"]);


    svg.selectAll(".bar")
        .data(chartData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d['Churn Reason']))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d['Count']))
        .attr("height", d => height - y(d['Count']))
        .attr("fill", d => color(d['Churn Category']));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .attr("font-size","16px");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 120) + ")")
        .style("text-anchor", "middle")
        .text("Churn Reason");

    svg.selectAll(".legend")
        .data(Object.keys(groupedData))
        .enter()
        .append("text")
        .attr("class", "legend")
        .style("font-size","20px")
        .attr("x", width - 100)
        .attr("y", (d, i) => i * 20)
        .attr("fill", d => color(d))
        .text(d => d);
}

crtajChurnReason();
