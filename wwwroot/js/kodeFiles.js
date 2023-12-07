// const urltest = "https://codecraft.azurewebsites.net" //<- change to actual db for deployment

const urltest ="http://localhost:5215";

export const uploadDiv = async (name, kodeAsADiv) => {
    try {
        const data = {
            Name: name,
            Content: kodeAsADiv
        };

        const response = await fetch(urltest + '/file/uploadtext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);
    } catch (e) {
        console.error(e);
    }
};




export const showMyProjects = async () => {
    try {
        const response = await fetch(urltest + '/file/showAllMyFiles');
        console.log('openProject function called');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const loadMyProject = async (myProject) => {
    try {
        console.log(myProject)
        const url = `${urltest}/file/loadAProject?projectName=${encodeURIComponent(myProject)}`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
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

            let dialog = document.getElementById('openDialog');
            dialog.showModal();

            console.log('Open Project button clicked');
            let data = await showMyProjects();
            if (!data) {
                console.log('No projects found');
                return;
            } else {
                let projectList = document.getElementById('openDialogList');
                projectList.innerHTML = '';

                for (let i = 0; i < data.projects.length; i++) {
                    let button = document.createElement('button');
                    button.className = 'openDialogListItem';
                    button.innerHTML = data.projects[i];

                    button.addEventListener('click', async () => {
                        await loadMyProject(data.projects[i]);
                        dialog.close();
                    });

                    projectList.appendChild(button);
                }
            }
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
        let dialog = document.getElementById('saveDialog');
        dialog.close();
    }
});


