import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";

    type DropdownListProps = {
        parentRef: React.RefObject<HTMLElement>;
        children: React.ReactNode;
    }

    const DropdownList = forwardRef( ({parentRef, children}: DropdownListProps, ref) => {
        const dropboxListRef = useRef<HTMLDivElement>(null)
        useImperativeHandle(ref, ()=>dropboxListRef.current!,[])

        useEffect(() => {
            const parent = parentRef.current;
            const dropDown = dropboxListRef.current;
        
            if (parent !== null && dropDown !== null) {
              const { top, left } = parent.getBoundingClientRect();
              dropDown.style.top = `${top + 40}px`;
              dropDown.style.left = `${left}px`;
            }
          }, [dropboxListRef]);
        
          return (
            <div ref={dropboxListRef} className='dropdown'>
                { children }
            </div>
            )
    })

    type DropdownToolProps = {
        Tool: ()=>React.ReactNode;
        children: React.ReactNode;
    }

    export default function DropdownTool({Tool, children}: DropdownToolProps) {
            const dropdownToolRef = useRef<HTMLDivElement>(null)
            const dropdownListRef = useRef<HTMLDivElement>(null)
            const [showDropdown, setShowDropdown] = useState<boolean>(false)

            const HandleClick = ({target}: MouseEvent) => {
                if ( dropdownToolRef && !dropdownToolRef.current?.contains(target as Node) && 
                    dropdownListRef && !dropdownListRef.current?.contains(target as Node)){
                    setShowDropdown(false);
                }
            }

            useEffect(()=> {
                document.addEventListener('click', HandleClick)

                return () => {document.removeEventListener('click', HandleClick)}
            },[])

            return (
                <div ref={dropdownToolRef} onClick={() => {setShowDropdown((state) => !state)}}>
                    <Tool/>
                    {showDropdown && createPortal(
                        <DropdownList ref={dropdownListRef} parentRef={dropdownToolRef}>
                            {children}
                        </DropdownList>
                    , document.body)}
                </div>
            )
    }