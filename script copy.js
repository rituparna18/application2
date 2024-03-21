document.addEventListener("DOMContentLoaded", function () {
  fetch("https://s3.amazonaws.com/open-to-cors/assignment.json")
    .then((response) => response.json())
    .then((data) => {
      data = data["products"];
      const productTable = document
        .getElementById("productTable")
        .getElementsByTagName("tbody")[0];
      let products = [];
      Object.keys(data).forEach((key) => {
        let product = data[key];
        products.push(product);
      });
      products.sort((a, b) => b.popularity - a.popularity);
      products.forEach((product) => {
        const row = productTable.insertRow();
        row.innerHTML = `
                        <td>${product.subcategory}</td>
                        <td>${product.title}</td>
                        <td>₹ ${product.price}</td>
                        <td>${product.popularity}</td>
                    `;
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});
