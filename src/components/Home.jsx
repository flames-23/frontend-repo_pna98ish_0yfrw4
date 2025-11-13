import { Link } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500" />
            <span className="font-extrabold text-xl tracking-tight">sync.in</span>
          </div>
          <div className="text-sm text-gray-500">AI career co-pilot for Indian students</div>
        </div>
      </header>

      <div className="absolute inset-0 -z-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pt-28 pb-10 sm:pt-36 sm:pb-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black leading-tight">
              Your vibe-powered career guide.
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600">
              No jargon. No stress. Just a clean path to your dream work.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/know"
              className="group rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-3xl font-extrabold">I Know What I Want To Do</h3>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="mt-2 text-gray-600">We’ll reverse-engineer your role into a crisp, stage-wise roadmap.</p>
            </Link>

            <Link
              to="/discover"
              className="group rounded-2xl bg-white/70 backdrop-blur border border-white/60 p-6 sm:p-8 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl sm:text-3xl font-extrabold">I Don’t Know What I Want To Do</h3>
                <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <p className="mt-2 text-gray-600">Take fun, tiny tests to find your best-fit careers. Zero pressure.</p>
            </Link>
          </div>
        </section>

        <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-gray-500">
          Built with love in India. Stay curious. ✨
        </footer>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />
    </div>
  )
}
