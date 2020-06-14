/*  二維單點資料結構
    實作出:
    POINT的比較子:equal
    POINT的加法:add */
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


/*  黑白棋棋盤物件
    round:true=黑子, false=白子
    get_step():取得當前棋盤可以下那些地方。
    filp(POINT):給定一個POINT後，棋盤下該點並翻轉應該要翻的棋子。
*/
class reversi{
    constructor(round){
        if (typeof(round) == "string"){
            if (this.reset(round) == -1)
                throw new Error("round error");
        }
        else{
            this.black = Object.assign([], round.black);
            this.white = Object.assign([], round.white);
            this.round = round.round;
            this.step = [];
            this.filp_chess = [];
        }
        
    }

    get_step(){
        this.step = [];
        let chess1, chess2;
        if (this.round){
            chess1 = this.black;
            chess2 = this.white;
        }else{
            chess1 = this.white;
            chess2 = this.black;
        }
            

        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                let temp = new POINT(i, j);
                if (this.is_empty(temp) && this.check_chess(chess1, temp))   //如果該點不在黑、白棋裡，且他之間是可以下的
                    this.step.push(temp);
            }
        }
    }

    //給定p，為該reversi下點p，並翻轉應該翻轉的棋子
    filp(p){
        let chess1, chess2;
        if (this.round){
            chess1 = this.black;
            chess2 = this.white;
        }else{
            chess1 = this.white;
            chess2 = this.black;
        }

        this.filp_chess = [];
        this.check_chess(chess1, p);    //取得應該要翻轉的棋子，存在thus.filp_chess
        chess1.push(p);
        for (let i = 0; i < this.filp_chess.length; i++){   //翻轉棋子
            let e = this.filp_chess[i];
            if (!this.search_point_array(chess1, e))
                chess1.push(e);
            this.delete_point_array(chess2, e);
        }
        this.filp_chess = [];
    }

    //檢查chess和p是否可以下，同時記錄chess裡各點和p之間可以翻轉的棋子在this.filp.chess裡
    check_chess(chess, p){
        let flag = false;
        for (let i = 0; i < chess.length; i++){         //掃過chess裡的各點
            let delta_x = Math.abs(chess[i].x - p.x);
            let delta_y = Math.abs(chess[i].y - p.y);
            let temp = [];
            if ((delta_x > 1 || delta_y > 1) && this.calculate_slope(chess[i], p) != -1 && this.check_path(chess[i], p, temp)){ //(先看他們之間的x或y有沒有超過1，沒超過則代表相鄰) && (檢查兩點之間斜率，只要不是回傳-1則代表他們在一條線上) && (檢查兩點之間是否都是相反顏色的棋子)
                for (let i = 0; i < temp.length; i++)   //把temp的每個點(POINT結構)，存到this.filp_chess裡
                    this.filp_chess.push(temp[i]);
                flag = true;
            }
        }
        return flag;
    }

    //紀錄p1->p2中間要翻轉的棋子在filp_chess裡
    //但如果p1->p2中間有錯，則return false, 否則return true
    //EX:p1=黑, p2=黑, 但p1->p2中間還有顆黑子，則return false
    //   如果p1->p2中間都是白子，則return true
    check_path(p1, p2, filp_chess){
        let chess;
        if (!this.round)
            chess = this.black;
        else
            chess = this.white;

        let offset = this.get_offset(p1, p2);
        let point = new POINT(p1.x, p1.y);
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

    //檢查point在this.white和this.black裡是否都不存在
    //都不存在 return true
    //存在     return false
    is_empty(point){
        return !(this.search_point_array(this.white, point) || this.search_point_array(this.black, point));
    }

    //計算p1和p2之間是否在同一條線上，用斜率來做
    calculate_slope(p1, p2){
        let _x = (p2.x - p1.x);
        let _y = (p2.y - p1.y);
        let m = (_y / _x);

        if (_x == 0.0)          //在水平線上
            return 0;
        else if (_y == 0.0)     //在鉛直線上
            return 1;
        else if (m == 1.0)      //在斜線上，p1->p2是這樣／的直線
            return 2;
        else if (m == -1.0)     //在斜線上，p1->p2是這樣＼的直線
            return 3;
        else                    //不是在同一條線上
            return -1;
    }

    //計算p1->p2的每一步的偏移量
    get_offset(p1, p2){
        let x, y;
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

    //使用附件的圖片 & index.html來顯示棋盤
    show_map(){
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                document.querySelector(`#index${i.toString()}${j.toString()}`).src="./empty.jpg";
            }
        }
        let black = 0;
        let white = 0;
        for (let i = 0; i<this.black.length; i++){
            document.querySelector(`#index${this.black[i].x}${this.black[i].y}`).src="./black.jpg";
            black += 1;
        }
        for (let i = 0; i<this.white.length; i++){
            document.querySelector(`#index${this.white[i].x}${this.white[i].y}`).src="./white.jpg";
            white += 1;
        }
        for (let i = 0; i<this.step.length; i++){
            document.querySelector(`#index${this.step[i].x}${this.step[i].y}`).src="./step.jpg";
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