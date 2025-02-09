import { ReactNode } from "react";
import { Provider as ChakraProvider } from "@/src/components/ui/provider";
import { Toaster } from "@/src/components/ui/toaster";
import "./globals.css"; // 전역 스타일

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "FlowsSync",
  description: "FlowsSync로 프로젝트 관리를 한번에",
  openGraph: {
    title: "FlowsSync",
    description: "FlowsSync로 프로젝트 관리를 한번에",
    url: "https://www.flowssync.com",
    siteName: "FlowsSync",
    images: [
      {
        url: "https://www.flowssync.com/flowSync_Logo.png", // 카카오톡에서 크롤링할 이미지
        width: 1200,
        height: 630,
        alt: "FlowSync Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowSync - The Best PMS Service",
    description:
      "Boost your business efficiency with FlowSync's enterprise project management solution.",
    images: ["https://www.flowsync.com/flowSync_Logo.png"],
  },
  additionalMetaTags: [
    { property: "og:locale", content: "en_US" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "robots", content: "index, follow" }, // SEO 최적화
  ],
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning={true} data-theme="light">
      <head lang="ko">
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      {/* 초기값: 라이트 모드 */}
      <body>
        <ChakraProvider>
          <Toaster />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
