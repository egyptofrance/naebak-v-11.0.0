import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header"; 
import Banner from "@/components/Banner";
import NewsTicker from "@/components/NewsTicker";
import Footer from "@/components/Footer";
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Naebak.com | نائبك دوت كوم",
  description: "منصة التواصل المباشر مع النواب والمرشحين",
};

// Function to get news data for the news ticker
function getNewsData() {
  // For now, we'll use static news content
  // This can be replaced with dynamic content from Supabase later
  return [
    { content: 'مرحباً بكم في منصة نائبك - منصة التواصل المباشر مع النواب والمرشحين' },
    { content: 'تابعوا آخر الأخبار والتطورات البرلمانية من خلال منصتنا' },
    { content: 'شاركوا في الحوار الديمقراطي وعبروا عن آرائكم ومقترحاتكم' },
    { content: 'تواصلوا مع ممثليكم في البرلمان بسهولة ويسر عبر الرسائل المباشرة' },
    { content: 'منصة نائبك - صوتكم يصل إلى البرلمان - مشاركتكم تصنع الفرق' },
    { content: 'اطلعوا على أحدث القرارات والقوانين التي تهم المواطن المصري' },
    { content: 'قدموا شكاواكم ومقترحاتكم مباشرة إلى النواب المختصين' }
  ];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get news data for the news ticker
  const newsData = getNewsData();
  const newsText = newsData && newsData.length > 0 
    ? newsData.map(item => item.content).join(' • ')
    : 'مرحباً بكم في منصة نائبك - تابعوا آخر الأخبار والتطورات';

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.className} flex flex-col min-h-screen`}>
        <Header />
        <Banner />
        <NewsTicker text={newsText} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
