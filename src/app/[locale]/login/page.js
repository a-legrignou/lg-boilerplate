import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/utils/auth";
import { getCachedSiteSettings } from "@/lib/models";
import TopMenu from "@/components/menus/top-menu";
import { getCachedTopMenu } from "@/lib/models";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/forms/login";
import TitleSection from "@/components/widgets/title-section";

// Page non indexée — métadonnées minimales mais localisées
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Login" : "Connexion",
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params, searchParams }) {
  const { locale } = await params;
  const sp = await searchParams;
  const redirectTo = sp?.redirect ?? `/${locale}/account`;

  // Already authenticated → redirect
  const user = await getSession();
  if (user) redirect(redirectTo);

  const [settings, topmenu] = await Promise.all([getCachedSiteSettings(), getCachedTopMenu()]);

  return (
    <>
      <TopMenu items={topmenu} logo={settings?.logo} name={settings?.site_name} linkedinUrl={settings?.linkedin_url} />

      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <TitleSection title="Accédez à vos contenus exclusifs." subtitle="Connexion" className="mb-8" />

          {/* Card */}
          <div className="border border-border bg-background p-8 space-y-6">
            <LoginForm locale={locale} />

            <div className="pt-2 border-t border-border space-y-3 text-center">
              <p className="text-xs text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href={`/${locale}/contact`} className="text-primary underline-offset-4 hover:underline">
                  Contactez-nous
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  );
}
