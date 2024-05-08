import { useRef, useEffect, useState, forwardRef, RefObject } from "react";
import { createPortal } from "react-dom";

    type DropdownListProps = {
        children: React.ReactNode;
    }

    export const DropdownList = forwardRef<HTMLDivElement, DropdownListProps>( ({children}: DropdownListProps, ref) => {
        return (
        <div ref={ref} className='dropdown'>
            { children }
        </div>
        )
    })

    type DropdownToolProps = {
        Tool: ()=>React.ReactNode;
        version?: number;
        children: React.ReactNode;
        onStateChange?: (visible:boolean) => void;
    }

    export default function DropdownTool({Tool, children, onStateChange}: DropdownToolProps) {
            const dropdownToolRef = useRef<HTMLDivElement>(null)
            const dropdownElementRef = useRef<HTMLDivElement>(null)

            const [showDropdown, setShowDropdown] = useState<boolean>(false)

            function ChangeShowDropdown( visible: boolean ) {
                setShowDropdown(visible)
                if ( onStateChange )
                    onStateChange(visible)
            }

            const HandleClick = ({target}: MouseEvent) => {
                if ( dropdownToolRef && !dropdownToolRef.current?.contains(target as Node) && 
                    dropdownElementRef && !dropdownElementRef.current?.contains(target as Node)){
                    ChangeShowDropdown(false);
                }
            }

            useEffect(()=> {
                document.addEventListener('click', HandleClick)
                return () => {document.removeEventListener('click', HandleClick)}
            },[])

            useEffect(()=>{
                const parentObject = dropdownToolRef.current;
                const dropdownElementObject = dropdownElementRef.current;
                if ( parentObject != null && dropdownElementObject != null ){
                    const { top, left, width } = parentObject.getBoundingClientRect();
                    const {width: listhWidth } = dropdownElementObject.getBoundingClientRect();
                    dropdownElementObject.style.top = `${top + 40}px`;
                    dropdownElementObject.style.left = `${left + (width * 0.5) - (listhWidth * 0.5)}px`;
                }   
            },[showDropdown])

            return (
                <div ref={dropdownToolRef} onClick={() => {setShowDropdown((state) => {const newState = !state; ChangeShowDropdown(newState); return newState})}}>
                    <Tool/>
                    {showDropdown && createPortal(
                        <div ref={dropdownElementRef} className="dropdown-float">
                            {children}
                        </div>
                    , document.body)}
                </div>
            )
    }