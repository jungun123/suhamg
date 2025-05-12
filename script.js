let started = false;
let array = [];
let matrix = [];
let mineset = false;
let left = 999;
let minesetnum = 0;
let numMines = 999;
let step = 0;
let sizerow = 0;
let sizecol = 0;
document.getElementById("mine").addEventListener("click", () => {
    mineset = !mineset;
    if (mineset) {
        document.getElementById("mine").style.color = "red"
    } else {
        document.getElementById("mine").style.color = "black"

    }
});



class Cell {
    constructor(x, y, element) {
        this.x = x
        this.y = y
        this.mine = false;
        this.isOpen = false;
        this.element = element;
        this.isMineSet = false;
    }
    mineset() {
        if (!this.isMineSet && this.isOpen == true) {
            return; 
        }
        this.isMineSet = !this.isMineSet
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.element.style.backgroundColor = "red";
            left--;
            minesetnum++;
            if (left == 0) {
                if (numMines == minesetnum) {
                    started = false;
                    alert("축하합니다!");
                    document.getElementById("grid").innerHTML = '';
            document.getElementById("mode").style.display = "block";
            document.getElementById("show").innerHTML = ""
            left = 999;
            minesetnum = 0;
            numMines = 999;
                }
            }
        }
        else {
            this.element.style.backgroundColor = "lightgray";
            left++;
            minesetnum--;
        }
    }
    isNearOpen() {
        const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
            const dy = [-1, 0, 1, -1, 1, -1, 0, 1];
    
            for (let i = 0; i < 8; i++) {
            const nx = this.y + dx[i];
            const ny = this.x + dy[i];
        
            // 범위를 벗어나지 않는지 확인
            if (nx >= 0 && nx < array.length && ny >= 0 && ny < array[0].length) {
                if (!array[nx][ny].isMineSet &&array[nx][ny].isOpen && !array[this.y][this.x].isOpen) return true
            }
            }
            return false;
    }
    open() {
        if (this.mine) {
            started = false;
            alert("게임 오버!");
        } else {
            left--;
            this.isOpen = true;
            this.element.style.backgroundColor = "white";
            if (this.nearMine() != 0) this.element.innerHTML = this.nearMine();
            else {
            const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
            const dy = [-1, 0, 1, -1, 1, -1, 0, 1];
    
            for (let i = 0; i < 8; i++) {
            const nx = this.y + dx[i];
            const ny = this.x + dy[i];
        
            // 범위를 벗어나지 않는지 확인
            if (nx >= 0 && nx < array.length && ny >= 0 && ny < array[0].length) {
                if (!array[nx][ny].mine && !array[nx][ny].isOpen) {
                    array[nx][ny].open(); 
                }
            }
            }
        }
    }

    }
    setMine() {
        this.mine = true;
    }
    nearMine() {
    let count = 0;
    const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dy = [-1, 0, 1, -1, 1, -1, 0, 1];
    
    for (let i = 0; i < 8; i++) {
        const nx = this.y + dx[i];
        const ny = this.x + dy[i];
        
        // 범위를 벗어나지 않는지 확인
        if (nx >= 0 && nx < array.length && ny >= 0 && ny < array[0].length) {
            if (array[nx][ny].mine) {
                count++;
            }
        }
    }
    
    return count;
}
}
const easy = document.getElementById("easy");
const normal = document.getElementById("normal");
const hard = document.getElementById("hard");
function generateMines(grid, rows, cols, stx, sty) {
    left = cols * rows;
    if (cols == 9) numMines = 10;
    else if (cols == 16) numMines = 40;
    else numMines = 99; 
  let minesPlaced = 0;
  const totalCells = rows * cols;
  
  // 지뢰를 무작위로 배치
  while (minesPlaced < numMines) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    const row = Math.floor(randomIndex / cols);
    const col = randomIndex % cols;
    
    // 이미 지뢰가 배치된 곳은 건너뛰기
    if (grid[row][col].mine) {
      continue;
    }
    if (row >= sty -1 && row <= sty + 1 && col >= stx -1 && col <= stx +1) continue;

    // 지뢰 배치
    grid[row][col].setMine();
    minesPlaced++;
  }
}
function augmentedMatrixToLatex(matrix) {
  const numCols = matrix[0].length;
  const lastColIndex = numCols - 1;

  // 열 정렬 문자열: 예를 들어 {ccc|c}
  const colSpec = 'c'.repeat(lastColIndex) + '|c';

  // 각 행을 LaTeX 행으로 변환
  const rows = matrix.map(row => {
    const left = row.slice(0, lastColIndex).join(' & ');
    const right = row[lastColIndex];
    return `${left} & ${right}`;
  });

  const body = rows.join(' \\\\ ');

  return `\\left[ \\begin{array}{${colSpec}} ${body} \\end{array} \\right]`;
}
function removeZeroRows(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] != 0) break
            if (j == matrix[i][j].length-1) {
                matrix.splice(i, 1)
                i--;
            }
        }
    }



  return matrix.filter(row => !row.every(value => value === 0));

}
function augmentedMatrixToLatexEquations(matrix) {
  let latex = "";
  let numVariables = matrix[0].length - 1;  // 마지막 열을 제외한 변수의 개수
  
  for (let i = 0; i < matrix.length; i++) {
    let equation = "";
    for (let j = 0; j < numVariables; j++) {
      // 계수와 변수 결합
      if (matrix[i][j] !== 0) {
        if (j > 0 && matrix[i][j] > 0) {
          equation += " + ";
        }
        equation += matrix[i][j] + "x_{\\text{" + (j + 1) + "}}";  // \text{}를 사용하여 숫자의 크기를 맞춤
      } else {
        if (j > 0) {
          equation += " + ";
        }
        equation += "0x_{\\text{" + (j + 1) + "}}";  // \text{}를 사용하여 숫자의 크기를 맞춤
      }
    }
    
    // 마지막 항(상수항)을 추가
    equation += " = " + matrix[i][numVariables];
    
    // 줄바꿈 추가
    latex += equation;
    if (i < matrix.length - 1) {
      latex += " \\\\ ";
    }
  }

  // MathJax에서 사용하기 위해 `align` 환경으로 감쌈
  return "\\begin{align}" + latex + "\\end{align}";
}
function createGrid(rows, cols) {
    sizecol = cols
    sizerow = rows
    array = [];
    const grid = document.getElementById("grid");
    grid.innerHTML = '';  // 그리드를 초기화 (기존의 버튼들 삭제)

    // 그리드 동적 생성
    for (let row = 0; row < rows; row++) {
        array[row] = [];
        for (let col = 0; col < cols; col++) {
            grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`; // cols에 맞춰 30px 크기 버튼들을 배치
            grid.style.gridTemplateRows = `repeat(${rows}, 30px)`;
            const button = document.createElement("div");  // 버튼 생성
            button.className = "cell";  // 클래스 설정
            button.dataset.row = row ;  // 행 정보 저장
            button.dataset.col = col;  // 열 정보 저장
            button.className = "cell";
            
            array[row].push(new Cell(col, row, button))
            // 버튼 클릭 시 이벤트 리스너 추가
            button.addEventListener("click", () => {
                if (!started) {
                    started = true;
                    
                    generateMines(array, rows, cols, col, row);
                    console.log(array);
                    array[row][col].open();
                    let gas = gaussianEliminationToEchelon(stepForward())
                    console.log(matrixToLatex(removeZeroRows(gas)))
                    console.log(augmentedMatrixToLatex(removeZeroRows(gas)))
                } else if (!mineset && !array[row][col].isOpen) {

                    array[row][col].open();
                } else if (mineset) {
                    array[row][col].mineset();
                }
            });

            grid.appendChild(button);  // 그리드에 버튼 추가
        }
    }

    // #mode div 숨기기
    const modeDiv = document.getElementById("mode");
    if (modeDiv) {
        modeDiv.style.display = "none"; // #mode 숨기기
    }
}
function round(num, decimals = 10) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

function gaussianEliminationToEchelon(matrix) {
  const n = matrix.length;
  const m = matrix[0].length;
  const result = matrix.map(row => row.slice()); // 깊은 복사

  let row = 0;
  for (let col = 0; col < m - 1 && row < n; col++) {
    // 피벗 찾기
    let pivotRow = -1;
    for (let i = row; i < n; i++) {
      if (result[i][col] !== 0) {
        pivotRow = i;
        break;
      }
    }

    // 피벗이 없으면 다음 열로
    if (pivotRow === -1) continue;

    // 행 교환
    [result[row], result[pivotRow]] = [result[pivotRow], result[row]];

    // 피벗을 1로 만들기 (여기선 항상 1이라 생략 가능하지만 일반화함)
    const pivot = result[row][col];
    for (let j = col; j < m; j++) {
      result[row][j] = round(result[row][j] / pivot);
    }

    // 아래 행들 제거
    for (let i = row + 1; i < n; i++) {
      const factor = result[i][col];
      for (let j = col; j < m; j++) {
        result[i][j] = round(result[i][j] - factor * result[row][j]);
      }
    }

    row++;
  }

  return result;
}
easy.addEventListener("click", () => {
    document.getElementById("game").style.display = "block";
    document.getElementById("show").style.display = "block";
    createGrid(9, 9);  // 9x9 그리드 생성
});

normal.addEventListener("click", () => {
    document.getElementById("game").style.display = "block";
    document.getElementById("show").style.display = "block";
    createGrid(16, 16);  // 16x16 그리드 생성
})
hard.addEventListener("click", () => {
    document.getElementById("game").style.display = "block";
    document.getElementById("show").style.display = "block";
    createGrid(16, 30);  // 30x16 그리드 생성

});
function matrixToLatex(matrix) {
  const rows = matrix.map(row => row.join(' & '));
  const body = rows.join(' \\\\ ');
  return `\\begin{bmatrix} ${body} \\end{bmatrix}`;
}
document.getElementById("next").addEventListener("click", stepForward)
let augmat = []
let 계수들 = []
function removeColumn(matrix, index) {
  return matrix.map(row => {
    if (index >= 0 && index < row.length) {
      const newRow = [...row]; // 원본 보호
      newRow.splice(index, 1);
      return newRow;
    } else {
      return row; // 인덱스 범위 초과 시 그대로 반환
    }
  });
}
function decrementLastColumn(arr, index) {
  for (let i = 0; i < arr.length; i++) {
    // index 번째 요소 제거
    if (arr[i][index] == 1)  {arr[i][arr[i].length - 1] -= 1;}
    arr[i].splice(index, 1);

    // 마지막 요소 -1
  }

  return arr;
}
function deepEqual2DArray(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    const row1 = arr1[i];
    const row2 = arr2[i];

    if (!Array.isArray(row1) || !Array.isArray(row2)) return false;
    if (row1.length !== row2.length) return false;

    for (let j = 0; j < row1.length; j++) {
      if (row1[j] !== row2[j]) return false;
    }
  }

  return true;
}
function isSolvable(matrix) {
    matrix = removeZeroRows(matrix)
  for (let row of matrix) {
    const min = 0;
    let max = 0;
    for (let i = 0; i < row.length - 1 ; i++) {
        max += row[i]
    }
    if (row[row.length - 1] == min || row[row.length - 1] == max) {
        return true;
    }
    



  }

  // 모든 행이 풀 수 없는 경우만 false
  return false;
}
function stepForward() {
    if (!started) return
    retmat = []
    step++;
    if (step == 5) step -= 5;
    switch(step) {
        case 1:
            for (let i = 0; i < sizerow; i++) {
                for (let j = 0; j < sizecol; j++) {
                    if (array[i][j].isNearOpen() && !array[i][j].isOpen) {
                        계수들.push(array[i][j]);
                    }
                }
            }

            for (let i = 0; i < sizerow; i++) {
                for (let j = 0; j < sizecol; j++) {
                    let onerow = []
                    if (array[i][j].isOpen && array[i][j].nearMine() != 0 && !array[i][j].isMineSet) {
                        let count1 = 0; // 근방에 존재하는 빨간색칸칸
                        const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
                        const dy = [-1, 0, 1, -1, 1, -1, 0, 1];
                        let isnear계수들 = false
                        for (let k = 0; k < 8; k++) {
                            const nx = array[i][j].y + dx[k];
                            const ny = array[i][j].x + dy[k];
                            
                            // 범위를 벗어나지 않는지 확인
                            if (nx >= 0 && nx < array.length && ny >= 0 && ny < array[0].length) {
                                if (array[nx][ny].isMineSet) {
                                    count1++;
                                }
                                for (let 계수 of 계수들) {
                                    if (nx == 계수.y && ny == 계수.x) isnear계수들 = true
                                }
                            }
                        }
                        if (isnear계수들) {
                        for (let k = 0; k < 계수들.length; k++) {
                            if (계수들[k].x >= array[i][j].x -1 && 계수들[k].x <= array[i][j].x +1 && 계수들[k].y >= array[i][j].y -1 && 계수들[k].y <= array[i][j].y +1) {
                                onerow.push(1);
                            } else {
                                onerow.push(0);
                            }
                        }
                        onerow.push(array[i][j].nearMine() - count1)
                        retmat.push(onerow)
                    } else {
                        
                    }
                }
                    
                }
            }
            if (!isSolvable(gaussianEliminationToEchelon(removeZeroRows(retmat)))) {
                alert("찍어야합니다!")
                
            
            
            }
            console.log(augmentedMatrixToLatexEquations(retmat))
            document.getElementById("show").innerHTML = "$$" + augmentedMatrixToLatexEquations(removeZeroRows(retmat)) + "$$";
            MathJax.typeset();
            augmat = retmat
            augmat = removeZeroRows(augmat)
            return retmat

        case 2:
            augmat = removeZeroRows(augmat)
            console.log(augmentedMatrixToLatex(augmat))
            document.getElementById("show").innerHTML = "$$" + augmentedMatrixToLatex(removeZeroRows(augmat)) + "$$";
            MathJax.typeset();
            break;

        case 3:
            augmat = removeZeroRows(gaussianEliminationToEchelon(augmat))
            console.log(augmentedMatrixToLatex(augmat))
            document.getElementById("show").innerHTML = "$$" + augmentedMatrixToLatex(augmat) + "$$";
            MathJax.typeset();

            break;

        case 4:
            let temp = [];
            while (!deepEqual2DArray(temp, augmat)) {
                temp = [...augmat]
            for (let i = 0; i < augmat.length; i++) {
                if (augmat[i][augmat[i].length -1] == 0) {
                    for (let j = 0; j < augmat[i].length - 1; j++) {
                        if (augmat[i][j] == 1) {
                            계수들[j].open()
                            계수들.splice(j, 1)
                            
                            augmat = removeColumn(augmat, j)
                            j--;
                        }
                    }
                } else{ 



                let count = 0;
                for (let j = 0; j < augmat[i].length - 1; j++) {
                    count += Math.abs(augmat[i][j])
                }
                if (count == augmat[i][augmat[i].length - 1]) { // 다지뢰임임 계수들은 인접한 안밝혀진거.
                    for (let j = 0; j < augmat[i].length - 1; j++) { 
                        if (augmat[i][j] == 1) {
                            계수들[j].mineset()
                            계수들.splice(j, 1)
                            
                            augmat = decrementLastColumn(augmat, j)
                            j--;
                        }
                    }
                }
            }
            }
            
        
        
        }


        break;



            // 똑같아서 빠져나왔고, 이제 여기서 더 해먹을것 없음.



        default:
            document.getElementById("show").innerHTML = ""
            계수들 = []
            augmat = []
    }
}