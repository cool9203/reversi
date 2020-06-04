class reversiAI{
    constructor(color, level_limit){
        if (typeof(color) == "string"){
            if (color.toLowerCase() == "black")
                this.color = true;
            else if (color.toLowerCase() == "white")
                this.color = false;
            else
                throw new Error("round error");
        }else
            this.color = color;

        this.level_limit = level_limit;
    }

    SBE(board){
        var chess;
        if (!board.round)
            chess = board.black;
        else
            chess = board.white;
        return chess.length;
    }

    get_next(board){
        var game_tree = [];
        var number = [];

        board.get_step();

        for (let i = 0; i < board.step.length; i++){
            let temp = new reversi(board);
            temp.filp(board.step[i]);
            temp.round = !temp.round;
            game_tree.push(temp);
        }

        for (let i = 0; i < game_tree.length; i++)
            number.push(this.dfs(game_tree[i], 1, false, -99999, 99999));
        
        var m = number.findIndex((e) => e==this.max(number));
        board.get_step();
        return board.step[m];
    }

    dfs(board, level, minimax, a, b){
        if (level > this.level_limit)
            return this.SBE(board);

        var game_tree = [];
        var number = [];

        if (minimax)
            number.push(a);
        else
            number.push(b);

        board.get_step();

        if (board.step.length == 0 || (board.black.length + board.white.length) == 64)
            return 0;
        
        for (let i = 0; i < board.step.length; i++){
            let temp = new reversi(board);
            temp.filp(board.step[i]);
            temp.round = !temp.round;
            game_tree.push(temp);
        }

        for (let i = 0; i < game_tree.length; i++){
            number.push(this.dfs(game_tree[i], level + 1, !minimax, a, b));
            if (minimax)
                a = this.max(number);
            else
                b = this.min(number);

            if (a >= b)
                break;
        }

        if (minimax)
            return this.max(number);
        else
            return this.min(number);
    }

    max(arr){
        var m = arr[0];
        for (let i = 0; i < arr.length; i++){
            if (arr[i] > m)
                m = arr[i];
        }
        return m;
    }

    min(arr){
        var m = arr[0];
        for (let i = 0; i < arr.length; i++){
            if (arr[i] < m)
                m = arr[i];
        }
        return m;
    }
}