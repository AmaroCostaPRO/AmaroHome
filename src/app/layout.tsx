import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { PlayerProvider } from "@/contexts/player-context";
import { GlobalSpotifyPlayer } from "@/components/media/global-spotify-player";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <PlayerProvider>
          <AppShell>{children}</AppShell>
          <GlobalSpotifyPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}

