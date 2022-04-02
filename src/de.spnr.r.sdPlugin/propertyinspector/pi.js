let pluginUUID;
let websocket;

const connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) => {
    pluginUUID = inPluginUUID;
    websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

    websocket.onopen = () => {
        websocket.send(JSON.stringify({
            event: inRegisterEvent,
            uuid: inPluginUUID
        }));
        websocket.send(JSON.stringify({
            event: 'getSettings',
            context: pluginUUID
        }));
    };

    const urlElement = document.getElementById('url');

    urlElement.oninput = () => {
        const url = urlElement.value;
        const json = {
            event: 'setSettings',
            context: pluginUUID,
            payload: {
                url
            }
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        switch (data.event) {
            case 'didReceiveSettings':
                if (data.payload.settings.url)
                    urlElement.value = data.payload.settings.url;
                break;
        }
    };
};