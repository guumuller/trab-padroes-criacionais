import { Request, Response } from 'express';
import { ProdutoService } from '../service/ProdutoService';

export class ProdutoController {
  private service: ProdutoService;

  constructor(service: ProdutoService) {
    this.service = service;
  }

  inserir = async (req: Request, res: Response): Promise<void> => {
    const { nome, categoria, preco } = req.body;
    try{ 
        const newProduct = await this.service.inserir({ nome, categoria, preco });
        res.status(201).json(newProduct);
    }
    catch(err:any) {
      res.status(400).json({ message: 'Erro ao inserir produto', err });

    }
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const products = await this.service.listar();
    res.json(products);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const produto = await this.service.buscarPorId(id);
        res.json(produto);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const { nome, categoria, preco } = req.body;

    try{ 
        const produtoAtualizado = await this.service.atualizar(id, { nome, categoria, preco });
        res.json(produtoAtualizado);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };

  deletar = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{ 
        const produto = await this.service.deletar(id);
        res.json(produto);
    } catch (err: any) {
        res.status(err.id).json({ error: err.msg });
    }
  };
}