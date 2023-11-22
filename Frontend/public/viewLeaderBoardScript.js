let tabel = document.getElementById("table");
let tabelbody = document.getElementById("tablebody");
document.addEventListener('DOMContentLoaded', fetchData());

async function fetchData() {
    const result = await axios.get('/expense/viewLeaderBoardData');
    displayData(result.data)
}


async function displayData(data) {
    tabelbody.innerText = "";
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.id = "td";
            td.appendChild(document.createTextNode(i + 1));
            tr.appendChild(td);
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].name));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].totalExpense));
            tr.appendChild(td2);
            tabelbody.appendChild(tr);
        }
    } else {
        tabel.innerHTML = "<h5>No Data Found</h5>";
    }
}