let pluginUUID;
let websocket;
let context;

const audio = new Audio();

const setTitle = (title = '') => {
    console.log(`Set title to "${title}" with context "${context}"`);
    websocket.send(JSON.stringify({
        event: 'setTitle',
        context,
        payload: {
            title,
        }
    }));
};

const setContext = (c) => {
    console.log(`Set context to "${c}"`);
    context = c;
};

const play = (data) => {
    const url = data.payload.settings.url;
    const newContext = data.context;
    if (audio.src === url) {
        setContext(newContext);
        audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
    } else {
        if (context)
            setTitle();
        setContext(newContext);
        audio.src = url;
        audio.play();
    }
};

const connectElgatoStreamDeckSocket = (inPort, inPluginUUID, inRegisterEvent, inInfo) => {
    pluginUUID = inPluginUUID;
    websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);

    websocket.onopen = () => {
        websocket.send(JSON.stringify({
            event: inRegisterEvent,
            uuid: inPluginUUID
        }));
    };

    websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);
        switch (data.event) {
            case 'keyUp':
                play(data);
                break;
        }
    };
};

audio.onwaiting = () => {
    console.log('waiting');
    setTitle('🔃');
};

audio.onplaying = () => {
    console.log('playing');
    setTitle('⏯️');
};

audio.onended = () => {
    console.log('ended');
    setTitle();
};

audio.onabort = () => {
    console.log('abort');
    setTitle();
};

audio.onerror = () => {
    console.log('error');
    setTitle();
    websocket.send(JSON.stringify({
        event: 'showAlert',
        context
    }));
};