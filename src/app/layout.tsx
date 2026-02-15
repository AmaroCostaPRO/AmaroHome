import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerProvider } from "@/contexts/player-context";
import { GlobalSpotifyPlayer } from "@/components/media/global-spotify-player";

import { ShaderBackground } from "@/components/ui/shader-background";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Hub Pessoal",
  description: "Finanças, Playlists, Games, eBooks, Notas e IA — tudo em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <ShaderBackground />
        <PlayerProvider>
          <AppShell>{children}</AppShell>
          <GlobalSpotifyPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}

