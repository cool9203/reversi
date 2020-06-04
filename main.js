var board = document.querySelector("#reversi_board");
for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
        board.innerHTML += `<img class=\"board\" id=\"index${i.toString()}${j.toString()}\" src=\"./empty.jpg\" onclick=\"run(${i},${j})\">`;
    }
    board.innerHTML += "<br>";
}

function show_index(i, j){
    alert(`${i}, ${j}`);
}

class POINT{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    equal(point){
        return this.x == point.x && this.y == point.y;
    }

    static equal(p1, p2){
        return p1.x == p2.x && p1.y == p2.y;
    }

    add(x, y){
        if (arguments.length === 1){
            y = x.y;
            x = x.x;
        }
        this.x += x;
        this.y += y;
    }

    static add(p1, p2){
        return new POINT(p1.x + p2.x, p1.y + p2.y);
    }
}


class reversi{
    constructor(round){
        if (this.reset(round) == -1)
            throw new Error("round error");
    }

    get_step(){
        this.step = [];
        var chess;
        if (this.round)
            chess = this.black;
        else
            chess = this.white;

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                let temp = new POINT(i, j);
                if (this.is_empty(temp) && this.check_chess(chess, temp))
                    this.step.push(temp);
            }
        }
    }

    filp(p){
        var chess1, chess2;
        if (this.round){
            chess1 = this.black;
            chess2 = this.white;
        }else{
            chess1 = this.white;
            chess2 = this.black;
        }

        this.filp_chess = [];
        this.check_chess(chess1, p);
        chess1.push(p);
        for (let i = 0; i < this.filp_chess.length; i++){
            let e = this.filp_chess[i];
            if (!this.search_point_array(chess1, e))
                chess1.push(e);
            this.delete_point_array(chess2, e);
        }
        this.filp_chess = [];
    }

    check_chess(chess, p){
        var flag = false;
        for (let i = 0; i < chess.length; i++){
            let delta_x = Math.abs(chess[i].x - p.x);
            let delta_y = Math.abs(chess[i].y - p.y);
            let temp = [];
            if ((delta_x > 1 || delta_y > 1) && this.calculate_slope(chess[i], p) != -1 && this.check_path(chess[i], p, temp)){
                for (let i = 0; i < temp.length; i++)
                    this.filp_chess.push(temp[i]);
                flag = true;
            }
        }
        return flag;
    }

    check_path(p1, p2, filp_chess){
        var chess;
        if (!this.round)
            chess = this.black;
        else
            chess = this.white;

        var offset = this.get_offset(p1, p2);
        var point = new POINT(p1.x, p1.y);
        while(true){
            point.add(offset);
            if (POINT.equal(point, p2))
                break;
            if (!this.search_point_array(chess, point))
                return false;
            else
                filp_chess.push(new POINT(point.x, point.y));
        }
        return true;
    }

    is_empty(point){
        return !(this.search_point_array(this.white, point) || this.search_point_array(this.black, point));
    }

    calculate_slope(p1, p2){
        var _x = (p2.x - p1.x);
        var _y = (p2.y - p1.y);
        var m = (_y / _x);

        if (_x == 0.0)
            return 0;
        else if (_y == 0.0)
            return 1;
        else if (m == 1.0)
            return 2;
        else if (m == -1.0)
            return 3;
        else
            return -1;
    }

    get_offset(p1, p2){
        var x, y;
        if (p1.x == p2.x)
            x = 0;
        else
            x = (p2.x - p1.x) / Math.abs(p2.x - p1.x);

        if (p1.y == p2.y)
            y = 0;
        else
            y = (p2.y - p1.y) / Math.abs(p2.y - p1.y);

        return new POINT(x, y);
    }

    show_map(){
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                document.querySelector(`#index${i.toString()}${j.toString()}`).src="./empty.jpg"
            }
        }
        var black = 0;
        var white = 0;
        for (let i = 0; i<this.black.length; i++){
            document.querySelector(`#index${this.black[i].x}${this.black[i].y}`).src="./black.jpg"
            black += 1;
        }
        for (let i = 0; i<this.white.length; i++){
            document.querySelector(`#index${this.white[i].x}${this.white[i].y}`).src="./white.jpg"
            white += 1;
        }
        for (let i = 0; i<this.step.length; i++){
            document.querySelector(`#index${this.step[i].x}${this.step[i].y}`).src="./step.jpg"
        }
        document.querySelector("#black_size").innerHTML = black;
        document.querySelector("#white_size").innerHTML = white;
    }

    search_point_array(arr, x, y){
        if (arguments.length === 2){
            y = x.y;
            x = x.x;
        }
        for (let i = 0; i < arr.length; i++){
            if (arr[i].x == x && arr[i].y == y)
                return true;
        }
        return false;
    }

    delete_point_array(arr, point){
        for (let i = 0; i < arr.length; i++){
            if (arr[i].x == point.x && arr[i].y == point.y){
                arr.splice(i, 1);
                return;
            }
        }
    }

    reset(round){
        if (round.toLowerCase() == "black")
            this.round = true;
        else if (round.toLowerCase() == "white")
            this.round = false;
        else
            return -1;

        this.black = [];
        this.white = [];
        this.step = [];
        this.filp_chess = [];
        this.black.push(new POINT(3, 4));
        this.black.push(new POINT(4, 3));
        this.white.push(new POINT(3, 3));
        this.white.push(new POINT(4, 4));
    }
}

var r;

function run(i ,j){
    if ((r.black.length + r.white.length) == 64)
        return;
    r.get_step();
    if (r.step.length > 0){
        r.filp(new POINT(i ,j));
    }else{
        if (r.round)
            alert("黑方跳過");
        else
            alert("白方跳過");
    }
    r.round = !r.round;
    r.get_step();
    r.show_map();
}

function init(){
    r = new reversi(document.querySelector("#select_round").value);
    r.get_step();
    r.show_map();
}
init();