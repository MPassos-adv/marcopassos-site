/* Existing Analytics destinations, preserved without sending triage or form values. */
(() => {
  const host=location.hostname;
  if(host==='localhost'||host==='127.0.0.1'||host.endsWith('.chatgpt.site')) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config','G-DDFCRGDYBX');
  window.gtag('config','G-RK0LVCE8H7');
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id=G-DDFCRGDYBX';
  document.head.append(script);
})();
