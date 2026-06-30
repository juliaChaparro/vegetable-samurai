import { Router } from "../router/router";

export class MainController {

    private router: Router;

    constructor() {
        this.router = new Router();
    }

    public start() {
        this.router.navigate("menu");
    }

}