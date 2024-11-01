# 1. Node.js 이미지를 선택합니다. 버전을 명시하는 것이 좋습니다.
FROM node:lts

# 2. 작업 디렉터리를 설정합니다.
WORKDIR /app

# 3. package.json 및 package-lock.json 파일을 복사합니다.
COPY package*.json ./

# 4. 의존성을 설치합니다.
RUN npm install

# 5. 소스 코드를 모두 복사합니다.
COPY . .

# 6. 서버를 실행할 포트를 환경 변수로 지정합니다. (기본값은 3000)
ENV PORT=3001

# 7. 컨테이너 실행 시 열어줄 포트를 설정합니다.
EXPOSE 3001

# 8. 서버 실행 명령어를 설정합니다.
CMD ["node", "server.js"]
