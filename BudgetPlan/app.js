(function() {
function $id(id) {
    return document.getElementById(id);
}

let incSum = 0;
let expSum = 0;
const budget = $id("budget");
const incHdr = $id("inc");
const expHdr = $id("exp");
const select = $id("slct");
const greenIcon = $id("green");
const redIcon = $id("red");
const tblIncome = $id("income");
const tblExpenses = $id("expenses");
const perc = document.getElementById("perc");

function setDate() {
    const date = $id("date");
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    date.innerHTML += day+"/"+month+"/"+year+":";
}

function slct() {
    select.addEventListener("change", function() {
        if(select.value === "plus") { 
            greenIcon.style.display = "inline";
            redIcon.style.display = "none";
        } else {
            greenIcon.style.display = "none";
            redIcon.style.display = "inline";
        }
    })
}

function tableRow(table, sign) {
    let val = parseFloat($id("value").value);
    if(select.value === "plus") {
        incSum += val;
    } else {
        expSum += val;
    }

    addRow(table, sign, val);
}

function addRow(table, sign, val) {
    const description = $id("describe");
    let tr = document.createElement("tr");
    let td0 = document.createElement("td");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let btn = document.createElement("button");
    btn.innerHTML = "X";
    btn.addEventListener("click", function() {
        dltBtn(this, sign, val);
    });
    table.appendChild(tr);
    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);
    if(table.id === "expenses") {
        tr.appendChild(td3);
        tr.childNodes[1].className = "exp-tbl-val";
        tr.childNodes[2].innerText = percent(val);
    }
    tr.childNodes[0].innerHTML = description.value;
    tr.childNodes[1].innerHTML = sign+val.toFixed(2);
    tr.childNodes[tr.childNodes.length-1].appendChild(btn);
}

function setValue(elem, val, sign) {
    if(sign === "sum" && val < 0) {
        elem.innerHTML = "- "+Number(-val).toFixed(2);
    } else if(sign === "sum") {
        elem.innerHTML = "+ "+Number(val).toFixed(2);
    } else {
        if(sign === "- ") {
            elem.innerHTML = sign+Number(val).toFixed(2);
            perc.innerHTML = percent(val);
        }
        elem.innerHTML = sign+Number(val).toFixed(2);
    }
}

function dltBtn(elem, sign, val) {
    elem.parentNode.parentNode.remove();
    if(sign === "+ ") {
        incSum -= val;
        setValue(incHdr, incSum, "+ ");
        setValue(budget, incSum-expSum, "sum");
        perc.innerHTML = percent(expSum);
    } else {
        expSum -= val;
        setValue(expHdr, expSum, "- ");
        setValue(budget, incSum-expSum, "sum");
        perc.innerHTML = percent(expSum);
    }
}

function percent(val) {
    let num = (val/incSum*100).toFixed(0);
    if(isNaN(num)) {
        return "0%";
    } else {
        return num + "%";
    }
}

setDate();
slct();
greenIcon.addEventListener("click", function() {
    tableRow(tblIncome, "+ ");
    setValue(incHdr, incSum, "+ ");
    setValue(budget, incSum-expSum, "sum");
});
redIcon.addEventListener("click", function() {
    tableRow(tblExpenses, "- ");
    setValue(expHdr, expSum, "- ");
    setValue(budget, incSum-expSum, "sum");
});
})();
