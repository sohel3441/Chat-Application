// import { io } from "socket.io-client";
// const socket = io("https://chat-application-one-plum.vercel.app");

// const socket = io('https://chat-application-one-plum.vercel.app');
// const socket = io();
const socket = io("https://chat-application-one-plum.vercel.app");

const clientsTotal = document.getElementById('clients-total');

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message-form');
const messageInput =  document.getElementById('message-input');
const nameInput = document.getElementById('name-input');

const messageTone = new Audio('/Whatsapp Message.mp3')

socket.on('clients-total' , (data) => {
    clientsTotal.innerText = `Total clients ${data}`
})

messageForm.addEventListener('submit' , (e) => {
    e.preventDefault();
   sendMessage();
})

function sendMessage ()  {
    if(messageInput.value === '') return
    const data = {
       name : nameInput.value,
        message : messageInput.value,
        dateTime : new Date()
    }
    socket.emit('message' , data);
    addMessageToUI(true , data) ;
    messageInput.value = '';
}

socket.on('chat-message' , (data) => {
    messageTone.play();
    addMessageToUI(false , data);
})

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
    saveMessageToLocalStorage(data);
    scrollToBottom();
}


function saveMessageToLocalStorage(message) {
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    
    // Limit to last 100 messages
    if (messages.length >= 100) {
        messages.shift(); // Remove the oldest message
    }

    messages.push(message);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
}



function loadMessagesFromLocalStorage() {
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const fragment = document.createDocumentFragment();

    messages.forEach((data) => {
        const isOwnMessage = data.name === nameInput.value;
        const li = document.createElement("li");
        li.className = isOwnMessage ? "message-right" : "message-left";
        li.innerHTML = `
          <p class="message">
           ${data.message}
            <span>${data.name} • ${moment(data.dateTime).format('h:mm A')}</span>
          </p>
        `;
        fragment.appendChild(li);
    });

    messageContainer.appendChild(fragment); // Append all at once
    scrollToBottom();
}


// Load messages when page loads
document.addEventListener("DOMContentLoaded", loadMessagesFromLocalStorage);





function scrollToBottom () {
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

messageInput.addEventListener('focus' , (e) => {
    socket.emit('feedback' , {
        feedback : `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress' , (e) => {
    socket.emit('feedback' , {
        feedback : `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur' , (e) => {
    socket.emit('feedback' , {
        feedback : ``
    })
})

socket.on('feedback' , (data) => {
    clearFeedBack();
    const element = `
          <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
          </li>`
          messageContainer.innerHTML += element;
})


function clearFeedBack () {
   document.querySelectorAll('li.message-feedback').forEach(element => {
    element.parentNode.removeChild(element);
   })
}