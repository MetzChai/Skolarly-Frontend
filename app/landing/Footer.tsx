import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/skolarly-logo.png"
              alt="Skolarly Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain object-top"
            />
            <span className="text-lg font-bold text-primary">Skolarly</span>
          </Link>
          <p className="text-muted-foreground text-sm">Learn Smarter. Achieve More.</p>
        </div>
      </div>
    </footer>
  )
}
