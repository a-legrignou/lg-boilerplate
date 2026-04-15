import Link from "next/link";

/**
 * SmartLink — <a> pour les ancres #, <Link> pour le reste.
 */
export default function SmartLink({ href, children, ...props }) {
  if (href?.startsWith("#")) return <a href={href} {...props}>{children}</a>;
  return <Link href={href} {...props}>{children}</Link>;
}
