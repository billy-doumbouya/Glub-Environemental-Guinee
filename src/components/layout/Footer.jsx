import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { organization } from "../../data/organization";
import { NAV_LINKS } from "../../constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg font-poppins">
                  ONG C.E.G
                </p>
                <p className="text-green-400 text-xs">
                  Club Environnemental de Guinée
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              ONG dédiée à la préservation de l'environnement et au
              développement durable en République de Guinée depuis 2016.
            </p>
            <div className="flex gap-3">
              {[
                {
                  href: organization.socialLinks.facebookPage,
                  icon: FaFacebook,
                  label: "Facebook",
                },
                {
                  href: organization.socialLinks.instagram,
                  icon: FaInstagram,
                  label: "Instagram",
                },
                {
                  href: organization.socialLinks.youtube,
                  icon: FaYoutube,
                  label: "YouTube",
                },
                {
                  href: organization.socialLinks.tiktok,
                  icon: FaTiktok,
                  label: "TikTok",
                },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-6 font-poppins text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:bg-green-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div>
            <h3 className="font-semibold text-white mb-6 font-poppins text-sm uppercase tracking-wider">
              Nos Domaines
            </h3>
            <ul className="space-y-3">
              {[
                "Environnement & Développement Durable",
                "Genre Inclusion & Gouvernance Locale",
                "Santé Communautaire Intégréé",
                "Recherche Action & Formation",
              ].map((d) => (
                <li key={d}>
                  <Link
                    to="/domaines"
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full group-hover:bg-green-400 transition-colors" />
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-6 font-poppins text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">
                  {organization.headquarters}
                </span>
              </li>
              {organization.phones.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <a
                    href={`tel:${phone}`}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href={`mailto:${organization.email}`}
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors break-all"
                >
                  {organization.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center">
            © {year} ONG Club Environnemental de Guinée — Agrément{" "}
            {organization.agreement}
          </p>
          <p className="text-gray-600 text-xs">
            Créée le {organization.created}
          </p>
        </div>
      </div>
    </footer>
  );
}
