# socket-io-chat-challenge

## 개요
`socket.io`, `JWT Login`, `multer` 등 node.js의 핵심적인 응용 기능을 전부 사용할 수 있는 프로젝트입니다.
20241104 추가 - `Docker`, `Docker-Compose`, `Kubernetes`를 적용하여 CI/CD를 연습할 수 있는 프로젝트로 전환하였습니다.

## 기술 스택
- FE: HTML5 + CSS + JavaScript *(vanila)*
- BE: Node.js + Express + JavaScript
- DB: SQLite3

## 협업 및 안정적인 개발 환경 조성을 위한 `docker-compose.yml`활성화 방법
해당 프로젝트는 2024.11.01 Docker 환경으로 이식되었습니다.
```
docker-compose up --build
```
입력 시 Docker 환경에서 구동이 가능합니다.
```
http://localhost:3001
```
위 주소를 통해 접근이 가능합니다.

## 사용법
- 상단 버튼을 누르면 `namespace` 간 이동
  - 개인 스페이스는 현재 `개발`, `잡담`, `정보` 이렇게 3개로 분리되어 있음

 
- 채팅창에 `/dm {username} {message}`형식으로 입력하면 특정 유저에게 귓속말 사용 가능
  - 보낸 귓속말은 보낸 User와 받은 User만 확인할 수 있음
  - 새로고침 or 재접속 후에도 귓속말 기록이 유지됨
  - 귓속말은 namespace 단위로 관리됨 *(A namespace의 귓속말을 B namespace에서 확인할 수 없음)*

## 프로젝트 완수 시 얻는 것
 - `socket.io`, `JWT Login`, `multer`의 자유로운 응용
 - 기능 구현에 있어 단계적인 접근법 터득 및 문제 해결 능력 함양
 - 파이널 프로젝트, 개인 프로젝트 등에서 사용할 수 있는 소스코드 확보
 - 점차 규모가 커져가는 프로젝트를 적절히 모듈화하고 정리해본 경험 확보
   
## 목표
### 완료된 목표
- Socket.io 연동 (2024.10.30)
- Node.js 연동 (2024.10.30)
- express 연동 (2024.10.30)
- sqlite3 기반으로 채팅 데이터 영속성 유지 (2024.10.30)
- sessionStorage를 통한 사용자 닉네임 구분(username 텍스트 기반) (2024.10.30)
- whisper(namespace 단위로 구분되는 귓속말) (2024.10.30)
- namespace (2024.10.30)
- `Dockerfile`&& `docket-compose.yml`추가 (2024.11.01)

## 미완료된 목표(단기 목표)
- 특정 User의 채팅을 누르면, `/dm {username} {message}` 템플릿이 채팅창에 뜨도록 만들기
- 단톡방(room) 구현
- 파일 전송 / 업로드 / 미리보기(multer)
- JWT 기반 인증 처리(로그인)
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
