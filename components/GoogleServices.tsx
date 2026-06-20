"use client";

import Script from "next/script";

export const Adsens = () => {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3286439795135934"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
};

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-WECNP4P9E6"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WECNP4P9E6');
        `}
      </Script>
    </>
  );
}
