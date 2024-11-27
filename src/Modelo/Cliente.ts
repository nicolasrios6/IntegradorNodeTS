export class Cliente{
    id: number;
    cuit: String;
    razonSocial: String;
    
    constructor(id: number, cuit: String, razonSocial: String){
        this.id=id;
        this.cuit=cuit;
        this.razonSocial=razonSocial;
    }

}