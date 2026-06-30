/** 
import { Routes } from "./routes";

import { MenuController } from "../controllers/MenuController";
import { GameController } from "../controllers/GameController";
import { OptionsController } from "../controllers/OptionsController";
import GameOverController from "../controllers/GameOverController";

export class Router {

    private menu = new MenuController(this);
    private game = new GameController(this);
    private options = new OptionsController(this);
    private gameOver = new GameOverController(this);

    public navigate(route: Routes | string) {

        this.hideAll();

        switch(route){

            case Routes.MENU:
                this.menu.show();
                break;

            case Routes.GAME:
                this.game.show();
                break;

            case Routes.OPTIONS:
                this.options.show();
                break;

            case Routes.GAMEOVER:
                this.gameOver.show();
                break;
        }

    }

    private hideAll(){

        this.menu.hide();
        this.game.hide();
        this.options.hide();
        this.gameOver.hide();

    }

}

*/