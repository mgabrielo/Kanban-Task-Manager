import React, { useState } from "react";
import crossIcon from "../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask } from "../redux/boardsSlice";

const AddEditTaskModal = ({
  type,
  device,
  setOpenAddEditTask,
  taskIndex,
  prevColIndex = 0,
}) => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );
  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);
  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((itm) => itm.id !== id));
  };
  function onChange(id, value) {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtsk) => subtsk.id === id);
      subtask.title = value;
      return newState;
    });
  }

  function validateInput() {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }

    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  }

  const onSubmitInput = (type) => {
    if (type === "add") {
      // dispacth
      dispatch(addTask({ title, description, subtasks, status, newColIndex }));
    } else {
      //dispatch
      dispatch(
        editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };

  function onChangeStatus(e) {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  }

  return (
    <div
      className={
        device === "mobile"
          ? `py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 
     bottom-[-100vh] top-0 bg-[#00000080]`
          : `py-6 px-6 pb-40 absolute overflow-y-scroll left-0  flex right-0
    bottom-0 top-0 bg-[#00000080]`
      }
      onClick={(e) => {
        if (e.currentTarget !== e.target) {
          return;
        }
        setOpenAddEditTask(false);
      }}
    >
      <div
        className="overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black
        dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl
        "
      >
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500 mt-2">
            Task name
          </label>
          <input
            type="text"
            value={title}
            placeholder="eg: Cofee Break"
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent px-4 py-3 rounded-md text-sm border border-gray-600
                focus:outline-[#635fc7]  outline-1 ring-0"
          />

          <label className="text-sm dark:text-white text-gray-500 mt-2">
            Task Description
          </label>
          <input
            type="text"
            value={description}
            placeholder="eg: Summary of the whole year"
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent px-4 py-2 min-h-[200px] rounded-md text-sm border border-gray-600
                focus:outline-[#635fc7] outline-none outline-1 ring-0"
          />

          <label className="text-sm dark:text-white text-gray-500 mt-2">
            SubTasks
          </label>
          {subtasks.map((subtask, index) => {
            return (
              <div
                key={index}
                className={`flex items-center w-full overflow-y-hidden`}
              >
                <input
                  type="text"
                  value={subtask.title}
                  className="bg-transparent outline-none focus:border-0 border flex-grow px-2 py-2 rounded-md text-sm
                        border-gray-600 focus:outline-[#635fc7]"
                  placeholder="e.g: Mages on a Mission"
                  onChange={(e) => {
                    onChange(subtask.id, e.target.value);
                  }}
                />
                <img
                  src={crossIcon}
                  alt="cross-Icon"
                  onClick={() => {
                    onDelete(subtask.id);
                  }}
                  className="m-4 cursor-pointer"
                />
              </div>
            );
          })}
          <button
            className="w-full items-center dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7]
          py-2 rounded-full"
            onClick={() => {
              setSubtasks((state) => [
                ...state,
                { title: "", isCompleted: false, id: uuidv4() },
              ]);
            }}
          >
            + Add Sub Task
          </button>
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-600">
            {" "}
            Current Status
          </label>
          <select
            value={status}
            onChange={(e) => onChangeStatus(e)}
            className="select-status flex flex-grow px-4 py-2 rounded-md text-sm bg-transparent
          focus:border-0 border border-gray-300 focus:outline-[#635fc7] outline-none
          "
          >
            {columns.length > 0 &&
              columns.map((col, index) => {
                return (
                  <option value={col?.name} key={index}>
                    {col?.name}
                  </option>
                );
              })}
          </select>

          <button
            className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
            onClick={() => {
              const isValid = validateInput();
              if (isValid === true) {
                onSubmitInput(type);
                setOpenAddEditTask(false);
              }
            }}
          >
            {type === "edit" ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
