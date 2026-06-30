import { Routes } from "../router/routes";

export class MenuController{

    constructor(private router){}

    show(){

        document.getElementById("tela-menu")!.style.display = "flex";

    }

    hide(){

        document.getElementById("tela-menu")!.style.display = "none";

    }

    jogar(){

        this.router.navigate(Routes.GAME);

    }

}