import Link from "next/link";

const variants = {
  outline:
    "w-50 font-bold border border-foreground backdrop-blur-sm text-center text-lg text-foreground mx-auto lg:ml-0 px-7 py-2 rounded-none hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-500",
  filled:
    "w-50 font-bold mx-auto lg:ml-0 bg-secondary text-white text-center text-lg py-2 rounded-none hover:bg-primary transition-colors duration-500",
};

export function CTAButton({ label, href, variant = "filled" }) {
  if (!href) return null;
  return (
    <Link href={href} className={variants[variant]}>
      {label}
    </Link>
  );
}
