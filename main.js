var board = document.querySelector("#reversi_board");
for (let i = 0; i < 8; i++){
    for (let j = 0; j < 8; j++){
        board.innerHTML += `<img class=\"board\" id=\"index${i.toString()}${j.toString()}\" src=\"./empty.jpg\" onclick=\"run(${i},${j})\">`;
    }
    board.innerHTML += "<br>";
}
var r, black, white, level_limit, bai, wai;
init();

function show_index(i, j){
    alert(`${i}, ${j}`);
}


function run(i ,j){
    if ((r.black.length + r.white.length) == 64 || !r.search_point_array(r.step, i ,j))
        return;
    if (r.step.length > 0)
        r.filp(new POINT(i ,j));

    if ((r.black.length + r.white.length) == 64){
        if (r.black.length > r.white.length)
            document.querySelector("#result").innerHTML = "黑子贏";
        else if (r.black.length < r.white.length)
            document.querySelector("#result").innerHTML = "白子贏";
        else
            document.querySelector("#result").innerHTML = "平手";
    }
    
    
    r.round = !r.round;
    r.get_step();
    if (r.step.length == 0 && (r.black.length + r.white.length) != 64){
        if (r.round)
            alert("黑方跳過");
        else
            alert("白方跳過");
        r.round = !r.round;
        r.get_step();
    }

    if ((r.black.length + r.white.length) != 64){
        if (r.round == true && black == "computer"){
            ai_run(bai);
        }else if (r.round == false && white == "computer"){
            ai_run(wai);
        }
    }
    r.show_map();
    return;
}


function ai_run(ai){
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            document.querySelector(`#index${i.toString()}${j.toString()}`).classList = ["board"];
        }
    }
    let p = ai.get_next(r);
    document.querySelector(`#index${p.x.toString()}${p.y.toString()}`).classList.add("computer_board");
    run(p.x, p.y);
}


function init(){
    first = document.querySelector("#select_round").value;
    r = new reversi(first);
    r.get_step();
    r.show_map();

    black = document.querySelector("#select_black").value;
    white = document.querySelector("#select_white").value;
    level_limit = parseInt(document.querySelector("#search_tree_level_limit").value);
    
    document.querySelector("#result").innerHTML = "";

    bai = new reversiAI(true, level_limit);
    wai = new reversiAI(false, level_limit);
    if (first == "black" && black == "computer"){
        ai_run(bai);
    }else if (first == "white" && white == "computer"){
        ai_run(wai);
    }
}