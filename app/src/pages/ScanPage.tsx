import ScanInputForm from '@/components/ScanInputForm'
import Navbar from '@/components/Navbar'

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-tk-bg">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-tk-accent uppercase tracking-[0.2em]">
              New Scan
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-normal text-tk-text mt-4 mb-4">
              Scan your code
            </h1>
            <p className="font-sans text-base text-tk-text-secondary max-w-lg mx-auto">
              Paste your code, connect a GitHub repo, or scan a live URL.
              Triskelix will analyze code, deployed assets, and agent config signals for security risks.
            </p>
          </div>
          <ScanInputForm />
        </div>
      </div>
    </div>
  )
}
