import { useApp } from '../contexts/AppContext';

export function useI18n() {
  const { language, setLanguage, t } = useApp();
  return { language, setLanguage, t };
}
