# 보일러 점검 관리 시스템

모바일 최적화된 보일러 점검 현장 관리 웹 애플리케이션입니다.

## 주요 기능

- 📝 점검 데이터 입력 및 관리
- 📷 점검 사진 업로드 
- ✅ 23개 항목 체크리스트
- 📄 PDF 보고서 생성
- 👥 사용자 및 점검자 관리
- 🏭 사이트 관리
- 📊 점검 이력 조회

## 기술 스택

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (서버 상태 관리)
- React Hook Form + Zod (폼 관리)
- Wouter (라우팅)

### Backend  
- Node.js + Express + TypeScript
- Drizzle ORM (PostgreSQL)
- Passport + OpenID Connect (인증)
- Multer (파일 업로드)

### 배포
- Frontend: Vercel
- Database: Supabase (PostgreSQL)
- 파일 저장: Vercel

## 설치 및 실행

### 1. 저장소 복제
```bash
git clone https://github.com/sihwankim2023/boiler-inspection-app.git
cd boiler-inspection-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 정보 입력
```

### 4. 데이터베이스 설정
```bash
npm run db:push
```

### 5. 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 http://localhost:5000 에서 실행됩니다.

## 배포 가이드

### Vercel + Supabase 배포

1. **Supabase 프로젝트 생성**
   - supabase.com 가입
   - 새 프로젝트 생성
   - Database URL 복사

2. **Vercel 배포**
   - vercel.com 가입 (GitHub 계정으로)
   - GitHub 저장소 연결
   - 환경변수 설정

3. **환경변수 설정**
   ```
   DATABASE_URL=postgresql://...
   SESSION_SECRET=random-32-character-string
   REPL_ID=your-app-id
   REPLIT_DOMAINS=your-vercel-domain.vercel.app
   ```

## 프로젝트 구조

```
├── client/           # React 프론트엔드
│   ├── src/
│   │   ├── components/  # 재사용 컴포넌트
│   │   ├── pages/       # 페이지 컴포넌트  
│   │   ├── hooks/       # 커스텀 훅
│   │   └── lib/         # 유틸리티 함수
├── server/           # Express 백엔드
│   ├── routes.ts     # API 라우트
│   ├── storage.ts    # 데이터베이스 로직
│   └── auth.ts       # 인증 로직
├── shared/           # 공유 타입 및 스키마
└── uploads/          # 업로드된 파일
```

## 주요 페이지

- `/` - 홈 대시보드
- `/new-inspection` - 새 점검 작성
- `/history` - 점검 이력 조회  
- `/inspectors` - 점검자 관리

## API 엔드포인트

- `GET /api/inspections` - 점검 목록
- `POST /api/inspections` - 새 점검 생성
- `PUT /api/inspections/:id` - 점검 수정
- `GET /api/sites` - 사이트 목록
- `POST /api/upload` - 파일 업로드

## 개발자 정보

- **개발자**: KD Systems
- **버전**: 2.0
- **최종 업데이트**: 2025년 6월

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
