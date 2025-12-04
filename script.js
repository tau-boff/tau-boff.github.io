// Scroll suave para seções internas
document.querySelectorAll("[data-scroll-to]").forEach((el) => {
  el.addEventListener("click", (event) => {
    const target = el.getAttribute("data-scroll-to");
    if (!target) return;

    const section = document.querySelector(target);
    if (!section) return;

    event.preventDefault();
    
    // Calcular a posição exata do topo da seção
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = rect.top + scrollTop;
    
    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
});

// Modal de Agendamento
const WHATSAPP_NUMBER = "5554996559985";

const modal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const serviceSelect = document.getElementById("serviceSelect"); // Hidden input
const customSelect = document.getElementById("customSelect");
const selectTrigger = document.getElementById("selectTrigger");
const selectValue = document.getElementById("selectValue");
const selectDropdown = document.getElementById("selectDropdown");
const selectOptions = selectDropdown.querySelectorAll(".custom-select__option");
const bookingButtons = document.querySelectorAll(".booking-service[data-booking-service]");
const closeButtons = document.querySelectorAll("[data-modal-close]");
const openModalButton = document.getElementById("openBookingModal");

// Abrir modal quando clicar em "Agendar um ritual"
if (openModalButton) {
  openModalButton.addEventListener("click", () => {
    openModal();
  });
}

// Abrir modal quando clicar em um serviço específico
bookingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const serviceName = button.getAttribute("data-booking-service");
    openModal(serviceName);
  });
});

// Fechar modal
closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

// Fechar modal ao pressionar ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// Custom Select Functionality
if (customSelect && selectTrigger && selectDropdown) {
  // Toggle dropdown
  selectTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    customSelect.classList.toggle("is-open");
    const isOpen = customSelect.classList.contains("is-open");
    selectTrigger.setAttribute("aria-expanded", isOpen);
  });

  // Select option
  selectOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");
      const text = option.textContent;

      // Update hidden input
      serviceSelect.value = value;

      // Update display
      if (value === "") {
        selectValue.textContent = "Selecione o serviço";
        selectValue.classList.remove("has-value");
      } else {
        selectValue.textContent = text;
        selectValue.classList.add("has-value");
      }

      // Update selected state
      selectOptions.forEach((opt) => opt.classList.remove("is-selected"));
      option.classList.add("is-selected");

      // Close dropdown
      customSelect.classList.remove("is-open");
      selectTrigger.setAttribute("aria-expanded", "false");

      // Validate form
      serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Keyboard navigation
    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        option.click();
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("is-open");
      selectTrigger.setAttribute("aria-expanded", "false");
    }
  });

  // Close dropdown on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && customSelect.classList.contains("is-open")) {
      customSelect.classList.remove("is-open");
      selectTrigger.setAttribute("aria-expanded", "false");
    }
  });
}

// Abrir modal
function openModal(serviceName = null) {
  if (serviceName && serviceSelect && selectValue && selectOptions) {
    // Find and select the option
    selectOptions.forEach((option) => {
      if (option.getAttribute("data-value") === serviceName) {
        const text = option.textContent;
        serviceSelect.value = serviceName;
        selectValue.textContent = text;
        selectValue.classList.add("has-value");
        selectOptions.forEach((opt) => opt.classList.remove("is-selected"));
        option.classList.add("is-selected");
      }
    });
  } else if (serviceSelect && selectValue && selectOptions) {
    // Reset to placeholder
    serviceSelect.value = "";
    selectValue.textContent = "Selecione o serviço";
    selectValue.classList.remove("has-value");
    selectOptions.forEach((opt) => opt.classList.remove("is-selected"));
    selectOptions[0].classList.add("is-selected");
  }
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  
  // Close dropdown if open
  if (customSelect) {
    customSelect.classList.remove("is-open");
    if (selectTrigger) {
      selectTrigger.setAttribute("aria-expanded", "false");
    }
  }
  
  // Focar no primeiro input
  const firstInput = bookingForm.querySelector("input[type='text']");
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 100);
  }
}

// Fechar modal
function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  bookingForm.reset();
  
  // Reset custom select
  if (serviceSelect && selectValue && selectOptions) {
    serviceSelect.value = "";
    selectValue.textContent = "Selecione o serviço";
    selectValue.classList.remove("has-value");
    selectOptions.forEach((opt) => opt.classList.remove("is-selected"));
    selectOptions[0].classList.add("is-selected");
  }
  
  // Close dropdown if open
  if (customSelect) {
    customSelect.classList.remove("is-open");
    if (selectTrigger) {
      selectTrigger.setAttribute("aria-expanded", "false");
    }
  }
}

// Atualizar estado visual dos radio buttons
const radioInputs = bookingForm.querySelectorAll('input[type="radio"]');
radioInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    // Remover classe checked de todos
    document.querySelectorAll(".booking-form__radio").forEach((label) => {
      label.classList.remove("is-checked");
    });
    // Adicionar classe ao selecionado
    if (radio.checked) {
      radio.closest(".booking-form__radio").classList.add("is-checked");
    }
  });
});

// Mensagens personalizadas para cada serviço
const serviceMessages = {
  "Massagem Relaxante": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e gostaria de agendar uma sessão de *Massagem Relaxante*.`,
    description: "Busco um momento de relaxamento profundo para aliviar tensões e restaurar o bem-estar.",
    preference: "Tenho preferência pelo período da *{time}*.",
    closing: "Aguardo sua resposta para confirmarmos o melhor horário."
  },
  "Massagem com Pedras Quentes": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e tenho interesse em agendar uma sessão de *Massagem com Pedras Quentes*.`,
    description: "Sinto que meu corpo precisa desse cuidado especial com as pedras aquecidas para aliviar tensões profundas.",
    preference: "Prefiro o período da *{time}*.",
    closing: "Fico no aguardo para combinarmos o melhor momento."
  },
  "Massagem Terapêutica": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e gostaria de agendar uma *Massagem Terapêutica*.`,
    description: "Preciso de um atendimento focado em alívio de dores e tensões musculares.",
    preference: "Tenho preferência pelo período da *{time}*.",
    closing: "Aguardo sua resposta para agendarmos."
  },
  "Reiki": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e tenho interesse em uma sessão de *Reiki*.`,
    description: "Busco harmonização energética e equilíbrio para o meu bem-estar físico e emocional.",
    preference: "Prefiro o período da *{time}*.",
    closing: "Aguardo sua resposta para agendarmos esse momento de cuidado."
  },
  "Cone Hindu": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e gostaria de agendar uma sessão de *Cone Hindu*.`,
    description: "Tenho interesse em experimentar essa terapia para limpeza e relaxamento profundo.",
    preference: "Tenho preferência pelo período da *{time}*.",
    closing: "Aguardo sua resposta para combinarmos o melhor horário."
  },
  "Escalda-pés": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e gostaria de agendar um *Escalda-pés*.`,
    description: "Busco um momento de relaxamento e cuidado especial para os pés.",
    preference: "Prefiro o período da *{time}*.",
    closing: "Aguardo sua resposta para agendarmos."
  },
  "Banho de Lua": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e tenho interesse em agendar um *Banho de Lua*.`,
    description: "Gostaria de cuidar da minha pele com esse tratamento especial de clareamento e hidratação.",
    preference: "Tenho preferência pelo período da *{time}*.",
    closing: "Aguardo sua resposta para combinarmos o melhor horário."
  },
  "Depilação": {
    greeting: "Olá, Tauana!",
    intro: `Meu nome é {name} e gostaria de agendar uma sessão de *Depilação*.`,
    description: "Preciso de um atendimento profissional para depilação.",
    preference: "Prefiro o período da *{time}*.",
    closing: "Aguardo sua resposta para agendarmos."
  }
};

// Função para construir mensagem personalizada
function buildCustomMessage(name, service, timePreference) {
  const template = serviceMessages[service];
  
  if (!template) {
    // Fallback para serviços não mapeados
    return `Olá, Tauana! Meu nome é ${name}. Gostaria de agendar uma sessão de *${service}* no período da *${timePreference}*. Aguardo sua resposta.`;
  }
  
  return `${template.greeting}

${template.intro.replace("{name}", name)}

${template.description}

${template.preference.replace("{time}", timePreference)}

${template.closing}`;
}

// Enviar formulário
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(bookingForm);
  const name = formData.get("name").trim();
  const service = formData.get("service");
  const timePreference = formData.get("timePreference");
  
  if (!name || !service || !timePreference) {
    return;
  }
  
  // Construir mensagem personalizada
  const message = buildCustomMessage(name, service, timePreference);
  
  // Codificar para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Criar link do WhatsApp
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  // Abrir WhatsApp em nova aba
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  
  // Fechar modal
  closeModal();
});

// Player de Áudio Relaxante
const audioPlayer = document.getElementById("audioPlayer");
const audioToggle = document.getElementById("audioToggle");
const audioPrev = document.getElementById("audioPrev");
const audioNext = document.getElementById("audioNext");
const backgroundAudio = document.getElementById("backgroundAudio");

if (audioToggle && backgroundAudio && audioPrev && audioNext) {
  // Lista de músicas para tocar em sequência
  const audioSources = [
    "relaxing_songs/fundo-musical-relaxante-para-meditacao-120658.mp3",
    "relaxing_songs/musica-relaxante-212335.mp3",
    "relaxing_songs/relaxante-2-149197.mp3",
    "relaxing_songs/meditation-relaxing-music-background-320405.mp3",
    "relaxing_songs/relax-in-the-forest-background-music-for-video-9145.mp3",
    "relaxing_songs/relaxante-149079.mp3"
  ];
  
  let currentTrackIndex = 0;
  let wasPlaying = false;

  // Função para carregar música específica
  function loadTrack(index, shouldPlay = false) {
    currentTrackIndex = index;
    backgroundAudio.src = audioSources[currentTrackIndex];
    backgroundAudio.load();
    
    if (shouldPlay) {
      backgroundAudio.play().catch(() => {
        // Ignorar erros de autoplay
      });
    }
  }

  // Função para próxima música
  function loadNextTrack(shouldPlay = false) {
    const nextIndex = (currentTrackIndex + 1) % audioSources.length;
    loadTrack(nextIndex, shouldPlay);
  }

  // Função para música anterior
  function loadPrevTrack(shouldPlay = false) {
    const prevIndex = (currentTrackIndex - 1 + audioSources.length) % audioSources.length;
    loadTrack(prevIndex, shouldPlay);
  }

  // Quando uma música termina, tocar a próxima (se estiver tocando)
  backgroundAudio.addEventListener("ended", () => {
    if (audioToggle.classList.contains("is-playing")) {
      loadNextTrack(true);
    }
  });

  // Botão anterior
  audioPrev.addEventListener("click", () => {
    wasPlaying = !backgroundAudio.paused;
    loadPrevTrack(wasPlaying);
  });

  // Botão próximo
  audioNext.addEventListener("click", () => {
    wasPlaying = !backgroundAudio.paused;
    loadNextTrack(wasPlaying);
  });

  // Toggle play/pause
  audioToggle.addEventListener("click", () => {
    if (backgroundAudio.paused) {
      backgroundAudio.play().then(() => {
        audioToggle.classList.add("is-playing");
        audioToggle.setAttribute("aria-label", "Pausar música relaxante");
      }).catch((error) => {
        console.log("Erro ao reproduzir áudio:", error);
      });
    } else {
      backgroundAudio.pause();
      audioToggle.classList.remove("is-playing");
      audioToggle.setAttribute("aria-label", "Reproduzir música relaxante");
    }
  });

  // Atualizar estado visual quando áudio pausa
  backgroundAudio.addEventListener("pause", () => {
    audioToggle.classList.remove("is-playing");
    audioToggle.setAttribute("aria-label", "Reproduzir música relaxante");
  });

  backgroundAudio.addEventListener("play", () => {
    audioToggle.classList.add("is-playing");
    audioToggle.setAttribute("aria-label", "Pausar música relaxante");
  });

  // Carregar e tocar primeira música automaticamente
  loadTrack(0, true);
  backgroundAudio.volume = 0.4; // Volume moderado (40%)
  
  // Tentar reproduzir automaticamente quando a página carregar
  window.addEventListener("load", () => {
    backgroundAudio.play().then(() => {
      audioToggle.classList.add("is-playing");
      audioToggle.setAttribute("aria-label", "Pausar música relaxante");
    }).catch((error) => {
      // Se autoplay falhar (política do navegador), manter pausado
      console.log("Autoplay bloqueado pelo navegador. Usuário precisa clicar para iniciar.");
      audioToggle.classList.remove("is-playing");
    });
  });
}

// Detectar quando o player está sobre o footer
const audioPlayerWrapper = document.getElementById("audioPlayerWrapper");
const footer = document.querySelector(".footer");

if (audioPlayerWrapper && footer) {
  function checkPlayerPosition() {
    const playerRect = audioPlayerWrapper.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    
    // Verificar se o player está sobre o footer
    const isOverFooter = playerRect.bottom >= footerRect.top && playerRect.top <= footerRect.bottom;
    
    if (isOverFooter) {
      audioPlayerWrapper.classList.add("over-footer");
    } else {
      audioPlayerWrapper.classList.remove("over-footer");
    }
  }
  
  // Verificar posição ao scrollar
  window.addEventListener("scroll", checkPlayerPosition);
  
  // Verificar posição ao redimensionar
  window.addEventListener("resize", checkPlayerPosition);
  
  // Verificar posição inicial
  checkPlayerPosition();
}

