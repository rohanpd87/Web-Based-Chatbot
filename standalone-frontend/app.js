//app.js
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };
        this.state = false;
        this.messages = [];
        this.firstTime = true; // Flag to track if it's the first time opening the chatbot
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => {
            this.toggleState(chatBox);
            if (this.firstTime) {
                this.introduce();
                this.firstTime = false;
            }
        });

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    introduce() {
        const chatbox = this.args.chatBox;
        const greetingMessage = "Hi, I'm Culin, your 'Cutlinary Creation' chatbot. I'm here to answer your cooking-related questions. How can I assist you today?";
        const msg = { name: "Culin", message: greetingMessage, timestamp: new Date().toISOString() };
        this.messages.push(msg);
        this.updateChatText(chatbox);
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
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
        let image = "";
        let urls = []; // Modify to store multiple URLs
        // let youtubeLinks = [];
        
        if (text1.toLowerCase().includes("look") && text1.toLowerCase().includes("gulab jamun")) {
            tag = "show_image_gul_jam_color";
            image = "./gul_jam.png"; // Default image path for general image requests
        }
        if ((text1.toLowerCase().includes("look") || text1.toLowerCase().includes("manchurian")) && text1.toLowerCase().includes("ball")) {
            tag = "show_image_fried_manchurian_ball_color";
            image = "./dry_manch_ball.png"; // Default image path for general image requests
        }
        if ((text1.toLowerCase().includes("picture") || text1.toLowerCase().includes("image")) && text1.toLowerCase().includes("onion")) {
            tag = "show_image_fried_onion_color";
            image = "./caramelize_onion.jpg"; // Default image path for general image requests
        }
        if ((text1.toLowerCase().includes("picture") || text1.toLowerCase().includes("image")) && text1.toLowerCase().includes("dosa")) {
            tag = "show_image_dosa_masala";
            image = "./Potato_Masala_dosa.jpg"; // Image path for recipe-related requests
        }
        if ((text1.toLowerCase().includes("link") || text1.toLowerCase().includes("url") || text1.toLowerCase().includes("site")) && text1.toLowerCase().includes("south") && text1.toLowerCase().includes("indian")) {
            tag = "URL_south_indian";
            urls.push(
                { name: "Dosa", url: "https://www.indianhealthyrecipes.com/dosa-recipe-dosa-batter/" },
                { name: "Uttapam", url: "https://www.indianhealthyrecipes.com/uttapam-recipe-uthappam/" },
                { name: "Idli-Sambhar", url: "http://localhost:3000/" }
            );
        }
        if ((text1.toLowerCase().includes("link") || text1.toLowerCase().includes("url") || text1.toLowerCase().includes("site")) && text1.toLowerCase().includes("chaat")) {
            tag = "URL_chaat";
            urls.push(
                { name: "Pani Puri", url: "https://foodviva.com/snacks-recipes/pani-puri/" },
                { name: "Dahi Puri", url: "https://foodviva.com/snacks-recipes/dahi-puri/" },
                { name: "Bhel", url: "https://foodviva.com/snacks-recipes/bhel-puri-recipe/" }
            );
        }
        if ((text1.toLowerCase().includes("link") || text1.toLowerCase().includes("url") || text1.toLowerCase().includes("site") || text1.toLowerCase().includes("Hakka")
        || text1.toLowerCase().includes("Schezwan")|| text1.toLowerCase().includes("Manchurian")) && text1.toLowerCase().includes("chinese")) 
        {
            tag = "URL_chinese";
            urls.push(
                { name: "Manchurian", url: "http://localhost:3000/" },
                { name: "Hakka Noodles", url: "http://localhost:3000/" },
                { name: "Fried Rice", url: "http://localhost:3000/" }
            );
        }
        // if ((text1.toLowerCase().includes("youtube") || text1.toLowerCase().includes("video") || text1.toLowerCase().includes("suggest")) && text1.toLowerCase().includes("pani puri")) {
        //     tag = "youtube_url_chaat";
        //     youtubeLinks.push(
        //         { name: "Pani Puri Recipe", url: "https://www.youtube.com/embed/yOobLm_Urpc" }
        //     );
        // }
        // if ((text1.toLowerCase().includes("youtube") || text1.toLowerCase().includes("video") || text1.toLowerCase().includes("suggest")) && text1.toLowerCase().includes("pizza")) {
        //     tag = "youtube_url_pizza";
        //     youtubeLinks.push(
        //         { name: "Paneer Pizza Recipe", url: "https://www.youtube.com/embed/iODYdP8Z6tQ"}
        //     );
        // }
    
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
            let msg2;
            // if (youtubeLinks.length > 0) {
            //     let youtubeHTML = "<b>Here are some YouTube videos you're asking for...</b><br>";
            //     youtubeLinks.forEach((item, index) => {
            //         youtubeHTML += `<iframe width=100% height="200" src="${item.url}" frameborder="0" allow="accelerometer; border-radius: 5px; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>`;
            //     });
            //     msg2 = { name: "Culin", message: youtubeHTML, tag: tag, image: image, timestamp: new Date().toISOString() };
            // }
            if (urls.length > 0) {
                // If there are multiple URLs, construct the message accordingly
                let urlsHTML = "<b>Here are some URLs of popular dishes:</b><br>";
                urls.forEach((item, index) => {
                    const truncatedUrl = item.url.length > 23 ? item.url.substr(0, 23) + '...' : item.url; // Truncate URL if it exceeds 23 characters
                    urlsHTML += `${index + 1}. ${item.name}:<br><a href="${item.url}" target="_blank">${truncatedUrl}</a><br>`;
                });
                msg2 = { name: "Culin", message: urlsHTML, tag: tag, image: image, timestamp: new Date().toISOString() };
            } else {
                msg2 = { name: "Culin", message: r.answer, tag: tag, image: image, timestamp: new Date().toISOString() };
            }
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
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Culin") {
                if (item.tag === "show_image_fried_onion_color" || 
                    item.tag === "show_image_fried_manchurian_ball_color" || 
                    item.tag === "show_image_dosa_masala" && item.image) { // Check if the tag is "show_image" and image is available
                    html += `<div class="messages__item messages__item--visitor"><img src="${item.image}" alt="Food Image" width=100%><br>${item.message}<span class="timestamp">${formatTimestamp(item.timestamp)}</span></div>`;
                }
                else if
                    (item.tag === "show_image_gul_jam_color" && item.image) { 
                    html += `<div class="messages__item messages__item--visitor"><p><b>Notice the size of jamun at different stages of preparation:</b><br>(i)raw,<br>(ii)after deep frying,<br>(iii)after absorption of sugar syrup:</p><br><img src="${item.image}" alt="Food Image" width=100%><br>${item.message}<span class="timestamp">${formatTimestamp(item.timestamp)}</span></div>`;
                }
                else {
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
