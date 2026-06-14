import Image from "next/image";
import { ImageIcon } from "lucide-react";

function EvidenceGallery({ images }: { images: { url: string }[] }) {
  if (!images.length) {
    return (
      <div className="bg-muted/50 border-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16">
        <ImageIcon className="text-muted-foreground/50 h-9 w-9" />
        <p className="text-muted-foreground text-sm">Tidak ada foto bukti</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {images.map((img, i) => (
        <a
          key={i}
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-muted ring-border hover:ring-primary relative aspect-square overflow-hidden rounded-xl border ring-1 transition"
        >
          <Image
            src={img.url}
            alt={`Bukti ${i + 1}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          <div className="bg-foreground/0 group-hover:bg-foreground/20 absolute inset-0 transition" />
          <span className="bg-foreground/60 text-background absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 text-[11px] font-medium opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            Lihat
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * "Bukti" card: section header with image count plus the evidence grid.
 * Used on every report/complaint detail page.
 */
export default function EvidenceSection({
  images,
}: {
  images: { url: string }[];
}) {
  return (
    <div className="bg-card ring-border space-y-4 rounded-xl border p-5 ring-1">
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 rounded-lg p-2.5">
          <ImageIcon className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Bukti
          </p>
          <p className="text-muted-foreground text-[13px] font-medium">
            {images.length} gambar terlampir
          </p>
        </div>
      </div>
      <EvidenceGallery images={images} />
    </div>
  );
}
