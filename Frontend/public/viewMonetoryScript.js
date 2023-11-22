let table1 = document.getElementById("table1");
let tablebody1 = document.getElementById("tablebody1");
let table2 = document.getElementById("table2");
let tablebody2 = document.getElementById("tablebody2");
let table3 = document.getElementById("table3");
let tablebody3 = document.getElementById("tablebody3");
let table4 = document.getElementById("table4");
let tablebody4 = document.getElementById("tablebody4");
let table5 = document.getElementById("table5");
let tablebody5 = document.getElementById("tablebody5");
const dailyDataArray = [];
const weeklyDataArray = [];
const monthlyDataArray = [];
const yearlyDataArray = [];
const btnDownload = document.getElementById('btnDownload');
document.addEventListener('DOMContentLoaded', fetchData);

async function fetchData() {
    const token = localStorage.getItem('token');
    const result = await axios.get('/expense/viewReportExpensesData', {
        headers: {
            "Authorization": token
        }
    });
    const yearlyResult = await axios.get('/expense/viewYearlyExpensesData', {
        headers: {
            "Authorization": token
        }
    });
    const DownloadUrl = await axios.get('/expense/getDownloadUrl', {
        headers: {
            "Authorization": token
        }
    });

    const currentDate = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    const [month, day, year] = formattedDate.split('/');
    const today = `${year}-${month}-${day}`;
    const thisWeekStart = new Date(currentDate);
    thisWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const thisWeekStartFormatted = thisWeekStart.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonthStartFormatted = thisMonthStart.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const dailyData = result.data.filter(item => item.updatedAt.startsWith(today));
    const weeklyData = result.data.filter(item => item.updatedAt >= thisWeekStartFormatted);
    const monthlyData = result.data.filter(item => item.updatedAt >= thisMonthStartFormatted);

    displayData(dailyData, table1, tablebody1, dailyDataArray);
    displayData(weeklyData, table2, tablebody2, weeklyDataArray);
    displayData(monthlyData, table3, tablebody3, monthlyDataArray);
    displayYearlyReport(yearlyResult.data, table4, tablebody4, yearlyDataArray);
    displayDownloadUrl(DownloadUrl.data, table5, tablebody5);
}

async function displayData(data, tablebody, table, dataArray) {
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(new Date(data[i].updatedAt).toISOString().split('T')[0]));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            td2.id = "td2";
            td2.appendChild(document.createTextNode(data[i].expenseAmount));
            tr.appendChild(td2);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].expenseType));
            tr.appendChild(td3);
            let td4 = document.createElement("td");
            td4.id = "td4";
            td4.appendChild(document.createTextNode(data[i].description));
            tr.appendChild(td4);
            dataArray.push({
                date: new Date(data[i].updatedAt).toISOString().split('T')[0],
                ExpenseAmount: data[i].expenseAmount,
                expenseType: data[i].expenseType,
                description: data[i].description,
            });
            tablebody.appendChild(tr)
        }
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }

}

async function displayYearlyReport(data, tablebody, table, dataArray) {
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let dateParts = data[i].year.split('-');
            let month = parseInt(dateParts[0], 10);
            let year = parseInt(dateParts[1], 10);
            let formattedDate = new Date(year, month - 1);
            let monthName = formattedDate.toLocaleString('en-US', { month: 'long' });

            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(`${monthName} ${year}`));
            tr.appendChild(td1);
            let td3 = document.createElement("td");
            td3.id = "td3";
            td3.appendChild(document.createTextNode(data[i].TotalExpense));
            tr.appendChild(td3);
            dataArray.push({
                monthYear: `${monthName} ${year}`,
                totalExpense: data[i].TotalExpense,
            });
            tablebody.appendChild(tr)
        }
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }
}

function displayDownloadUrl(data, table, tablebody) {
    tablebody.innerHTML = '';
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            tr.className = 'text-center'
            let td1 = document.createElement("td");
            td1.id = "td1";
            td1.appendChild(document.createTextNode(data[i].date));
            tr.appendChild(td1);
            let td2 = document.createElement("td");
            let downloadLink = document.createElement("a");
            downloadLink.href = data[i].fileUrl;
            downloadLink.target = "_blank";
            downloadLink.appendChild(document.createTextNode(document.innerHTML = `${data[i].fileUrl}`));
            td2.appendChild(downloadLink);
            tr.appendChild(td2);
            tablebody.appendChild(tr);
        }
        let extraTr = document.createElement("tr");
        let extraTd = document.createElement("td");
        extraTd.textContent = 'new data will be added here';
        extraTr.appendChild(extraTd);
        tablebody.appendChild(extraTr);
    }
    else {
        table.innerHTML = "<div class='text-center'><h5>No Data Found</h5></div>";
    }
}

btnDownload.addEventListener('click', async (e) => {
    const queryParams = {
        dailyData: dailyDataArray,
        weeklyData: weeklyDataArray,
        monthlyData: monthlyDataArray,
        yearlyData: yearlyDataArray
    };

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/expense/download', queryParams, {
            headers: {
                "Authorization": token
            }
        });
        console.log(response)
        var a = document.createElement('a');
        a.href = response.data.fileUrl;
        a.click();
        setTimeout(function () {
            window.location.reload();
        }, 3000);
    } catch (error) {
        console.log(error)
        alert('something went wrong');
    }
});