document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const phoneInput = document.getElementById("phone");
  const requestPairingBtn = document.getElementById("requestPairing");
  const statusEl = document.getElementById("status");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById('navLinks');
  const nav = document.getElementById('nav');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.innerHTML = navLinks.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  socket.on("statsUpdate", ({ activeSockets, totalUsers }) => {
    document.getElementById("activeSockets").textContent = activeSockets;
    document.getElementById("totalUsers").textContent = totalUsers;
  });

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });
  }

  requestPairingBtn.addEventListener("click", async () => {
    const number = phoneInput.value.trim();
    if (!number) {
      showStatus("❌ Veuillez entrer votre numéro de téléphone (avec indicatif pays).", "error");
      return;
    }

    if (!/^[0-9]{8,15}$/.test(number.replace(/\D/g, ''))) {
      showStatus("❌ Veuillez entrer un numéro de téléphone valide (chiffres uniquement, 8-15 caractères).", "error");
      return;
    }

    showStatus("<span class='spinner'></span> Demande du code d'appairage en cours...", "loading");
    requestPairingBtn.disabled = true;

    try {
      const res = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showStatus("❌ Erreur: " + (data.error || "Échec de la demande d'appairage"), "error");
        requestPairingBtn.disabled = false;
        return;
      }

      const code = (data.pairingCode || "").toString().trim();
      const spacedCode = code.split("").join(" ");
      
      showStatus(`
        <div style="text-align: center;">
          <p style="margin-bottom: 20px; font-size: 1.1rem;">✅ Code d'appairage pour <strong>${number}</strong> :</p>
          <div class="pairing-code" id="pairingCode">${spacedCode}</div>
          <p style="margin-top: 16px; opacity: 0.8;"><small>Cliquez sur le code pour le copier — puis entrez-le dans WhatsApp pour finaliser l'appairage.</small></p>
        </div>
      `, "success");

      const pairingEl = document.getElementById("pairingCode");
      if (pairingEl) {
        pairingEl.addEventListener("click", () => {
          navigator.clipboard.writeText(code)
            .then(() => {
              const originalText = pairingEl.textContent;
              pairingEl.textContent = "Copié !";
              pairingEl.style.letterSpacing = "2px";
              pairingEl.style.background = "rgba(0, 255, 157, 0.2)";
              
              setTimeout(() => {
                pairingEl.textContent = originalText;
                pairingEl.style.letterSpacing = "10px";
                pairingEl.style.background = "rgba(0, 0, 0, 0.4)";
              }, 2000);
            })
            .catch(() => {
              showStatus("❌ Échec de la copie dans le presse-papiers. Veuillez copier manuellement le code.", "error");
            });
        });
      }
    } catch (err) {
      console.error("Échec de la demande d'appairage", err);
      showStatus("❌ Échec de la demande du code d'appairage (erreur réseau ou serveur).", "error");
    } finally {
      requestPairingBtn.disabled = false;
    }
  });

  function showStatus(message, type = "") {
    statusEl.innerHTML = message;
    statusEl.className = "";
    if (type) statusEl.classList.add(type);
    statusEl.classList.add("fade-in");
  }

  socket.on("linked", ({ sessionId }) => {
    showStatus(`
      <div style="text-align: center; color: var(--success);">
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px;"></i>
        <h3 style="margin-bottom: 16px;">✅ Connecté avec succès !</h3>
        <p>Votre appareil a été connecté avec succès. Vous pouvez maintenant utiliser les fonctionnalités de ShadowCrew Mini.</p>
        <p style="margin-top: 12px; opacity: 0.8;"><small>ID de session : ${sessionId}</small></p>
      </div>
    `, "success");
    
    phoneInput.value = "";
  });

  socket.on("pairingTimeout", ({ number }) => {
    showStatus(`
      <div style="text-align: center; color: var(--warning);">
        <i class="fas fa-clock" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
        <h3 style="margin-bottom: 12px;">⏰ Code d'appairage expiré</h3>
        <p>Le code d'appairage pour ${number} a expiré.</p>
        <p>Veuillez demander un nouveau code si vous devez encore vous connecter.</p>
      </div>
    `, "warning");
  });

  phoneInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      requestPairingBtn.click();
    }
  });

  phoneInput.addEventListener("input", function(e) {
    this.value = this.value.replace(/\D/g, '');
  });

  requestPairingBtn.addEventListener("click", function() {
    this.classList.add("loading");
    const originalText = this.innerHTML;
    this.innerHTML = '<span class="spinner"></span> Demande en cours...';
    
    setTimeout(() => {
      this.classList.remove("loading");
      this.innerHTML = originalText;
    }, 3000);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 3 + 1;
      const posX = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = Math.random() * 15 + 20;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  createParticles();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});