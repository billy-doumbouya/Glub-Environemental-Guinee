import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import { organization } from '../../data/organization'

const links = [
  { href: organization.socialLinks.facebookPage, icon: FaFacebook, label: 'Facebook', color: 'hover:bg-blue-600' },
  { href: organization.socialLinks.instagram, icon: FaInstagram, label: 'Instagram', color: 'hover:bg-pink-600' },
  { href: organization.socialLinks.youtube, icon: FaYoutube, label: 'YouTube', color: 'hover:bg-red-600' },
  { href: organization.socialLinks.tiktok, icon: FaTiktok, label: 'TikTok', color: 'hover:bg-gray-900' },
]

export function SocialFloatingBar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2"
    >
      {links.map(({ href, icon: Icon, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-gray-600 ${color} hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-xl`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </motion.div>
  )
}
