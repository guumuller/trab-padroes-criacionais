import { Repository } from 'typeorm';
import { Produto } from '../model/Produto';
import { Categoria } from '../model/Categoria';
import { DataSourceSingleton } from '../database';

export class ProdutoService {
  private repository: Repository<Produto>;

  constructor(repository: Repository<Produto>) {
    this.repository = repository;
  }

  async inserir(produto: Produto): Promise<Produto> {
    if (!produto.nome || !produto.categoria || !produto.categoria.id || !produto.preco) {
      throw { id: 400, msg: 'Faltam dados obrigatórios' };
    }
  
    const categoriaRepo = DataSourceSingleton.getInstance().getRepository(Categoria);
  
    const categoriaEncontrada = await categoriaRepo.findOneBy({ id: produto.categoria.id });
  
    if (!categoriaEncontrada) {
      throw { id: 400, msg: `Categoria com id ${produto.categoria.id} não encontrada` };
    }
  
    produto.categoria = categoriaEncontrada;
  
    return await this.repository.save(produto);
  }
  

  async buscarPorId(id: number): Promise<Produto> {
    let produto = await this.repository.findOneBy({id: id});
    if(!produto) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }
    return produto;
  }

  async atualizar(id: number, produto: Produto): Promise<Produto> {
    if (!produto.nome || !produto.categoria || !produto.categoria.id || !produto.preco) {
      throw { id: 400, msg: 'Faltam dados obrigatórios' };
    }
  
    const categoriaRepo = DataSourceSingleton.getInstance().getRepository(Categoria);
    const categoriaEncontrada = await categoriaRepo.findOneBy({ id: produto.categoria.id });
  
    if (!categoriaEncontrada) {
      throw { id: 400, msg: `Categoria com id ${produto.categoria.id} não encontrada` };
    }
  
    const produtoAlt = await this.repository.findOneBy({ id });
  
    if (!produtoAlt) {
      throw { id: 404, msg: 'Produto não encontrado' };
    }
  
    produtoAlt.nome = produto.nome;
    produtoAlt.preco = produto.preco;
    produtoAlt.categoria = categoriaEncontrada;
  
    return await this.repository.save(produtoAlt);
  }
  

  async deletar(id: number): Promise<Produto> {
    let produtoDeletado = await this.repository.findOneBy({id: id});
    if (!produtoDeletado) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }    
    else {
      await this.repository.remove(produtoDeletado);
      return produtoDeletado;
    }
  }

  async listar(): Promise<Produto[]> {
    return await this.repository.find();
  }
  
}