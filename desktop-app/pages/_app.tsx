import { IsClientProvider } from '@/context/is-client-context'
import Head from 'next/head';
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { SWRConfig } from 'swr';
import { CubeDirectionProvider } from '@/context/cube-direction';
import { CubeAHRSProvider } from '@/context/cube-ahrs';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig>
      <IsClientProvider>
        <CubeAHRSProvider>
          <CubeDirectionProvider>
            <Head>
              <meta
                  name='description'
                  content='DeskCube — Prototype Desktop Application'
              />
              <meta name='viewport' content='width=device-width, initial-scale=1' />
              <link rel='icon' href='/favicon.ico' />
            </Head>
            <Component {...pageProps} />
          </CubeDirectionProvider>
        </CubeAHRSProvider>
      </IsClientProvider>
    </SWRConfig>
  )
}
