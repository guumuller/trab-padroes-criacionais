import { Repository } from 'typeorm';
import { Produto } from '../model/Produto';
import { Categoria } from '../model/Categoria';
import { DataSourceSingleton } from '../database';
import { ValidationStrategy } from '../strategy/ValidationStrategy';
import { ProdutoValidationStrategy } from '../strategy/ProdutoValidationStrategy';
import { ProductSubject } from '../observer/ProductSubject';

export class ProdutoService {
  private repository: Repository<Produto>;
  private validationStrategy: ValidationStrategy;
  private productSubject: ProductSubject;

  constructor(repository: Repository<Produto>) {
    this.repository = repository;
    this.validationStrategy = new ProdutoValidationStrategy();
    this.productSubject = new ProductSubject();
  }

  public setValidationStrategy(strategy: ValidationStrategy): void {
    this.validationStrategy = strategy;
  }

  public attachObserver(observer: any): void {
    this.productSubject.attach(observer);
  }

  async inserir(produto: Produto): Promise<Produto> {
    // Usando Strategy Pattern para validação
    const validation = this.validationStrategy.validate(produto);
    if (!validation.isValid) {
      throw { id: 400, msg: `Dados inválidos: ${validation.errors.join(', ')}` };
    }
  
    const categoriaRepo = DataSourceSingleton.getInstance().getRepository(Categoria);
  
    const categoriaEncontrada = await categoriaRepo.findOneBy({ id: produto.categoria!.id });
  
    if (!categoriaEncontrada) {
      throw { id: 400, msg: `Categoria com id ${produto.categoria!.id} não encontrada` };
    }
  
    produto.categoria = categoriaEncontrada;
  
    const produtoSalvo = await this.repository.save(produto);
    
    // Usando Observer Pattern para notificar sobre a criação
    this.productSubject.notify(produtoSalvo, 'created');
    
    return produtoSalvo;
  }
  

  async buscarPorId(id: number): Promise<Produto> {
    let produto = await this.repository.findOneBy({id: id});
    if(!produto) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }
    return produto;
  }

  async atualizar(id: number, produto: Produto): Promise<Produto> {
    // Usando Strategy Pattern para validação
    const validation = this.validationStrategy.validate(produto);
    if (!validation.isValid) {
      throw { id: 400, msg: `Dados inválidos: ${validation.errors.join(', ')}` };
    }
  
    const categoriaRepo = DataSourceSingleton.getInstance().getRepository(Categoria);
    const categoriaEncontrada = await categoriaRepo.findOneBy({ id: produto.categoria!.id });
  
    if (!categoriaEncontrada) {
      throw { id: 400, msg: `Categoria com id ${produto.categoria!.id} não encontrada` };
    }
  
    const produtoAlt = await this.repository.findOneBy({ id });
  
    if (!produtoAlt) {
      throw { id: 404, msg: 'Produto não encontrado' };
    }
  
    produtoAlt.nome = produto.nome;
    produtoAlt.preco = produto.preco;
    produtoAlt.categoria = categoriaEncontrada;
  
    const produtoAtualizado = await this.repository.save(produtoAlt);
    
    // Usando Observer Pattern para notificar sobre a atualização
    this.productSubject.notify(produtoAtualizado, 'updated');
    
    return produtoAtualizado;
  }
  

  async deletar(id: number): Promise<Produto> {
    let produtoDeletado = await this.repository.findOneBy({id: id});
    if (!produtoDeletado) {
        throw ({id: 404, msg: "Produto nao encontrado"});    
    }    
    else {
      await this.repository.remove(produtoDeletado);
      
      // Usando Observer Pattern para notificar sobre a remoção
      this.productSubject.notify(produtoDeletado, 'deleted');
      
      return produtoDeletado;
    }
  }

  async listar(): Promise<Produto[]> {
    return await this.repository.find();
  }
  
}