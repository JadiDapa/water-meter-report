"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { resolveComplaint } from "@/app/actions/complaint.actions";

export default function ResolveComplaintDialog({
  complaintId,
}: {
  complaintId: number;
}) {
  const [finishOpen, setFinishOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFinish = () => {
    startTransition(async () => {
      try {
        await resolveComplaint(complaintId, { action: "FINISHED" });
        toast.success("Keluhan berhasil diselesaikan");
        setFinishOpen(false);
      } catch {
        toast.error("Gagal menyelesaikan keluhan");
      }
    });
  };

  const handleCancel = () => {
    if (!reason.trim()) {
      setReasonError("Alasan pembatalan wajib diisi");
      return;
    }
    setReasonError("");
    startTransition(async () => {
      try {
        await resolveComplaint(complaintId, {
          action: "CANCELLED",
          cancellationReason: reason.trim(),
        });
        toast.success("Keluhan berhasil dibatalkan");
        setCancelOpen(false);
        setReason("");
      } catch {
        toast.error("Gagal membatalkan keluhan");
      }
    });
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="default"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setFinishOpen(true)}
          disabled={isPending}
        >
          <CheckCircle className="h-4 w-4" />
          Selesaikan
        </Button>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => setCancelOpen(true)}
          disabled={isPending}
        >
          <XCircle className="h-4 w-4" />
          Batalkan
        </Button>
      </div>

      {/* Confirm finish */}
      <AlertDialog open={finishOpen} onOpenChange={setFinishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Selesaikan Keluhan?</AlertDialogTitle>
            <AlertDialogDescription>
              Keluhan ini akan ditandai sebagai selesai. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinish}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isPending ? "Memproses..." : "Ya, Selesaikan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel with reason */}
      <Dialog
        open={cancelOpen}
        onOpenChange={(open) => {
          setCancelOpen(open);
          if (!open) {
            setReason("");
            setReasonError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Batalkan Keluhan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="reason">Alasan Pembatalan</Label>
            <Textarea
              id="reason"
              placeholder="Masukkan alasan pembatalan..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError("");
              }}
              rows={4}
              disabled={isPending}
            />
            {reasonError && (
              <p className="text-destructive text-xs">{reasonError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
              disabled={isPending}
            >
              Kembali
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isPending}
            >
              {isPending ? "Memproses..." : "Batalkan Keluhan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
