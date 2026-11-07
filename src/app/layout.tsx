import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toaster from "@/components/ui/Toaster";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UPK Mekarsari - Koperasi Simpan Pinjam Terpercaya",
  description:
    "UPK Mekarsari adalah koperasi yang berkomitmen untuk kesejahteraan anggota melalui layanan finansial yang terpercaya dan menguntungkan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var origSetAttr = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, val) {
                    if (name === 'bis_skin_checked' || name === 'bis_register' || (typeof name === 'string' && name.indexOf('__processed_') === 0)) {
                      return;
                    }
                    return origSetAttr.apply(this, arguments);
                  };
                  var clean = function(el) {
                    if (!el || !el.removeAttribute) return;
                    if (el.hasAttribute && el.hasAttribute('bis_skin_checked')) el.removeAttribute('bis_skin_checked');
                    if (el.hasAttribute && el.hasAttribute('bis_register')) el.removeAttribute('bis_register');
                    var attrs = el.attributes;
                    if (attrs) {
                      for (var i = attrs.length - 1; i >= 0; i--) {
                        var n = attrs[i].name;
                        if (n === 'bis_skin_checked' || n === 'bis_register' || (typeof n === 'string' && n.indexOf('__processed_') === 0)) {
                          el.removeAttribute(n);
                        }
                      }
                    }
                  };
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.target) {
                        clean(m.target);
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          clean(m.addedNodes[j]);
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
        suppressHydrationWarning
      >
        <QueryProvider>
          {children}
          <Toaster />
          <ConfirmDialog />
        </QueryProvider>
      </body>
    </html>
  );
}
