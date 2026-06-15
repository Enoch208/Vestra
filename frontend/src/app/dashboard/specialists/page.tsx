import { SpecialistGrid } from "@/components/dashboard/SpecialistGrid";

export const metadata = {
  title: "Savers · Vestra",
};

export default function SpecialistsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-8 md:px-8 md:py-10">
      <SpecialistGrid />
    </div>
  );
}
