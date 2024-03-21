document
  .getElementById("submitBtn")
  .addEventListener("click", handleFileSubmit);
document
  .getElementById("columnSubmitBtn")
  .addEventListener("click", handleColumnSubmit);
document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

let fileContent;
let columnNames;
let data;

function handleFileSelect(event) {
  fileContent = event.target.files[0];
}

function handleFileSubmit() {
  if (fileContent) {
    const extension = fileContent.name.split(".").pop().toLowerCase();
    if (extension === "csv") {
      displayColumnSelector();
      readCSV(fileContent);
    } else if (extension === "json") {
      displayColumnSelector();
      readJSON(fileContent);
    } else {
      alert("Unsupported file format. Please upload a CSV or JSON file.");
    }
  } else {
    alert("Please select a file first.");
  }
}

function displayColumnSelector() {
  document.getElementById("columnSelector").style.display = "block";
}

function readCSV(csvContent) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;
    const rows = content.split("\n");
    columnNames = rows[0].split(",");
    populateColumnSelect();
  };
  reader.readAsText(csvContent);
}

function readJSON(jsonContent) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const data = JSON.parse(event.target.result)["products"];

    let products = [];
    Object.keys(data).forEach((key) => {
      let product = data[key];
      products.push(product);
    });
    products.sort((a, b) => b.popularity - a.popularity);
    columnNames = Object.keys(products[0]);
    console.log("columns : ", columnNames);
    populateColumnSelect();
  };
  reader.readAsText(jsonContent);
}

function populateColumnSelect() {
  const selectElement = document.getElementById("columnSelect");
  selectElement.innerHTML = "";
  columnNames.forEach((column) => {
    const option = document.createElement("option");
    option.value = column;
    option.textContent = column;
    selectElement.appendChild(option);
  });
}

function handleColumnSubmit() {
  const selectedColumns = Array.from(
    document.getElementById("columnSelect").selectedOptions
  ).map((option) => option.value);
  if (selectedColumns.length === 0) {
    alert("Please select at least one column.");
    return;
  }
  if (fileContent) {
    const extension = fileContent.name.split(".").pop().toLowerCase();
    if (extension === "csv") {
      displayCSV(fileContent, selectedColumns);
    } else if (extension === "json") {
      displayJSON(fileContent, selectedColumns);
    } else {
      alert("Unsupported file format. Please upload a CSV or JSON file.");
    }
  } else {
    alert("Please select a file first.");
  }
}

function displayCSV(csvContent, selectedColumns) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const content = event.target.result;
    const rows = content.split("\n");
    let table = "<table>";
    rows.forEach((row, rowIndex) => {
      table += "<tr>";
      const columns = row.split(",");
      if (rowIndex === 0) {
        columns.forEach((column, colIndex) => {
          if (selectedColumns.includes(column)) {
            table += "<th>" + column + "</th>";
          }
        });
      } else {
        columns.forEach((column, colIndex) => {
          if (selectedColumns.includes(columnNames[colIndex])) {
            table += "<td>" + column + "</td>";
          }
        });
      }
      table += "</tr>";
    });
    table += "</table>";
    document.getElementById("tableContainer").innerHTML = table;
  };
  reader.readAsText(csvContent);
}

function displayJSON(jsonContent, selectedColumns) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const data = JSON.parse(event.target.result)["products"];
    let products = [];
    Object.keys(data).forEach((key) => {
      let product = data[key];
      products.push(product);
    });
    products.sort((a, b) => b.popularity - a.popularity);

    let table = "<table>";
    table += "<tr>";
    selectedColumns.forEach((column) => {
      table += "<th>" + column + "</th>";
    });
    table += "</tr>";
    products.forEach((item) => {
      console.log("item : ", item);
      table += "<tr>";
      selectedColumns.forEach((column) => {
        table += "<td>" + item[column] + "</td>";
      });
      table += "</tr>";
    });
    table += "</table>";
    document.getElementById("tableContainer").innerHTML = table;
  };
  reader.readAsText(jsonContent);
}
