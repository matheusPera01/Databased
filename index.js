import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); 
app.set('views', path.join(__dirname, 'public'));

async function init() {
    try {
        const mysqli = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        app.post('/cadastro', async (req, res) => {
            const {nome, email, senha} = req.body;
            try {
                const [results] = await mysqli.execute('INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
                console.log("Inserção feita com sucesso");
                res.redirect("/login.html");
            } catch (err) {
                console.log("Deu erro ao fazer a inserção", err);
            }
        });

        app.post('/login', async (req, res) => {
            const {email, senha} = req.body;
            try {
                const [rows] = await mysqli.execute('SELECT * FROM usuario WHERE email = ? AND senha = ?', [email, senha]);
                if (rows.length > 0) {
                    console.log("Login bem sucedido");
                    res.render('main.mustache', { email: email }); 
                } else {
                    console.log("A senha ou email está errado");
                }
            } catch (err) {
                console.log("Deu erro ao fazer login", err);
            }
        });

    } catch (err) {
        console.log("Deu erro ao tentar conectar ao banco de dados", err);
    }
}

init();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});
