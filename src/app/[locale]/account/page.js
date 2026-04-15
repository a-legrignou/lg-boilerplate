import { redirect } from "next/navigation";
import { getSession, getUserTier } from "@/lib/utils/auth";
import { getCachedSiteSettings, getCachedTopMenu } from "@/lib/models";
import TopMenu from "@/components/menus/top-menu";
import Footer from "@/components/layout/footer";
import AccountLayout from "@/components/layout/account";

// Page non indexée — métadonnées minimales mais localisées
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "My account" : "Mon compte",
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage({ params }) {
  const { locale } = await params;

  const user = await getSession();
  if (!user) redirect(`/${locale}/login`);

  const tier = getUserTier(user);

  const [settings, topmenu] = await Promise.all([
    getCachedSiteSettings(),
    getCachedTopMenu(),
  ]);

  return (
    <>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />
      <AccountLayout user={user} tier={tier} locale={locale} />
      <Footer locale={locale} />
    </>
  );
}
