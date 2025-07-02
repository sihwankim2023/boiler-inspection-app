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

## 설치 및 실행

### 1. 저장소 복제
```bash
git clone https://github.com/sihwankim2023/boiler-inspection-app.git
cd boiler-inspection-app
