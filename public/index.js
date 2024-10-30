let currentNamespace = '/dev'; // 기본 네임스페이스 설정
let socket; // 소켓 변수 선언

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
let counter = 0;

let username = sessionStorage.getItem('username');
if (!username) {
    username = prompt('사용할 닉네임을 입력하세요:');
    if (username) {
        sessionStorage.setItem('username', username);
        //username = sessionStorage.getItem('username');
    } else {
        alert('닉네임이 필요합니다!');
        location.reload();
    }
}

socket = io({
    ackTimeout: 10000,//1초
    retries: 3,
    auth: { username },
    transports: ['websocket'], // 웹소켓만 사용

});

// 폼 제출 이벤트 (기존 코드 유지)
// const form = document.getElementById('form');
// const input = document.getElementById('input');
// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const msg = input.value.trim();
//     if (msg) {
//         socket.emit('chat message', msg);
//         input.value = '';
//     }
// });


// === 메시지 리스트 초기화 함수 ===
function clearMessages() {
    messages.innerHTML = ''; // 기존 메시지 삭제
}




// 메시지 추가 함수
function addMessage(name, msg, isWhisper = false, target = '') {
    const item = document.createElement('li');
    if (isWhisper) {
        // 귓속말 메시지 형식: "Whisper from [발신자] to [수신자]: [메시지]"
        item.textContent = `Whisper from ${name} to ${target}: ${msg}`;
        item.style.fontStyle = 'italic';
        item.style.color = 'gray';
    } else {
        // 일반 메시지 형식: "[사용자명]: [메시지]"
        item.textContent = `${name}: ${msg}`;
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value.trim();
    if (!inputValue) return;

    const clientOffset = `${username}-${counter++}`;

    if (inputValue.startsWith('/dm ')) {
        const [_, targetUsername, ...messageParts] = inputValue.split(' ');
        const message = messageParts.join(' ');

        if (targetUsername && message) {
            socket.emit('private message', targetUsername, message, clientOffset);
            console.log(`Whisper to ${targetUsername}: ${message}`);
        } else {
            console.error('잘못된 /dm 형식입니다. 사용법: /dm {username} {message}');
        }
    } else {
        socket.emit('chat message', inputValue, clientOffset);
        console.log(`Sent public message: ${inputValue}`);
    }
    input.value = '';
});

// // 서버로부터 채팅 메시지 수신
// socket.on('chat message', ({ username, msg }) => {
//     addMessage(username, msg);
// });


// 기존 리스너 제거 후 새로 등록
socket.on('private message', ({ from, to, msg }) => {
    addMessage(from, msg, true, to);  // 귓속말 메시지 처리 시 수신자 정보도 전달
    console.log(`Whisper from ${from} to ${to}: ${msg}`);  // 로그에 출력
});

// 네임스페이스 버튼 클릭 시 소켓 재연결
document.querySelectorAll('.namespace-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const namespace = e.target.dataset.namespace;
        if (namespace !== currentNamespace) {
            connectToNamespace(namespace);
        }
    });
});

function connectToNamespace(namespace) {
    // if (socket) socket.disconnect(); // 기존 소켓 연결 해제
    // currentNamespace = namespace;

    if (socket) {
        socket.off(); // 기존 리스너 제거
        socket.disconnect(); // 기존 소켓 해제
    }

    currentNamespace = namespace;
    clearMessages(); // 새로운 네임스페이스로 이동 시 메시지 초기화



    socket = io(namespace, {
        auth: { username: sessionStorage.getItem('username') || prompt('사용할 닉네임을 입력하세요:') },
        transports: ['websocket'],
    });

    // 서버로부터 메시지 수신
    socket.on('chat message', ({ username, msg }) => {
        addMessage(username, msg);
    });

    socket.on('private message', ({ from, to, msg }) => {
        addMessage(from, msg, true, to);
    });

    console.log(`Connected to namespace: ${namespace}`);
}

// // 메시지 추가 함수 (기존 코드 유지)
// function addMessage(name, msg, isWhisper = false, target = '') {
//     const item = document.createElement('li');
//     if (isWhisper) {
//         item.textContent = `Whisper from ${name} to ${target}: ${msg}`;
//         item.style.fontStyle = 'italic';
//         item.style.color = 'gray';
//     } else {
//         item.textContent = `${name}: ${msg}`;
//     }
//     document.getElementById('messages').appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// }

// 페이지 로드 시 기본 네임스페이스에 연결
connectToNamespace(currentNamespace);

