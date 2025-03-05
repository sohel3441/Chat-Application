
// // const socket = io();

// const socket = io("https://chat-application-one-plum.vercel.app", {
//     transports: ["websocket", "polling"]
// });

// const clientsTotal = document.getElementById('clients-total');

// const messageContainer = document.getElementById('message-container');
// const messageForm = document.getElementById('message-form');
// const messageInput =  document.getElementById('message-input');
// const nameInput = document.getElementById('name-input');

// const messageTone = new Audio('/Whatsapp Message.mp3')

// socket.on('clients-total' , (data) => {
//     clientsTotal.innerText = `Total clients ${data}`
// })

// messageForm.addEventListener('submit' , (e) => {
//     e.preventDefault();
//    sendMessage();
// })

// function sendMessage ()  {
//     if(messageInput.value === '') return
//     const data = {
//        name : nameInput.value,
//         message : messageInput.value,
//         dateTime : new Date()
//     }
//     console.log('Sending message:', data);

//     socket.emit('message' , data);
//     addMessageToUI(true , data) ;
//     messageInput.value = '';
// }

// socket.on('chat-message' , (data) => {
//     messageTone.play();
//     addMessageToUI(false , data);
// })

// function addMessageToUI(isOwnMessage, data) {
//     clearFeedBack();

//     const li = document.createElement("li");
//     li.className = isOwnMessage ? "message-right" : "message-left";
//     li.innerHTML = `
//         <p class="message">
//            ${data.message}
//             <span>${data.name} • ${moment(data.dateTime).format('h:mm A')}</span>
//         </p>`;

//     messageContainer.appendChild(li);
//     // saveMessageToLocalStorage(data);
//     scrollToBottom();
// }






// function scrollToBottom () {
//     messageContainer.scrollTop = messageContainer.scrollHeight;

// }

// messageInput.addEventListener('focus' , (e) => {
//     socket.emit('feedback' , {
//         feedback : `${nameInput.value} is typing a message`
//     })
// })

// messageInput.addEventListener('keypress' , (e) => {
//     socket.emit('feedback' , {
//         feedback : `${nameInput.value} is typing a message`
//     })
// })

// messageInput.addEventListener('blur' , (e) => {
//     socket.emit('feedback' , {
//         feedback : ``
//     })
// })


// socket.on('feedback' , (data) => {
//     clearFeedBack();
//     const element = `
//           <li class="message-feedback">
//           <p class="feedback" id="feedback">${data.feedback}</p>
//           </li>`
//           messageContainer.innerHTML += element;
// })


// function clearFeedBack () {
//    document.querySelectorAll('li.message-feedback').forEach(element => {
//     element.parentNode.removeChild(element);
//    })
// }












// const socket = io("https://chat-application-one-plum.vercel.app", {
//     transports: ["websocket", "polling"]
// });
const socket = io();

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const nameInput = document.getElementById('name-input');
const messageTone = new Audio('/Whatsapp Message.mp3');

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === '') return;
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    };
    console.log('Sending message:', data);
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTone.play();
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedBack();
    const li = document.createElement("li");
    li.className = isOwnMessage ? "message-right" : "message-left";
    li.innerHTML = `
        <p class="message">
           ${data.message}
            <span>${data.name} • ${moment(data.dateTime).format('h:mm A')}</span>
        </p>`;
    messageContainer.appendChild(li);
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener('focus', () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    });
});

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    });
});

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', {
        feedback: ``
    });
});

socket.on('feedback', (data) => {
    clearFeedBack();
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
        </li>`;
    messageContainer.innerHTML += element;
});

function clearFeedBack() {
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element);
    });
}
