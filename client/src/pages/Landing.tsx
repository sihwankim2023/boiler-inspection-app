import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">보일러 점검 관리 시스템</CardTitle>
          <CardDescription>
            모바일 최적화된 점검 현장 관리 애플리케이션
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">주요 기능</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 점검 데이터 입력 및 관리</li>
              <li>• 23개 항목 체크리스트</li>
              <li>• PDF 보고서 생성</li>
              <li>• 사진 업로드 및 관리</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/api/login'} 
              className="w-full"
            >
              로그인
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/demo'} 
              className="w-full"
            >
              데모 체험하기
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            <p>개발: KD Systems</p>
            <p>버전: 2.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
