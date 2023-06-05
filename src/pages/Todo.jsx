import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const URL = "https://www.pre-onboarding-selection-task.shop/";
  const [list, setList] = useState([]);
  const navigate = useNavigate();

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
      let array = [...list].filter((el, i) => i !== index);
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
              <input type="checkbox" />
              <span>{el.todo}</span>
            </label>
            <button data-testid="modify-button">수정</button>
            <button
              data-testid="delete-button"
              onClick={() => {
                deleteHandler(el.id, i);
              }}
            >
              삭제
            </button>
          </li>
        );
      })}
    </>
  );
}
