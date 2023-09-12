//Generate two letters initials from a name
function getInitials(name) {
    const words = name.trim().split(' ');
    let initials = '';

    for (let i = 0; i < words.length && initials.length < 2; i++) {
        initials += words[i][0].toUpperCase();
    }

    return initials;
}

// Function to replace HTML entities with their corresponding characters
function decodeHtmlEntities(input) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    return textarea.value;
}

function setChatHeaderTitle(title){
    title = decodeHtmlEntities(title);
    document.getElementById('chat-header-title').innerText = title;
}

document.addEventListener('DOMContentLoaded', () => {

    //If in page there is an element with class chat-cell, then cycle through each element
    document.querySelectorAll('.chat-cell').forEach((cell) => {

        //Get data-id from cell
        let id = cell.getAttribute('data-chat-id');

        //Set cell avatar for each element with class avatar-<id> (need to use class instead of id because same id could be used in multiple cells)
        document.querySelectorAll('.avatar-' + id).forEach((avatar) => {
            new Avatar(avatar, {
                'useGravatar': false,
                'initials': getInitials(document.querySelector('.chat-title-' + id).innerText),
            });
        });


        //Add on-click to open chat
        let openNewChat = cell.getAttribute('data-chat-new') === 'true';
        cell.addEventListener('click', () => {
            let url = openNewChat ? "chat/new" : "chat";
            window.location.href = `/${url}/${id}${window.location.search}`;
        });

    });


});
