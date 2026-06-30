import { Routes } from "../router/routes";

export class GameController{

    constructor(private router){}

    show(){

       //inicializar();

    }

    hide(){

       // pararMotorDoJogo();

    }

    gameOver(){

        this.router.navigate(Routes.GAMEOVER);

    }

}