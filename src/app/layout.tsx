import type { Metadata } from 'next';
import './globals.css';
import { HRProvider } from '@/lib/store/useHRStore';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'HR Analytics — Enterprise Workforce Intelligence',
  description: 'Production-quality workforce analytics dashboard for attrition, compensation, performance, satisfaction, and executive reporting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className="h-full overflow-hidden antialiased">
        <ThemeProvider>
          <HRProvider>{children}</HRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
