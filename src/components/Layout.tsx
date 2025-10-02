'use client';

interface LayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export default function Layout({ children, showBanner = true }: LayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
