import { useEffect, useState } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    // Client-side device detection
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      
      // Mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // OS-specific detection
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      
      // Update state
      setDeviceInfo({
        isMobile: isMobile,
        isIOS: isIOS,
        isAndroid: isAndroid,
      });
    }
  }, []);

  return deviceInfo;
};