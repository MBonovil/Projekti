function Provjera(unos){
    if(unos.model.length<3)
    {
        console.log("Uneseni model je kraći od 3!");
        document.querySelectorAll("input")[0].style.border="5px solid red";
        return false;
    }
    else
    {
        document.querySelectorAll("input")[0].style.border="5px solid green";
    }
    if(unos.serial.toString().length!=6)
    {
        console.log("Serijski broj treba imati 6 znakova!");
        document.querySelectorAll("input")[1].style.border="5px solid red";
        return false;
    }
    else
    {
        document.querySelectorAll("input")[1].style.border="5px solid green";
    }
    if(unos.vlasnik=="")
    {
        console.log("Vlasnik ne smije biti prazan!");
        document.querySelectorAll("input")[2].style.border="5px solid red";
        return false;
    }
    else
    {
        document.querySelectorAll("input")[2].style.border="5px solid green";
    }
    if(unos.petg.checked)
    {
        unos.petg="5G";
    }
    else
    {
        unos.petg="";
    }
    return true;
}
let mobiteli=[];
let odgovor=document.getElementById("odgovor");
document.getElementById("postdata").addEventListener("click", (e)=>{
    e.preventDefault();
    let NoviUnos={
        model: document.querySelectorAll("input")[0].value,
        serial: document.querySelectorAll("input")[1].value,
        vlasnik: document.querySelectorAll("input")[2].value,
        petg: document.getElementById("5g").value
    }
    if(Provjera(NoviUnos)==true)
    {
        fetch("https://comments-pmf.herokuapp.com/comments", {
            method:"POST",
            headers:{"Content-Type": "application/json",
            "Accept":"*/*"
        },
        body: JSON.stringify(NoviUnos)
        })
        .then(res=>console.log(res.statusText))
        .catch(err=>console.log(err));
        console.log(NoviUnos);
        mobiteli.push(NoviUnos);
        odgovor.innerText="Created...";
    }
    else
    {
        console.log("Krivo uneseni podaci!");
        odgovor.innerText="Onemoguceno!";
    }
})
function Brisi(){
    document.querySelectorAll("input")[0].value="";
    document.querySelectorAll("input")[1].value="";
    document.querySelectorAll("input")[2].value="";
    document.getElementById("5g").value="";
}
let rezultat=document.getElementById("rezultat");
document.getElementById("getdt").addEventListener("click", (e)=>{
    fetch("https://comments-pmf.herokuapp.com/comments")
    .then(res=>{return res.json()})
    .then(data=>{
        console.log(data);
        for(i=0;i<data.length;i++)
        {
            let n=document.createElement("label");
            rezultat.appendChild(n).innerHTML=data[i].id+"-"+data[i].name;
            let br=document.createElement("br");
            n.appendChild(br);
        }
    })
    .catch(err=>console.log(err));
})