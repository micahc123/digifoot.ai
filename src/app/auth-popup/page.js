'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthPopup() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    let platform;
    if (state === 'facebook') {
      platform = 'facebook';
    } else {
      platform = 'instagram';
    }

    if (code) {
      window.opener.postMessage({ platform, code }, window.location.origin);
      window.close();
    }
  }, [searchParams]);

  return <div>Authenticating...</div>;
}