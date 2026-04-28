import { SignUpForm } from "./SignUpForm";
import { enabledProviders } from "@/lib/auth";

export default function SignUpPage() {
  return <SignUpForm providers={enabledProviders} />;
}
