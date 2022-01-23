let name_input = document.getElementById("name_input");

let password_input = document.getElementById("password_input");

let error_log = document.getElementById("error_log");

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

document.getElementById("SubmitLoginButton").onclick = function() {
    error_log.innerHTML = "Trying to Log you in..."
    if (name_input.value.length > 0 && password_input.value.length > 0) {
        fetch(`${Config.get_url()}/does_user_exist`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name_input.value,
                    password: password_input.value,
                }),
            }).then(res => { return res.json() })
            .then(data => {
                //console.log(data)
                if (data.returns == "User exist") {
                    let datas = data.data
                    ipcRenderer.send('login', { id: datas.id, name: datas.name, password: datas.password })
                } else { error_log.innerHTML = "Incorrect Name/Password" }
            })
    } else {
        error_log.innerHTML = "Please fill out the feilds correctly"
    }
};

/**
 * A reactive way to login the user once they are done putting in there password
 */
password_input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("SubmitLoginButton").click();
    }
})