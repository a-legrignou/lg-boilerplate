import { SignInForm } from "./SignInForm";
import { enabledProviders } from "@/lib/auth";

export default function SignInPage() {
  return <SignInForm providers={enabledProviders} />;
}
