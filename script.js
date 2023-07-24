    const folderId = '1m0Rv56pOhzJ_CUuJWDI6dvMNlnTcUiYf';
    const apiKey = 'AIzaSyDI76_OsUZmk53m6C5XTHYR2t_K1kb4ovw';
    
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
    
                    // Add name below the image
                    const name = document.createElement('span');
                    name.textContent = file.name;
                    li.appendChild(name);
    
                    // Add size selection dropdown
                    const sizeDropdown = createDropdown('Size', ['Small', 'Medium', 'Large']);
                    li.appendChild(sizeDropdown);
    
                    // Add amount selection dropdown
                    const amountDropdown = createDropdown('Amount', ['1', '2', '3', '4', '5']);
                    li.appendChild(amountDropdown);
    
                    // Add a button
                    const button = document.createElement('button');
                    button.textContent = 'Add to Cart';
                    button.addEventListener('click', () => {
                        const selectedSize = sizeDropdown.value;
                        const selectedAmount = amountDropdown.value;
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
        // Replace this function with your desired functionality to add items to the cart.
        // For example, you could store the selected items in an array or perform some other action.
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
    
        return labelElem;
    }
    
    fetchImagesFromFolder();