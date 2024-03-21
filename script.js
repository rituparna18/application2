document.addEventListener('DOMContentLoaded', function() {
    
    const displayHandlingSelect = document.getElementById('selectedFields'); // Correct the ID
    const addBtn = document.querySelector('.button-container button:nth-child(1)'); // Correct the query selector
    const removeBtn = document.querySelector('.button-container button:nth-child(2)'); // Correct the query selector
    const productTable = document.querySelector('table'); // Correct the query selector

    // // const displayHandlingSelect = document.getElementById('displayHandling');
    // // const addBtn = document.getElementById('addBtn');
    // // const removeBtn = document.getElementById('removeBtn');
    // // const productTable = document.getElementById('productTable');


    
    const optionsData = [
        { value: '1', label: 'Subcategory' },
        { value: '2', label: 'Title' },
        { value: '3', label: 'Price' },
        { value: '3', label: 'Popularity' },
        { value: '3', label: 'Description' },
        { value: '3', label: 'UTM source' },
        { value: '3', label: 'UTM medium' },
        { value: '3', label: 'Rating' }
        
    ];

    // Function to populate select options
    function populateSelect() {
        const selectElement = document.getElementById('selectedFields');

        optionsData.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            selectElement.appendChild(optionElement);
        });
    }

    // Call the function to populate select options
    populateSelect();

    let selectedFields = [];

    // Event listeners for add and remove buttons
    addBtn.addEventListener('click', function() {
        const selectedOptions = Array.from(displayHandlingSelect.selectedOptions);
        selectedOptions.forEach(option => {
            if (!selectedFields.includes(option.value)) {
                selectedFields.push(option.value);
            }
        });
        renderTable();
    });

    removeBtn.addEventListener('click', function() {
        const selectedOptions = Array.from(displayHandlingSelect.selectedOptions);
        selectedOptions.forEach(option => {
            const index = selectedFields.indexOf(option.value);
            if (index !== -1) {
                selectedFields.splice(index, 1);
            }
        });
        renderTable();
    });

    // Fetch JSON data and render table
    fetch('https://s3.amazonaws.com/open-to-cors/assignment.json')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to render table based on selected fields
    function renderTable(data) {
        if (!data) return;

        productTable.innerHTML = '';

        const sortedData = data.sort((a, b) => b.popularity - a.popularity);

        const tableHead = `<tr>${selectedFields.map(field => `<th>${field}</th>`).join('')}</tr>`;
        const tableBody = sortedData.map(product => {
            const rowData = selectedFields.map(field => `<td>${product[field]}</td>`).join('');
            return `<tr>${rowData}</tr>`;
        }).join('');

        productTable.innerHTML = tableHead + tableBody;
    }
});

