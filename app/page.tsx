"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "services", "about", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { value: "15K+", label: "Pelanggan Aktif" },
    { value: "99.9%", label: "Kualitas Air" },
    { value: "24/7", label: "Layanan Darurat" },
    { value: "4.9", label: "Rating Kepuasan" },
  ];

  const services = [
    {
      title: "Sambungan Baru",
      description: "Pasang sambungan air baru dengan proses cepat dan mudah tanpa birokrasi berbelit.",
      features: ["Proses 3 Hari", "Gratis Survey", "Garansi 1 Tahun"],
    },
    {
      title: "Pembayaran Digital",
      description: "Bayar tagihan online kapan saja melalui berbagai metode pembayaran modern.",
      features: ["Virtual Account", "QRIS", "E-Wallet"],
    },
    {
      title: "Pengaduan 24 Jam",
      description: "Layanan pengaduan kebocoran dan gangguan air non-stop setiap hari.",
      features: ["Respon < 30 Menit", "Teknis Berpengalaman", "Gratis Panggilan"],
    },
    {
      title: "Monitoring Digital",
      description: "Pantau pemakaian air Anda secara real-time langsung dari genggaman.",
      features: ["Aplikasi Mobile", "Notifikasi Real-time", "History Pemakaian"],
    },
  ];

  const advantages = [
    { title: "Teknologi Terbaru", description: "Sistem filtrasi canggih untuk kualitas air terbaik", stat: "99.9%", statLabel: "Kebersihan" },
    { title: "Ramah Lingkungan", description: "Pengolahan air berkelanjutan dan eco-friendly", stat: "Zero", statLabel: "Waste" },
    { title: "Respon Cepat", description: "Tim tanggap darurat siap melayani 24 jam", stat: "< 30", statLabel: "Menit" },
    { title: "Bersertifikat", description: "Terakreditasi standar kesehatan nasional", stat: "A+", statLabel: "Rating" },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pelanggan Rumah Tangga",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "Pelayanan PDAM sangat memuaskan. Air jernih dan tidak pernah mati. Tagihan juga mudah dibayar online.",
    },
    {
      name: "Siti Rahayu",
      role: "Pemilik Restoran",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "Sebagai pengusaha kuliner, kualitas air sangat penting. PDAM Tirta Pakuan selalu memberikan yang terbaik.",
    },
    {
      name: "Ahmad Hidayat",
      role: "Developer Perumahan",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      text: "Kerjasama dengan PDAM sangat profesional. Proses pemasangan cepat dan harga kompetitif.",
    },
  ];

  const faqs = [
    { q: "Berapa biaya pemasangan sambungan baru?", a: "Biaya pemasangan bervariasi tergantung jarak dari jaringan utama, mulai dari Rp 500.000. Silakan hubungi kami untuk informasi lebih detail." },
    { q: "Bagaimana cara cek tagihan online?", a: "Anda bisa cek tagihan melalui website resmi kami atau aplikasi mobile dengan memasukkan nomor pelanggan." },
    { q: "Apa yang harus dilakukan jika air keruh?", a: "Segera laporkan melalui layanan pengaduan 24 jam kami. Tim teknis akan segera menindaklanjuti laporan Anda." },
    { q: "Apakah ada diskon untuk pembayaran tepat waktu?", a: "Ya, kami memberikan diskon 2% untuk pembayaran sebelum tanggal 10 setiap bulannya." },
  ];

  const navItems = ["home", "services", "about", "testimonials", "contact"];
  const navLabels: Record<string, string> = {
    home: "Beranda",
    services: "Layanan",
    about: "Tentang",
    testimonials: "Testimoni",
    contact: "Kontak",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff]">
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0077b6] to-[#00b4d8] flex items-center justify-center shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C12 2 4 8.5 4 14a8 8 0 0016 0C20 8.5 12 2 12 2z" fill="white" opacity="0.95"/>
                  <path d="M12 8C12 8 8 11.5 8 14a4 4 0 008 0C16 11.5 12 8 12 8z" fill="white" opacity="0.6"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#0a1628] leading-tight">PDAM Tirta Pakuan</p>
                <p className="text-[10px] text-[#0077b6] font-medium">Air Bersih untuk Masa Depan</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`px-3.5 py-1.5 text-sm rounded-md transition-colors ${
                    activeSection === section
                      ? "bg-[#0077b6] text-white shadow-sm"
                      : "text-muted-foreground hover:text-[#0077b6] hover:bg-blue-50"
                  }`}
                >
                  {navLabels[section]}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-[#0077b6] transition-colors font-medium">
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0077b6] to-[#0096c7] text-white text-sm font-medium rounded-lg hover:from-[#00699e] hover:to-[#0084b3] transition-all shadow-sm"
              >
                Daftar Gratis
              </Link>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-muted-foreground hover:text-[#0077b6]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileMenu ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="md:hidden pb-4 border-t border-blue-100 mt-2 pt-3">
              {navItems.map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={() => setMobileMenu(false)}
                  className={`block px-3 py-2 text-sm rounded-md mb-1 ${
                    activeSection === section ? "bg-[#0077b6] text-white" : "text-muted-foreground hover:text-[#0077b6] hover:bg-blue-50"
                  }`}
                >
                  {navLabels[section]}
                </a>
              ))}
              <Link href="/sign-up" className="block px-3 py-2 text-sm text-[#0077b6] font-medium mt-2">
                Daftar Gratis →
              </Link>
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="relative min-h-screen flex items-center bg-[#0a1628] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0096c7]" />
                <span className="text-white/70 text-xs font-medium tracking-wide uppercase">Layanan Air Bersih Premium</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
                Air Bersih yang
                <br />
                <span className="text-[#0096c7]">Anda Percaya</span>
                <br />
                Sejak 1975
              </h1>
              <p className="text-white/60 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                PDAM Tirta Pakuan menghadirkan air bersih berkualitas tinggi dengan teknologi modern dan pelayanan yang dapat diandalkan setiap saat.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0096c7] text-white font-medium rounded-lg hover:bg-[#0084b3] transition-colors text-sm"
                >
                  Mulai Sekarang
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <a href="#services" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
                  Lihat Layanan
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.08 }}
                    className="bg-white/5 rounded-lg p-3.5 border border-white/10"
                  >
                    <div className="text-white font-bold text-xl">{stat.value}</div>
                    <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative rounded-xl overflow-hidden w-full max-w-md">
                <img
                  src="https://images.pexels.com/photos/14571222/pexels-photo-14571222.jpeg"
                  alt="Water Treatment Plant"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                    <p className="text-white text-sm font-medium">Instalasi Pengolahan Air</p>
                    <p className="text-white/60 text-xs mt-0.5">Teknologi Filtrasi Modern</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559302995-f2f47c9b67eb?w=1920&h=400&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-[0.03]"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mb-14"
          >
            <span className="text-xs font-semibold text-[#0096c7] uppercase tracking-widest">Layanan Unggulan</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628] mt-3 mb-4">
              Solusi Lengkap untuk Kebutuhan Air Anda
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Kami menghadirkan layanan terpadu yang memudahkan akses air bersih untuk seluruh kebutuhan Anda
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg border border-border p-6 hover:border-[#0077b6]/20 hover:shadow-sm transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-[#0077b6]/5 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f3b3e" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#0a1628] mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-1.5">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-[#0096c7]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-[#0096c7] uppercase tracking-widest">Tentang Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628] mt-3 mb-4 leading-tight">
                Lebih dari 45 Tahun Melayani Masyarakat
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                PDAM Tirta Pakuan telah menjadi mitra terpercaya masyarakat Kota Bogor dalam menyediakan air bersih berkualitas sejak tahun 1975. Kami bangga melayani lebih dari 150.000 pelanggan dengan standar tertinggi.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Dengan komitmen kuat terhadap kualitas dan inovasi, kami terus menggunakan teknologi terkini untuk memastikan setiap tetes air yang sampai ke rumah Anda aman, jernih, dan sehat.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#f0f5ff] rounded-lg p-5 border border-border">
                  <div className="text-2xl font-bold text-[#0077b6]">45+</div>
                  <div className="text-xs text-muted-foreground mt-1">Tahun Pengalaman</div>
                </div>
                <div className="bg-[#f0f5ff] rounded-lg p-5 border border-border">
                  <div className="text-2xl font-bold text-[#0096c7]">150K+</div>
                  <div className="text-xs text-muted-foreground mt-1">Pelanggan Terlayani</div>
                </div>
              </div>
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b6] text-white text-sm font-medium rounded-lg hover:bg-[#00699e] transition-colors">
                Pelajari Lebih Lanjut
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="rounded-xl overflow-hidden border border-border">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=350&fit=crop"
                  alt="Instalasi Pengolahan Air PDAM"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {advantages.map((adv, idx) => (
                  <div key={idx} className="bg-[#f0f5ff] rounded-lg p-5 border border-border hover:border-[#0077b6]/20 transition-colors">
                    <h3 className="font-semibold text-[#0a1628] text-sm mb-1.5">{adv.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{adv.description}</p>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-md border border-border">
                      <span className="font-bold text-[#0077b6] text-sm">{adv.stat}</span>
                      <span className="text-[10px] text-muted-foreground">{adv.statLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-[#0a1628] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-wrap gap-8 justify-around items-center">
            {[
              { label: "Penghargaan Nasional 2023" },
              { label: "ISO 9001:2015 Bersertifikat" },
              { label: "Standar WHO Terpenuhi" },
              { label: "Ramah Lingkungan" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/80">
                <div className="w-2 h-2 rounded-full bg-[#0096c7]" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="testimonials" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mb-14"
          >
            <span className="text-xs font-semibold text-[#0096c7] uppercase tracking-widest">Testimoni</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628] mt-3 mb-4">
              Apa Kata Pelanggan Kami?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ribuan pelanggan telah merasakan manfaat air bersih berkualitas dari kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="bg-[#f0f5ff] rounded-lg p-6 border border-border"
              >
                <svg className="text-[#0077b6]/10 mb-3" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                </svg>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628]">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="rounded-xl overflow-hidden border border-border">
                <img
                  src="https://images.pexels.com/photos/6109219/pexels-photo-6109219.jpeg"
                  alt="Kualitas Air Bersih"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="mt-4 bg-[#f0f5ff] rounded-xl border border-border p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#0077b6] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Butuh Bantuan?</p>
                    <p className="text-xs text-muted-foreground">Hubungi call center kami</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-[#0077b6]">(0251) 123-4567</p>
              </div>
            </motion.div>

            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <span className="text-xs font-semibold text-[#0096c7] uppercase tracking-widest">FAQ</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0a1628] mt-3 mb-4">
                  Pertanyaan Umum
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Temukan jawaban dari pertanyaan yang sering diajukan
                </p>
              </motion.div>

              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-[#f0f5ff] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#0a1628] pr-4">{faq.q}</span>
                      <svg
                        className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 sm:py-28 bg-[#0a1628] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1920&h=600&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center px-4 relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096c7]" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Bergabung Sekarang</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Siap Menikmati Air Bersih Berkualitas?
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Bergabunglah dengan lebih dari 150.000 pelanggan yang telah merasakan manfaat layanan PDAM Tirta Pakuan
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0096c7] text-white font-medium rounded-lg hover:bg-[#0084b3] transition-colors text-sm"
            >
              Daftar Sekarang
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="tel:025112345678" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="bg-[#060e1a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#0096c7] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C12 2 4 8.5 4 14a8 8 0 0016 0C20 8.5 12 2 12 2z" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">PDAM Tirta Pakuan</p>
                  <p className="text-[10px] text-white/40">Air Bersih untuk Semua</p>
                </div>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                Menyediakan air bersih berkualitas untuk masyarakat Kota Bogor sejak 1975.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a1.998 1.998 0 01-2.18 2 19.791 19.791 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.791 19.791 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.758 12.758 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.758 12.758 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  (0251) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  info@pdamtirtapakuan.go.id
                </li>
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Jl. Raya Pajajaran No. 123, Bogor
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-sm text-white/50">
                <li>Senin – Jumat: 08.00 – 16.00</li>
                <li>Sabtu: 08.00 – 12.00</li>
                <li className="flex items-center gap-2 text-[#0096c7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0096c7]" />
                  Call Center: 24 Jam
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex gap-2.5 mb-5">
                {[
                  { label: "FB", href: "https://facebook.com/pdamtirtapakuan" },
                  { label: "IG", href: "https://instagram.com/pdamtirtapakuan" },
                  { label: "TW", href: "https://twitter.com/pdamtirtapakuan" },
                  { label: "YT", href: "https://youtube.com/@pdamtirtapakuan" },
                ].map((s, i) => (
                  <a key={i} href={s.href}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium bg-white/5 border border-white/10 hover:bg-[#0096c7] hover:border-[#0096c7] transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0096c7] text-white text-xs font-medium rounded-lg hover:bg-[#0084b3] transition-colors">
                Daftar Sekarang
              </Link>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-xs border-t border-white/10">
            <p>© 2024 PDAM Tirta Pakuan. Hak cipta dilindungi.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white/60 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white/60 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
