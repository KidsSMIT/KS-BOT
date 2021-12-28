// wait for an updateReady message
render.on('updateReady', function(event, text) {
    // changes the text of the button
    render.send('app_version');
});

render.on("app_version", function(event, data) {
    var show_update_div = document.getElementById("show_update");

    show_update_div.innerHTML = `
    <div style="width: 160px; background-color: blue; color: white; text-align: center;border-radius: 6px; padding: 8px 0; position: absolute; z-index: 1; bottom: 50%; left: 50%; margin-left: -80px;">
        <p>You are currently on Version: ${data.version}</p>    
        <p>And a new update for Reciept-App is now availiable</p>
        <button onClick="render.send('quitAndInstall')">Update Now!!!</button>
    </div>
    `
});