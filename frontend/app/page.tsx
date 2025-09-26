import Image from "next/image";
import Link from "next/link";
import NavigationBar from "../components/NavigationBar";

// Hero Section Component
function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Make a Difference
            <span className="block text-green-600 dark:text-green-400">Together</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect with meaningful volunteering opportunities in your community. 
            Our smart matching system finds the perfect opportunities based on your location and skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Find Opportunities
            </Link>
            <Link
              href="/organize"
              className="border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Post an Opportunity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      title: "Smart Matching",
      description: "Get matched with opportunities based on your location and skills using our advanced point system.",
      icon: "🎯",
      href: "/volunteer/volunteer-matching",
    },
    {
      title: "Easy Discovery",
      description: "Browse and search through hundreds of volunteering opportunities in your area.",
      icon: "🔍"
    },
    {
      title: "Track Impact",
      description: "See your volunteering history and the positive impact you're making in your community.",
      icon: "📊",
      href: "/volunteer/volunteer-history",
    }
  ];

  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose GiversGuild?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            We make volunteering simple, rewarding, and impactful, so you can focus on making a difference in your community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link href={feature.href ?? "#"} key={index}>
              <div className="text-center p-6 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-green-200 dark:hover:border-gray-700">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
