import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import SiteHeader from "../components/SiteHeader";

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <SiteHeader />
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
