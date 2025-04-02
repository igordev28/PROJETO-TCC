const sideLinks = document.querySelectorAll(".sidebar .side-menu li a:not(.logout)");

sideLinks.forEach((item) => {
  const li = item.parentElement;
  item.addEventListener("click", () => {
    sideLinks.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

const menuBar = document.querySelector(".content nav .bx.bx-menu");
const sideBar = document.querySelector(".sidebar");

menuBar.addEventListener("click", () => {
  sideBar.classList.toggle("close");
});

const searchBtn = document.querySelector(".content nav form .form-input button");
const searchBtnIcon = document.querySelector(".content nav form .form-input button .bx");
const searchForm = document.querySelector(".content nav form");

searchBtn.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchBtnIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchBtnIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth < 768) {
    sideBar.classList.add("close");
  } else {
    sideBar.classList.remove("close");
  }

  if (window.innerWidth > 576) {
    searchBtnIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const toggler = document.getElementById("theme-toggle");

toggler.addEventListener("change", function () {
  this.checked ? document.body.classList.add("dark") : document.body.classList.remove("dark");
});

// Função para carregar o conteúdo da página
async function loadPage(page) {
  try {
    const response = await fetch(page); // Busca o conteúdo da página
    const html = await response.text(); // Converte a resposta em texto (HTML)
    document.getElementById('content').innerHTML = html; // Insere o HTML no container
  } catch (error) {
    console.error('Erro ao carregar a página:', error);
    document.getElementById('content').innerHTML = '<p>Erro ao carregar a página.</p>'; // Mensagem de erro
  }
}

// Adiciona um evento de clique a cada item do menu
const menuItems = document.querySelectorAll('.side-menu li a');
menuItems.forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault(); // Evita o comportamento padrão do link
    const page = this.getAttribute('data-page'); // Obtém o nome da página
    if (page) {
      loadPage(page); // Carrega a página correspondente
    }
  });
});

// Botão "Início"
const inicioButton = document.getElementById('inicio');
if (inicioButton) {
  inicioButton.addEventListener('click', function (e) {
    e.preventDefault(); // Evita o comportamento padrão do link
    loadPage('dashboard.html'); // Carrega o conteúdo inicial
  });
}

// Carrega a página inicial ao abrir o site
loadPage('dashboard.html');

// Envio de formulário para criar colaborador
document.getElementById("form-colaborador").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  const formData = new FormData(this);
  console.log("Enviando dados:", formData); // Verifique no console os dados que estão sendo enviados

  try {
    const response = await fetch("/api/colaboradores/criar", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log(result); // Verifique a resposta do servidor

    if (response.ok) {
      alert("Colaborador cadastrado com sucesso!");
      this.reset(); // Limpa o formulário após o envio
    } else {
      throw new Error(result.error || "Erro ao cadastrar colaborador.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao cadastrar colaborador. Verifique o console.");
  }
});

// Função para carregar colaboradores na tabela
function carregarColaboradores() {
  fetch('http://localhost:3000/api/colaboradores')
    .then(response => response.json())
    .then(data => {
      const tabela = document.getElementById('tabela-colaboradores').getElementsByTagName('tbody')[0];
      tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

      data.forEach(colaborador => {
        const row = tabela.insertRow();
        row.insertCell().textContent = colaborador.nome;
        row.insertCell().textContent = colaborador.email;
        row.insertCell().textContent = colaborador.telefone;
        row.insertCell().textContent = colaborador.turma;
        row.insertCell().textContent = colaborador.sala;
        row.insertCell().textContent = new Date(colaborador.data).toLocaleDateString();
        row.insertCell().textContent = colaborador.horario;
        const fotoCell = row.insertCell();
        if (colaborador.foto) {
          const img = document.createElement('img');
          img.src = colaborador.foto;
          img.alt = 'Foto do Colaborador';
          img.style.width = '50px';
          fotoCell.appendChild(img);
        }
      });
    })
    .catch(error => {
      console.error('Erro ao carregar colaboradores:', error);
    });
}

// Carrega os colaboradores ao abrir a página
carregarColaboradores();

// Função para carregar o perfil do colaborador
function carregarPerfil(id) {
  fetch(`http://localhost:3000/api/colaboradores/${id}`)
    .then(response => response.json())
    .then(colaborador => {
      const perfilDiv = document.getElementById('perfil-colaborador');
      perfilDiv.innerHTML = `
        <p><strong>Nome:</strong> ${colaborador.nome}</p>
        <p><strong>Email:</strong> ${colaborador.email}</p>
        <p><strong>Telefone:</strong> ${colaborador.telefone}</p>
        <p><strong>Turma:</strong> ${colaborador.turma}</p>
        <p><strong>Sala:</strong> ${colaborador.sala}</p>
        <p><strong>Data:</strong> ${new Date(colaborador.data).toLocaleDateString()}</p>
        <p><strong>Horário:</strong> ${colaborador.horario}</p>
        ${colaborador.foto ? `<img src="${colaborador.foto}" alt="Foto do Colaborador" style="width: 100px;">` : ''}
      `;
    })
    .catch(error => {
      console.error('Erro ao carregar perfil:', error);
    });
}

// Verifica se há um ID na URL e carrega o perfil correspondente
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
if (id) {
  carregarPerfil(id);
}

// Função para carregar horários
function carregarHorarios() {
  fetch('http://localhost:3000/api/colaboradores')
    .then(response => response.json())
    .then(data => {
      const tabela = document.getElementById('tabela-horarios').getElementsByTagName('tbody')[0];
      tabela.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

      data.forEach(colaborador => {
        const row = tabela.insertRow();
        row.insertCell().textContent = colaborador.nome;
        row.insertCell().textContent = new Date(colaborador.data).toLocaleDateString();
        row.insertCell().textContent = colaborador.horario;
      });
    })
    .catch(error => {
      console.error('Erro ao carregar horários:', error);
    });
}

document.getElementById("profile-picture").addEventListener("change", function(event) {
  const file = event.target.files[0];

  if (file) {
      // Exibe o nome do arquivo, se necessário
      document.getElementById("file-name").textContent = file.name;
  } else {
      // Se nenhum arquivo for escolhido, mantém o texto padrão
      document.getElementById("file-name").textContent = 'Nenhum arquivo escolhido';
  }
});


// Carrega os horários ao abrir a página
carregarHorarios();
