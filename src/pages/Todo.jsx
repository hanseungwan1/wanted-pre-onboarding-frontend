import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const URL = "https://www.pre-onboarding-selection-task.shop/";
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [isEdit, setIsEdit] = useState([]);
  const [editContent, setEditContent] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/signin");
    } else {
      fetch(URL + "todos", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setList([...json]);
          const fillEdit = new Array(json.length).fill(false);
          setEditContent([...json].map((el) => el.todo));
          setIsEdit(fillEdit);
        });
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (e.target.todo.value.trim() === "") {
      e.target.todo.value = "";
      return;
    }

    fetch(URL + "todos", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: e.target.todo.value,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setList([...list, json]);
        setIsEdit([...isEdit, false]);
        setEditContent([...editContent, json.todo]);
        e.target.todo.value = "";
      });
  };

  const deleteHandler = (id, index) => {
    fetch(URL + "todos/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    }).then((response) => {
      let array = [...list].filter((el, i) => {
        if (i !== index) {
          let a = [...isEdit];
          let b = [...editContent];
          a = a.filter((el, ii) => ii !== index);
          b = b.filter((el, ii) => ii !== index);
          setIsEdit([...a]);
          setEditContent([...b]);
          return true;
        }
      });
      setList([...array]);
    });
  };

  const updateHandler = (id, todo, isCompleted) => {
    fetch(URL + "todos/" + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo,
        isCompleted: isCompleted,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let array = [...list].map((el) => {
          if (el.id === id) return json;
          else return el;
        });
        setList([...array]);
      });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input data-testid="new-todo-input" name="todo" />
        <button data-testid="new-todo-add-button">추가</button>
      </form>
      {list.map((el, i) => {
        return (
          <li key={el.id}>
            <label>
              <input
                type="checkbox"
                checked={el.isCompleted ? "checked" : ""}
                onChange={() => {
                  updateHandler(el.id, el.todo, !el.isCompleted);
                }}
              />
            </label>
            {isEdit[i] ? (
              <>
                <input
                  data-testid="modify-input"
                  value={editContent[i]}
                  onChange={(e) => {
                    let b = [...editContent].map((el, index) => {
                      if (i === index) return e.target.value;
                      return el;
                    });
                    setEditContent(b);
                  }}
                />
                <button
                  data-testid="submit-button"
                  onClick={() => {
                    updateHandler(el.id, editContent, el.isCompleted);
                    let a = [...isEdit];
                    a = a.map((el, index) => {
                      if (index === i) return false;
                      else return el;
                    });
                    setIsEdit([...a]);
                  }}
                >
                  제출
                </button>
                <button
                  data-testid="cancel-button"
                  onClick={() => {
                    let b = [...editContent].map((ell, index) => {
                      if (i === index) return el.todo;
                      return ell;
                    });
                    setEditContent(b);

                    let a = [...isEdit];
                    a = a.map((el, index) => {
                      if (index === i) return false;
                      else return el;
                    });
                    setIsEdit([...a]);
                  }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span>{el.todo}</span>
                <button
                  data-testid="modify-button"
                  onClick={() => {
                    let a = [...isEdit];
                    a = a.map((el, index) => {
                      if (index === i) return true;
                      else return el;
                    });
                    setIsEdit([...a]);
                  }}
                >
                  수정
                </button>
                <button
                  data-testid="delete-button"
                  onClick={() => {
                    deleteHandler(el.id, i);
                  }}
                >
                  삭제
                </button>
              </>
            )}
          </li>
        );
      })}
    </>
  );
}
