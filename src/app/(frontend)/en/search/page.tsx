import type { Metadata } from "next";
import { SearchForm } from "@/components/SearchForm";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchPageEn() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
      <div className="mt-8">
        <SearchForm locale="en" />
      </div>
    </main>
  );
}
