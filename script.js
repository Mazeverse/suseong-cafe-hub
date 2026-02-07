(function(){
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Set dates
  const now = new Date();
  const yyyy = now.getFullYear();
  $("#year").textContent = String(yyyy);

  // "최근 업데이트" — set to current year/month automatically
  const mm = String(now.getMonth()+1).padStart(2, "0");
  $("#updated").textContent = `${yyyy}년 ${parseInt(mm,10)}월`;

  // Search/filter
  const cards = $$(".card");
  const countEl = $("#count");
  const searchEl = $("#search");
  const updateCount = () => {
    const visible = cards.filter(c => !c.classList.contains("hidden")).length;
    countEl.textContent = String(visible);
  };
  updateCount();

  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();
    cards.forEach(card => {
      const text = (card.innerText + " " + (card.getAttribute("data-tags")||"")).toLowerCase();
      const hit = !q || text.includes(q);
      card.classList.toggle("hidden", !hit);
    });
    updateCount();
  });

  // Copy buttons
  const toast = $("#toast");
  let toastTimer = null;

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1200);
  };

  $$(".btn.ghost").forEach(btn => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try{
        await navigator.clipboard.writeText(value);
        showToast("링크를 복사했어요 ✅");
      }catch(e){
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("링크를 복사했어요 ✅");
      }
    });
  });
})();