import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardIcon from "../assets/icon-board.svg";
import lightIcon from "../assets/icon-light-theme.svg";
import darkIcon from "../assets/icon-dark-theme.svg";
import { Switch } from "@headlessui/react";
import useDarkMode from "../Hooks/useDarkMode";
import { setBoardActive } from "../redux/boardsSlice";

const HeaderDropDown = ({ setOpenDropDown, setBoardModalOpen }) => {
  const boards = useSelector((state) => state.boards);
  console.log("boards -- ", boards);
  const dispatch = useDispatch();
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  function toggleDarkMode(checked) {
    setTheme(colorTheme);
    setDarkSide(checked);
  }
  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropDown(false);
      }}
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 bg-[#808080]"
    >
      <div className="bg-white dark:bg-[#2b2c37] shadow-md shadow-[#36437c1a] w-full py-4 rounded-xl">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
          All Boards ({boards.length})
        </h3>
        <div>
          {boards.length > 0 &&
            boards.map((item, index) => {
              if (item) {
                return (
                  <div
                    className={`flex items-baseline cursor-default dark:text-white space-x-2 px-5 py-4 ${
                      item.isActive &&
                      "bg-[#635fc7] rounded-r-full text-white mr-8"
                    }`}
                    key={index}
                    onClick={() => {
                      dispatch(setBoardActive({ index }));
                    }}
                  >
                    <img src={boardIcon} alt="icon board" />
                    <p>{item.name}</p>
                  </div>
                );
              }
              return null;
            })}
          <div
            onClick={() => {
              setBoardModalOpen(true);
              setOpenDropDown(false);
            }}
            className="flex items-baseline space-x-2 text-[#635fc7] px-5 py-4 cursor-pointer"
          >
            <img src={boardIcon} alt="boardIcon" />
            <p className="text-lg font-bold">Create Board</p>
          </div>
          <div className="mx-2 p-4 space-x-2 bg-slate-100 dark:bg-slate-300 flex justify-center rounded-lg">
            <img src={lightIcon} alt="lightIcon" />
            <Switch
              checked={darkSide}
              onChange={toggleDarkMode}
              className={`${darkSide ? "bg-[#635fc7]" : "bg-gray-200"}
            relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  darkSide ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              ></span>
            </Switch>
            <img src={darkIcon} alt="darkIcon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropDown;
