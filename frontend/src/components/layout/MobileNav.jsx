import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  CalendarClock,
  BookOpen,
  Settings,
} from "lucide-react";
import { useI18n } from "../../context/I18nContext";

export function MobileNav({ currentTab, onSelectTab }) {
  const { t } = useI18n();

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "shopping", label: t("nav.shopping"), icon: ShoppingCart },
    { id: "reminders", label: t("nav.reminders"), icon: CalendarClock },
    { id: "study", label: t("nav.study"), icon: BookOpen },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-light dark:bg-surface-dark border-t border-edge-light dark:border-edge-dark flex items-center justify-around h-14 px-1 safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded transition-colors ${
              isActive
                ? "text-brand-500 dark:text-brand-400 font-medium"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4 stroke-[1.8]" />
            <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
