# 🚀 Vercel + Supabase 배포 가이드

## 📋 단계별 배포 프로세스

### 1단계: GitHub 저장소 생성 및 코드 푸시

#### A. GitHub에서 새 저장소 생성
1. **GitHub.com 접속** → **"New repository"** 클릭
2. **Repository name**: `boiler-inspection-app`
3. **Public/Private** 선택
4. **"Create repository"** 클릭

#### B. Replit에서 Git 설정
```bash
# Git 초기화 (이미 되어있으면 생략)
git init

# 원격 저장소 추가 (GitHub URL로 교체)
git remote add origin https://github.com/YOUR_USERNAME/boiler-inspection-app.git

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Boiler inspection app ready for deployment"

# GitHub에 푸시
git push -u origin main
```

### 2단계: Supabase 프로젝트 설정

#### A. Supabase 계정 생성 및 프로젝트 생성
1. **supabase.com** 접속
2. **"Start your project"** 클릭
3. **GitHub로 로그인**
4. **"New project"** 클릭
5. **설정**:
   - Project name: `boiler-inspection`
   - Database password: **강력한 비밀번호 설정**
   - Region: `Northeast Asia (Seoul)`

#### B. 데이터베이스 스키마 생성
Supabase Dashboard → **SQL Editor**에서 다음 SQL 실행:

```sql
-- 사용자 프로필 테이블
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id)
);

-- 점검원 테이블
CREATE TABLE inspectors (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 현장 테이블
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_person TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 점검 테이블
CREATE TABLE inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  site_id INTEGER REFERENCES sites(id),
  inspector_id INTEGER REFERENCES inspectors(id),
  document_number TEXT,
  visit_count TEXT,
  inspection_date DATE,
  installation_date DATE,
  products JSONB,
  fuel TEXT,
  exhaust_type TEXT,
  electrical TEXT,
  piping TEXT,
  water_supply TEXT,
  control TEXT,
  purpose TEXT,
  delivery_type TEXT,
  checklist JSONB,
  result TEXT,
  facility_manager TEXT,
  summary TEXT,
  photos JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 이메일 기록 테이블
CREATE TABLE email_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Storage 버킷 생성 (점검 사진용)
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', true);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_records ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can access own data" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can access own inspectors" ON inspectors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own sites" ON sites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own inspections" ON inspections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own email records" ON email_records FOR ALL USING (
  EXISTS (SELECT 1 FROM inspections WHERE inspections.id = email_records.inspection_id AND inspections.user_id = auth.uid())
);

-- Storage 정책 설정
CREATE POLICY "Users can upload inspection photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inspection-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can view inspection photos" ON storage.objects FOR SELECT USING (bucket_id = 'inspection-photos');
```

#### C. API 키 가져오기
1. **Settings** → **API**
2. **복사할 키들**:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3단계: Vercel 배포

#### A. Vercel 계정 연결
1. **vercel.com** 접속
2. **GitHub 계정으로 로그인**
3. **"New Project"** 클릭
4. **GitHub 저장소 선택**: `boiler-inspection-app`

#### B. 환경변수 설정
Vercel Dashboard → **Settings** → **Environment Variables**:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=production
```

#### C. 빌드 설정
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4단계: 코드 수정 (배포 전 최종 점검)

#### A. package.json 교체
```bash
# 현재 package.json을 백업하고 Vercel용으로 교체
cp package.json package.json.replit
cp package.json.vercel package.json
```

#### B. 환경변수 파일 생성
```bash
# .env 파일에 실제 Supabase 키 입력
cp .env.example .env
# .env 파일을 편집하여 실제 값 입력
```

#### C. Supabase 클라이언트 수정
`client/src/lib/supabase.ts`에서 placeholder를 제거하고 환경변수 사용:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5단계: 최종 배포

#### A. 코드 푸시
```bash
git add .
git commit -m "Ready for Vercel deployment with Supabase"
git push origin main
```

#### B. Vercel 자동 배포
- GitHub 푸시 후 **Vercel이 자동으로 빌드 및 배포**
- **Deployments** 탭에서 진행 상황 확인

### 6단계: 배포 완료 확인

#### A. 기능 테스트
1. **회원가입/로그인** 테스트
2. **점검 생성** 테스트
3. **사진 업로드** 테스트
4. **PDF 생성** 테스트
5. **이메일 발송** 테스트

#### B. 도메인 확인
- Vercel에서 제공하는 `xxx.vercel.app` 도메인으로 접속
- 모든 기능이 정상 작동하는지 확인

## 🔧 문제 해결

### 빌드 오류 시
1. **Vercel Dashboard** → **Functions** → **Logs** 확인
2. **GitHub Actions** 로그 확인
3. **환경변수** 재확인

### 데이터베이스 연결 오류 시
1. **Supabase Dashboard** → **Settings** → **API** 에서 키 재확인
2. **RLS 정책** 설정 확인
3. **네트워크** 접근 권한 확인

## 📞 지원

배포 과정에서 문제가 발생하면:
1. **Vercel 로그** 확인
2. **Supabase 로그** 확인  
3. **브라우저 개발자 도구** 확인

---

이 가이드를 따라하면 현재 Replit에서 작동하는 보일러 점검 앱을 **Vercel + Supabase** 환경에서 완전히 작동하게 할 수 있습니다.