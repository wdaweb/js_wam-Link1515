const startbtn = document.getElementById('startbtn');
const resetbtn = document.getElementById('resetbtn');
const difficulty = document.getElementsByName('difficulty');
const timeText = document.getElementById('timeText');
const scoreText = document.getElementById('scoreText');
const gameTable = document.getElementById('gameTable');
const scoreTable = document.getElementById('scoreTable');
const logo = document.getElementById('logo');
// 表格資料
const easyName = document.getElementsByClassName('easy-name');
const easyScore = document.getElementsByClassName('easy-score');
const normalName = document.getElementsByClassName('normal-name');
const normalScore = document.getElementsByClassName('normal-score');
const hardName = document.getElementsByClassName('hard-name');
const hardScore = document.getElementsByClassName('hard-score');
// gameover info
const gameoverInfo = document.querySelector('.gameoverInfo');
const QNum = document.getElementById('QNum');
const info = document.getElementById('info');
const typeName = document.querySelector('.typeName');
const comfirmBtn = document.getElementById('comfirmBtn');

let timer = '';
let score = 0;
let flag = '';
let newRecord = {
  name: '',
  rank: -1,
};

// 讀取localStorage
if (localStorage.getItem('highScore')) {
  var highScore = JSON.parse(localStorage.getItem('highScore'));
  updateScoreTable();
} else {
  var highScore = {
    easy: [
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
    ],
    normal: [
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
    ],
    hard: [
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
    ],
  };
}

// 遊戲開始
startbtn.onclick = () => {
  let col = '';
  let row = '';
  let count = 2000;

  logo.style.display = 'none';
  gameTable.style.display = 'table';
  startbtn.disabled = true;
  for (const dif of difficulty) {
    dif.disabled = true;
    if (dif.checked) {
      flag = dif.id;
    }
  }
  scoreTable.style.display = 'none';

  // 難度
  if (flag == 'easy') {
    col = 16;
    row = 9;
    gameTable.style.minWidth = '850px';
  } else if (flag == 'normal') {
    col = 26;
    row = 12;
    gameTable.style.minWidth = '1400px';
  } else if (flag == 'hard') {
    col = 36;
    row = 15;
    gameTable.style.minWidth = '1900px';
  }

  // 繪製表格

  for (let i = 0; i < row; i++) {
    const tr = document.createElement('tr');
    tr.id = `tr${i}`;
    gameTable.appendChild(tr);
    const trInTable = document.getElementById(`tr${i}`);
    for (let j = 0; j < col; j++) {
      const td = document.createElement('td');
      td.id = `td${i}${j}`;
      td.innerText = 'O';
      trInTable.appendChild(td);
    }
  }

  randomPlace(row, col);

  timer = setInterval(() => {
    count--;
    timeText.innerText = count / 100;

    if (count == 0) {
      clearInterval(timer);
      logo.style.display = 'block';
      gameTable.style.display = 'none';
      gameTable.innerHTML = '';
      scoreTable.style.display = 'table';

      // 顯示 gameover info
      gameoverInfo.style.display = 'flex';
      info.innerText = '請繼續加油!';
      QNum.innerText = score;

      // 紀錄分數
      if (score > highScore[flag][4].score) {
        typeName.style.display = 'block';

        if (score > highScore[flag][0].score) {
          // const name = prompt('破紀錄! 你成為了第一名! 請輸入你的名字');
          newRecord.rank = 0;
          info.innerHTML = '破紀錄! 你成為了第一名!<br>請輸入你的名字';
        } else if (score > highScore[flag][1].score) {
          info.innerHTML = '破紀錄! 你成為了第二名!<br>請輸入你的名字';
          newRecord.rank = 1;
        } else if (score > highScore[flag][2].score) {
          info.innerHTML = '破紀錄! 你成為了第三名!<br>請輸入你的名字';
          newRecord.rank = 2;
        } else if (score > highScore[flag][3].score) {
          info.innerHTML = '破紀錄! 你成為了第四名!<br>請輸入你的名字';
          newRecord.rank = 3;
        } else {
          info.innerHTML = '破紀錄! 你成為了第五名!<br>請輸入你的名字';
          newRecord.rank = 4;
        }
      }

      startbtn.disabled = false;
      for (const dif of difficulty) {
        dif.disabled = false;
      }
    }
  }, 10);
};

// 重來
resetbtn.onclick = () => {
  location.reload();
};

// 分數結算
comfirmBtn.onclick = () => {
  newRecord.name = typeName.firstElementChild.value;
  highScore[flag].splice(newRecord.rank, 0, { name: newRecord.name ? newRecord.name : 'anonymous', score: score });
  updateScoreTable();
  localStorage.setItem('highScore', JSON.stringify(highScore));

  score = 0;
  scoreText.innerText = score;
  gameoverInfo.style.display = 'none';
  typeName.style.display = 'none';
  typeName.firstElementChild.value = '';
  newRecord.name = '';
  newRecord.rank = -1;
};

// 隨機一格換字
function randomPlace(row, col) {
  const changeBlock = document.getElementById(
    `td${Math.round(Math.random() * (row - 1))}${Math.round(Math.random() * (col - 1))}`
  );

  changeBlock.innerText = 'Q';
  changeBlock.classList.add('target');

  changeBlock.onclick = () => {
    score++;
    scoreText.innerText = score;
    changeBlock.innerText = 'O';
    changeBlock.onclick = null;
    randomPlace(row, col);
    changeBlock.classList.remove('target');
  };
}

function updateScoreTable() {
  for (let i = 0; i < easyName.length; i++) {
    easyName[i].innerText = highScore.easy[i].name;
    easyScore[i].innerText = highScore.easy[i].score;
    normalName[i].innerText = highScore.normal[i].name;
    normalScore[i].innerText = highScore.normal[i].score;
    hardName[i].innerText = highScore.hard[i].name;
    hardScore[i].innerText = highScore.hard[i].score;
  }
}
