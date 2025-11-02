import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import SiteHeader from "../components/SiteHeader";
import HeaderAuth from "../components/HeaderAuth";

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <SiteHeader />
      <HeaderAuth />
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
