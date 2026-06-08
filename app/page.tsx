import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="bg-primary sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>

            <div>
              <h1 className="text-white text-xl font-bold">HMS</h1>
              <p className="text-accent text-xs">
                Hospital Management System
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10 hover:text-white"
              >
                Login
              </Button>
            </Link>

            <Link href="/register/patient">
              <Button className="bg-accent hover:bg-accent/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[100px] -z-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Trusted by 1000+ patients
            </div>
            <h1 className="text-5xl font-bold text-primary leading-tight mb-6">
              Your Health,
              <span className="text-accent block">Our Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Book appointments with verified doctors, manage your health records,
              and get the care you deserve - all in one secure platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register/patient">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 shadow-lg shadow-accent/25">
                  Get Started as Patient
                </Button>
              </Link>
              <Link href="/register/doctor">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
                  Join as Doctor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold text-primary">20+</p>
                <p className="text-muted-foreground text-sm">Doctors</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">1k+</p>
                <p className="text-muted-foreground text-sm">Patients</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-muted-foreground text-sm">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right - Visual card */}
          <div className="relative hidden md:block">
            <div className="bg-primary rounded-3xl p-8 text-white shadow-2xl">
              <p className="text-accent text-sm font-medium mb-4">Next Appointment</p>
              <div className="bg-white/10 rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                    D
                  </div>
                  <div>
                    <p className="font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-white/60 text-sm">Cardiologist</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-white/80">
                  <span>📅 June 20, 2026</span>
                  <span>🕘 09:00 AM</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-accent">24</p>
                  <p className="text-white/60 text-xs">Appointments</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-accent">12</p>
                  <p className="text-white/60 text-xs">Doctors</p>
                </div>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">Appointment Confirmed</p>
                  <p className="text-muted-foreground text-xs">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose HMS?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your healthcare journey in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Easy Booking
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Book appointments with top doctors in just a few clicks. Choose your preferred time and doctor.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Verified Doctors
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                All doctors are thoroughly verified and approved by our admin team before joining the platform.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                Secure & Private
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your health data is encrypted and protected. We take your privacy seriously at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join thousands of patients and doctors already using HMS.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register/patient">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 shadow-lg">
                Register as Patient
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8">
                Login to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/95 px-8 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-white font-bold">HMS</span>
          </div>
          <p className="text-white/50 text-sm">
            © 2026 HMS - Hospital Management System. All rights reserved.
          </p>
          <div className="flex gap-6 text-white/50 text-sm">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>

    </main>
  );
}