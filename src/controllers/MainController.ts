import { Router } from "../router/router";
import { Routes } from "../router/routes";

export class MainController {

    private router: Router;

    constructor() {
        this.router = new Router();
    }

    public start() {
        this.router.navigate(Routes.MENU);
    }

}