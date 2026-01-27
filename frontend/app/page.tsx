'use client';


import { useRef, useState, useEffect } from 'react';
import {
  Ticket, Award, DollarSign, Users, Shield,
  ArrowRight, Sparkles, Globe, Zap
} from 'lucide-react';
import CustomNavbar from '@/components/CustomNavbar';
import CustomFooter from '@/components/CustomFooter';
import Tilt from 'react-parallax-tilt';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- VISUAL COMPONENTS ---

const MeshGradientBackground = () => (
  <div className="fixed inset-0 -z-10 bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden transition-colors duration-300">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#14279B]/20 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#5C7AEA]/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#3D56B2]/15 blur-[100px] animate-bounce-slow" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

const FloatingBadge = ({ children, delay = 0, x, y = 0, right }: { children: React.ReactNode, delay?: number, x?: number, y?: number, right?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="absolute"
    style={{ top: y, left: x, right: right }}
  >
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
      className="backdrop-blur-md bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 shadow-xl rounded-2xl p-4 flex items-center gap-3"
    >
      {children}
    </motion.div>
  </motion.div>
);

const BentoItem = ({
  children,
  className = "",
  title,
  subtitle,
  icon: Icon,
  delay = 0
}: {
  children?: React.ReactNode,
  className?: string,
  title: string,
  subtitle: string,
  icon: any,
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`h-full ${className}`}
    >
      <Tilt
        tiltMaxAngleX={2}
        tiltMaxAngleY={2}
        glareEnable={true}
        glareMaxOpacity={0.05}
        className="group relative h-full overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 p-8 h-full flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{subtitle}</p>
          <div className="mt-auto">
            {children}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="min-h-screen text-gray-900 dark:text-white selection:bg-[#14279B]/20 overflow-x-hidden">
      <MeshGradientBackground />
      <CustomNavbar />

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-20 container mx-auto px-6 overflow-hidden">
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">

            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
              </span>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Powered by Base Layer 2</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none"
            >
              The future of <br />
              <span className="text-gradient text-transparent bg-clip-text font-extrabold pb-2">
                event ticketing
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Create secure digital tickets, reward your attendees automatically and build loyal community all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <a
                href="/create"
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-600/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 transform" />
                <span className="relative flex items-center gap-2">
                  Create Event <ArrowRight className="w-4 h-4" />
                </span>
              </a>
              <a
                href="/explore"

                className="px-8 py-4 rounded-full bg-white dark:bg-white/5 border border-primary-200 dark:border-white/10 text-primary-700 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-sm"
              >
                Explore Events
              </a>
            </motion.div>
          </div>

          {/* Floating Abstract Visuals - Responsive Hidden on Mobile */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <FloatingBadge delay={0.8} y={150} x={100}>
              <div className="p-2 bg-blue-100 rounded-lg"><Ticket className="w-6 h-6 text-primary-600" /></div>
              <div>
                <p className="text-xs text-gray-500">Minted</p>
                <p className="text-sm font-bold">NFT Ticket</p>
              </div>
            </FloatingBadge>

            <FloatingBadge delay={1.2} y={250} right={50}>
              <div className="p-2 bg-purple-100 rounded-lg"><Award className="w-6 h-6 text-purple-600" /></div>
              <div>
                <p className="text-xs text-gray-500">Reward</p>
                <p className="text-sm font-bold">Early Adopter POAP</p>
              </div>
            </FloatingBadge>
          </div>
        </section>

        {/* --- BENTO GRID FEATURES --- */}
        <section className="py-20 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Large Feature */}
            <BentoItem
              title="Smart Tickets"
              subtitle="Dynamic NFT tickets that evolve. Prevent scalping, enable secondary royalties, and gate exclusive content."
              icon={Shield}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-900"
            >
              <div className="relative h-64 mt-4 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:scale-[1.02] transition-transform duration-500">
                {/* Abstract UI Mockup */}
                <div className="absolute top-4 left-4 right-4 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center px-4 space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="absolute top-16 left-4 right-4 bottom-4 bg-white dark:bg-gray-700 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className="flex justify-between items-center mb-4 px-4">
                      <div className="h-2 w-1/3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                      <div className="h-6 w-16 bg-[#0052FF]/20 rounded-lg text-[#0052FF] text-xs flex items-center justify-center font-bold">VERIFIED</div>
                    </div>
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
                      <Globe className="w-10 h-10 text-white animate-spin-slow" />
                    </div>
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2" />
                  </div>
                </div>
              </div>
            </BentoItem>

            {/* Side Feature 1 */}
            <BentoItem
              title="Instant Settlement"
              subtitle="Get paid instantly in IDRX or USDC. No waiting weeks for payouts."
              icon={DollarSign}
              delay={0.2}
            />

            {/* Side Feature 2 */}
            <BentoItem
              title="Community Logic"
              subtitle="Reward loyalty with on-chain reputation points and unlockable perks."
              icon={Users}
              delay={0.4}
            />
          </div>
        </section>

        {/* --- STATISTICS --- */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-400 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { label: "Events Hosted", value: "500+" },
                { label: "Tickets Minted", value: "125K" },
                { label: "Volume (IDRX)", value: "2.5B" }, // Changed to IDRX for local relevance
                { label: "Onchain Users", value: "10K+" }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS STEPS --- */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple & Seamless</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Powered by Account Abstraction. Your users won't even know they're using blockchain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Create", desc: "Define your event details, ticket prices, and artwork. Deployed instantly as a smart contract factory.", icon: Sparkles },
              { title: "Mint", desc: "Attendees purchase tickets with one click using Smart Wallets (Passkeys). Gasless options available.", icon: Ticket },
              { title: "Engage", desc: "Verify ownership on-chain, distribute POAPs, and airdrop rewards to loyal fans.", icon: Zap }
            ].map((step, i) => (
              <Tilt key={i} tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.05} scale={1.02}>
                <div className="h-full relative p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold font-serif leading-none select-none">
                    {i + 1}
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-primary-500/30">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 text-white p-12 md:p-24 text-center">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-black/30"></div>

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold">Ready to build on Base?</h2>
                <p className="text-xl text-blue-100">Join the next generation of event organizers.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a href="/create" className="px-10 py-5 bg-white text-primary-600 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    Get Started Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CustomFooter />
      <style jsx global>{`
          .animate-spin-slow {
              animation: spin 8s linear infinite;
          }
          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
      `}</style>
    </div>
  );
}
