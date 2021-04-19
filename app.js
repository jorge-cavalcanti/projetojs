const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ModeloPessoa = require('./models/pessoa');
const methodOverride = require('method-override');

//conexão com o banco de dados:
mongoose.connect('mongodb://localhost:27017/cadastro-pessoas', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//teste para conferir se conectou:
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

//colocando o servidor express pra rodar:
const app = express();

//definindo ejs como padrão para as views:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

//rota para a página que lista todos os elementos do banco de dados (index.ejs):
app.get('/pessoas', async (req, res) => {
    const pessoas = await ModeloPessoa.find({});
    res.render('pessoas/index', {pessoas})
})

//rota para a página de criação de novas pessoas(new.ejs):
app.get('/pessoas/new', (req, res) => {
    res.render('pessoas/new');
})

//função para criar efetivamente as novas pessoas
app.post('/pessoas', async(req,res) =>{
    const pessoa = new ModeloPessoa(req.body.pessoa);
    await pessoa.save();
    res.redirect(`/pessoas/${pessoa._id}`)
})

//rota para show.ejs
app.get('/pessoas/:id', async(req,res) => {
    const pessoa = await ModeloPessoa.findById(req.params.id)
    res.render('pessoas/show', {pessoa});
})

app.get('/pessoas/:id/edit', async(req,res) =>{
    const pessoa = await ModeloPessoa.findById(req.params.id)
    res.render('pessoas/edit', {pessoa});
})

app.put('/pessoas/:id', async(req,res) => {
    const {id} = req.params;
    const pessoa = await ModeloPessoa.findByIdAndUpdate(id,{...req.body.pessoa})
    res.redirect(`/pessoas/${pessoa._id}`)
})

app.delete('/pessoas/:id', async(req,res) => {
    const { id } = req.params;
    await ModeloPessoa.findByIdAndDelete(id);
    res.redirect('/pessoas');
})

//teste se a conexão com o servidor funcionou, ouvindo a porta 3000
app.listen(3000, () => {
    console.log('Serving on port 3000')
})