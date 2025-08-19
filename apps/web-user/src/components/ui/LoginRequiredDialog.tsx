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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Bạn cần đăng nhập để thực hiện đặt xe. Vui lòng đăng nhập để tiếp tục.
        </DialogDescription>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Button onClick={handleLogin} autoFocus>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
