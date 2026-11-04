import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Html({ children }: PropsWithChildren) {
  return <html lang="en"><head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>The Mess Around · Play</title>
    <meta name="description" content="Five games. One phone. The Mess Around gameplay preview." />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="theme-color" content="#EDE6D7" />
    <ScrollViewStyleReset />
  </head><body>{children}</body></html>;
}
