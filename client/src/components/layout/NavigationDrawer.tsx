import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/hooks/useDemoMode";
import { 
  Home, 
  PlusCircle, 
  FileText, 
  Building, 
  Users, 
  X,
  LogOut 
} from "lucide-react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const { isDemoMode } = useDemoMode();
  
  const baseUrl = isDemoMode ? "/demo" : "";
  
  const menuItems = [
    { icon: Home, label: "홈", href: baseUrl || "/" },
    { icon: PlusCircle, label: "새 점검", href: `${baseUrl}/new-inspection` },
    { icon: FileText, label: "점검 이력", href: `${baseUrl}/inspection-history` },
    { icon: Building, label: "사이트 관리", href: `${baseUrl}/site-management` },
    { icon: Users, label: "점검자 관리", href: `${baseUrl}/inspector-management` },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">메뉴</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          {!isDemoMode && (
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </Button>
          )}
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>보일러 점검 시스템 v2.0</p>
            <p>KD Systems</p>
          </div>
        </div>
      </div>
    </>
  );
}
