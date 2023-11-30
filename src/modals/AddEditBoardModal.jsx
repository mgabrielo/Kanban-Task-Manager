import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import { useDispatch } from "react-redux";
import { addBoard, editBoard } from "../redux/boardsSlice";

const AddEditBoardModal = ({ setBoardModalOpen, type }) => {
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  const [newColumns, setNewColumns] = useState([
    {
      name: "To do",
      task: [],
      id: uuidv4(),
    },
    {
      name: "Doing",
      task: [],
      id: uuidv4(),
    },
  ]);

  function onChange(id, value) {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = value;
      return newState;
    });
  }

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((itm) => itm.id !== id));
  };

  function validateInput() {
    setIsValid(false);
    if (!name.trim()) {
      return false;
    }

    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }

    setIsValid(true);
    return true;
  }

  const onSubmitInput = (type) => {
    setBoardModalOpen(false);
    if (type === "add") {
      // dispacth
      dispatch(addBoard({ name, newColumns }));
    } else {
      //dispatch
      dispatch(editBoard({ name, newColumns }));
    }
  };
  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setBoardModalOpen(false);
      }}
      className={`fixed right-0 left-0 top-0 bottom-0 px-2 py-4 overflow-scroll z-50
    justify-center items-center flex bg-[#00000080] scrollbar-hide
    `}
    >
      <div
        className={`scrollbar-hide overflow-y-scroll max-h-95vh bg-white dark:bg-[#2b2c37]
      text-black dark:text-white font-bold shadow-md shadow-[#364e7e1e] max-w-md mx-auto w-full px-8 py-8 rounded-xl
      `}
      >
        <h3 className="text-lg">
          {type === "edit" ? "Edit" : "Add New"} Board
        </h3>

        <div className="mt-8 flex flex-col space-y-3 ">
          <label>Board Name</label>
          <input
            type="text"
            className={`bg-transparent px-4 py-2 rounded-md text-sm border-gray-600
           focus:outline-[#635fc7] outline-none outline-1 ring-1`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g: web design"
            id="board-name-input"
          />
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">
            Board Columns
          </label>
          {newColumns.length > 0 &&
            newColumns.map((col, index) => {
              if (col) {
                return (
                  <div className="flex items-center w-full" key={index}>
                    <input
                      type="text"
                      className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border
                       border-gray-600 outline-none focus:outline-[#735fc7]"
                      value={col?.name}
                      onChange={(e) => onChange(col.id, e.target.value)}
                    />
                    <img
                      src={crossIcon}
                      className="cursor-pointer m-4"
                      onClick={() => {
                        onDelete(col.id);
                      }}
                    />
                  </div>
                );
              }
              return null;
            })}
        </div>

        <div>
          <button
            className="w-full items-center hover:opacity-75 dark:text-[#635fc7] dark:bg-white
          text-white bg-[#635fc7] py-2 mt-3 rounded-full"
            onClick={() =>
              setNewColumns((state) => [
                ...state,
                {
                  name: "",
                  task: [],
                  id: uuidv4(),
                },
              ])
            }
          >
            + Add New Column
          </button>

          <button
            className="w-full items-center hover:opacity-75 dark:text-white dark:bg-[#635fc7] mt-8 relative text-white
          bg-[#635fc7] py-2 rounded-full"
            onClick={() => {
              const isValid = validateInput();
              if (isValid === true) onSubmitInput(type);
            }}
          >
            {type === "add" ? "Create New Board" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditBoardModal;
