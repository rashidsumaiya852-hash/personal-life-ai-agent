import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Send,
  CalendarClock,
  ShoppingBag,
  BookOpen,
  ArrowRight,
  Check,
  Clock,
  AlertCircle,
  CornerDownLeft,
} from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { reminderService } from "../services/reminderService";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { useToast } from "../components/common/Toast";

export function DashboardPage({ onNavigateTab }) {
  const { user } = useAuth();
  const { t, formatNumber } = useI18n();
  const { addToast } = useToast();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Command input state
  const [commandText, setCommandText] = useState("");
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState(null);

  const loadOverview = useCallback(async () => {
    try {
      const data = await dashboardService.getOverview();
      setOverview(data);
    } catch (err) {
      addToast("Failed to load dashboard data.", "danger");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!commandText.trim() || commandLoading) return;

    setCommandLoading(true);
    setCommandFeedback(null);
    try {
      const res = await dashboardService.executeCommand(commandText.trim());
      setCommandFeedback(res);
      setCommandText("");
      await loadOverview();
    } catch (err) {
      addToast("Failed to execute command. Please try again.", "danger");
    } finally {
      setCommandLoading(false);
    }
  };

  const handleToggleReminder = async (reminderId) => {
    try {
      await reminderService.toggleReminder(reminderId);
      loadOverview();
    } catch (err) {
      addToast("Failed to update reminder status.", "danger");
    }
  };

  return (
    <div className="space-y-6">
      {/* Calm Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-edge-light dark:border-edge-dark">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {t("dashboard.greeting")}, {user?.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("app.tagline")}
          </p>
        </div>

        {overview && (
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-element border border-edge-light dark:border-edge-dark self-start sm:self-auto">
            {overview.current_time_dhaka} (Asia/Dhaka)
          </div>
        )}
      </div>

      {/* Unified Command Input ("Add or ask something") */}
      <div className="bg-surface-light dark:bg-surface-dark border border-edge-light dark:border-edge-dark rounded-card p-4 shadow-sm space-y-3">
        <form onSubmit={handleCommandSubmit} className="relative flex items-center">
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            placeholder={t("dashboard.commandPlaceholder")}
            className="w-full h-11 pl-4 pr-24 text-sm bg-slate-50/60 dark:bg-slate-800/40 border border-edge-light dark:border-edge-dark rounded-element text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-surface-light dark:focus:bg-surface-dark transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              type="submit"
              size="sm"
              loading={commandLoading}
              loadingText="Routing"
              disabled={!commandText.trim()}
              className="h-7 text-xs px-2.5"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
          {t("dashboard.commandHint")}
        </p>

        {/* Command Feedback Result Card */}
        {commandFeedback && (
          <div className="p-3 bg-brand-50/70 dark:bg-brand-500/10 border border-brand-500/30 rounded-element text-xs flex items-start justify-between gap-3 transition-all">
            <div className="space-y-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-brand-700 dark:text-brand-300">
                Action: {commandFeedback.intent}
              </span>
              <p className="text-slate-800 dark:text-slate-200">
                {commandFeedback.message}
              </p>
            </div>
            {commandFeedback.action_url && (
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 text-xs h-7 px-2.5"
                onClick={() => {
                  const tab = commandFeedback.action_url.replace("/", "");
                  onNavigateTab(tab);
                }}
              >
                <span>Open {commandFeedback.intent}</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main 3 Sections */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-card animate-pulse" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-card animate-pulse" />
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-card animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Today's Reminders Card */}
          <div className="bg-surface-light dark:bg-surface-dark border border-edge-light dark:border-edge-dark rounded-card p-4 space-y-3 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-edge-light dark:border-edge-dark">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t("dashboard.todayReminders")}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {formatNumber(overview?.today_reminders_count || 0)}
                </span>
              </div>

              {overview?.today_reminders?.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                  No reminders scheduled for today.
                </p>
              ) : (
                <div className="space-y-2">
                  {overview?.today_reminders?.map((rem) => (
                    <div
                      key={rem.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-edge-light dark:border-edge-dark rounded-element flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem.id)}
                          className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-brand-500 flex items-center justify-center shrink-0 transition-colors"
                          aria-label="Check reminder"
                        >
                          {rem.status === "done" && <Check className="w-3 h-3 text-brand-500" />}
                        </button>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {rem.title}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {formatNumber(rem.due_time.substring(0, 5))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab("reminders")}
              className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 pt-2 border-t border-edge-light/60 dark:border-edge-dark/60"
            >
              <span>{t("dashboard.viewAll")} reminders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Active Shopping Lists Card */}
          <div className="bg-surface-light dark:bg-surface-dark border border-edge-light dark:border-edge-dark rounded-card p-4 space-y-3 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-edge-light dark:border-edge-dark">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t("dashboard.activeLists")}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {formatNumber(overview?.shopping_lists_count || 0)}
                </span>
              </div>

              {overview?.active_shopping_lists?.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                  No active shopping lists.
                </p>
              ) : (
                <div className="space-y-2">
                  {overview?.active_shopping_lists?.map((sList) => (
                    <div
                      key={sList.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-edge-light dark:border-edge-dark rounded-element flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {sList.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {formatNumber(sList.item_count)} items
                        </p>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-200 shrink-0">
                        {formatNumber(sList.total_cost)} {t("common.bdt")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab("shopping")}
              className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 pt-2 border-t border-edge-light/60 dark:border-edge-dark/60"
            >
              <span>{t("dashboard.viewAll")} lists</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Recent Study Sessions Card */}
          <div className="bg-surface-light dark:bg-surface-dark border border-edge-light dark:border-edge-dark rounded-card p-4 space-y-3 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-edge-light dark:border-edge-dark">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {t("dashboard.recentStudy")}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {formatNumber(overview?.study_sessions_count || 0)}
                </span>
              </div>

              {overview?.recent_study_sessions?.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                  No study sessions recorded.
                </p>
              ) : (
                <div className="space-y-2">
                  {overview?.recent_study_sessions?.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-edge-light dark:border-edge-dark rounded-element flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {sess.title}
                        </p>
                        <p className="text-[10px] text-slate-500 capitalize">
                          {sess.document_type} • {sess.question_count} questions
                        </p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 shrink-0">
                        {sess.language}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab("study")}
              className="text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1 pt-2 border-t border-edge-light/60 dark:border-edge-dark/60"
            >
              <span>{t("dashboard.viewAll")} sessions</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
