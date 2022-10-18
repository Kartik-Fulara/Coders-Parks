import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { UPDOWN } from "../../Icons/Icons";

interface PROPS {
  $active: boolean;
}

const DROPDOWN = tw.section`
    w-full
    text-white
    box-border
`;

const SELECT = tw.div`
relative
w-full    
min-w-full
font-normal 
rounded
transition
ease-in-out
m-0
outline-none 
text-white 
bg-black1  
cursor-pointer 
h-[3rem]
flex 
gap-4
items-center 
justify-center
text-center
`;

const MENU = tw.ul`
    top-12
    select-none
    pt-4
    w-full
    flex
    bg-black
    flex-col
    gap-4
    absolute
    pb-4
    z-[9]
    rounded-b-lg
    px-4
`;

const MENUITEM = tw.li<PROPS>`
    bg-black4
    w-full
    h-[2.5rem]
    select-none
    flex
    z-10
    items-center
    flex-col
    justify-center
    ${(props) =>
      props.$active ? "bg-black1 text-green-500" : "text-white text-opacity-50"}
`;

const DropDown = ({ options, setFunc, onValue, start }: any) => {
  const [active, setActive] = React.useState();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (start) {
      console.log(start);
      setActive(start);
      setFunc(start);
    } else {
      setActive(options[0].value);
      setFunc(options[0].value);
    }
  }, []);

  const handleOptionChange = (e: any) => {
    console.log(e.target.id);
    setActive(e.target.id);
    onValue.map((item: any) => {
      if (item.on === e.target.id) {
        setFunc(item.value);
        start = item.value;
      }
    });
    setOpen(false);
  };
  return (
    // @ts-ignore
    <DROPDOWN>
      <SELECT>
        <div
          onClick={() => setOpen(!open)}
          className="uppercase w-full flex px-4 items-center gap-4 justify-center relative"
        >
          <span className="select-none w-full">
            {options.map((option: any) =>
              option.value === active ? option.label : ""
            )}
          </span>
          <div className="h-6 w-6 text-white select-none absolute right-2">
            <UPDOWN />
          </div>
        </div>
        {open && (
          <MENU>
            {options.map((option: any) => (
              <MENUITEM
                $active={active === option.value ? true : false}
                id={option.value}
                onClick={(e: any) => handleOptionChange(e)}
              >
                {option.label}
              </MENUITEM>
            ))}
          </MENU>
        )}
      </SELECT>
    </DROPDOWN>
  );
};

export default DropDown;
