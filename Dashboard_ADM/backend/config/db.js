const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Endereço do banco de dados
  user: 'root', // Usuário do MySQL
  password: '', // Senha do MySQL
  database: 'colaboradores_db' // Nome do banco de dados
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

module.exports = connection;