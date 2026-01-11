import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";

export default function DiscordPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/" className="text-neutral-400 hover:text-neutral-100 text-sm">
          ← {t("nav.home")}
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-neutral-900/50 ring-1 ring-neutral-800">
            <Image src="/logo.png" alt={t("discordSection.logoAlt")} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">{t("discordSection.title")}</h1>
            <p className="mt-1 text-neutral-300">{t("discordSection.subtitle")}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
            <h2 className="text-xl font-semibold">{t("discordSection.discordOnly.title")}</h2>
            <p className="text-sm text-neutral-300">{t("discordSection.discordOnly.description")}</p>
            <div className="text-4xl font-black mt-4">
              {t("discordSection.discordOnly.price")}{" "}
              <span className="text-base font-semibold text-neutral-400">{t("discordSection.discordOnly.period")}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t("discordSection.discordOnly.features").map((feature, i) => (
                <li key={i}>✔ {feature}</li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="block mt-6 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 text-center"
            >
              {t("discordSection.discordOnly.cta")}
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-indigo-500 bg-neutral-900/60 p-6 flex flex-col relative">
            <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold">
              {t("discordSection.bundle.badge")}
            </div>
            <h2 className="text-xl font-semibold">{t("discordSection.bundle.title")}</h2>
            <p className="text-sm text-neutral-300">{t("discordSection.bundle.description")}</p>
            <div className="text-4xl font-black mt-4 text-indigo-300">
              {t("discordSection.bundle.price")}{" "}
              <span className="text-base font-semibold text-neutral-400">{t("discordSection.bundle.period")}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              {t("discordSection.bundle.features").map((feature, i) => (
                <li key={i}>✔ {feature}</li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="block mt-6 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 text-center"
            >
              {t("discordSection.bundle.cta")}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-400">{t("discordSection.keepExisting")}</p>
      </div>
    </div>
  );
}

