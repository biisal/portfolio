import {
  Hanken_Grotesk,
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";

export const InstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  variable: "--font-instrument-serif",
});

export const HankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
  variable: "--font-hanken-grotesk",
});

// export const orbitron = Orbitron({
//   variable: "--font-orbitron",
//   subsets: ["latin"],
// });

// export const openSans = Open_Sans({
//   variable: "--font-open-sans",
//   subsets: ["latin"],
// });

// export const poppins = Poppins({
//   variable: "--font-poppins",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
// });

// export const MontserratFont = Montserrat({
//   subsets: ["latin"],
//   weight: "600",
// });

export const JetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-jetbrains-mono",
});

export const SpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

// export const AlbertSans = Albert_Sans({
//   subsets: ["latin"],
//   weight: "600",
// });
