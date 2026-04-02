import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect information you provide directly to us when you create an account, generate an itinerary, or communicate with us. This includes your name, email address, and travel preferences."
    },
    {
      title: "How We Use Your Data",
      content: "We use your data to provide and improve our services, specifically to personalize your travel itineraries and provide customer support."
    },
    {
        title: "Information Sharing",
        content: "We do not sell your personal data. We may share information with service providers who perform functions on our behalf, but only with appropriate security measures."
    },
    {
        title: "Your Rights",
        content: "You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-16">
          <Clock size={14} />
          Last Updated: March 20, 2026
        </div>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold mb-6 text-white">{section.title}</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-zinc-900 text-zinc-600 text-sm">
          For any questions regarding our privacy practices, please contact our Data Protection Officer at privacy@travelmind.com.
        </div>
      </div>
    </div>
  );
}
