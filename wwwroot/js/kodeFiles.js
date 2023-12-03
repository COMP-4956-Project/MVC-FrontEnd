const URL = "http://localhost:5215/file"; // Change the localhost

// const urltest = "https://codecraft.azurewebsites.net/file" <- change to actual db for deployment

export const uploadDiv = async (kodeAsADiv) => {
    try {
        const formData = new FormData();
        formData.append('name', 'kodeDiv.txt');
        formData.append('content', kodeAsADiv);

        const response = await fetch(URL + '/uploadtext', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); 
    } catch (e) {
        console.error(e);
    }
};
