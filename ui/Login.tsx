'use client';

import supabase from '#/lib/supabase-browser';
import { cn } from '#/lib/utils';
import { useSession } from '@supabase/auth-helpers-react';
import { IconUserCheck, IconUserExclamation } from '@tabler/icons';
import Button from './Button';
import Popover from './Popover';

function Login() {
  const session = useSession();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: 'leon.machens@gmail.com',
    });

    if (error) {
      console.log({ error });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log({ error });
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          'rounded p-1',
          session ? 'bg-emerald-600' : 'bg-orange-600',
        )}
      >
        {session ? <IconUserCheck /> : <IconUserExclamation />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <p>
            For some features like creating or reporting nodes, an account is
            required.
          </p>
          {session ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default Login;
