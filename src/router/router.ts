import { Routes } from "./routes";

export class Router {

    public navigate(route: Routes) {

        switch(route){

            case Routes.MENU:
                console.log("Menu");
                break;

            case Routes.GAME:
                console.log("Jogo");
                break;

            case Routes.OPTIONS:
                console.log("Opções");
                break;

            case Routes.GAMEOVER:
                console.log("Game Over");
                break;
        }

    }

}