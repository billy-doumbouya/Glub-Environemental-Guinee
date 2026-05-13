import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200',
  secondary: 'bg-white hover:bg-gray-50 text-green-700 border border-green-200 shadow-sm',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-green-700',
  ghost: 'text-green-700 hover:bg-green-50',
  gold: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', href, to, className = '', ...props }) {
  const base = `inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {children}
      </a>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={base}
      {...props}
    >
      {children}
    </motion.button>
  )
}
