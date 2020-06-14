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
        this.set_weight(15, 1, 4, 10, 2, 0, -15, 0, 0, 0, 0, 0);
    }

    SBE(board){
        var chess1, chess2;
        if (!board.round){
            chess1 = board.black;
            chess2 = board.white;
        }
        else{
            chess1 = board.white;
            chess2 = board.black;
        }
        
        let t = this.get_board_description(board, chess1);
        let corner = t[0], edge = t[1], inner_point = t[2], center = t[3], other = t[4];

        t = this.get_board_description(board, chess2);
        let opp_corner = t[0], opp_edge = t[1], opp_inner_point = t[2], opp_center = t[3], opp_other = t[4];

        return (this.corner_weight * corner + 
                this.edge_weight * edge + 
                this.inner_point_weight * inner_point + 
                this.center_weight * center + 
                this.other_weight * other + 
                this.size_weight * chess1.length + 
                this.opp_corner_weight * opp_corner + 
                this.opp_edge_weight * opp_edge + 
                this.opp_inner_point_weight * opp_inner_point + 
                this.opp_center_weight * opp_center + 
                this.opp_other_weight * opp_other + 
                this.opp_size_weight * chess2.length);
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

    get_board_description(board, chess){
        let corner = 0, edge = 0, inner_point = 0, center = 0, other = 0;
        //角點
        if (board.search_point_array(chess, 0, 0)){
            corner++;
        }
        if (board.search_point_array(chess, 0, 7)){
            corner++;
        }
        if (board.search_point_array(chess, 7, 0)){
            corner++;
        }
        if (board.search_point_array(chess, 7, 7)){
            corner++;
        }

        //中心點
        if (board.search_point_array(chess, 3, 3)){
            center++;
        }
        if (board.search_point_array(chess, 3, 4)){
            center++;
        }
        if (board.search_point_array(chess, 4, 3)){
            center++;
        }
        if (board.search_point_array(chess, 4, 4)){
            center++;
        }

        //除了角點的邊邊的點
        for (let i = 1; i < 7; i++){
            if (board.search_point_array(chess, 0, i)){ //上邊界
                edge++;
            }
            if (board.search_point_array(chess, 7, i)){ //下邊界
                edge++;
            }
            if (board.search_point_array(chess, i, 0)){ //左邊界
                edge++;
            }
            if (board.search_point_array(chess, i, 7)){ //右邊界
                edge++;
            }
        }
        
        
        //中心四點外面那圈
        for (let i = 2; i < 6; i++){
            if (board.search_point_array(chess, 2, i)){ //上邊界
                inner_point++;
            }
            if (board.search_point_array(chess, 5, i)){ //下邊界
                inner_point++;
            }
            if (board.search_point_array(chess, i, 2)){ //左邊界
                inner_point++;
            }
            if (board.search_point_array(chess, i, 5)){ //右邊界
                inner_point++;
            }
        }

        //中心四點外面那圈的角點會重複計算，所以有存在的話要多扣1
        if (board.search_point_array(chess, 2, 2)){ //上邊界
            inner_point--;
        }
        if (board.search_point_array(chess, 5, 2)){ //下邊界
            inner_point--;
        }
        if (board.search_point_array(chess, 2, 5)){ //左邊界
            inner_point--;
        }
        if (board.search_point_array(chess, 5, 5)){ //右邊界
            inner_point--;
        }

        //其他點
        other = chess.length - corner - edge - inner_point - center;

        return [corner, edge, inner_point, center, other];
    }

    set_weight(corner_weight, edge_weight, inner_point_weight, center_weight, other_weight, size_weight
		, opp_corner_weight, opp_edge_weight, opp_inner_point_weight, opp_center_weight, opp_other_weight, opp_size_weight) {

		this.corner_weight = corner_weight;
		this.edge_weight = edge_weight;
		this.inner_point_weight = inner_point_weight;
		this.center_weight = center_weight;
		this.other_weight = other_weight;
		this.size_weight = size_weight;

		this.opp_corner_weight = opp_corner_weight;
		this.opp_edge_weight = opp_edge_weight;
		this.opp_inner_point_weight = opp_inner_point_weight;
		this.opp_center_weight = opp_center_weight;
		this.opp_other_weight = opp_other_weight;
		this.opp_size_weight = opp_size_weight;
    }
    
    set_level_limit(level_limit) {
		this.level_limit = level_limit;
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