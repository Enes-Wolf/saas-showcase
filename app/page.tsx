"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planName: string, price: number) => {
    setLoading(planName);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName, price }),
      });

      const data = await res.json();

      if (data.url) {
        // Gerçek Stripe oturumu varsa ödeme sayfasına yönlendir
        window.location.href = data.url;
      } else {
        // Test modunda API yanıtını göster
        alert(`API Entegrasyonu Başarılı! (${planName} Planı - $${price}/ay)\nStripe Secret Key bağlandığında doğrudan güvenli ödeme sayfasına yönlendirilir.`);
      }
    } catch (error) {
      alert("Ödeme isteği oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Starter",
      price: 19,
      period: "/ay",
      description: "Bireysel geliştiriciler ve erken aşama projeler için temel araç seti.",
      features: ["5 Proje Limiti", "Temel Analitik", "Topluluk Desteği", "Standart API Erişimi"],
      popular: false,
    },
    {
      name: "Pro",
      price: 49,
      period: "/ay",
      description: "Büyüyen SaaS ve B2B girişimleri için gelişmiş özellikler.",
      features: ["Sınırsız Proje", "Gelişmiş Analitik & Rapor", "Öncelikli 7/24 Destek", "Yüksek Hızlı API", "Özel Webhook Entegrasyonu"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 149,
      period: "/ay",
      description: "Büyük ölçekli operasyonlar ve tam özelleştirme ihtiyacı olan ekipler.",
      features: ["Özel Altyapı", "SLA Garantisi", "Birebir Teknik Danışman", "Sınırsız Ekip Üyesi"],
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-4 py-20">
      {/* Hero Header */}
      <div className="max-w-3xl text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Canlı SaaS Vitrin Projesi v1.0
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
          Modern Sistemler İçin Hızlı ve Güvenli Altyapı
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto">
          İşinizi ölçeklendirmek için tasarlanmış Next.js ve Stripe tabanlı yeni nesil SaaS platformu. Planınızı seçin ve hemen başlayın.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${
              plan.popular
                ? "bg-neutral-900/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-105"
                : "bg-neutral-900/30 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-xs font-semibold rounded-full text-white tracking-wide">
                EN ÇOK TERCİH EDİLEN
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-neutral-100">{plan.name}</h3>
              <p className="text-sm text-neutral-400 mt-2 min-h-[40px]">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                <span className="text-sm text-neutral-400">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-neutral-300">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(plan.name, plan.price)}
              disabled={loading === plan.name}
              className={`mt-8 w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                plan.popular
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
              }`}
            >
              {loading === plan.name ? "İşleniyor..." : `${plan.name} ile Başla`}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}