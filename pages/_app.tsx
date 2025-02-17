import { GoogleAnalytics } from "nextjs-google-analytics";
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'
import '../style.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return <>
    <GoogleAnalytics trackPageViews />
    <Component {...pageProps} />
  </>
}