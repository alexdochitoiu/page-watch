import { useState } from 'react';
import { WatcherRule } from '@/types/watcher';

interface CheckResult {
  success: boolean;
  message: string;
  ruleResults: Array<{
    ruleId: string;
    passed: boolean;
    actualValue?: string;
    expectedValue?: string;
    error?: string;
  }>;
  screenshot?: string;
  timestamp: string;
}

export const useWatcherCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);

  const checkWatcher = async (url: string, rules: WatcherRule[]) => {
    setIsChecking(true);
    try {
      const response = await fetch('/api/watcher/check-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, rules }),
      });

      const data = await response.json();

      console.log('Watcher check response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check watcher');
      }

      if (data.success) {
        setLastResult(data.data);
        return data.data;
      } else {
        throw new Error(data.error || 'Check failed');
      }
    } catch (error) {
      console.error('Error checking watcher:', error);
      const errorResult: CheckResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        ruleResults: [],
        timestamp: new Date().toISOString(),
      };
      setLastResult(errorResult);
      throw error;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    lastResult,
    checkWatcher,
    clearResult: () => setLastResult(null),
  };
};
