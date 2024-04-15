async function crtajTenure() {
    const data = await d3.json("telecom_customer_churn.json");
    console.log(data);

    // Filtriranje podataka prema stupcu "Customer Status"
    const filteredData = data.filter(d => d["Customer Status"] === 'Churned');

    const xAccessor = d => d["Tenure in Months"];
    const yAccessor = d => d.length;

    const minimum = d3.min(filteredData, xAccessor);
    const maksimum = d3.max(filteredData, xAccessor);
    console.log(minimum);
    console.log(maksimum);

    const sirina = 500;
    let dimenzije = {
        sirina: sirina,
        visina: sirina * 0.6,
        margine: {
            top: 30,
            right: 10,
            bottom: 50,
            left: 50,
        },
    }

    dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;
    dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;

    // CRTANJE GRAFA
    const okvir = d3
        .select("#otkazivanje_razlog")
        .append("svg")
        .attr("width", dimenzije.sirina)
        .attr("height", dimenzije.visina)
        .style("class","tenure");

    const granice = okvir
        .append("g")
        .style(
            "transform",
            `translate(${dimenzije.margine.left}px, ${dimenzije.margine.top}px)`
        );

    // DEFINIRANJE RAZMJERA
    const xSkala = d3.scaleLinear()
        .domain(d3.extent(filteredData, xAccessor))
        .range([0, dimenzije.grSirina])
        .nice()

    const kosGenerator = d3.histogram()
        .domain(xSkala.domain())
        .value(xAccessor)
        .thresholds(d3.range(0, 73, 6));

    const kosare = kosGenerator(filteredData);
    console.log(kosare);

    const ySkala = d3.scaleLinear()
        .domain([0, d3.max(kosare, yAccessor)])
        .range([dimenzije.grVisina, 0])
        .nice()

    const sveKosare = granice.append("g");
    const kosGrupe = sveKosare.selectAll("g")
        .data(kosare)
        .enter()
        .append("g");

    const bar_padding = 2;
    const barCrtez = kosGrupe.append("rect")
        .attr("x", dp => xSkala(dp.x0) + bar_padding)
        .attr("y", dp => ySkala(yAccessor(dp)))
        .attr("width", dp => (xSkala(dp.x1) - xSkala(dp.x0)) - bar_padding)
        .attr("height", dp => dimenzije.grVisina - ySkala(yAccessor(dp)))
        .attr("fill", dp => {
        // Provjeri je li trenutni podatak ima najveću vrijednost
        const maxCount = d3.max(kosare, yAccessor);
        return yAccessor(dp) === maxCount ? "#DF9758" : "#888BE6";
    });

    const barTekst = kosGrupe.append("text")
        .attr("x", dp => xSkala(dp.x0) + (xSkala(dp.x1) - xSkala(dp.x0)) / 2)
        .attr("y", dp => ySkala(yAccessor(dp)) -10)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .attr("fill", "darkgrey")
        .style("font-size", "17px")

    const xOsGenerator = d3.axisBottom()
        .scale(xSkala)
        .tickFormat((d, i) => kosare[i].x0)
        .tickValues(kosare.map(d => d.x0));

    const xOs = granice.append("g")
        .call(xOsGenerator)
        .style("transform", `translateY(${dimenzije.grVisina}px)`);

    xOs.selectAll("text")
        .style("text-anchor", "start")
        .style("font-size", "14px")
        .attr("fill", "black")

    const xOsOznaka = xOs.append("text")
        .attr("x", dimenzije.grSirina / 2)
        .attr("y", dimenzije.margine.bottom)
        .attr("fill", "black")
        .style("font-size", "18px")
        .text("Tenure in Month")
};

crtajTenure();
