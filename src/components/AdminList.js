/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
import React, { useState, useEffect } from "react";
import AdminTodoItem from "@/components/AdminTodoItem";
import styles from "@/styles/AdminTodoList.module.css";
import { useSession, signOut } from "next-auth/react";

//firebase 관련 모듈 불러오기
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

// DB의 todos 컬렉션 참조를 만들기. 잘못된 컬렉션 이름 사용을 방지.
const todoCollection = collection(db, "todos");

// TodoList 컴포넌트를 정의합니다.
const AdminTodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const { data } = useSession();

  // firebase로 변경된 부분
  const getTodos = async () => {
    // firebase 쿼리 만들기
    // const q = query(todoCollection);
    const q = query(todoCollection, orderBy("datetime", "asc"));

    // firebase에서 할 일 목록 조회하기
    const results = await getDocs(q);
    const newTodos = [];

    // 할 일 목록을 newTodos 배열에 담기
    results.docs.forEach((doc) => {
      // id값을 firestore에 저장한 값으로 지정하고, 나머지를 newTodos 배열에 담기
      newTodos.push({ id: doc.id, ...doc.data() });
    });
    setTodos(newTodos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id, userId) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // firestore에서 해당 id를 가진 할 일 삭제하기
    if (userId !== data?.user.id) {
      alert("권한이 없습니다.");
      return;
    }

    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);

    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    // firebase에서 추가된 부분
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        // Firestore 에서 해당 id를 가진 할 일을 찾아 완료 상태를 업데이트합니다.
        const todoDoc = doc(todoCollection, id);
        updateDoc(todoDoc, { completed: !todo.completed });
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  };

  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <div className="grid">
        <button
          className={`w-30 h-7 justify-self-end
                      bg-gray-600
                      text-white
                      text-xs
                      border border-gray-600 rounded
                      hover:bg-white hover:text-gray-600`}
          onClick={() => signOut()}
        >
          로그아웃
        </button>
      </div>
      <div className="grid">
        <h1 className="justify-self-center w-40 text-xl mb-10 bg-lime-100 font-bold underline underline-offset-4 decoration-wavy">
          관리자 페이지
        </h1>
      </div>

      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <AdminTodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id, todo.userId)}
          />
        ))}
      </ul>
    </div>
  );
};

export default AdminTodoList;
