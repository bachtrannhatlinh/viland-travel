import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginRequiredDialog: React.FC<LoginRequiredDialogProps> = ({ open, onOpenChange }) => {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl font-bold text-gray-900 mb-2 text-center">Yêu cầu đăng nhập</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600 mb-6 text-center">
          Bạn cần đăng nhập để thực hiện đặt xe. Vui lòng đăng nhập để tiếp tục.
        </DialogDescription>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 w-full mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 py-2 rounded-lg">Đóng</Button>
          </DialogClose>
          <Button onClick={handleLogin} autoFocus className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
