import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Accordion = ({ title, children, open }: { title: string, children: React.ReactNode, open: boolean }) => {
    const [isOpen, setIsOpen] = useState(open);
    
    return (
        <div className="p-4 w-full min-h-60 rounded-lg gap-2 flex flex-col">
            <div className="flex justify-between cursor-pointer items-center" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="font-semibold">{title}</h2>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </div>
            <div className="bg-slate-400 w-full h-[2px]"></div>
            {isOpen && children}
        </div>
    );
};

export default Accordion;