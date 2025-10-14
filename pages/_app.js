import "@/styles/globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import HeaderAuth from "../components/HeaderAuth";

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <HeaderAuth />
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
