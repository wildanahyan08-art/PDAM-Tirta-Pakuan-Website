"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section
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
    { value: "15K+", label: "Pelanggan Aktif", icon: "👥", color: "from-blue-500 to-cyan-500" },
    { value: "99.9%", label: "Kualitas Air", icon: "💧", color: "from-emerald-500 to-teal-500" },
    { value: "24/7", label: "Layanan Darurat", icon: "🕐", color: "from-orange-500 to-red-500" },
    { value: "4.9", label: "Rating Kepuasan", icon: "⭐", color: "from-yellow-500 to-amber-500" },
  ];

  const services = [
    {
      title: "Sambungan Baru",
      description: "Pasang sambungan air baru dengan proses cepat dan mudah",
      icon: "🔌",
      gradient: "from-blue-600 to-indigo-600",
      features: ["Proses 3 Hari", "Gratis Survey", "Garansi 1 Tahun"]
    },
    {
      title: "Pembayaran Digital",
      description: "Bayar tagihan online melalui berbagai metode pembayaran",
      icon: "💳",
      gradient: "from-emerald-600 to-teal-600",
      features: ["Virtual Account", "QRIS", "E-Wallet"]
    },
    {
      title: "Pengaduan 24 Jam",
      description: "Layanan pengaduan kebocoran dan gangguan air non-stop",
      icon: "📞",
      gradient: "from-orange-600 to-red-600",
      features: ["Response < 30 Menit", "Teknis Berpengalaman", "Gratis Panggilan"]
    },
    {
      title: "Monitoring Digital",
      description: "Pantau pemakaian air Anda secara real-time",
      icon: "📊",
      gradient: "from-purple-600 to-pink-600",
      features: ["Aplikasi Mobile", "Notifikasi Real-time", "History Pemakaian"]
    },
  ];

  const advantages = [
    {
      icon: "✨",
      title: "Teknologi Terbaru",
      description: "Menggunakan sistem filtrasi canggih untuk kualitas air terbaik",
      stat: "99.9%",
      statLabel: "Kebersihan"
    },
    {
      icon: "🌿",
      title: "Ramah Lingkungan",
      description: "Proses pengolahan air yang berkelanjutan dan eco-friendly",
      stat: "Zero",
      statLabel: "Waste"
    },
    {
      icon: "⚡",
      title: "Respon Cepat",
      description: "Tim tanggap darurat siap melayani 24 jam sehari",
      stat: "< 30",
      statLabel: "Menit"
    },
    {
      icon: "🏆",
      title: "Bersertifikat",
      description: "Terakreditasi dan memenuhi standar kesehatan nasional",
      stat: "A+",
      statLabel: "Rating"
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pelanggan Rumah Tangga",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      text: "Pelayanan PDAM sangat memuaskan. Air jernih dan tidak pernah mati. Tagihan juga mudah dibayar online.",
      rating: 5
    },
    {
      name: "Siti Rahayu",
      role: "Pemilik Restoran",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      text: "Sebagai pengusaha kuliner, kualitas air sangat penting. PDAM Tirta Pakuan selalu memberikan yang terbaik.",
      rating: 5
    },
    {
      name: "Ahmad Hidayat",
      role: "Developer Perumahan",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      text: "Kerjasama dengan PDAM sangat profesional. Proses pemasangan cepat dan harga kompetitif.",
      rating: 4.5
    },
  ];

  const faqs = [
    {
      q: "Berapa biaya pemasangan sambungan baru?",
      a: "Biaya pemasangan bervariasi tergantung jarak dari jaringan utama. Mulai dari Rp 500.000. Silakan hubungi kami untuk info lebih detail."
    },
    {
      q: "Bagaimana cara cek tagihan online?",
      a: "Anda bisa cek tagihan melalui website resmi kami atau aplikasi mobile dengan memasukkan nomor pelanggan."
    },
    {
      q: "Apa yang harus dilakukan jika air keruh?",
      a: "Segera laporkan melalui layanan pengaduan 24 jam kami. Tim teknis akan segera menindaklanjuti."
    },
    {
      q: "Apakah ada diskon untuk pembayaran tepat waktu?",
      a: "Ya, kami memberikan diskon 2% untuk pembayaran sebelum tanggal 10 setiap bulannya."
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Custom Cursor */}
      <div className="hidden lg:block fixed w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mix-blend-difference pointer-events-none z-50 transition-transform duration-300"
           style={{ transform: 'translate(-50%, -50%)' }}
           id="custom-cursor" />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-2xl py-4" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white text-2xl font-bold">P</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  PDAM Tirta Pakuan
                </h1>
                <p className="text-xs text-gray-500">Air Bersih untuk Masa Depan</p>
              </div>
            </motion.div>
            
            <div className="hidden md:flex space-x-8">
              {["home", "services", "about", "testimonials", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    activeSection === section 
                      ? "text-blue-600" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                  {activeSection === section && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </a>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-3"
            >
              <Link
                href="/sign-in"
                className="px-5 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Daftar
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-blue-600 text-sm font-medium">Layanan Air Bersih Premium</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Air Bersih untuk 
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Masa Depan
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                PDAM Tirta Pakuan menyediakan air bersih berkualitas tinggi dengan teknologi terkini. 
                Nikmati kemudahan akses air bersih 24/7 untuk rumah dan bisnis Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/sign-up"
                  className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="relative z-10">Mulai Sekarang</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
                <Link
                  href="#services"
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all font-medium"
                >
                  Lihat Layanan
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-xl">{stat.icon}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1548839141-82a1b8ffb0c0?w=600&h=500&fit=crop"
                  alt="Water Treatment"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Air Layak Minum</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">⭐</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                    <p className="text-sm text-gray-600">Kepuasan Pelanggan</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-600 text-sm font-medium">Layanan Premium</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Layanan Unggulan
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan terbaik untuk memenuhi kebutuhan air bersih Anda
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#"
                    className="text-blue-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Selengkapnya
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-600 text-sm font-medium">Tentang Kami</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Lebih dari 45 Tahun
                </span>
                <br />
                <span className="text-blue-600">Melayani Masyarakat</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PDAM Tirta Pakuan telah menjadi mitra terpercaya masyarakat Kota Bogor dalam menyediakan air bersih berkualitas sejak tahun 1975.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Dengan komitmen kuat terhadap kualitas dan pelayanan, kami terus berinovasi menggunakan teknologi terkini untuk memastikan setiap tetes air yang sampai ke rumah Anda aman dan sehat.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">45+</div>
                  <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">150K+</div>
                  <div className="text-sm text-gray-600">Pelanggan Terlayani</div>
                </div>
              </div>
              
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                Pelajari Lebih Lanjut
                <span>→</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {advantages.map((adv, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl mb-3">{adv.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{adv.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{adv.description}</p>
                  <div className="inline-block px-3 py-1 bg-white rounded-full">
                    <span className="font-bold text-blue-600">{adv.stat}</span>
                    <span className="text-xs text-gray-500"> {adv.statLabel}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-600 text-sm font-medium">Testimonial</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Apa Kata Mereka?
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ribuan pelanggan telah merasakan manfaat air bersih berkualitas dari kami
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      {i < Math.floor(testimonial.rating) ? "★" : i < testimonial.rating ? "½" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <span className="text-blue-600 text-sm font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Pertanyaan Umum
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Temukan jawaban dari pertanyaan yang sering diajukan
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <span className="text-2xl text-blue-600">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Siap Menikmati Air Bersih?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Bergabunglah dengan ribuan pelanggan yang sudah merasakan kualitas air terbaik dari PDAM Tirta Pakuan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-all shadow-lg font-semibold transform hover:scale-105"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="#"
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all font-semibold"
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">P</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">PDAM Tirta Pakuan</h3>
                  <p className="text-sm text-gray-400">Air Bersih untuk Semua</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Menyediakan air bersih berkualitas untuk masyarakat Kota Bogor sejak 1975.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">📞 (0251) 1234567</li>
                <li className="flex items-center gap-2">✉️ info@pdamtirtapakuan.go.id</li>
                <li className="flex items-center gap-2">📍 Jl. Raya Pajajaran No. 123, Bogor</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Senin - Jumat: 08:00 - 16:00</li>
                <li>Sabtu: 08:00 - 12:00</li>
                <li>Call Center: 24 Jam</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  ig
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  tw
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PDAM Tirta Pakuan. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}