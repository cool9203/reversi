# reversi
https://cool9203.github.io/reversi/

程式介紹：  
reversi.js 使用javascript實作出來的黑白棋局，提供變數任意存取、取得該次可以下那些位置的功能。  
main.js 利用reversi.js實作黑白棋對弈功能(在該js裡的function run裡)，並顯示在index.html，提供可下棋的功能。  
reversiAI.js 實作的黑白棋下棋AI。


AI介紹：  
目前使用DFS + minimax&alpha-beta-pruning + SBE


SBE介紹：  
目前使用N+2步後的我方顏色數量，來當作SBE的分數，AI會選擇最高分來當作下一步。


完全開放原始碼，歡迎取用。  
this code is open source, welcome used this code.  


預計要完成的功能：  
beam search  
SBE改良  
