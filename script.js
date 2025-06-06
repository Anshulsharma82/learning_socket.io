const socket = io('http://localhost:3000')

const form = document.getElementsByTagName('form')[0]
const inputField = document.getElementById('msgField')
const contentDiv = document.getElementById('contentDiv')

let userName = prompt('What\'s your name?')

userName = userName ? userName : 'Someone'

inputField.addEventListener('keydown', (e) => {
    if(e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !=='Tab') {
        socket.emit('user-typing', userName)
    }
})

let typingTimeout = null;
let typingDiv = null;

socket.on('broadcast-user-typing', (msg) => {
    
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }

    // Remove previous div if exists
    if (typingDiv) {
        typingDiv.remove();
        typingDiv = null;
    }

    // Create new div
    typingDiv = document.createElement('div');
    typingDiv.innerHTML = msg;
    typingDiv.classList.add('self-start', 'bg-white', 'text-black', 'p-1', 'mx-2', 'rounded-md')
    contentDiv.appendChild(typingDiv);

    // Set timeout to remove it after 2 seconds
    typingTimeout = setTimeout(() => {
        if (typingDiv) {
            typingDiv.remove();
            typingDiv = null;
        }
    }, 1000);
})

appendMessage('You Joined!', 'w-[98.5%]', 'bg-black', 'text-white')
socket.emit('user-connected', userName)

socket.on('new-user-connected', (userName) => {
    console.log('broadcast!')
    appendMessage(`${userName} connected!`,'w-1/3', 'bg-green-300', 'white', true)
})

socket.on('boradcast-msg', (obj) => {
    console.log('userName::::::::::::::::::::::::::', userName)
    appendMessage(`${obj.userName}: ${obj.msg}`, 'max-w-1/2', 'bg-white', 'black', false)
})

socket.on('user-disconnected', (userName) => {
    appendMessage(`${userName} disconnected`, 'w-1/3', 'bg-red-300', 'white', true)
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
 
    if(inputField.value.trim() === '' || !inputField.value) {
        console.log('invalid input')
    }
    else {
        console.log('button clicked')
        appendMessage(`You: ${inputField.value}`, 'max-w-1/2', 'bg-gray-200', 'white', true)
        socket.emit('send-message',inputField.value)
        inputField.value = ''
    }
})


function appendMessage(msg, width, backgroundColor='bg-white', color='black', alignToEnd=false) {
    const newDiv = document.createElement('div')
    const newP = document.createElement('p')
    newP.innerHTML = msg;
    newDiv.classList.add(backgroundColor, color, width, 'p-1', 'mx-2', `rounded-md`)
    newP.classList.add( 'w-full')
    newDiv.classList.add( 'border-2',)
    if (alignToEnd) {
        newDiv.classList.add( 'self-end')
    }
    else {
        newDiv.classList.add('self-start')
    }
    console.log('classList::::::::::::::::::::', newDiv.classList)
    
    newDiv.appendChild(newP)
    contentDiv.appendChild(newDiv)
} 
