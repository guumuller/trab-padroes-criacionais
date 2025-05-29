import { NextFunction, Request, Response } from "express";
import { LoginService } from "../service/LoginService";

export class TokenMiddleware{
    private service: LoginService;

    constructor(service: LoginService) {
        this.service = service;
    }

    async verificarAcesso(req: Request, res: Response, next: NextFunction){
        let token = req.get("Token");
        if(!token) {
            res.status(401).json({error: "Nenhum token informado!"});
        }
        else {
            try{
                console.log("Validar Token ", token);
                this.service.validarToken(token);
                console.log("Token validado!");
                next();        
            }
            catch(err:any) {
                console.log(err);
                res.status(err.id).json({ error: err.msg });
            }
        }
    }
}