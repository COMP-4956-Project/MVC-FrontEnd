const URL = "http://localhost:5215/file"; // Change the localhost

// const urltest = "https://codecraft.azurewebsites.net/file" <- change to actual db for deployment

export const uploadDiv = async (name, kodeAsADiv) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
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
        //console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
};



document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');

    const openProjectListItem = document.getElementById('openProjectButton');
    const saveProjectButton = document.getElementById('saveProjectButton');
    const saveButton = document.getElementById('saveButton');

    if (openProjectListItem) {
        openProjectListItem.onclick = async (event) => {
            event.preventDefault();
            console.log('Open Project button clicked');
            let data = await showMyProjects();
            let projectList = document.getElementById('openDialogList');
            projectList.innerHTML = '';

            for (let i = 0; i < data.projects.length; i++) {
                let div = document.createElement('div');
                div.className = 'openDialogListItem';
                div.innerHTML = data.projects[i];
                projectList.appendChild(div);
            }

            let dialog = document.getElementById('openDialog');
            dialog.showModal();
        };
    }

    if (saveProjectButton) {
        saveProjectButton.onclick = async (event) => {
            event.preventDefault();
            let dialog = document.getElementById('saveDialog');
            dialog.showModal();
        };
    }

    saveButton.onclick = async (event) => {
        event.preventDefault();
        let name = document.getElementById('saveDialogInput').value;

        let kodeAsADiv = document.getElementById('test2').outerHTML;
        console.log(kodeAsADiv);

        await uploadDiv(name, kodeAsADiv);
        // let dialog = document.getElementById('saveDialog');
        // dialog.close();
    }
});

