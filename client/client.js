
const writeEvent = (text) => {

    // ul element
    const parent = document.querySelector('#events');

    // li element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
    
    el.scrollIntoView();
}

const onFormSubmitted = (e) => {
    e.preventDefault();

    const input = document.querySelector('#textInput');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
}

writeEvent('Welcome to chat!');

const addButtonListeners = () => {
    ['rock', 'paper', 'scissors'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            sock.emit('turn', id);
        })
    })
}



const sock = io();
sock.on('message', writeEvent);

document
.querySelector('#textContainer')
.addEventListener('submit', onFormSubmitted);

addButtonListeners();