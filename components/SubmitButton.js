"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="px-8">
      {pending ? "Submitting..." : "Submit Recipe"}
    </Button>
  );
}
