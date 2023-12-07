const urltest = "https://codecraft.azurewebsites.net"; //<- change to actual db for deployment

// const urltest ="http://localhost:5215";

//for making a new one in the db
const uploadDiv = async (name, kodeAsADiv) => {
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

// for saving current work 
export const saveMyProject = async (name, kodeAsADiv) => {
    try {
        console.log('clicked in kodeFile');
        console.log('name '+name)
        console.log('code '+kodeAsADiv)

        const data = {
            Name: name,
            Content: kodeAsADiv
        };

        console.log(data)

        const response = await fetch(urltest + '/file/savefile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Check if the response is not okay and handle the error
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorMessage}`);
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
        return data;
    } catch (e) {
        console.log(e);
    }
};

export const loadMyProject = async (myProject) => {
    try {
        const url = `${urltest}/file/loadAProject?projectName=${encodeURIComponent(myProject)}`;

        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            console.log(data.projectContents);

            const test2Container = document.getElementById('test2');
            console.log(test2Container);

            if (test2Container) {
                console.log('Replacing content of test2...');
                test2Container.outerHTML = data.projectContents;
                console.log('Content of test2 replaced successfully.');
                sessionStorage.setItem('projectName', myProject)
            } else {
                console.error('Element with id test2 not found.');
            }
            console.log(data.projectContents)
            return data.projectContents;
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (e) {
        console.error(e);
    }
};

document.addEventListener('DOMContentLoaded', () => {

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
        sessionStorage.setItem("projectName",name)
        let dialog = document.getElementById('saveDialog');
        dialog.close();
    }
});


