var board = document.querySelector("#reversi_board");
for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
        board.innerHTML += `<img class=\"board\" id=\"index${i.toString()}${j.toString()}\" src=\"./empty.jpg\" onclick=\"run(${i},${j})\" onmouseover=\"add_border(this)\" onmouseout=\"re_add_border(this)\">`;
    }
    board.innerHTML += "<br>";
}
var r, black, white, level_limit, wai, bai, first, middle, final;
init();


async function run(i ,j){
    if ((r.black.length + r.white.length) == 64 || !r.search_point_array(r.step, i ,j))
        return;
    if (r.step.length > 0){
        r.filp(new POINT(i ,j));
    }

    r.round = !r.round;
    r.get_step();

    if (((r.black.length + r.white.length) == 64) || r.black.length == 0 || r.white.length == 0){
        reversi_end(r);
        return;
    }
    
    if (r.step.length == 0 && (r.black.length + r.white.length) != 64){
        if (r.round){
            alert("黑方跳過");
            ;
        }
        else{
            alert("白方跳過");
            ;
        }
        r.round = !r.round;
        r.get_step();

        if (r.step.length == 0){
            reversi_end(r);
            return;
        }

    }

    r.show_map();
    await delay(0);

    if ((r.black.length + r.white.length) != 64){
        if (r.round == true && black == "computer"){
            if ((r.black.length + r.white.length) < 15){
                bai.set_level_limit(first);
                bai.set_weight(15, 1, 4, 8, -2, 1.5, -15, 0, 0, 0, 0, -1.5);
            }else if ((r.black.length + r.white.length) < 40){
                bai.set_level_limit(middle);
                bai.set_weight(90, 5, 4, 8, -3, 0, -100, -5, -4, -8, 3, 0);
            }else if ((r.black.length + r.white.length) < 58){
                bai.set_level_limit(final);
                bai.set_weight(90, 5, 2, 4, -3, 0, -100, -5, -2, -4, 3, 0);
            }else{
                bai.set_level_limit(10);
                bai.set_weight(0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1);
            }

            ai_run(bai);
        }else if (r.round == false && white == "computer"){
            if ((r.black.length + r.white.length) < 15){
                wai.set_level_limit(first);
                wai.set_weight(15, 1, 4, 8, -2, 1.5, -15, 0, 0, 0, 0, -1.5);
            }else if ((r.black.length + r.white.length) < 40){
                wai.set_level_limit(middle);
                wai.set_weight(90, 5, 4, 8, -3, 0, -100, -5, -4, -8, 3, 0);
            }else if ((r.black.length + r.white.length) < 58){
                wai.set_level_limit(final);
                wai.set_weight(90, 5, 2, 4, -3, 0, -100, -5, -2, -4, 3, 0);
            }
            else{
                wai.set_level_limit(10);
                wai.set_weight(0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1);
            }

            ai_run(wai);
        }
    }
}


async function ai_run(ai){
    document.querySelector("#ai_computing").innerHTML = "AI計算中";
    await delay(30);
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            document.querySelector(`#index${i.toString()}${j.toString()}`).classList = ["board"];
        }
    }
    let p = ai.get_next(r);
    document.querySelector(`#index${p.x.toString()}${p.y.toString()}`).classList.add("computer_board");
    run(p.x, p.y);
    document.querySelector("#ai_computing").innerHTML = "AI計算完成";
    await delay(30);
}


function reversi_end(r){
    r.show_map();
    if (r.black.length > r.white.length)
            document.querySelector("#result").innerHTML = "黑子贏";
        else if (r.black.length < r.white.length)
            document.querySelector("#result").innerHTML = "白子贏";
        else
            document.querySelector("#result").innerHTML = "平手";
}


function init(){
    first_round = document.querySelector("#select_round").value;
    r = new reversi(first_round);
    r.get_step();
    r.show_map();

    black = document.querySelector("#select_black").value;
    white = document.querySelector("#select_white").value;

    first = parseInt(document.querySelector("#search_tree_level_limit_1").value);
    middle = parseInt(document.querySelector("#search_tree_level_limit_2").value);
    final = parseInt(document.querySelector("#search_tree_level_limit_3").value);
    
    document.querySelector("#result").innerHTML = "";
    document.querySelector("#ai_computing").innerHTML = "";

    wai = new reversiAI(true, first);
    bai = new reversiAI(true, first);
    if (first_round == "black" && black == "computer"){
        ai_run(wai);
    }else if (first_round == "white" && white == "computer"){
        ai_run(bai);
    }
}


function add_border(x){
    x.style.borderColor = "#FF0000";
}


function re_add_border(x){
    x.style.borderColor = "#000000";
}


function delay(ms){
    return new Promise((reslove, reject) => {
        setTimeout(() => {
            reslove("success");
        }, ms);
    });
}