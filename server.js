const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function main() {
  const db = await open({
    filename: join(__dirname, 'chat.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(100),
      socketId VARCHAR(100),
      client_offset TEXT UNIQUE,
      content TEXT,
      isWhisper BOOLEAN,
      WhisperFrom VARCHAR(100),
      WhisperTo VARCHAR(100),
      namespace TEXT  -- 네임스페이스를 구분하는 컬럼 추가
    );
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*", // 모든 출처 허용 (개발용)
      methods: ["GET", "POST"],
    },
    transports: ['websocket'], // 웹소켓만 사용
    // connectionStateRecovery: {},
  });

  // PRAGMA 설정을 통한 SQLite 최적화
  await db.exec('PRAGMA journal_mode = WAL;');  // WAL 모드 활성화
  await db.exec('PRAGMA synchronous = FULL;');  // 안정적인 동기화 모드
  await db.exec('PRAGMA cache_size = -16384;');  // 캐시 크기 4MB로 증가
  await db.exec('PRAGMA temp_store = MEMORY;');  // 임시 데이터를 메모리에 저장

  app.use(express.static(join(__dirname, 'public')));
  const userSockets = new Map(); // username과 socket.id를 매핑

  const port = process.env.PORT || 3000;

  io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('Authentication error: Username is required'));
    }
    next();
  });

  // 기존 코드는 수정하지 않고, 새로운 네임스페이스 추가 (아래 코드만 추가됨)
  const devNamespace = io.of('/dev'); // 개발 네임스페이스
  const chatNamespace = io.of('/chat'); // 잡담 네임스페이스
  const infoNamespace = io.of('/info'); // 정보 네임스페이스

  // === 네임스페이스 별 소켓 처리 로직 추가 ===
  function handleNamespace(namespace) {
    namespace.on('connection', async (socket) => {
      const username = socket.handshake.auth.username;

      console.log(`User connected to ${namespace.name}: ${username} (ID: ${socket.id})`);

      try {
        const rows = await db.all(
          'SELECT * FROM messages WHERE namespace = ? ORDER BY id ASC',
          [namespace.name]
        );

        rows.forEach((row) => {
          const messageData = {
            from: row.WhisperFrom || row.username,
            username: row.username,
            to: row.WhisperTo || '',
            msg: row.content,
            offset: row.id,
          };

          if (!row.isWhisper) {
            socket.emit('chat message', messageData);
          } else if (row.WhisperTo === username || row.WhisperFrom === username) {
            socket.emit('private message', messageData);
          }
        });
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }

      // === 메시지 저장 로직 ===
      socket.on('chat message', async (msg) => {
        console.log(`[${namespace.name}] ${username}: ${msg}`);

        try {
          // 네임스페이스와 함께 메시지 저장
          await db.run(
            'INSERT INTO messages (username, content, socketId, client_offset, isWhisper, namespace) VALUES (?, ?, ?, ?, ?, ?)',
            username, msg, socket.id, `${username}-${Date.now()}`, false, namespace.name
          );
        } catch (error) {
          console.error(`Failed to save message in ${namespace.name}:`, error);
        }

        // 네임스페이스 내 모든 사용자에게 메시지 전송
        namespace.emit('chat message', { username, msg });
      });

      socket.on('private message', async function (targetUsername, msg) {
        try {
          // const targetSocketId = userSockets.get(targetUsername);
          const targetSocketId = Array.from(namespace.sockets.values()).find(
            (s) => s.handshake.auth.username === targetUsername
          )?.id;
  
          if (targetSocketId) {
            await db.run(
              'INSERT INTO messages (username, content, socketId, client_offset, isWhisper, WhisperFrom, WhisperTo, namespace) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              username, msg, socket.id, `${username}-${Date.now()}`, true, username, targetUsername, namespace.name
              // username, msg, socket.id, clientOffset, true, username, targetUsername, namespace.name
            );
            console.log(`Whisper from ${username} to ${targetUsername}: ${msg}`);
            // 귓속말 메시지를 발신자와 수신자에게만 전송
            // 발신자와 수신자에게만 귓속말 전송
            socket.emit('private message', { from: username, to: targetUsername, msg, offset: result.lastID });  // 발신자에게 전송
            io.to(targetSocketId).emit('private message', { from: username, to: targetUsername, msg, offset: result.lastID });  // 수신자에게 전송
            // callback();
          }
        } catch (error) {
          console.error(`Failed to save message in ${namespace.name}:`, error);
        }
      });
      // 클라이언트가 연결 해제될 때 로그 출력
      socket.on('disconnect', () => {
        console.log(`User disconnected from ${namespace.name}: ${username} (ID: ${socket.id})`);
        userSockets.delete(username); // 소켓 해제 시 매핑 제거
      });
    });
  }
  // === 네임스페이스 별 소켓 처리 로직 끝 ===


  // 각 네임스페이스에 핸들러 적용
  handleNamespace(devNamespace);
  handleNamespace(chatNamespace);
  handleNamespace(infoNamespace);

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main();
