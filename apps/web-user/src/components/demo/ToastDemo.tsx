'use client';

import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

export default function ToastDemo() {
  const showSuccessToast = () => {
    toast.success('🎉 Registration successful! Welcome to ViLand Travel!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const showErrorToast = () => {
    toast.error('❌ Registration failed! Please check your information.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const showInfoToast = () => {
    toast.info('ℹ️ Please verify your email address.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const showWarningToast = () => {
    toast.warning('⚠️ Password must be at least 8 characters long.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">React Toastify Demo</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={showSuccessToast} className="bg-green-600 hover:bg-green-700">
          Show Success Toast
        </Button>
        <Button onClick={showErrorToast} className="bg-red-600 hover:bg-red-700">
          Show Error Toast
        </Button>
        <Button onClick={showInfoToast} className="bg-blue-600 hover:bg-blue-700">
          Show Info Toast
        </Button>
        <Button onClick={showWarningToast} className="bg-yellow-600 hover:bg-yellow-700">
          Show Warning Toast
        </Button>
      </div>
    </div>
  );
}
