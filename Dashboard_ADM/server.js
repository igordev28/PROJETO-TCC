const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'colaboradores_db'
});

// Conecte-se ao banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Middleware para servir arquivos estáticos do diretório 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Rota GET para o caminho raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Rota POST para criar colaborador
app.post('/api/criar-colaborador', (req, res) => {
  const { primeiroNome, ultimoNome, numeroContato, email, nomeUsuario, senha } = req.body;

  // Valide os dados recebidos
  if (!primeiroNome || !ultimoNome || !numeroContato || !email || !nomeUsuario || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Consulta SQL para inserir os dados
  const query = 'INSERT INTO colaboradores (primeiro_nome, ultimo_nome, numero_contato, email, nome_usuario, senha) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [primeiroNome, ultimoNome, numeroContato, email, nomeUsuario, senha];

  db.execute(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir colaborador: ' + err.stack);
      return res.status(500).json({ error: 'Erro ao criar colaborador.' });
    }
    res.status(201).json({ message: 'Colaborador criado com sucesso!' });
  });
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
