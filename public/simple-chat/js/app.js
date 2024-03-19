/*
|--------------------------------------------------------------------------
| Elements
|--------------------------------------------------------------------------
*/
let openedChat = document.getElementById('opened-chat');
let slideOver = document.getElementById('slide-over');
let newChatModal = document.getElementById('new-chat-modal');
let startedChatsSlideoverContent = document.getElementById('started-chats-slideover-content');
let newChatSlideoverContent = document.getElementById('new-chat-slideover-content');
let chatsLoadingSpinner = document.getElementById('chats-loading-spinner');
let chatLoadingSpinner = document.getElementById('chat-loading-spinner');
let userMessageInput = document.getElementById('user-input');
let chatMessages = document.getElementById('chat-messages');
let sendButton = document.getElementById('send-button');
let newChatButton = document.getElementById('new-chat-btn');
let closeNewChatButton = document.getElementById('close-new-chat-btn');
let slideOverContent = document.getElementById('slide-over-content');

/*
|--------------------------------------------------------------------------
| Variables
|--------------------------------------------------------------------------
*/
let isLeftContainerOpen = true;
let currentChatId = null;

/*
|--------------------------------------------------------------------------
| Document Ready
|--------------------------------------------------------------------------
*/
document.addEventListener("DOMContentLoaded", function () {
    loadStartedChats();
});


/*
|--------------------------------------------------------------------------
| UI Functions
|--------------------------------------------------------------------------
*/
function showLoadingSpinner(el) {
    el.classList.remove('hidden');
}

function hideLoadingSpinner(el) {
    el.classList.add('hidden');
}

function showSlideOver() {
    slideOver.classList.remove('-translate-x-full');
    isLeftContainerOpen = true;
}

function hideSlideOver() {
    slideOver.classList.add('-translate-x-full');
    isLeftContainerOpen = false;
}

function showNewChatSlideover() {

    // Show if not already shown
    showSlideOver();

    // Hide started chats and show new chat
    newChatSlideoverContent.classList.remove('hidden');
    startedChatsSlideoverContent.classList.add('hidden');

    // Show close button and hide new chat button
    newChatButton.classList.add('hidden');
    closeNewChatButton.classList.remove('hidden');

    // Download new chats if not already downloaded
    if (newChatSlideoverContent.innerHTML.trim() === '') {
        showLoadingSpinner(chatsLoadingSpinner);
        axios.get('/chat/new')
            .then(response => {
                newChatSlideoverContent.innerHTML += response.data;
            }).finally(() => {
            hideLoadingSpinner(chatsLoadingSpinner);
        });
    }
}

function hideNewChatSlideover() {

    // Hide new chat and show started chats
    newChatSlideoverContent.classList.add('hidden');
    startedChatsSlideoverContent.classList.remove('hidden');

    // Show new chat button and hide close button
    newChatButton.classList.remove('hidden');
    closeNewChatButton.classList.add('hidden');

    // Reload started chats
    loadStartedChats();
}

function openChat(selectedChatId, selectedChatCell) {

    hideSlideOver();

    // Call function on chat view in order to detect new chat
    currentChatChanged(selectedChatId);

    // Focus new chat cell
    focusChatCell(selectedChatCell);
}


function focusChatCell(selectedChatCell) {
    // Remove any previous cell with active background
    let activeCell = document.querySelector('.active-chat-cell');
    if (activeCell != null)
        activeCell.classList.remove('active-chat-cell');

    // Add active background to selected cell
    selectedChatCell.classList.add('active-chat-cell');
}

function scrollMessagesToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function scrollChatsToTop() {
    slideOverContent.scrollTop = 0;
}


/*
|--------------------------------------------------------------------------
| Home
|--------------------------------------------------------------------------
*/
function loadStartedChats() {
    showLoadingSpinner(chatsLoadingSpinner);
    axios.get('/chat/chats')
        .then(response => {
            startedChatsSlideoverContent.innerHTML = response.data;
        }).finally(() => {
        hideLoadingSpinner(chatsLoadingSpinner);
        scrollChatsToTop();
    });
}

function startNewChat(userId, selectedChatCell) {

    // Call API to start new chat
    axios.post(`/chat/new/`, {
        user_id: userId
    })
        .then(response => {

            openChat(response.data, selectedChatCell);

        }).finally(() => {
    });

}


/*
|--------------------------------------------------------------------------
| Chat View
|--------------------------------------------------------------------------
*/
function currentChatChanged(newChatId) {

    // Show chat view
    openedChat.hidden = false;

    // Show loading spinner
    showLoadingSpinner(chatLoadingSpinner);

    // Clear messages from messages div
    chatMessages.innerHTML = '';

    // Set current chat id
    currentChatId = newChatId;

    // Download messages from selected chat
    axios.get('/chat/messages/' + newChatId)
        .then(function (response) {
            chatMessages.innerHTML = response.data;
            scrollMessagesToBottom();
        })
        .catch(function (error) {
            console.log(error);
        }).finally(function () {
        hideLoadingSpinner(chatLoadingSpinner);
    });

}

function sendNewMessage() {

    //Disable send button and text input
    sendButton.disabled = true;
    userMessageInput.disabled = true;

    axios.post('/chat/newmessage', {
        chat_id: currentChatId,
        body: userMessageInput.value
    })
        .then(function (response) {
            userMessageInput.value = '';
            chatMessages.innerHTML += response.data;
            scrollMessagesToBottom();
        })
        .catch(function (error) {
            console.log(error);
        }).finally(function () {


        // Enable send button and text input
        sendButton.disabled = false;
        userMessageInput.disabled = false;
    })
}

// {{--Echo.private('chat.{{$chat['id']}}').listen('.new-message', function(data) {--}}
// {{--    //addMessage(data.body, false); RENDER MESSAGE BUBBLE FROM SERVER--}}
//     {{--});--}}