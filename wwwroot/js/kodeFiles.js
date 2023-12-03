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


export const showMyProjects = async () => {
    try {
        const response = await fetch(URL + '/showAllMyFiles');
        console.log('openProject function called');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
};



document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');

    const openProjectListItem = document.getElementById('openProjectButton');

    if (openProjectListItem) {
        openProjectListItem.onclick = async (event) => {
            event.preventDefault();
            console.log('Open Project button clicked');
            await showMyProjects();
        };
    }
});

