import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { StoreProvider } from '../client/state-persistence/index';
import Router from 'flareact/router'

export default function MyApp({ Component, pageProps }) {
    // Your custom stuff here

    return (
        <>
            <StoreProvider>
                <Component {...pageProps} />
                <ToastContainer position="top-center" />
            </StoreProvider>
        </>
    )
}