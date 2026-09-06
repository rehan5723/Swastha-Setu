module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef3ff',
          100: '#dce7ff',
          200: '#b9d0ff',
          300: '#84adff',
          400: '#4d80ff',
          500: '#1356d8',
          600: '#0a40b0',
          700: '#083090',
          800: '#062570',
          900: '#041a50',
        },
        teal: {
          50:  '#e0fbff',
          100: '#b3f5ff',
          200: '#66ebff',
          300: '#19e0ff',
          400: '#00d4f5',
          500: '#00b8d9',
          600: '#0094ad',
          700: '#007080',
          800: '#004d57',
          900: '#002933',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        ink: {
          900: '#0b1e3d',
          700: '#1e3a5f',
          500: '#4b6280',
          300: '#94a3b8',
          100: '#cbd5e1',
        },
        // Status colours — flat keys so Tailwind generates them correctly
        'success-50':     '#f0fdf4',
        'success-500':    '#22c55e',
        'success-700':    '#166534',
        'success-border': '#bbf7d0',
        'warning-50':     '#fffbeb',
        'warning-500':    '#f59e0b',
        'warning-700':    '#92400e',
        'warning-border': '#fde68a',
        'danger-50':      '#fff1f0',
        'danger-500':     '#ef4444',
        'danger-700':     '#c0392b',
        'danger-border':  '#fecaca',
        // Urgency level colours
        urgent: {
          low:      '#22c55e',
          moderate: '#f59e0b',
          high:     '#ef4444',
          critical: '#7c3aed',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':  '0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
        'modal':       '0 24px 64px rgba(10,22,40,0.22), 0 2px 8px rgba(0,0,0,0.08)',
        'brand':       '0 4px 20px rgba(19,86,216,0.35)',
        'focus':       '0 0 0 3px rgba(19,86,216,0.18)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)',
        'teal-gradient':  'linear-gradient(135deg, #00e2ff 0%, #1356d8 100%)',
        'page-bg':        'linear-gradient(to bottom right, #e8f0fe, #f0f7ff, #e3ecff)',
        'dark-panel':     'linear-gradient(160deg, #071226 0%, #0d1f45 45%, #071a3e 100%)',
      },
      animation: {
        'blob':         'blobFloat 7s ease-in-out infinite alternate',
        'blob-delayed': 'blobFloat 7s ease-in-out 2s infinite alternate',
        'ecg':          'ecgScroll 2.2s linear infinite',
        'spin-fast':    'spin 0.7s linear infinite',
        'fade-in':      'fadeIn 0.3s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-in-left':'slideInLeft 0.35s ease-out',
      },
      keyframes: {
        blobFloat: {
          from: { transform: 'translateY(0) scale(1)' },
          to:   { transform: 'translateY(30px) scale(1.08)' },
        },
        ecgScroll: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-40px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
