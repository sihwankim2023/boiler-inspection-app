import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import AppHeader from "@/components/layout/AppHeader";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { PlusCircle, FileText, Building, Users, Mail, TrendingUp, Edit } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { isDemoMode, getApiPath } = useDemoMode();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: inspections } = useQuery({
    queryKey: [getApiPath("/inspections")],
  });

  const { data: sites } = useQuery({
    queryKey: [getApiPath("/sites")],
  });

  const { data: inspectors } = useQuery({
    queryKey: [getApiPath("/inspectors")],
  });

  const recentInspections = inspections?.slice(0, 5) || [];
  const totalInspections = inspections?.length || 0;
  const completedInspections = inspections?.filter((i: any) => i.status === 'completed').length || 0;
  const draftInspections = inspections?.filter((i: any) => i.status === 'draft').length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onMenuClick={() => setDrawerOpen(true)} />
      <NavigationDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />

      <main className="pb-6">
        {/* Welcome Section */}
        <div className="bg-primary text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-normal mb-2">
                안녕하세요, 점검자님!
              </h2>
              <p className="text-blue-100">
                오늘도 안전한 점검 작업을 시작해보세요.
              </p>
            </div>
            <div className="px-3 py-2">
              <span className="text-white font-semibold text-xl">KD NAVIEN</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/new-inspection">
              <Button className="w-full h-16 flex flex-col gap-2">
                <PlusCircle className="h-6 w-6" />
                <span>새 점검</span>
              </Button>
            </Link>
            <Link href="/inspection-history">
              <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>점검 이력</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-6 space-y-4">
          <h3 className="text-lg font-semibold">통계</h3>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalInspections}</div>
                <div className="text-sm text-gray-600">총 점검</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedInspections}</div>
                <div className="text-sm text-gray-600">완료</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{draftInspections}</div>
                <div className="text-sm text-gray-600">임시저장</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Inspections */}
        <div className="px-6 space-y-4">
          <h3 className="text-lg font-semibold">최근 점검</h3>
          {recentInspections.length > 0 ? (
            <div className="space-y-3">
              {recentInspections.map((inspection: any) => (
                <Card key={inspection.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{inspection.contractorName || '미정'}</h4>
                        <p className="text-sm text-gray-600">{inspection.inspectionDate || '날짜 미정'}</p>
                        <p className="text-xs text-gray-500">{inspection.status === 'completed' ? '완료' : '임시저장'}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <p>아직 점검 기록이 없습니다.</p>
                <p className="text-sm">새 점검을 시작해보세요!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Management */}
        <div className="px-6 space-y-4">
          <h3 className="text-lg font-semibold">관리</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/site-management">
              <Button variant="outline" className="w-full h-12 flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>사이트 관리</span>
              </Button>
            </Link>
            <Link href="/inspector-management">
              <Button variant="outline" className="w-full h-12 flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>점검자 관리</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
