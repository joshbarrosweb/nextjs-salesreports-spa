import type { AppProps } from "next/app";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primeflex/primeflex.css";
import "bulma/css/bulma.css";
import "components/common/loader/loader.css";

import { AuthProvider } from "contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
