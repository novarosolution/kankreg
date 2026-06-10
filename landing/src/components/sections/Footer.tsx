import Link from "next/link";
import { site } from "@/content/site";

export default function Footer() {
  const { brand, footer } = site;

  return (
    <footer className="border-t border-charcoal/8 bg-charcoal text-cream/85">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold text-cream">{brand.name}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/65">{footer.blurb}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ghee-gold">Quick links</p>
          <ul className="mt-4 space-y-2">
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream/70 transition hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ghee-gold">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-cream">
                {brand.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${brand.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className="hover:text-cream">
                {brand.email}
              </a>
            </li>
            <li>{brand.address}</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {Object.entries(brand.social).map(([key, href]) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/15 px-3 py-1 text-xs capitalize text-cream/70 hover:text-cream"
              >
                {key}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/45">{footer.copyright}</div>
    </footer>
  );
}
