/**
 * Footer Component
 * Site footer with links and info
 */

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Tentang Infortic</h3>
            <p className="text-sm text-neutral-600">
              Platform informasi peluang kompetisi, beasiswa, magang, dan berbagai kesempatan
              lainnya untuk pelajar dan mahasiswa Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/opportunities" className="text-neutral-600 hover:text-primary-600">
                  Semua Peluang
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-neutral-600 hover:text-primary-600">
                  Kategori
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Kontak</h3>
            <p className="text-sm text-neutral-600">
              Ada pertanyaan atau saran? Hubungi kami melalui media sosial.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-neutral-200 pt-6 text-center">
          <p className="text-sm text-neutral-600">
            © {currentYear} Infortic. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
