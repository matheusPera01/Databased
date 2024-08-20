import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import mustacheExpress from 'mustache-express';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); 
app.set('views', path.join(__dirname, 'public'));

dotenv.config();

async function init() {
    try{
        const mysqli = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "bd_test",
        });

        app.post('/cadastro', async (req, res) => {
            const {nome, email, senha} = req.body;
            try{
                const [results] = await mysqli.execute('INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
                console.log("Inserção feita com sucesso");
                res.redirect("/login.html")
            }
            catch(err){
                console.log("deu erro ao fazer a inserção", err)
            }
        })
        app.post('/login', async (req, res) => {
            const {email, senha} = req.body;
            try{
                const [rows] = await mysqli.execute('SELECT * FROM usuario WHERE email = ? AND senha = ?', [email, senha]);
                if(rows.length > 0) {
                    console.log("login bem sucedido")
                    console.log(email)
                    res.render('main.mustache', { email: email }); 
                   
                }
                else{
                    console.log("A senha ou email esta errado")
                }
            }
            catch(err){
                console.log("deu erro ao fazer login")
            }
        })


    }
    catch(err){
        console.log("deu erro ao tentar conectar ao banco de dados", err)
    }
};

init();

app.listen(3000, () => {
    console.log("O servidor esta rodando na porta 3000");
});
console.log('Host:', 'roundhouse.proxy.rlwy.net');
console.log('User:', 'root');
console.log('Database:', 'railway');
console.log('Port:', 48116);
