import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
  message: string;
  type: AlertType;
  visible: boolean;
}

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within AlertProvider');
  return ctx;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({ message: '', type: 'info', visible: false });

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert(a => ({ ...a, visible: false })), 3000);
  };

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertTriangle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div
        className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 min-w-[280px] max-w-xs
          transition-all duration-300
          ${alert.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        style={{ transitionProperty: 'opacity, transform' }}
      >
        {alert.visible && (
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl font-medium text-gray-900 bg-white border-l-4
              ${alert.type === 'success' ? 'border-green-600' : alert.type === 'error' ? 'border-red-600' : 'border-blue-600'}
            `}
          >
            <span>{iconMap[alert.type]}</span>
            <span className="flex-1">{alert.message}</span>
          </div>
        )}
      </div>
    </AlertContext.Provider>
  );
}
