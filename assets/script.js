const socket = io("http://192.168.1.23:5555")


var sendChannel,
    receiveChannel,
    chatWindow = document.querySelector('.chat-window'),
    chatWindowMessage = document.querySelector('.chat-window-message'),
    chatThread = document.querySelector('.chat-thread');

socket.on("message-received", function(data) {
    console.log("Mesaj geldi breh");
    handleMessage(data.message, data.user || "Ataberk ASLAN");
});
socket.on("user-joined", function(data) {
    console.log(data.user + " chate katıldı.");
});
socket.on("user-disconnected", function(data) {
    console.log(data.user + " chatten ayrıldı.");
});
// On form submit, send message
chatWindow.onsubmit = function(e) {
    e.preventDefault();
    sendMessage(chatWindowMessage.value);
    handleMessage(chatWindowMessage.value);
    return false;
};

function sendMessage(message) {
    socket.emit("message-sent", message);
}

function handleMessage(message, user = "you") {
    if (message !== "") {
        const chatNewThread = document.createElement('li'),
            chatNewMessage = document.createTextNode(message);
        chatNewThread.classList.add(user.toLocaleLowerCase().replace(" ", ""));
        // Add message to chat thread and scroll to bottom
        if (user !== "you") {
            const usernameField = document.createElement("span");
            usernameField.innerHTML = user;
            chatNewThread.appendChild(usernameField);
        }
        chatNewThread.appendChild(chatNewMessage);
        chatThread.appendChild(chatNewThread);
        chatThread.scrollTop = chatThread.scrollHeight;

        // Clear text value
        chatWindowMessage.value = '';
    } else {
        alert("Mesaj alanını boş bırakmayın!")
    }
}