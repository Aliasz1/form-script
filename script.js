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
                    imageList.appendChild(li);
                }
            });
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    }
    
    fetchImagesFromFolder();