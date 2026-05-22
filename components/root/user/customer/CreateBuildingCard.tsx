"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreateBuildingDialog from "./CreateBuildingDialog";

export default function CreateBuildingCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:shadow-primary/5 bg-card group relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed p-5 transition-all duration-300 hover:shadow-lg"
      >
        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-300">
          <Plus className="h-5 w-5" />
        </div>
        <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
          Tambah Gedung
        </span>
      </button>
      <CreateBuildingDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
