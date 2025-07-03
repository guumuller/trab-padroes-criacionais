import { Repository } from 'typeorm';
import { Usuario } from '../model/Usuario';
import { ValidationStrategy } from '../strategy/ValidationStrategy';
import { UsuarioValidationStrategy } from '../strategy/UsuarioValidationStrategy';

export class UsuarioService {
  private repository: Repository<Usuario>;
  private validationStrategy: ValidationStrategy;

  constructor(repository: Repository<Usuario>) {
    this.repository = repository;
    this.validationStrategy = new UsuarioValidationStrategy();
  }

  public setValidationStrategy(strategy: ValidationStrategy): void {
    this.validationStrategy = strategy;
  }

  async inserir(usuario: Usuario): Promise<Usuario> {
    // Usando Strategy Pattern para validação
    const validation = this.validationStrategy.validate(usuario);
    if (!validation.isValid) {
      throw { id: 400, msg: `Dados inválidos: ${validation.errors.join(', ')}` };
    }
    
    return await this.repository.save(usuario);
  }

  async listar(): Promise<Usuario[]> {
    return await this.repository.find();
  }
}
