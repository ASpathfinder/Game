import logo from './logo.svg';
import './App.css';
import Table from 'react-bootstrap/Table';
import {useEffect, useState} from "react";
import {Button} from 'react-bootstrap'
import {SquareFill, XSquare} from "react-bootstrap-icons";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function get_cell_obj(pos, value) {
  return {
    pos: pos,
    value: value,
  }
}

function get_user_cell_obj(pos) {
  return {
    pos: pos,
    value: null,
    checked: false,
  }
}

function get_hint_obj() {
  return {
    row: [],
    col: [],
  }
}

function generateCells(width) {
  const table = []
  for(let i = 0;i<width;i++) {
    const row = [];
    for(let j = 0;j<width;j++) {
      row.push(get_cell_obj([i, j], getRandomInt(0, 2)))
    }
    table.push(row);
  }
  return table;
}

function generateUserCells(width) {
  const table = []
  for(let i = 0;i<width;i++) {
    const row = [];
    for(let j = 0;j<width;j++) {
      row.push(get_user_cell_obj([i, j]))
    }
    table.push(row);
  }
  return table;
}

function get_row_col_hint(row, begin_index) {
  let count = 0;
  let i, j;
  if(row[begin_index].value === 0) {
    for(i=begin_index;i<row.length;i++) {
      if(row[i].value !== 0)
        break;
    }
    return [0, i]
  }

  for(j=begin_index;j<row.length;j++) {
    let current = row[j].value;
    if(current === 0) {
      break;
    }
    count++;
  }
  return [count, j]
}

function generate_hint(seq) {
  let begin_index = 0;
  const hint_per_seq = [];
  do {
    let count_begin_index = get_row_col_hint(seq, begin_index);
    console.log(count_begin_index);
    if(count_begin_index[0] !== 0)
      hint_per_seq.push(count_begin_index[0]);

    begin_index = count_begin_index[1];
  } while(begin_index < seq.length);

  return hint_per_seq;
}

function get_hint(table) {
  const hint = get_hint_obj()

  for(let i=0;i<table.length;i++) {
    const col_seq = []
    for(let j=0;j<table.length;j++) {
      col_seq.push(table[j][i])
    }

    hint.row.push(generate_hint(table[i]))
    hint.col.push(generate_hint(col_seq))
  }
  console.log(hint)
  return hint;
}

function get_cell_icon(cell_obj) {
  if(!cell_obj.checked) {
    return ''
  }
  if(cell_obj.value === 1) {
    return <SquareFill/>
  }
  return <XSquare/>
}

function autoFillRow(index, userTable, solutionTable) {
  const userRow = userTable[index]
  const solutionRow = solutionTable[index]
  const squareCols = solutionRow.filter((cell) => cell.value === 1)

  const userRowSquareCellsRef = []
  for(let i=0;i<squareCols.length;i++) {
    if(userRow[squareCols[i].pos[1]]=== squareCols[i]) {
      userRowSquareCellsRef.push(userRow[squareCols[i].pos[1]])
    }
  }
  console.log(userRowSquareCellsRef)
  if(userRowSquareCellsRef.length === squareCols.length) {
    console.log('XXX')
    userRow.filter(cell => cell.value === 0 && !cell.checked).forEach(cell => {
      cell.checked = true;
      cell.value = 1
    })
  }
}

function autoFillCol(index) {

}

function App() {
  const [userTable, setUserTable] = useState(() => generateUserCells(10))
  const [table, setTable] = useState(() => generateCells(10))
  const [hint, setHint] = useState(() => get_hint_obj())
  const [selectBtn, setSelectBtn] = useState(true)

  useEffect(() => {
    console.log(table)
    setHint(get_hint(table))
  }, []);

  function onTableCellClicked(row_index, col_index) {
    const table_copy = [...userTable]
    const cell_obj = table_copy[row_index][col_index]
    cell_obj.checked = !cell_obj.checked;
    if(selectBtn) {
      cell_obj.value = 1
    } else {
      cell_obj.value = 0
    }
    autoFillRow(row_index, table_copy, table)
    setUserTable(table_copy);
  }

  return (
    <main style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <table style={{display: 'flex'}}>
        <tbody>
        <tr className={"hint-tr"}>
          <td className={"row-hint"}></td>{hint.col ? hint.col.map((h, index) => <td className={"colhint"}>{h.map(ele => <>{ele}<br/></>)}</td>) : ''}
        </tr>
        {
          userTable.map((row, index_row) => <tr className={"tabletr"}>
            <td className={"row-hint"}>
              {hint.row[index_row] ? hint.row[index_row].join(' '): ''}
            </td>
            {row.map((col, index_col) => <td className={"cell"} onClick={e => onTableCellClicked(index_row, index_col)}>{get_cell_icon(col)}</td>)}
          </tr>)
        }
        </tbody>
      </table>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
        <Button variant={ selectBtn ? "primary" : "outline-primary"}
                style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}
                onClick={() => setSelectBtn(true)}
        >
          <SquareFill/>
          <span style={{marginLeft: '10px'}}>选中</span>
        </Button>
        <Button variant={ selectBtn ? "outline-secondary" : "secondary"}
                style={{display: 'flex', alignItems: 'center'}}
                onClick={() => setSelectBtn(false)}
        >
          <XSquare/><span style={{marginLeft: '10px'}}>取消选中</span>
        </Button>
      </div>
    </main>
  );
}

export default App;
