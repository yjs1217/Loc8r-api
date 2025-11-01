import mongoose from 'mongoose';
import readLine from 'readline';

// 1. 모델(스키마) import를 파일 상단으로 이동 (ESM 표준)
// 이 파일이 실행될 때 Mongoose가 'locations' 모델을 인식하게 합니다.
import './locations.js';

// 2. 'const' 대신 'let'을 사용하고 로컬 DB를 기본값으로 설정
let dbURI = 'mongodb://localhost/Loc8r';

// 3. 'MONGODB_PASSWORD' 환경 변수를 'dbPassword' 상수에 할당
const dbPassword = process.env.MONGODB_PASSWORD;

// 4. 'production' 환경일 경우에만 dbURI를 Atlas 주소로 덮어씁니다.
if (process.env.NODE_ENV === 'production') {
  // 5. 백틱(`) 문법 오류를 수정하고, 변수명을 ${dbPassword}로 올바르게 수정
  dbURI = `mongodb+srv://my_atlas_user:${dbPassword}@cluster0.s0fko.mongodb.net/Loc8r`;
}

const connect = () => {
  setTimeout(() => mongoose.connect(dbURI), 1000);
}

// 연결 이벤트 리스너
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

// Windows에서 SIGINT (Ctrl+C)를 올바르게 처리하기 위한 설정
if (process.platform === 'win32') {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', () => {
    process.emit("SIGINT");
  });
}

// Mongoose 연결을 정상적으로 종료하는 함수
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// Nodemon 재시작 시 (SIGUSR2)
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// 앱 종료 시 (SIGINT)
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// Heroku 등 배포 환경에서 종료 시 (SIGTERM)
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

// DB 연결 시작
connect();