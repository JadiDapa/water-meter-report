"use client";

import { useTransition, useState, useRef, useCallback } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateReportSchema } from "@/servers/validators/report.validator";
import { createReport } from "@/app/actions/report.actions";
import { CustomerCombobox } from "@/components/root/CustomerCombobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CustomerWithLatestReport } from "@/servers/validators/customer.validator";
import { useRouter } from "next/navigation";
import { X, ImagePlus, UploadCloud, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

type ReportFormType = z.infer<typeof CreateReportSchema>;

interface ImagePreview {
  file: File;
  url: string;
}

export default function CreateReportDialog({
  technicianId,
  customerId,
  customers,
}: {
  technicianId?: number;
  customerId?: number;
  customers?: CustomerWithLatestReport[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ReportFormType>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      technicianId: technicianId ? technicianId : undefined,
      customerId: customerId ? customerId : undefined,
      location: "",
      values: "",
      createdAt: new Date(),
    },
  });

  const syncFilesToInput = (previews: ImagePreview[]) => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    previews.forEach((p) => dt.items.add(p.file));
    fileInputRef.current.files = dt.files;
  };

  const addImages = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    const newPreviews: ImagePreview[] = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const next = [...prev, ...newPreviews];
      syncFilesToInput(next); // ← keep input in sync
      return next;
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      const next = prev.filter((_, i) => i !== index);
      syncFilesToInput(next); // ← keep input in sync
      return next;
    });
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  };

  async function onSubmit(values: ReportFormType) {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // Append scalar fields
        formData.append("technicianId", String(values.technicianId));
        formData.append("customerId", String(values.customerId));
        formData.append("location", values.location);
        formData.append("values", values.values);
        formData.append("createdAt", values.createdAt.toISOString());

        // Append image files
        images.forEach((img) => formData.append("images", img.file));

        await createReport(formData);
        toast.success("Laporan berhasil dibuat!");
        router.push("/technician/my-reports");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Terjadi kesalahan";
        toast.error(message);
      }
    });
  }

  // Ambil bacaan meteran dari report terakhir pelanggan.
  // Field `values` bisa berupa angka biasa atau JSON {"current","previous"}.
  function parseReading(values?: string): number {
    if (!values) return 0;
    try {
      const parsed = JSON.parse(values);
      if (parsed && typeof parsed === "object" && "current" in parsed) {
        return Number(parsed.current) || 0;
      }
    } catch {
      // bukan JSON, jatuh ke parsing angka biasa
    }
    return Number(values) || 0;
  }

  const selectedCustomerId = form.watch("customerId");
  const selectedCustomer = customers?.find(
    (c) => c.id === Number(selectedCustomerId),
  );

  // Lokasi pelanggan diambil dari alamat pelanggan terpilih.
  const customerLocation = selectedCustomer?.address ?? "";

  // Nilai sebelumnya = bacaan meteran terakhir pelanggan.
  const previousValue = parseReading(selectedCustomer?.reports[0]?.values);

  const currentInput = Number(form.watch("values")) || 0;
  const usage = currentInput ? currentInput - previousValue : 0;

  return (
    <section className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 grid grid-cols-2 gap-12"
      >
        <FieldGroup>
          {customers && (
            <Controller
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Pelanggan</FieldLabel>
                  <CustomerCombobox
                    customers={customers}
                    value={field.value}
                    onChange={(cust) => {
                      field.onChange(cust?.id);
                      form.setValue("location", cust?.address ?? "", {
                        shouldValidate: true,
                      });
                    }}
                  />
                </Field>
              )}
            />
          )}

          <div className="">
            <p className="">Lokasi Pelanggan:</p>
            <p className="text-primary/50 text-lg font-medium">
              {customerLocation || "—"}
            </p>
          </div>

          {/* Date */}
          <Controller
            name="createdAt"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Tanggal Laporan</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(field.value, "dd MMMM yyyy", { locale: id })
                        : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date ?? new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />

          {/* Values */}
          <div className="grid grid-cols-2">
            <div className="">
              <p className="">Nilai Sebelumnya:</p>
              <p className="text-primary/50 text-lg font-medium">
                {previousValue} m³
              </p>
            </div>

            <Controller
              name="values"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Nilai Sekarang</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      placeholder="Isi Nilai Meteran..."
                      type="number"
                    />
                    <InputGroupAddon align={"inline-end"}> m³</InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
            />
          </div>

          <div className="">
            <p className="text-lg font-medium">
              Selisih / Pemakaian Bulan Ini:
            </p>
            <p className="text-primary text-2xl font-semibold">{usage} m³</p>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? <Spinner /> : "Tambahkan"}
            </Button>
          </div>
        </FieldGroup>

        {/* Image Uploader */}
        <Field className="border-s ps-12">
          <FieldLabel>
            Foto{" "}
            <span className="text-muted-foreground ml-1 text-xs font-normal">
              (opsional, bisa lebih dari 1)
            </span>
          </FieldLabel>

          {/* Drop Zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" && fileInputRef.current?.click()
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "relative flex flex-col items-center justify-center gap-2",
              "cursor-pointer rounded-xl border-2 border-dashed px-4 py-6",
              "transition-colors duration-150 select-none",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/40",
            ].join(" ")}
          >
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <UploadCloud className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-foreground text-sm font-medium">
              Klik atau seret foto ke sini
            </p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, WEBP — bisa lebih dari satu
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => e.target.files && addImages(e.target.files)}
            />
          </div>

          {/* Previews */}
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.map((img, i) => (
                <div
                  key={img.url}
                  className="group border-border bg-muted relative aspect-square overflow-hidden rounded-lg border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`Preview ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className={[
                      "absolute top-1 right-1 flex h-5 w-5 items-center justify-center",
                      "rounded-full bg-black/60 text-white opacity-0 transition-opacity",
                      "group-hover:opacity-100 hover:bg-black/80",
                    ].join(" ")}
                    aria-label="Hapus foto"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={[
                  "flex aspect-square flex-col items-center justify-center gap-1",
                  "border-border rounded-lg border-2 border-dashed",
                  "text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors",
                ].join(" ")}
                aria-label="Tambah foto"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-medium">Tambah</span>
              </button>
            </div>
          )}
        </Field>
      </form>
    </section>
  );
}
