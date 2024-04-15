const sirina=450;
let dimenzije = {
    sirina : sirina,
    visina : sirina,
    margine:{
        top:40,
        right:0,
        bottom:30,
        left:110,
    },
};
dimenzije.grSirina = dimenzije.sirina - dimenzije.margine.left - dimenzije.margine.right;
dimenzije.grVisina = dimenzije.visina - dimenzije.margine.top - dimenzije.margine.bottom;

/*-----------------------------------------------OKVIR-1-----------------------------------------------------------------------------------------*/
async function crtajGender() {
    const data = await d3.json("telecom_customer_churn.json");

    // Filtriranje po spolu (gender)
    const GenderGroup = d3.group(data, d => d.Gender);
    console.log(GenderGroup);
    const GenderArray = Array.from(GenderGroup, ([key, value]) => ({
        gender: key,
        total: value.length,
        churned: value.filter(d => d["Customer Status"] === "Churned").length
    }));
    console.log(GenderArray);

    const okvir = d3
        .select("#okvir_11")
        .append("svg")
        .attr("class", "gender")
        .attr("width", dimenzije.sirina)
        .attr("height", dimenzije.visina);

    const xSkala = d3
        .scaleBand()
        .domain(GenderArray.map(d => d.gender))
        .range([dimenzije.grSirina, dimenzije.margine.left])
        .padding(0.1);

    const ySkala = d3
        .scaleLinear()
        .domain([0, d3.max(GenderArray, d => d.total)])
        .nice()
        .range([dimenzije.grVisina, dimenzije.margine.top]);

    okvir.append("g")
        .style("transform", `translateY(${dimenzije.grVisina}px)`)
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "14px");

    okvir.append("g")
        .attr("transform", `translate(${dimenzije.margine.left}, 0)`)
        .call(d3.axisLeft(ySkala))
        .style("font-size", "14px");

    // Prikazivanje stupaca za ukupan broj
    okvir.selectAll(".total-bar")
        .data(GenderArray)
        .enter()
        .append("rect")
        .attr("class", "total-bar")
        .attr("x", d => xSkala(d.gender))
        .attr("y", d => ySkala(d.total))
        .attr("width", xSkala.bandwidth() / 2)
        .attr("height", d => dimenzije.grVisina - ySkala(d.total))
        .attr("fill", d => d.gender === "Male" ? "#788bff" : "#f88dad");

    // Prikazivanje stupaca za 'churned' broj
    okvir.selectAll(".churned-bar")
        .data(GenderArray)
        .enter()
        .append("rect")
        .attr("class", "churned-bar")
        .attr("x", d => xSkala(d.gender) + xSkala.bandwidth() / 2)
        .attr("y", d => ySkala(d.churned))
        .attr("width", xSkala.bandwidth() / 2)
        .attr("height", d => dimenzije.grVisina - ySkala(d.churned))
        .attr("fill", d => d.gender === "Male" ? "#3555ff" : "#ff3555");

    // Dodavanje teksta za osi
    okvir.append("text")
        .attr("transform", `translate(${dimenzije.sirina / 2.1},${dimenzije.visina - 20})`)
        .style("text-anchor", "middle")
        .text("Gender");

    okvir.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (dimenzije.grVisina / 2))
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .text("Count");

    // Dodavanje brojeva na stupce
    okvir.append("g")
        .attr("class", "count-labels")
        .selectAll("text")
        .data(GenderArray)
        .enter()
        .append("text")
        .text(d => d.total)
        .attr("x", d => xSkala(d.gender) + xSkala.bandwidth() / 4)
        .attr("y", d => ySkala(d.total) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");

    // Dodavanje brojeva 'churned' na stupce
    okvir.append("g")
        .attr("class", "churned-labels")
        .selectAll("text")
        .data(GenderArray)
        .enter()
        .append("text")
        .text(d => d.churned)
        .attr("x", d => xSkala(d.gender) + 3 * xSkala.bandwidth() / 4)
        .attr("y", d => ySkala(d.churned) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");
}




async function crtajMarried() {
    const data = await d3.json("telecom_customer_churn.json");

    // Filtriranje po bračnom statusu (Married)
    const MarriedGroup = d3.group(data, d => d.Married);
    const MarriedArray = Array.from(MarriedGroup, ([key, value]) => ({
        married: key,
        total: value.length,
        churned: value.filter(d => d["Customer Status"] === "Churned").length
    }));

    const okvir = d3
        .select("#okvir_11")
        .append("svg")
        .attr("class", "married")
        .attr("width", dimenzije.sirina)
        .attr("height", dimenzije.visina);

    const xSkala = d3
        .scaleBand()
        .domain(MarriedArray.map(d => d.married))
        .range([dimenzije.grSirina, dimenzije.margine.left])
        .padding(0.1);

    const ySkala = d3
        .scaleLinear()
        .domain([0, d3.max(MarriedArray, d => d.total)])
        .nice()
        .range([dimenzije.grVisina, dimenzije.margine.top]);

    okvir.append("g")
        .style("transform", `translateY(${dimenzije.grVisina}px)`)
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "14px");

    okvir.append("g")
        .attr("transform", `translate(${dimenzije.margine.left}, 0)`)
        .call(d3.axisLeft(ySkala))
        .style("font-size", "14px");

    // Prikazivanje stupaca za ukupan broj
    okvir.selectAll(".total-bar")
        .data(MarriedArray)
        .enter()
        .append("rect")
        .attr("class", "total-bar")
        .attr("x", d => xSkala(d.married))
        .attr("y", d => ySkala(d.total))
        .attr("width", xSkala.bandwidth() / 2)
        .attr("height", d => dimenzije.grVisina - ySkala(d.total))
        .attr("fill", d => d.married === "Yes" ? "#5dbb73" : "#f06077");

    // Prikazivanje stupaca za 'churned' broj
    okvir.selectAll(".churned-bar")
        .data(MarriedArray)
        .enter()
        .append("rect")
        .attr("class", "churned-bar")
        .attr("x", d => xSkala(d.married) + xSkala.bandwidth() / 2)
        .attr("y", d => ySkala(d.churned))
        .attr("width", xSkala.bandwidth() / 2)
        .attr("height", d => dimenzije.grVisina - ySkala(d.churned))
        .attr("fill", d => d.married === "Yes" ? "#3fa34d" : "#c5283d");

    // Dodavanje teksta za osi
    okvir.append("text")
        .attr("transform", `translate(${dimenzije.sirina / 2.1},${dimenzije.visina - 20})`)
        .style("text-anchor", "middle")
        .text("Married");

    okvir.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (dimenzije.grVisina / 2))
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .text("Count");

    // Dodavanje brojeva na stupce za ukupan broj
    okvir.append("g")
        .attr("class", "total-labels")
        .selectAll("text")
        .data(MarriedArray)
        .enter()
        .append("text")
        .text(d => d.total)
        .attr("x", d => xSkala(d.married) + xSkala.bandwidth() / 4)
        .attr("y", d => ySkala(d.total) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");

    // Dodavanje brojeva na stupce za 'churned' broj
    okvir.append("g")
        .attr("class", "churned-labels")
        .selectAll("text")
        .data(MarriedArray)
        .enter()
        .append("text")
        .text(d => d.churned)
        .attr("x", d => xSkala(d.married) + 3 * xSkala.bandwidth() / 4)
        .attr("y", d => ySkala(d.churned) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");
}





async function crtajCityCounter(){

    const data = await d3.json('telecom_customer_churn.json');
    //console.log("data");
    // Izračunavanje 10 gradova s najvećim brojem ljudi
    const cityGroup = d3.group(data, d => d.City);
    //console.log(cityGroup);
    const cityArray = Array.from(cityGroup, ([key, value]) => ({ city: key, count: value.length }));
    cityArray.sort((a, b) => b.count - a.count);
    const top10Gradovi = cityArray.slice(0, 10);
    //console.log(top10Gradovi);
    // Izračunavanje broja ljudi koji su napustili kompaniju (churned) iz svakog od tih gradova
    const churnedGroup = d3.group(data.filter(d => d["Customer Status"] === "Churned"), d => d.City);
    const churnedArray = Array.from(churnedGroup, ([key, value]) => ({ city: key, churnedCount: value.length }));
    //console.log(churnedArray);
    // Pridruživanje broja churned ljudi za svaki grad u top10Gradovi
    top10Gradovi.forEach(grad => {
        const found = churnedArray.find(item => item.city === grad.city);
        if (found) {
            grad.churnedCount = found.churnedCount;
        } else {
            grad.churnedCount = 0;
        }
    });
    console.log(top10Gradovi);

    var okvir = d3
        .select("#okvir_11")
        .append("svg")
        .attr("class","cityCounter")
        .attr("height", dimenzije.visina)
        .attr("width", dimenzije.sirina);
    
    var ySkala = d3.scaleBand()
        .domain(top10Gradovi.map(d => d.city))
        .range([dimenzije.grVisina, dimenzije.margine.top])
        .padding(0.2)
    
    var xSkala = d3.scaleLinear()
        .domain([d3.max(top10Gradovi, d => d.count),0])
        .nice()
        .range([dimenzije.grSirina, dimenzije.margine.left])
    
    okvir.append("g")
        .attr("transform", "translate(" + dimenzije.margine.left + ",0)")
        .call(d3.axisLeft(ySkala))
        .selectAll("text")
        .style("font-size", "14px");
    
    okvir.append("g")
        .attr("transform", "translate(0," + (dimenzije.grVisina) + ")")
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor", "center")
        .style("font-size", "8px");

    // Dodavanje stupaca za broj ljudi
    okvir.selectAll(".count-rect")
        .data(top10Gradovi)
        .enter()
        .append("rect")
        .attr("class", "count-rect")
        .attr("x", dimenzije.margine.left)
        .attr("y", d => ySkala(d.city))
        .attr("width", d => xSkala(d.count) - dimenzije.margine.left)
        .attr("height", ySkala.bandwidth() / 2)
        .attr("fill", "#086788");

    // Dodavanje stupaca za churned broj
    okvir.selectAll(".churned-rect")
        .data(top10Gradovi)
        .enter()
        .append("rect")
        .attr("class", "churned-rect")
        .attr("x", dimenzije.margine.left)
        .attr("y", d => ySkala(d.city) + ySkala.bandwidth() / 2)
        .attr("width", d => xSkala(d.churnedCount) - dimenzije.margine.left)
        .attr("height", ySkala.bandwidth() / 2)
        .attr("fill", "#faa613");

    const obavijest = d3
        .select("#okvir_11")
        .append("div")
        .attr("class", "obavijest")
        .style("opacity", 0)
        .style("border", "2px solid black")
        .style("position", "absolute")
        .style("padding", "15px")
        .style("border-radius", "5px")
        .style("background-color", "white");

    okvir.selectAll(".count-rect")
        .on("mouseover", function (event, data) {
            d3.select(this).attr("fill", "DeepSkyBlue");

            const cityText1 = `${data.city} : ${data.count}`;
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;

            obavijest.html(cityText1)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color", "Black");

            obavijest.transition()
                .duration(100)
                .style("opacity", 0.9);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "#086788");
            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });

    // Dodavanje tooltipa za churned broj
    okvir.selectAll(".churned-rect")
        .on("mouseover", function (event, data) {
            d3.select(this).attr("fill", "Gold");

            const cityText1 = `${data.city} : (Churned) ${data.churnedCount}`;
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;

            obavijest.html(cityText1)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color", "Black");

            obavijest.transition()
                .duration(100)
                .style("opacity", 0.9);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "#faa613");
            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });
    
    okvir.append('text')
        .attr('transform', `translate(${dimenzije.grSirina / 1.5},${dimenzije.grVisina +40})`)
        .style('text-anchor', 'middle')
        .text('Count');
}








/*-----------------------------------------------OKVIR-2-----------------------------------------------------------------------------------------*/
async function crtajAge(){
    
    const sirina_age = 1000;
    let dimenzije_age = {
        sirina_age: sirina_age,
        visina_age: sirina_age - 500,
        margine_age: {
            top: 40,
            right: 40,
            bottom: 30,
            left: 70,
        },
    };
    dimenzije_age.grSirina = dimenzije_age.sirina_age - dimenzije_age.margine_age.left - dimenzije_age.margine_age.right;
    dimenzije_age.grVisina = dimenzije_age.visina_age - dimenzije_age.margine_age.top - dimenzije_age.margine_age.bottom;

    const data = await d3.json("telecom_customer_churn.json");
    const churnedData = data.filter(d => d["Customer Status"] == "Churned");
    const churnedAgeGroup = d3.group(churnedData, d => d.Age);

    const ageGroup = d3.group(data, d => d.Age);

    const ageArray = Array.from(ageGroup, ([key, value]) => ({ age: key, count: value.length })).sort((a, b) => b.age - a.age);

    const okvir = d3
        .select("#okvir_22")
        .append("svg")
        .attr("class", "combinedAgePlot")
        .attr("width", dimenzije_age.sirina_age)
        .attr("height", dimenzije_age.visina_age);

    const xSkala = d3
        .scaleBand()
        .domain(ageArray.map(d => d.age))
        .range([dimenzije_age.grSirina, dimenzije_age.margine_age.left])
        .padding(0.2);

    const ySkala = d3
        .scaleLinear()
        .domain([0, d3.max(ageArray, d => d.count)])
        .nice()
        .range([dimenzije_age.grVisina, dimenzije_age.margine_age.top]);

    okvir.append("g")
        .style("transform", `translateY(${dimenzije_age.grVisina}px)`)
        .call(d3.axisBottom(xSkala))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px");

    okvir.append("g")
        .attr("transform", `translate(${dimenzije_age.margine_age.left}, 0)`)
        .call(d3.axisLeft(ySkala))
        .style("font-size", "14px");

    const obavijest = d3
        .select("#okvir_22")
        .append("div")
        .attr("class", "obavijest")
        .style("opacity", 0)
        .style("border", "2px solid black")
        .style("position", "absolute")
        .style("padding", "15px")
        .style("border-radius", "5px")
        .style("background-color", "white");

    okvir.selectAll(".stupci")
        .data(ageArray)
        .enter()
        .append("rect")
        .attr("class", "stupci")
        .attr("x", d => xSkala(d.age))
        .attr("y", d => ySkala(d.count))
        .attr("width", xSkala.bandwidth())
        .attr("height", d => dimenzije_age.grVisina - ySkala(d.count))
        .attr("fill", "#3d348b")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(50)
                .attr("fill", "#e0aaff");

            const ageText = `Age [${d.age}] : ${d.count}`;
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;

            obavijest.html(ageText)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color", "Black");

            obavijest.transition()
                .duration(100)
                .style("opacity", 0.9);
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill", "#3d348b");

            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });

    // Drawing additional bars for churned data
    okvir.selectAll(".stupci-churned")
        .data(ageArray)
        .enter()
        .append("rect")
        .attr("class", "stupci-churned")
        .attr("x", d => xSkala(d.age))
        .attr("y", d => ySkala(churnedAgeGroup.get(d.age)?.length || 0)) // Using ternary operator to handle missing data
        .attr("width", xSkala.bandwidth())
        .attr("height", d => dimenzije_age.grVisina - ySkala(churnedAgeGroup.get(d.age)?.length || 0))
        .attr("fill", "#f18701")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(50)
                .attr("fill", "#ffbe0b");
        
            const churnedCount = churnedAgeGroup.get(d.age)?.length || 0; // Broj "Churned" korisnika za odabranu godinu
            const total = d.count + churnedCount; // Ukupan broj korisnika za odabranu godinu
        
            const ageText = `Age [${d.age}] : Churned (${churnedCount})`;
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;
        
            obavijest.html(ageText)
                .style('left', x_Pozicija + 'px')
                .style('top', y_Pozicija + 'px')
                .style("color", "Black");
        
            obavijest.transition()
                .duration(100)
                .style("opacity", 0.9);
        })
        
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill", "#f18701");

            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });;

    okvir.append("text")
        .attr("transform", `translate(${dimenzije_age.sirina_age / 2.1},${dimenzije_age.visina_age - 20})`)
        .style("text-anchor", "middle")
        .text("Age");

    okvir.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (dimenzije_age.grVisina / 2))
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .text("Count");

    // okvir.append("g")
    //     .attr("class", "count-labels")
    //     .selectAll("text")
    //     .data(ageArray)
    //     .enter()
    //     .append("text")
    //     .text(d => d.count)
    //     .attr("x", d => xSkala(d.age) + xSkala.bandwidth() / 2)
    //     .attr("y", d => ySkala(d.count) - 5)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "10px");
};



async function crtajCityPercetn(){

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const city_filter = data.filter(d=>d["Customer Status"] == "Churned")
    //console.log(city_filter);
    const city_group = d3.group(city_filter,d=>d.City);
    //console.log(city_group);
    const city_Array = Array.from(city_group,([key, value])=>({city : key , count : value.length})).sort((a,b)=>(b.count - a.count));
    //console.log(city_Array);
    const prvih_pet = city_Array.slice(0,5);
    const ostaliCount = city_Array.slice(5).reduce((total,city) => total + city.count , 0 );
    const ostaliGradovi = {city : "Other", count : ostaliCount };
    const GradoviArray = [...prvih_pet,ostaliGradovi];
    const Ukupna_suma = GradoviArray.reduce((total,city) => total + city.count , 0 );
    //console.log(Ukupna_suma);
    const gradovi_posto = GradoviArray.map(city =>({
        city : city.city,
        count : ((city.count / Ukupna_suma)*100).toFixed(2),
        counter : city.count
    }))
    //console.log(gradovi_posto);

    const radius = Math.min(dimenzije.grSirina,dimenzije.grVisina) / 1.7 - dimenzije.margine.left;



    const okvir = d3
        .select("#okvir_22")
        .append("svg")
        .attr("class","cityPie")
        .attr("width",dimenzije.sirina)
        .attr("height",dimenzije.visina)
        .append("g")
        .attr("transform","translate(" + dimenzije.grSirina / 3 + "," + dimenzije.grVisina / 2 + ")");

    const color = d3.scaleOrdinal()
        .domain(gradovi_posto.map(city=>city.city))
        .range(["#5a189a","#7b2cbf","#9d4edd","#c77dff","#e0aaff","#3c096c"]);

    const city_pie = d3.pie()
        .value(d=>d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const kut = okvir.selectAll("arc")
        .data(city_pie(gradovi_posto))
        .enter()
        .append("g")
        .attr("class","arc");

    //console.log(kut);
    const obavijest = d3
        .select("#okvir_22")
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
        .attr("fill", d=>color(d.data.city))
        .on("mouseover",function(event,d){

            var darkerColor = d3.color(d3.select(this).style("fill")).darker(0.4);

            d3.select(this)
            .transition()
            .duration(500)
            .attr("d",d3.arc().innerRadius(0).outerRadius(radius * 1.2).padAngle(0.03))
            .attr("fill",darkerColor)

            const cityText = `${d.data.city} : ${d.data.count}% : (${d.data.counter})`;
            //console.log(cityText);
            const x_Pozicija = event.clientX + window.scrollX + 30;
            const y_Pozicija = event.clientY + window.scrollY;
            
            obavijest.html(cityText)
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
                .attr("fill",d=>color(d.data.city))
            
            obavijest.transition()
                .duration(100)
                .style("opacity", 0);
        });
        
    const legend = okvir.selectAll(".legend")
        .data(gradovi_posto.map(d => d.city))
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
            .attr("x", dimenzije.sirina / 1.9 )
            .attr("y", -50)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => color(d));

    legend.append("text")
            .attr("x", dimenzije.sirina / 1.95 )
            .attr("y", -40)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);
};








/*-----------------------------------------------OKVIR-3-----------------------------------------------------------------------------------------*/
async function crtajMapu(){

    const svg = d3.select("#okvir_33")
        .append("svg")
        .attr("class","mapa")
        .attr("width", dimenzije.sirina)
        .attr("height", dimenzije.visina)
        .style("padding","30px");

    const projection = d3.geoMercator();

    const path = d3.geoPath().projection(projection);

    try {
        // Fetch both datasets
        const [geojsonPromise, citiesPromise] = await Promise.all([
            fetch('california.json'),
            fetch('telecom_customer_churn.json')
        ]);

        const geojson = await geojsonPromise.json();
        const citiesData = await citiesPromise.json();

        projection.fitSize([dimenzije.grSirina, dimenzije.grVisina], geojson);

        // Iscrtavanje karte Kalifornije
        svg.append("path")
            .datum(geojson)
            .attr("d", path)
            .attr("fill", "BlanchedAlmond")
            .attr("stroke", "DarkGoldenRod") // Crvena boja ruba
            .attr("stroke-width", 1.5);

        // Group city coordinates data by coordinates, filtering only churned customers
        const churnedCitiesData = citiesData.filter(d => d["Customer Status"] === "Churned");
        const groupedChurnedCities = d3.group(churnedCitiesData, d => `${d.Longitude},${d.Latitude}`);

        // Calculate circle radius based on frequency of occurrence for churned cities
        const churnedFrequencies = Array.from(groupedChurnedCities, ([, value]) => value.length);
        const churnedMinFrequency = Math.min(...churnedFrequencies);
        const churnedMaxFrequency = Math.max(...churnedFrequencies);
        const churnedRadiusScale = d3.scaleLinear()
                                    .domain([churnedMinFrequency, churnedMaxFrequency])
                                    .range([1, 10]); // Adjust range as needed

        // Define color scale for churned cities
        const churnedColorScale = d3.scaleLinear()
                                    .domain([churnedMinFrequency, churnedMaxFrequency])
                                    .range(["#988CDF", "#454566"]);

        // Visualize churned city coordinates data
        const g = svg.append("g"); // Presuming svg is defined in the outer scope

        // Definiranje elementa obavijesti
        const obavijest = d3
            .select("#okvir_33") // Promijenite na odgovarajući okvir
            .append("div")
            .attr("class", "obavijest")
            .style("opacity", 0)
            .style("border", "2px solid black")
            .style("position", "absolute")
            .style("padding", "15px")
            .style("border-radius", "5px")
            .style("background-color", "white");

        g.selectAll('circle')
            .data(groupedChurnedCities)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                const coords = d[0].split(',');
                return projection([+coords[0], +coords[1]])[0];
            })
            .attr('cy', function (d) {
                const coords = d[0].split(',');
                return projection([+coords[0], +coords[1]])[1];
            })
            .attr('r', function(d) {
                return churnedRadiusScale(d[1].length);
            })
            .style('fill', function (d) {
                return churnedColorScale(d[1].length);
            })
            .on('mouseover', function (event, d) {
                // Povećajte veličinu kruga i promijenite boju na "mouseover"
                d3.select(this)
                    .style('fill', 'red')
                    .attr('r', function(d) {
                        return churnedRadiusScale(d[1].length) * 1.5; // Povećajte radijus na hover
                    });
                
                // Postavljanje teksta grada i pomicanje polja
                const cityText = d[1][0].City;
                const x_Pozicija = event.clientX + window.scrollX + 30;
                const y_Pozicija = event.clientY + window.scrollY;
                
                obavijest.html(cityText)
                    .style('left', x_Pozicija + 'px')
                    .style('top', y_Pozicija + 'px')
                    .style("color", "Black");
                
                obavijest.transition()
                    .duration(100)
                    .style("opacity", 0.9);
            })
            .on('mouseout', function () {
                // Vratite krug na originalnu veličinu i boju na "mouseout"
                d3.select(this)
                    .style('fill', function (d) {
                        return churnedColorScale(d[1].length);
                    })
                    .attr('r', function(d) {
                        return churnedRadiusScale(d[1].length);
                    });
                
                // Sakrijte polje za prikaz grada
                obavijest.transition()
                    .duration(100)
                    .style("opacity", 0);
            });

    } catch (error) {
        console.error(error);
    }
};


async function crtajTarife(){

    const data = await d3.json("telecom_customer_churn.json");
    const churned_customer = data.filter(d => d["Customer Status"] == "Churned" )
    const okvir = d3
    .select("#okvir_33")
    .append("svg")
    .attr("class","tarife")
    .attr("width", dimenzije.sirina)
    .attr("height", dimenzije.visina);

  const granice = okvir
    .append("g")
    .style("transform", `translate(${dimenzije.margine.left}px, ${dimenzije.margine.top - 15}px)`);

  granice.append("g")
    .attr("class", "x-os")
    .attr("transform", `translate(0, ${dimenzije.grVisina})`);

  granice.append("g")
    .attr("class", "y-os");

  // Add x-axis label
  const xAxisLabel = granice.append("text")
    .attr("transform", `translate(${dimenzije.grSirina / 2}, ${dimenzije.grVisina + dimenzije.margine.bottom - 1})`)
    .style("text-anchor", "middle");

  // Add y-axis label
  granice.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - dimenzije.margine.left)
    .attr("x", 0 - (dimenzije.grVisina / 2))
    .attr("dy", "2.5em")
    .style("text-anchor", "middle")
    .text("Count");

  let labels = granice.append("g")
    .attr("class", "labels");

  const crtajGrafove = (metrika) => {
    const metricData = churned_customer.map((d) => d[metrika]);
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
  d3.select("#metrike-select-2")
    .selectAll("option")
    .data(metrike)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  // Prvi graf
  crtajGrafove(metrike[0]);

  // Kada se odabere nova metrika iz select polja
  d3.select("#metrike-select-2")
    .on("change", function() {
      const selectedMetric = d3.select(this).property("value");
      crtajGrafove(selectedMetric);
    });
};



async function crtajUgovore(){

    const data = await d3.json("telecom_customer_churn.json");
    //console.log(data);
    const churned_customers = data.filter(d => d["Customer Status"] == "Churned")
    const contractGroup = d3.group(churned_customers,d=>d.Contract)
    //console.log(contractGroup);
    const contractArray = Array.from(contractGroup,([key,value])=>({type:key , count:value.length}));
    console.log(contractArray);

    const radius = Math.min(dimenzije.grSirina,dimenzije.grVisina) / 2 - dimenzije.margine.left;

    const okvir = d3
        .select("#okvir_33")
        .attr("class","ugovori")
        .append("svg")
        .attr("width",dimenzije.sirina)
        .attr("height",dimenzije.visina)
        .append("g")
        .attr("transform","translate("+dimenzije.grSirina / 2 +","+dimenzije.grVisina / 2+")")

    const color = d3.scaleOrdinal()
        .domain(contractArray.map(d => d.type))
        .range(["#134611","#3e8914","#3da35d"]);
    
    const contract_pie = d3.pie()
        .value(d=>d.count);

    const arc = d3.arc()
        .innerRadius(20)
        .outerRadius(radius)
        .padAngle(0.009);

    const kut = okvir.selectAll("arc")
        .data(contract_pie(contractArray))
        .enter()
        .append("g")
        .attr("class", "arc");
    
    const obavijest = d3
        .select("#okvir_33")
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
            .attr("d",d3.arc().innerRadius(40).outerRadius(radius * 1.2).padAngle(0.03))
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
}



/*  OKVIR_1 */
crtajGender();
crtajMarried();
crtajCityCounter()

/*  OKVIR_2 */
crtajAge();
crtajCityPercetn();

/*  OKVIR_3 */
crtajMapu();
crtajTarife();
crtajUgovore();