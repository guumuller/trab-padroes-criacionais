import express from 'express';
import { ProdutoService } from './service/ProdutoService';
import { ProdutoController } from './controller/ProdutoController';
import { Produto } from './model/Produto';
import { Usuario } from './model/Usuario';
import { UsuarioService } from './service/UsuarioService';
import { UsuarioController } from './controller/UsuarioController';
import { LoginService } from './service/LoginService';
import { LoginController } from './controller/LoginController';
import { DataSourceSingleton } from './database';
import { usuarioRotas } from './routers/UsuarioRouter';
import { produtoRotas } from './routers/ProdutoRouter';
import { TokenMiddleware } from './middleware/TokenMiddleware';
import { LoggingObserver } from './observer/LoggingObserver';
import { NotificationObserver } from './observer/NotificationObserver';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Permite requisições apenas deste domínio
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
    credentials: true, // Permite cookies e credenciais
};
app.use(express.json());

const dataSource = DataSourceSingleton.getInstance();
dataSource.initialize()
    .then(() => console.log("Banco conectado!"))
    .catch((err) => console.error("Erro ao conectar com banco:", err));

//Produto
const produtoRepository = DataSourceSingleton.getInstance().getRepository(Produto);
const produtoService = new ProdutoService(produtoRepository);

// Configurando Observers para produtos (Observer Pattern)
const loggingObserver = new LoggingObserver();
const notificationObserver = new NotificationObserver();
produtoService.attachObserver(loggingObserver);
produtoService.attachObserver(notificationObserver);

const produtoController = new ProdutoController(produtoService);

//Usuario
const usuarioRepository = DataSourceSingleton.getInstance().getRepository(Usuario);
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

//Login
const loginService = new LoginService(usuarioRepository);
const loginController = new LoginController(loginService);

//Midleware TokenMiddleware
const tokenMiddleware = new TokenMiddleware(loginService)

app.use(cors(corsOptions));

// Routes
app.post('/api/login', loginController.realizarLogin);
app.use('/api/usuarios', usuarioRotas(usuarioController));

app.use(tokenMiddleware.verificarAcesso.bind(tokenMiddleware));
app.use('/api/produtos', produtoRotas(produtoController));

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));