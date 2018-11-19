(function() {
function $id(id) {
    return document.getElementById(id);
}

function $create(elem) {
    return document.createElement(elem);
}

let incSum = 0;
let expSum = 0;
let incArr = [];
let expArr = [];
const budget = $id("budget");
const incHdr = $id("inc");
const expHdr = $id("exp");
const select = $id("slct");
const greenIcon = $id("green");
const redIcon = $id("red");
const tblIncome = $id("income");
const tblExpenses = $id("expenses");
const perc = $id("perc");

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
    const description = $id("describe").value;
    let val = parseFloat($id("value").value);
    if(select.value === "plus") {
        incSum += val;
    } else {
        expSum += val;
    }

    addRow(table, sign, val, description);
}

function addRow(table, sign, val, description) {
    let tr = $create("tr");
    let td0 = $create("td");
    let td1 = $create("td");
    let td2 = $create("td");
    let td3 = $create("td");
    let btn = $create("button");
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
    tr.childNodes[0].innerHTML = description;
    tr.childNodes[1].innerHTML = sign+val.toFixed(2);
    tr.childNodes[tr.childNodes.length-1].appendChild(btn);
}

function setValue(elem, val, sign) {
    if(sign === "sum" && val < 0) {
        elem.innerHTML = "-"+Number(-val).toFixed(2);
    } else if(sign === "sum") {
        elem.innerHTML = "+ "+Number(val).toFixed(2);
    } else {
        if(sign === "-") {
            if(val < 0) {sign = ""};
            elem.innerHTML = sign+Number(val).toFixed(2);
            perc.innerHTML = percent(val);
        }
        elem.innerHTML = sign+Number(val).toFixed(2);
    }
}

function dltBtn(elem, sign, val) {
    elem.parentNode.parentNode.remove();
    if(sign === "+") {
        incSum -= val;
        setValue(incHdr, incSum, "+");
        if(expSum < 0) {
            setValue(budget, incSum+expSum, "sum");
        } else {
            setValue(budget, incSum-expSum, "sum");
        }
        perc.innerHTML = percent(expSum);
    } else {
        expSum -= val;
        setValue(expHdr, expSum, "-");
        if(expSum < 0) {
            setValue(budget, incSum+expSum, "sum");
        } else {
            setValue(budget, incSum-expSum, "sum");
        }
        perc.innerHTML = percent(expSum);
    }
    percentTable();
    hdrToLclStrg();
    tblToLclStrg(tblIncome);
    tblToLclStrg(tblExpenses);
}

function percent(val) {
    let num = (val/Number(incHdr.innerHTML)*100).toFixed(1);
    if(isNaN(num)) {
        return "0%";
    } else if(num === "Infinity") {
        return "100%";
    } else {
        return num + "%";
    }
}

function percentTable() {
    const tblExpenses = $id("expenses");
    for(let i = 0; i < tblExpenses.childElementCount; i++) {
        let val = tblExpenses.children[i].children[1].innerHTML;
        tblExpenses.children[i].children[2].innerHTML = percent(Number(val)*-1);
    }
}

function hdrToLclStrg() {
    localStorage.setItem("budget", budget.innerHTML);
    localStorage.setItem("incomeHdr", incHdr.innerHTML);
    localStorage.setItem("expensesHdr", expHdr.innerHTML);
    localStorage.setItem("percHdr", perc.innerHTML);
    localStorage.setItem("incSum", incHdr.innerHTML);
    localStorage.setItem("expSum", expHdr.innerHTML);
}   

function tblToLclStrg(table) {
    if(table.id === "income") {
        incArr = [];
    } else {
        expArr = [];
    }
    for(i = 0; i < table.childElementCount; i++) {
        if(table.id === "income") {
            incArr.push((table.children[i].children[0]).innerHTML);
            incArr.push((table.children[i].children[1]).innerHTML);
        } else {
            expArr.push((table.children[i].children[0]).innerHTML);
            expArr.push((table.children[i].children[1]).innerHTML);
        }
    }
    localStorage.setItem("incTbl", JSON.stringify(incArr));
    localStorage.setItem("expTbl", JSON.stringify(expArr));
}

function hdrFromLclStrg() {
    budget.innerHTML = localStorage.getItem("budget");
    incHdr.innerHTML = localStorage.getItem("incomeHdr");
    expHdr.innerHTML = localStorage.getItem("expensesHdr");
    perc.innerHTML = localStorage.getItem("percHdr");
}

function tblFromLclStrg(table) {
    if(localStorage !== null && localStorage !== "" && typeof (Storage) !== undefined) {
        if(table.id === "income") {
            if(JSON.parse(localStorage.getItem("incTbl")) !== null) {
                for(let i = 0; i < JSON.parse(localStorage.getItem("incTbl")).length; i+=2) {
                    addRow(tblIncome, "+", Number(JSON.parse(localStorage.getItem("incTbl"))[i+1]), JSON.parse(localStorage.getItem("incTbl"))[i]);
                    percentTable();
                }
            }
        } else {
            if(JSON.parse(localStorage.getItem("expTbl")) !== null) {
                for(let i = 0; i < JSON.parse(localStorage.getItem("expTbl")).length; i+=2) {
                    addRow(tblExpenses, "", Number(JSON.parse(localStorage.getItem("expTbl"))[i+1]), JSON.parse(localStorage.getItem("expTbl"))[i]);
                    percentTable();
                }
            }
        }
    }
}

incArr = JSON.parse(localStorage.getItem("incTbl"));
expArr = JSON.parse(localStorage.getItem("expTbl"));
incSum = Number(localStorage.getItem("incSum"));
expSum = Number(localStorage.getItem("expSum"));

setDate();
slct();
greenIcon.addEventListener("click", function() {
    tableRow(tblIncome, "+");
    setValue(incHdr, incSum, "+");
    if(expSum < 0) {
        setValue(budget, incSum+expSum, "sum");
    } else {
        setValue(budget, incSum-expSum, "sum");
    }
    perc.innerHTML = percent(expSum);
    percentTable();
    hdrToLclStrg();
    tblToLclStrg(tblIncome);
});
redIcon.addEventListener("click", function() {
    tableRow(tblExpenses, "-");
    setValue(expHdr, expSum, "-");
    if(expSum < 0) {
        setValue(budget, incSum+expSum, "sum");
    } else {
        setValue(budget, incSum-expSum, "sum");
    }
    percentTable();
    hdrToLclStrg();
    tblToLclStrg(tblExpenses);
});
window.addEventListener("load", function() {
    hdrFromLclStrg();
    tblFromLclStrg(tblIncome);
    tblFromLclStrg(tblExpenses);
});
})();
