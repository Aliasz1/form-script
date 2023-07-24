const folderId = '1m0Rv56pOhzJ_CUuJWDI6dvMNlnTcUiYf';
const apiKey = 'AIzaSyDI76_OsUZmk53m6C5XTHYR2t_K1kb4ovw';
const cart = [];

async function fetchImagesFromFolder() {
    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name,webContentLink,mimeType)&key=${apiKey}`);
        const data = await response.json();
        const imageList = document.getElementById('imageList');

        data.files.forEach(file => {
            if (file.mimeType.startsWith('image/')) {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = file.webContentLink || 'https://via.placeholder.com/150';
                img.alt = file.name;
                li.appendChild(img);
    
                // Update the event listener for sizeDropdown
                const { dropdown: sizeDropdown, selected: selectedSize } = createDropdown('Size', ['90CM', '100CM']);
                li.appendChild(sizeDropdown);
    
                // Update the event listener for amountDropdown
                const { dropdown: amountDropdown, selected: selectedAmount } = createDropdown('Amount', ['1', '2', '3', '4', '5']);
                li.appendChild(amountDropdown);
    
                // Add a button
                const button = document.createElement('button');
                button.textContent = 'Add to Cart';
                button.addEventListener('click', () => {
                    addToCart(file.name, selectedSize, selectedAmount);
                });
                li.appendChild(button);
    
                imageList.appendChild(li);
            }
        });
    
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function addToCart(imageName, selectedSize, selectedAmount) {
    // Add the selected item details to the cart array
    cart.push({
        name: imageName,
        size: selectedSize,
        amount: selectedAmount
    });

    displayCartData();
    console.log(`Added "${imageName}" with size "${selectedSize}" and amount "${selectedAmount}" to the cart.`);
}

// Updated function to create a dropdown with options
function createDropdown(label, options) {
    const dropdown = document.createElement('select');
    dropdown.addEventListener('change', () => {
        dropdown.setAttribute('data-selected', dropdown.value); // Store the selected value as a data attribute
    });

    const labelElem = document.createElement('label');
    labelElem.textContent = `${label}: `;
    labelElem.appendChild(dropdown);

    options.forEach(option => {
        const optionElem = document.createElement('option');
        optionElem.textContent = option;
        dropdown.appendChild(optionElem);
    });

    // Set the initial value for the data attribute
    dropdown.setAttribute('data-selected', options[0]);

    return { dropdown, selected: options[0] };
}

function displayCartData() {
    const cartDataDisplay = document.getElementById('cartDataDisplay');

    if (cart.length === 0) {
        cartDataDisplay.innerHTML = '<p>Your Cart is empty.</p>';
        return;
    }

    cartDataDisplay.innerHTML = ''; // Clear previous contents

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Item Name</th>
            <th>Size</th>
            <th>Amount</th>
        </tr>
    `;

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.amount}</td>
        `;
        table.appendChild(row);
    });

    cartDataDisplay.appendChild(table);
}

function submitCart(customerName, contactNumber, cartData) {
    var spreadsheetId = "13_O2mfueAeBk5QkKO43FTwQ0xLBWLihTpoQmpTfi0bs"; // Replace with your Google Sheets spreadsheet ID
    var sheetName = "Master Order"; // Replace with the name of the sheet to append the cart data
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);
    var timeStamp = new Date();
    var formattedCartData = cartData.map(item => item.slice(0, 2).join(" ") + " - " + item[2]).join("\n");
    
    sheet.appendRow([timeStamp, customerName, contactNumber, formattedCartData]);
    }

    function submitCart() {
        const customerName = document.getElementById("customerName").value;
        const contactNumber = document.getElementById("contactNumber").value;
    
        // Create an array with the data to be appended
        const rowData = [customerName, contactNumber];
    
        // Call the function to append data to the Google Sheets
        appendToSheet(rowData);
      }
    
      // Function to append data to the Google Sheets
function appendToSheet(data) {
gapi.client.init({
    apiKey: 'YOUR_API_KEY', // Your Google Cloud API key (not the service account key)
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    clientId: 'YOUR_CLIENT_ID', // Your Google Cloud client ID (not the service account client ID)
    scope: 'https://www.googleapis.com/auth/spreadsheets',
}).then(function () {
    gapi.client.load('sheets', 'v4', function () {
    // ID of the Google Sheets document and the sheet you want to append to
    const spreadsheetId = '13_O2mfueAeBk5QkKO43FTwQ0xLBWLihTpoQmpTfi0bs';
    const range = 'Master Order';

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
        values: [data],
        },
    }).then(function (response) {
        console.log('Data appended successfully:', response);
    }, function (reason) {
        console.error('Error appending data:', reason.result.error.message);
    });
    });
});
    }
    
    fetchImagesFromFolder();