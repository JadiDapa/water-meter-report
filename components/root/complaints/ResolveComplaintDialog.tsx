"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, X, UploadCloud, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  resolveComplaint,
  finishComplaint,
} from "@/app/actions/complaint.actions";

interface ImagePreview {
  file: File;
  url: string;
}

export default function ResolveComplaintDialog({
  complaintId,
}: {
  complaintId: number;
}) {
  const [finishOpen, setFinishOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const newPreviews: ImagePreview[] = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newPreviews]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetImages = useCallback(() => {
    setImages((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }, []);

  const handleFinish = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img.file));
        await finishComplaint(complaintId, formData);
        toast.success("Keluhan berhasil diselesaikan");
        setFinishOpen(false);
        resetImages();
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

      {/* Finish with optional evidence photos */}
      <Dialog
        open={finishOpen}
        onOpenChange={(open) => {
          setFinishOpen(open);
          if (!open) resetImages();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selesaikan Keluhan</DialogTitle>
            <DialogDescription>
              Keluhan ini akan ditandai sebagai selesai. Anda dapat melampirkan
              foto bukti penyelesaian (opsional).
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Label className="mb-2 block">
              Foto Bukti Penyelesaian{" "}
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                (opsional, bisa lebih dari 1)
              </span>
            </Label>

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                addImages(e.dataTransfer.files);
              }}
              className={[
                "relative flex flex-col items-center justify-center gap-2",
                "cursor-pointer rounded-xl border-2 border-dashed px-4 py-5",
                "transition-colors duration-150 select-none",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/40",
              ].join(" ")}
            >
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full">
                <UploadCloud className="text-muted-foreground h-4 w-4" />
              </div>
              <p className="text-foreground text-sm font-medium">
                Klik atau seret foto ke sini
              </p>
              <p className="text-muted-foreground text-xs">PNG, JPG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => e.target.files && addImages(e.target.files)}
              />
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div
                    key={img.url}
                    className="group border-border bg-muted relative aspect-square overflow-hidden rounded-lg border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Bukti ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                      aria-label="Hapus foto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border text-muted-foreground hover:border-primary/50 hover:text-primary flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors"
                  aria-label="Tambah foto"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Tambah</span>
                </button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinishOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleFinish}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isPending ? "Memproses..." : "Ya, Selesaikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
