import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">보일러 점검 시스템</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">KD NAVIEN</span>
        </div>
      </div>
    </header>
  );
}
