var sendChannel,
    receiveChannel,
    chatWindow = document.querySelector('.chat-window'),
    chatWindowMessage = document.querySelector('.chat-window-message'),
    chatThread = document.querySelector('.chat-thread');

socket.on("message-received", function(data) {
    handleMessage(data.message, data.user || "Ataberk ASLAN");
});
socket.on("user-joined", function(username) {
    showAlert(`${username} katıldı.`);
});
socket.on("user-disconnected", function(username) {
    showAlert(`${username} ayrıldı.`);
});
socket.on("connect", function() {
    socket.emit("connected", username)
});
socket.on("disconnect", function() {
    socket.emit("disconnected", username)
});
// On form submit, send message
chatWindow.onsubmit = function(e) {
    e.preventDefault();
    sendMessage(chatWindowMessage.value);
    handleMessage(chatWindowMessage.value);
    return false;
};

function sendMessage(message) {
    socket.emit("message-sent", { message, username });
}
/**
 * 
 * @param {String} message 
 * @param {String} user
 * @returns {void} 
 */
function showAlert(message) {
    const chatNewThread = document.createElement('li'),
        chatNewMessage = document.createTextNode(message);
    // Add message to chat thread and scroll to bottom
    chatNewThread.classList.add("alert");
    chatNewThread.appendChild(chatNewMessage);
    chatThread.appendChild(chatNewThread);
    chatThread.scrollTop = chatThread.scrollHeight;

    // Clear text value
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