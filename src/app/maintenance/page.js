import MaintenanceLayout from "../../components/layout/maintenance";
import { getMaintenance } from "@/lib/models/maintenance";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const maintenanceData = await getMaintenance();

  // Si maintenance n'est pas active, rediriger vers la page d'accueil
  if (!maintenanceData) {
    redirect("/");
  }

  return (
    <MaintenanceLayout
      title={maintenanceData?.title}
      message={
        maintenanceData?.message ||
        "Notre équipe met les dernières touches à de belles améliorations. Le service sera rétabli sous peu — merci pour votre patience."
      }
      returnDate={maintenanceData?.return_date || "2026-03-02T08:00:00Z"}
      image={maintenanceData?.image}
      contactEmail={maintenanceData?.contact_mail}
    />
  );
}
