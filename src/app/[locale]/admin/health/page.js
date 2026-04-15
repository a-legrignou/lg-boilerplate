import { redirect } from "next/navigation";
import { getSession } from "@/lib/utils/auth";
import { getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import HealthDashboard from "@/components/admin/health-dashboard";

export const metadata = {
  title: "Health — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHealthPage({ params }) {
  const { locale } = await params;

  const user = await getSession();
  if (!user) redirect(`/${locale}/login`);

  const [settings, topmenu] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
  ]);

  return (
    <>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />
      <HealthDashboard />
      <Footer locale={locale} />
    </>
  );
}
