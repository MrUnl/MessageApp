const socket = io('http://localhost:5000')
const messageContainer = document.querySelector('.chat-thread')
const roomContainer = document.getElementById('room-container')
const messageForm = document.querySelector('.chat-window')
const messageInput = document.querySelector('.chat-window-message')

if (messageForm != null) {
    let name = prompt('Kullanıcı Adı?')
    while (!name) {
        name = prompt('Kullanıcı Adı?')
    }
    appendAlert("Katıldınız");
    socket.emit('new-user', roomName, name)

    messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendMessage(`${message}`)
        socket.emit('send-chat-message', roomName, message)
        messageInput.value = ''
        return false;
    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
    console.log(data);
    appendMessage(data.message, false, data.name)
})

socket.on('user-connected', name => {
    appendAlert(`${name} katıldı.`)
})

socket.on('user-disconnected', name => {
    appendAlert(`${name} ayrıldı.`)
})

function appendAlert(message) {
    const messageElement = document.createElement('li')
    messageElement.classList.add("alert");
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

function appendMessage(message, you = true, user = null) {
    const messageElement = document.createElement('li')
    if (user !== null) {
        const userElement = document.createElement('span');
        userElement.innerText = user;
        messageElement.append(userElement)
    }
    if (you)
        messageElement.classList.add('you');
    messageElement.innerHTML += message
    messageContainer.append(messageElement)
}