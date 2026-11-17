import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  CalendarClock,
  BookOpen,
  Settings,
  LogOut,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import { useTheme } from "../../context/ThemeContext";

export function Sidebar({ currentTab, onSelectTab }) {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "shopping", label: t("nav.shopping"), icon: ShoppingCart },
    { id: "reminders", label: t("nav.reminders"), icon: CalendarClock },
    { id: "study", label: t("nav.study"), icon: BookOpen },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-surface-light dark:bg-surface-dark border-r border-edge-light dark:border-edge-dark h-screen sticky top-0 select-none">
      {/* Product Title */}
      <div className="p-4 border-b border-edge-light dark:border-edge-dark flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            {t("app.name")}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Academic Prototype
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-element transition-colors ${
                isActive
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 stroke-[1.8]" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Preferences & Account */}
      <div className="p-2 border-t border-edge-light dark:border-edge-dark space-y-1">
        {/* Quick Language & Theme toggles */}
        <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1 rounded"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase font-semibold tracking-wider text-[11px]">
              {language}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1 rounded"
            title={`Current theme: ${theme}`}
          >
            {theme === "dark" ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
            <span className="capitalize text-[11px]">{theme}</span>
          </button>
        </div>

        {/* User Card & Logout */}
        <div className="pt-1 mt-1 border-t border-edge-light/60 dark:border-edge-dark/60 flex items-center justify-between px-3 py-2 rounded-element bg-slate-50/50 dark:bg-slate-800/20">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-status-danger rounded transition-colors"
            title={t("nav.logout")}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
