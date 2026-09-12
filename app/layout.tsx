import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { GlobalAIBar } from "@/components/GlobalAIBar";
import { GuidedTour } from "@/components/GuidedTour";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naano-8x",
  description: "My Take on naano",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <div className="flex min-h-svh w-full">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col pb-24">{children}</div>
          </div>
          <GlobalAIBar />
          <GuidedTour />
        </TooltipProvider>
      </body>
    </html>
  );
}
