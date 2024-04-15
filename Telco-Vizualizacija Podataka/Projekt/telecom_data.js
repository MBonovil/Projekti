const crtajTelekomPodatke = async () => {
  const data = await d3.json("telecom_customer_churn.json");

  const dimenzije = {
    sirina: 500,
    visina: 500,
    margine: {
      top: 30,
      right: 50,
      bottom: 50,
      left: 50,
    },
  };
  dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;
  dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;

  const okvir = d3
    .select("#usluge")
    .attr("class","pogodnosti")
    .append("svg")
    .attr("width", dimenzije.sirina)
    .attr("height", dimenzije.visina);

  const granice = okvir
    .append("g")
    .style("transform", `translate(${dimenzije.margine.left}px, ${dimenzije.margine.top}px)`);

  granice.append("g")
    .attr("class", "x-os")
    .attr("transform", `translate(0, ${dimenzije.grVisina})`);

  granice.append("g")
    .attr("class", "y-os");

  // Add x-axis label
  const xAxisLabel = granice.append("text")
    .attr("transform", `translate(${dimenzije.grSirina / 2}, ${dimenzije.grVisina + dimenzije.margine.bottom - 10})`)
    .style("text-anchor", "middle");

  // Add y-axis label
  granice.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - dimenzije.margine.left)
    .attr("x", 0 - (dimenzije.grVisina / 2))
    .attr("dy", "0.8em")
    .style("text-anchor", "middle")
    .text("Count");

  let labels = granice.append("g")
    .attr("class", "labels");

  const crtajGrafove = (metrika) => {
    const metricData = data.map((d) => d[metrika]);
    const categories = ["Yes", "No"];
    const categoryCounts = categories.map((category) => {
      return { category, count: metricData.filter((value) => value === category).length };
    });

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(categoryCounts, (d) => d.count)])
      .range([dimenzije.grVisina, 0]);

    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, dimenzije.grSirina])
      .padding(0.2);

    granice.select(".x-os")
      .call(d3.axisBottom(xScale))
      .style("font-size","18px");

    granice.select(".y-os")
      .call(d3.axisLeft(yScale))
      .style("font-size","10px");

    const bars = granice.selectAll("rect")
      .data(categoryCounts);

    bars.enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.category))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => dimenzije.grVisina - yScale(d.count))
      .attr("fill",d=>d.category =="Yes" ? "LightGreen" : "Tomato");

    labels.selectAll("text").remove();

    labels.selectAll("text")
      .data(categoryCounts)
      .enter()
      .append("text")
      .text(d => (d.count))
      .style("opacity",0)
      .transition()
        .style("opacity",1)
      .duration(1000)
      .attr("x", d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")

    bars.exit().remove();
    xAxisLabel.text(metrika)
      .style("color","#000")
      .style("font-size","18px");
  };

  const metrike = [
    "Phone Service",
    "Multiple Lines",
    "Internet Service",
    "Online Security",
    "Online Backup",
    "Device Protection Plan",
    "Premium Tech Support",
    "Streaming TV",
    "Streaming Movies",
    "Streaming Music",
    "Unlimited Data",
  ];
  
  // Dodajemo opcije select polju
  d3.select("#metrike-select")
    .selectAll("option")
    .data(metrike)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  // Prvi graf
  crtajGrafove(metrike[0]);

  // Kada se odabere nova metrika iz select polja
  d3.select("#metrike-select")
    .on("change", function() {
      const selectedMetric = d3.select(this).property("value");
      crtajGrafove(selectedMetric);
    });
};

crtajTelekomPodatke();
