import 'server-only';

import createClient from '#/lib/supabase-server';
import { cn } from '#/lib/utils';
import '#/styles/globals.css';
import SupabaseListener from '#/ui/SupabaseListener';
import { Work_Sans as WorkSans } from '@next/font/google';
import localFont from '@next/font/local';
import type { ReactNode } from 'react';
import SupabaseProvider from './SupabaseProvider';

const fontSerif = localFont({
  variable: '--font-serif',
  src: './fonts/animales-fantastic.woff2',
});

const fontSans = WorkSans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html
      lang="en"
      className={cn(
        '[color-scheme:dark] select-none',
        fontSerif.variable,
        fontSans.variable,
      )}
    >
      <head />
      <body>
        <SupabaseListener accessToken={session?.access_token} />
        <SupabaseProvider session={session}>{children}</SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const revalidate = 0;
