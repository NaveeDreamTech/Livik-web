import { Dialog, DialogContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function SuccessModal({ open, onClose = () => {} }) {
  const router = useRouter();

  const goToLogin = () => {
    onClose(); // SAFE (always a function)
    router.push("/login");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="p-6 rounded-xl text-center relative">
        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4">
          Password Reset Successfully!
        </h2>

        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg"
          onClick={goToLogin}
        >
          Go to Login
        </button>
      </DialogContent>
    </Dialog>
  );
}
