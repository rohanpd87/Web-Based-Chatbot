// app.js
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }
        this.state = false;
        this.messages = [];
    }
    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }
    toggleState(chatbox) {
        this.state = !this.state;

        // show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }
    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }
    
        let msg1 = { name: "User", message: text1, timestamp: new Date().toISOString() };
        this.messages.push(msg1);

        let tag = "";
        if (text1.toLowerCase().includes("picture") || text1.toLowerCase().includes("image")) {
            tag = "show_image";
        }
    
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            //let msg2 = { name: "Culin", message: r.answer, timestamp: new Date().toISOString() };
            let msg2 = { name: "Culin", message: r.answer, tag: tag, image: "./code_symbol.png", timestamp: new Date().toISOString() };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }
    
    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            // if (item.name === "Culin") {
            //     html += '<div class="messages__item messages__item--visitor">' + item.message + '<span class="timestamp">' + formatTimestamp(item.timestamp) + '</span></div>'
            // } else {
            //     html += '<div class="messages__item messages__item--operator">' + item.message + '<span class="timestamp">' + formatTimestamp(item.timestamp) + '</span></div>'
            // }
            if (item.name === "Culin") {
                if (item.tag === "show_image" && item.image) { // Check if the tag is "show_image" and image is available
                    html += `<div class="messages__item messages__item--visitor"><img src="${item.image}" alt="Food Image" width="183" height="120"><br>${item.message}<span class="timestamp">${formatTimestamp(item.timestamp)}</span></div>`;
                } else {
                    html += `<div class="messages__item messages__item--visitor">${item.message}<span class="timestamp">${formatTimestamp(item.timestamp)}</span></div>`;
                }
            } else {
                html += `<div class="messages__item messages__item--operator">${item.message}<span class="timestamp">${formatTimestamp(item.timestamp)}</span></div>`;
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

function formatTimestamp(timestamp) {
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(timestamp).toLocaleTimeString([], timeOptions);
}

const chatbox = new Chatbox();
chatbox.display();

// Function to speak a given text using Web Speech API
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Speech synthesis is not supported in your browser.');
    }
}

// Function to handle new bot messages and trigger text-to-speech
function handleNewBotMessage(mutations) {
    const reversedMutations = mutations.slice().reverse();
    let userMessageDetected = false;

    reversedMutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);

            addedNodes.forEach(addedNode => {
                const isOperatorMessage = addedNode.classList && addedNode.classList.contains('messages__item--operator');
                const isTimestamp = addedNode.querySelector('.timestamp');

                if (isOperatorMessage && !isTimestamp && userMessageDetected) {
                    const messageText = addedNode.textContent.trim();

                    // Add a delay before speaking to allow the user to read the response
                    setTimeout(() => {
                        speakText(messageText);
                    }, 1000); // Adjust the delay as needed

                    // Scroll to the bottom of the chatbox to keep the latest messages visible
                    const chatbox = document.querySelector('.chatbox__support');
                    chatbox.scrollTop = chatbox.scrollHeight;
                } else if (isOperatorMessage) {
                    userMessageDetected = true;
                }
            });
        }
    });
}

// Add a MutationObserver to detect changes in the chatbox__messages
const chatMessages = document.querySelector('.chatbox__messages');
const observer = new MutationObserver(handleNewBotMessage);
const config = { childList: true, subtree: true };
observer.observe(chatMessages, config);
