# socket-io-chat-challenge

## 개요
`socket.io`, `JWT Login`, `multer` 등 node.js의 핵심적인 응용 기능을 전부 사용할 수 있는 프로젝트입니다.

## 프로젝트 완수 시 얻는 것
 - `socket.io`, `JWT Login`, `multer`의 자유로운 응용
 - 기능 구현에 있어 단계적인 접근법 터득 및 문제 해결 능력 함양
 - 파이널 프로젝트, 개인 프로젝트 등에서 사용할 수 있는 소스코드 확보
 - 점점 커져가는 프로젝트를 적절히 모듈화하고 정리해본 경험 확보
   
## 목표
### 완료된 목표
- Socket.io 연동
- Node.js 연동
- express 연동
- sqlite3 기반으로 채팅 데이터 영속성 유지(라이트한 db라 일단은 이걸 채택)
- sessionStorage를 통한 사용자 닉네임 구분(username 텍스트 기반)
- whisper(namespace 단위로 구분되는 귓속말)
- namespace

## 미완료된 목표(단기 목표)
- 단톡방(room) 구현
- 파일 전송 및 업로드 미리보기(multer)
- JWT 기반 인증 처리(로그인)
- 파일 전송(Multer)
- sqlite3 기반으로 유저 데이터 영속성 유지(로그인 구현 이후)
- 실시간 알림 기능
- DM(1:1 채팅)

## 조율 중인 목표(장기 목표)
- sqlite3 기반 기능을 MySQL 기반으로 돌아가도록 마이그레이션
- MUI + TypeScript + React 기반으로 프론트엔드 로직 및 디자인 개선
- TypeScript + Express 기반으로 백엔드 로직 개선
- Docker + Kubernetes 적용
- AWS를 통한 배포 (CI/CD)
- 장기목표 달성 시 나오는 결과물을 응용하여 새로운 프로젝트 시작하기 및 사업 아이디어 구성