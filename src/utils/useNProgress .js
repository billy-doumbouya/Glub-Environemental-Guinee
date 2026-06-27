import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Config + style brand — exécuté une seule fois au premier import
NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

if (typeof document !== "undefined" && !document.getElementById("nprogress-brand")) {
  const style = document.createElement("style");
  style.id = "nprogress-brand";
  style.textContent = `
    #nprogress .bar {
      background: #16a34a !important;
      height: 3px !important;
    }
    #nprogress .peg {
      box-shadow: 0 0 10px #16a34a, 0 0 5px #16a34a !important;
    }
  `;
  document.head.appendChild(style);
}

export function useNProgress() {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 300);
    return () => {
      clearTimeout(t);
      NProgress.done();
    };
  }, [pathname]);
}