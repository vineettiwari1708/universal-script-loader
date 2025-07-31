// 📦 UNIVERSAL WIDGET LOADER
(function () {
  const STACK_GAP = 16;
  const widgetMap = {
    "bottom-right": [],
    "bottom-left": [],
    "top-right": [],
    "top-left": []
  };

  function stackWidget(widget, position) {
    const widgets = widgetMap[position];
    let offset = 20;

    widgets.forEach(w => {
      offset += w.offsetHeight + STACK_GAP;
    });

    if (position.includes("bottom")) {
      widget.style.bottom = offset + "px";
    } else {
      widget.style.top = offset + "px";
    }

    if (position.includes("right")) {
      widget.style.right = "20px";
    } else {
      widget.style.left = "20px";
    }

    widgetMap[position].push(widget);
  }

  async function loadExternalWidgets() {
    const scripts = document.querySelectorAll(".floating-widget-loader");

    for (const s of scripts) {
      const widgetSrc = s.getAttribute("data-widget-src");
      const position = s.getAttribute("data-position") || "bottom-right";
      const config = s.getAttribute("data-config");
      const label = s.getAttribute("data-label") || "Widget";

      try {
        const resp = await fetch(widgetSrc);
        const widgetCode = await resp.text();

        const wrapper = document.createElement("div");
        wrapper.className = "dynamic-widget";
        wrapper.style.cssText = `
          position: fixed;
          z-index: 99999;
        `;

        const script = document.createElement("script");
        script.type = "module";
        script.textContent = `
          (function(){
            const config = ${config || "{}"};
            ${widgetCode}
          })();
        `;

        wrapper.appendChild(script);
        document.body.appendChild(wrapper);

        setTimeout(() => stackWidget(wrapper, position), 200);
      } catch (err) {
        console.error("❌ Failed to load widget:", widgetSrc, err);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", loadExternalWidgets);
})();
