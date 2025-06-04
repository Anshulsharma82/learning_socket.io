const socket = io('http://localhost:3000')

const form = document.getElementsByTagName('form')[0]
const inputField = document.getElementById('msgField')
const contentDiv = document.getElementById('contentDiv')

let userName = prompt('What\'s your name?')

while(!userName) {
    userName = prompt('What\'s your name?')
}

appendMessage('You Joined!', 'bg-black', 'text-white')
socket.emit('user-connected', userName)


socket.on('new-user-connected', (userName) => {
    console.log('broadcast!')
    appendMessage(`${userName} connected!`, 'bg-green-300')
})

socket.on('boradcast-msg', (obj) => {
    console.log('userName::::::::::::::::::::::::::', userName)
    appendMessage(`${obj.userName}: ${obj.msg}`)
})

socket.on('user-disconnected', (userName) => {
    appendMessage(`${userName} disconnected`, 'bg-red-300')
})

form.addEventListener('submit', (e) => {
    if(inputField.value.trim() === '' || !inputField.value) {
        console.log('invalid input')
        return;
    }
    e.preventDefault();
    console.log('button clicked')
    appendMessage(`You: ${inputField.value}`, 'bg-gray-200', 'white')
    socket.emit('send-message',inputField.value)
    inputField.value = ''
})


function appendMessage(msg, backgroundColor='bg-white', color='black') {
    const newDiv = document.createElement('div')
    newDiv.innerHTML = msg
    newDiv.classList.add(backgroundColor, color)
    contentDiv.appendChild(newDiv)
} 

// function appendMessage2(msg) {
//     const newDiv = document.createElement('div')
//     newDiv.innerHTML = msg
//     newDiv.classList.add('bg-gray-400', 'text-white')
//     contentDiv.appendChild(newDiv)
// } 